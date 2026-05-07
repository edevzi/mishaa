"use server";

import { cookies } from 'next/headers';
import { BooruSource, mapBooruDetail } from "@/lib/booru";
import { buildMangaDexCoverUrl, pickMangaDexCoverFileName, appendMangaDexFilters, isMangaDexUuid, resolveMangaDexIdFromTitle, getCachedMangaDexIdResolution, cacheMangaDexIdResolution } from "@/lib/mangadex";
import { resolveMangaDexLocalizedText, MangaLanguage, getMangaDexTranslatedLanguages, DEFAULT_MANGA_LANGUAGE } from "@/lib/manga-language";
import { fetchAniListManga, type AniListMedia } from "@/lib/anilist";
import { fetchJikanManga } from "@/lib/jikan";
import { getSiteUrl } from "@/lib/site-url";
import { AGE_VERIFICATION_COOKIE } from "@/lib/age-verification";

export interface MarvelCreator {
  role: string;
  name: string;
  id?: number;
}

export interface MarvelCharacter {
  id: number;
  name?: string;
  description?: string;
  thumbnail?: { path: string; extension: string };
}

export interface MarvelSeries {
  id: number;
  title?: string;
  description?: string;
  startYear?: number;
  endYear?: number;
  modified?: string;
  cover?: { path?: string; extension?: string };
  thumbnail?: { path?: string; extension?: string };
}

export interface MarvelSeriesIssue {
  id: number;
  title: string;
  issueNumber: string;
  detailUrl: string;
  seriesId: number;
  seriesName: string;
  onSaleDate?: string;
  unlimitedDate?: string;
  yearPage?: number;
  cover?: { path?: string; extension?: string };
}

export interface MarvelIssue {
  id: number;
  digitalId?: number;
  title: string;
  issueNumber?: string;
  description?: string;
  modified?: string;
  pageCount?: number;
  detailUrl?: string;
  seriesId?: number;
  seriesName?: string;
  onSaleDate?: string;
  unlimitedDate?: string;
  yearPage?: number;
  cover?: { path?: string; extension?: string };
  thumbnail?: { path?: string; extension?: string };
  creators?: MarvelCreator[];
}

interface MangaDexRelationship {
  type: string;
  attributes?: {
    name?: string;
  };
}

interface MangaDexTag {
  attributes: {
    name: Record<string, string>;
  };
}

interface NHentaiTag {
  type: string;
  name: string;
}

interface NHentaiGallery {
  id: number | string;
  media_id: string;
  title: { english?: string; japanese?: string };
  tags?: NHentaiTag[];
  upload_date?: number;
  images: {
    thumbnail: { t: string };
    cover: { t: string };
    pages: Record<string, { t: string; w?: number; h?: number }> | { t: string; w?: number; h?: number }[];
  };
}

const MARVEL_API_BASE = "https://marvel.emreparker.com/v1";
const getSuperheroApiBase = () => `https://superheroapi.com/api/${process.env.SUPERHERO_API_TOKEN}`;
const LIMIT = 36;

const nhentaiCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour server-side cache
/** Bump when fetch/normalization changes so poisoned cache entries are not reused. */
const NHENTAI_CACHE_KEY_REV = 2;
const RESTRICTED_SOURCES = new Set(['nhentai', 'e621', 'danbooru', 'gelbooru', 'rule34']);

const NHENTAI_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://nhentai.net/',
};

const NHENTAI_GALLERY_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

const cleanTrailingCommas = (value: string) => value.replace(/,\s*([}\]])/g, '$1');
const isRestrictedSource = (source: string) => RESTRICTED_SOURCES.has(source.toLowerCase());

async function hasAgeVerification() {
  try {
    return (await cookies()).get(AGE_VERIFICATION_COOKIE)?.value === 'true';
  } catch {
    return false;
  }
}

const resolveNHentaiImageExt = (type?: string) => {
  switch (type) {
    case 'p':
      return 'png';
    case 'g':
      return 'gif';
    case 'w':
      return 'webp';
    case 'j':
    default:
      return 'jpg';
  }
};

const getNHentaiPageEntries = (
  pages: NHentaiGallery['images']['pages']
) => {
  if (!pages) return [];

  if (Array.isArray(pages)) {
    return pages.map((page, index) => ({
      page: index + 1,
      ...page,
    }));
  }

  return Object.entries(pages)
    .map(([page, value]) => ({
      page: Number(page),
      ...(value || {}),
    }))
    .filter((entry) => Number.isFinite(entry.page))
    .sort((left, right) => left.page - right.page);
};

/** Infer legacy single-letter image type from filename (matches resolveNHentaiImageExt). */
const inferNHentaiTypeChar = (filePath: string) => {
  const lower = (filePath || '').toLowerCase();
  if (lower.endsWith('.webp')) return 'w';
  if (lower.endsWith('.png')) return 'p';
  if (lower.endsWith('.gif')) return 'g';
  return 'j';
};

const isV2GalleryDetail = (data: unknown): data is Record<string, unknown> => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  const row = data as Record<string, unknown>;
  return Array.isArray(row.pages) && !('images' in row);
};

const mapV2DetailToLegacy = (raw: Record<string, unknown>): NHentaiGallery | null => {
  const pages = raw.pages as Array<{ number?: number; path?: string }> | undefined;
  if (!pages?.length || raw.media_id == null || raw.id == null) return null;

  return {
    id: raw.id as number | string,
    media_id: String(raw.media_id),
    title: ((raw.title as NHentaiGallery['title']) || {}) as NHentaiGallery['title'],
    tags: raw.tags as NHentaiGallery['tags'],
    upload_date: raw.upload_date as number | undefined,
    images: {
      thumbnail: {
        t: inferNHentaiTypeChar(String((raw.thumbnail as { path?: string } | undefined)?.path || '')),
      },
      cover: {
        t: inferNHentaiTypeChar(String((raw.cover as { path?: string } | undefined)?.path || '')),
      },
      pages: [...pages]
        .map((p) => ({
          page: Number(p.number),
          t: inferNHentaiTypeChar(String(p.path || '')),
        }))
        .filter((p) => Number.isFinite(p.page))
        .sort((a, b) => a.page - b.page),
    },
  };
};

/**
 * nHentai detail can be legacy ({ images: { pages } }) or API v2 ({ pages: [...] }).
 * Reject payloads whose id does not match the URL (avoids wrong comic from HTML/proxy races).
 */
const coerceNHentaiGalleryPayload = (raw: unknown, expectedId: string): NHentaiGallery | null => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const row = raw as Record<string, unknown>;
  if ('error' in row && row.error) return null;

  let legacy: NHentaiGallery | null = null;
  if (isV2GalleryDetail(raw)) {
    legacy = mapV2DetailToLegacy(raw as Record<string, unknown>);
  } else if ((raw as NHentaiGallery).images?.pages) {
    legacy = raw as NHentaiGallery;
  } else {
    return null;
  }

  if (!legacy) return null;
  if (String(legacy.id) !== String(expectedId)) {
    console.warn(`[nHentai] Rejected gallery payload: expected id ${expectedId}, got ${legacy.id}`);
    return null;
  }
  (legacy as { related?: unknown }).related = row.related;
  return legacy;
};

async function fetchJsonThroughProxy(path: string, fallbackUrl?: string) {
  const proxyUrl = `${getSiteUrl()}/api/proxy/mangadex?path=${encodeURIComponent(path)}`;
  const endpoints = fallbackUrl ? [proxyUrl, fallbackUrl] : [proxyUrl];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      const text = await res.text();
      if (!res.ok) {
        continue;
      }

      try {
        return JSON.parse(text);
      } catch {
        continue;
      }
    } catch {
      continue;
    }
  }

  throw new Error('MangaDex fetch failed');
}

async function resolveMangaDexLookupId(source: string, id: string) {
  if (source !== 'mangadex' || isMangaDexUuid(id)) {
    return id;
  }

  const cached = getCachedMangaDexIdResolution(id);
  if (cached) {
    return cached;
  }

  const aniList = await fetchAniListManga(id);
  const title = aniList?.title.userPreferred || aniList?.title.english || aniList?.title.romaji;
  if (!title) {
    return id;
  }

  const resolved = (await resolveMangaDexIdFromTitle(title)) || id;
  cacheMangaDexIdResolution(id, resolved);
  return resolved;
}

export async function fetchNHentaiRaw(path: string) {
  if (!(await hasAgeVerification())) {
    return null;
  }

  const cacheKey = `nhentai_${NHENTAI_CACHE_KEY_REV}_${path}`;
  const cached = nhentaiCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log(`[nHentai] 🚀 Serving from Server Cache: ${path}`);
    return cached.data;
  }

  const galleryPathMatch = path.match(/^gallery\/([^/?]+)$/);
  const strictGalleryId = galleryPathMatch?.[1];

  if (strictGalleryId) {
    for (const mirror of ['nhentai.net', 'nhentai.xxx', 'nhentai.to']) {
      try {
        const url = `https://${mirror}/api/v2/galleries/${encodeURIComponent(strictGalleryId)}`;
        const res = await fetch(url, {
          headers: NHENTAI_HEADERS,
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) continue;
        const raw = await res.json();
        const normalized = coerceNHentaiGalleryPayload(raw, strictGalleryId);
        if (normalized) {
          nhentaiCache.set(cacheKey, { data: normalized, timestamp: Date.now() });
          console.log(`[nHentai] ✅ v2/galleries OK from ${mirror}: ${strictGalleryId}`);
          return normalized;
        }
      } catch {
        continue;
      }
    }
  }

  const isGallery = path.includes('gallery/') && !path.includes('v2/');
  const legacyGalleryId = isGallery ? path.split('/').pop() : null;

  const apiPaths = path.startsWith('v2/') ? [path, path.replace('v2/', '')] : [path, `v2/${path}`];
  const mirrors = ['nhentai.net', 'nhentai.xxx', 'nhentai.to'];

  const fetchTasks: Promise<any>[] = [];

  for (const mirror of mirrors) {
    for (const p of apiPaths) {
      const url = `https://${mirror}/api/${p}`;
      fetchTasks.push((async () => {
        try {
          const res = await fetch(url, { headers: NHENTAI_HEADERS, next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });
          if (!res.ok) throw new Error('Failed');
          const data = await res.json();
          if (legacyGalleryId) {
            const normalized = coerceNHentaiGalleryPayload(data, legacyGalleryId);
            if (normalized) {
              console.log(`[nHentai] ✅ API normalized from ${mirror}: ${p}`);
              return normalized;
            }
            throw new Error('Failed');
          }
          console.log(`[nHentai] ✅ API Success from ${mirror}: ${p}`);
          return data;
        } catch {
          throw new Error('Error');
        }
      })());
    }
  }

  if (isGallery && legacyGalleryId) {
    for (const mirror of ['nhentai.to', 'nhentai.xxx']) {
      const gUrl = `https://${mirror}/g/${legacyGalleryId}/`;
      fetchTasks.push((async () => {
        try {
          const res = await fetch(gUrl, {
            headers: NHENTAI_GALLERY_HEADERS,
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(10000),
          });
          if (!res.ok) throw new Error(`Gallery HTML failed: ${res.status}`);

          const html = await res.text();
          const marker = 'var gallery = new N.gallery(';
          const markerIndex = html.indexOf(marker);
          if (markerIndex < 0) throw new Error('Gallery payload not found');

          const objectStart = html.indexOf('{', markerIndex);
          if (objectStart < 0) throw new Error('Gallery payload start not found');

          const objectEnd = html.indexOf(');', objectStart);
          if (objectEnd < 0) throw new Error('Gallery payload end not found');

          const raw = html.slice(objectStart, objectEnd);
          const parsed = JSON.parse(cleanTrailingCommas(raw));
          const normalized = coerceNHentaiGalleryPayload(parsed, legacyGalleryId);
          if (!normalized) throw new Error('Gallery id mismatch');
          console.log(`[nHentai] ✅ Gallery HTML parsed from ${mirror} for ID ${legacyGalleryId}`);
          return normalized;
        } catch {
          throw new Error('Error');
        }
      })());
    }
  }

  const fallbackProxies = [
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://nhentai.net/api/${path}`)}`,
    `https://corsproxy.io/?${encodeURIComponent(`https://nhentai.net/api/${path}`)}`,
  ];
  for (const p of fallbackProxies) {
    fetchTasks.push((async () => {
      try {
        const res = await fetch(p, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
        if (!res.ok) throw new Error('Failed');
        const text = await res.text();
        const data = JSON.parse(text);
        if (legacyGalleryId) {
          const normalized = coerceNHentaiGalleryPayload(data, legacyGalleryId);
          if (!normalized) throw new Error('Failed');
          console.log(`[nHentai] ✅ Proxy Success (normalized) for ${path}`);
          return normalized;
        }
        console.log(`[nHentai] ✅ Proxy Success for ${path}`);
        return data;
      } catch {
        throw new Error('Error');
      }
    })());
  }

  try {
    const result = await Promise.any(fetchTasks);
    nhentaiCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (e) {
    console.error(`[nHentai] 🚨 ALL TASKS FAILED for ${path}`);
    return null;
  }
}

async function searchNHentai(query: string, page: number) {
  if (!(await hasAgeVerification())) {
    return null;
  }

  let path = '';
  const cleanQuery = query.trim() || '';
  
  if (!cleanQuery || cleanQuery === 'all') {
    path = `v2/search?query=%20&page=${page + 1}`; // Space as query to get all
  } else if (cleanQuery.includes('&sort=')) {
    const [q, sort] = cleanQuery.split('&sort=');
    path = `v2/search?query=${encodeURIComponent(q)}&sort=${sort}&page=${page + 1}`;
  } else {
    path = `v2/search?query=${encodeURIComponent(cleanQuery)}&page=${page + 1}`;
  }
  return fetchNHentaiRaw(path);
}

type MangaDexRelatedItem = {
  id: string;
  title: string;
  coverUrl: string;
  source: 'mangadex';
  rating: string;
};

const MANGADEX_UUID_IN_TEXT = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function extractMangaDexUuidFromExternalLinks(
  links: Array<{ url?: string | null }> | undefined | null,
): string | null {
  if (!links?.length) return null;
  for (const link of links) {
    const u = link.url || '';
    const m = u.match(MANGADEX_UUID_IN_TEXT);
    if (m) return m[0];
  }
  return null;
}

async function buildMangaDexRelatedRails(
  manga: {
    id: string;
    attributes: {
      tags: Array<{ id: string; attributes?: { group?: string; name?: Record<string, string> } }>;
      contentRating?: string | null;
    };
  },
  aniListData: AniListMedia | null,
  mangaLanguage: MangaLanguage,
): Promise<MangaDexRelatedItem[]> {
  const currentId = manga.id;
  const seen = new Set<string>([currentId]);
  const out: MangaDexRelatedItem[] = [];

  const push = (item: MangaDexRelatedItem | null) => {
    if (!item || seen.has(item.id)) return;
    seen.add(item.id);
    out.push(item);
  };

  const nodes = aniListData?.recommendations?.nodes;
  if (Array.isArray(nodes)) {
    const batch = await Promise.all(
      nodes.map(async (n) => {
        const rec = n?.mediaRecommendation;
        if (!rec || rec.type !== 'MANGA') return null;
        const aniTitle = rec.title?.userPreferred || rec.title?.english || '';
        const fromLink = extractMangaDexUuidFromExternalLinks(rec.externalLinks);
        let mdId = fromLink;
        if (!mdId && aniTitle) {
          mdId = (await resolveMangaDexIdFromTitle(aniTitle)) || null;
        }
        if (!mdId || mdId === currentId) return null;
        if (typeof rec.id === 'number') {
          cacheMangaDexIdResolution(String(rec.id), mdId);
        }
        return {
          id: mdId,
          title: aniTitle || 'Untitled',
          coverUrl: rec.coverImage?.extraLarge || rec.coverImage?.large || '/logo.png',
          source: 'mangadex' as const,
          rating: 'Safe',
        };
      }),
    );
    batch.forEach((x) => push(x));
  }

  const ratingsList: string[] = ['safe', 'suggestive', 'erotica', 'pornographic'];

  if (out.length < 8) {
    const tagIds = (manga.attributes.tags || [])
      .filter((t) => {
        const g = t.attributes?.group;
        return g === 'genre' || g === 'theme';
      })
      .map((t) => t.id)
      .filter(Boolean);

    for (const tagId of tagIds.slice(0, 4)) {
      if (out.length >= 12) break;
      const res = await searchComics({
        source: 'mangadex',
        page: 0,
        mangaLanguage,
        includedTagIds: [tagId],
        ratings: ratingsList,
      });
      for (const item of res.items) {
        push({
          id: item.id,
          title: item.title,
          coverUrl: item.coverUrl || '/logo.png',
          source: 'mangadex',
          rating: item.rating,
        });
        if (out.length >= 12) break;
      }
    }
  }

  return out.slice(0, 12);
}


export async function getComicDetails(source: string, id: string, mangaLanguage: MangaLanguage = DEFAULT_MANGA_LANGUAGE) {
  try {
    if (isRestrictedSource(source) && !(await hasAgeVerification())) {
      return null;
    }

    if (source === 'superhero') {
      const res = await fetch(`${getSuperheroApiBase()}/${id}`, { next: { revalidate: 3600 } });
      if (!res.ok) throw new Error('Superhero fetch failed');
      const data = await res.json();
      if (data.response === 'error') throw new Error(data.error);

      return {
        id: data.id,
        title: data.name,
        description: data.biography?.['full-name'] || data.name,
        coverUrl: data.image?.url || '/logo.png',
        rating: 'Safe',
        genres: [data.biography?.publisher || 'Superhero'],
        status: 'Completed',
        year: data.biography?.['first-appearance'],
        author: data.biography?.publisher || 'Unknown',
        source: 'superhero' as const,
        superheroData: data
      };
    }

    if (source === 'marvel') {
      const res = await fetch(`${MARVEL_API_BASE}/issues/${id}`, { next: { revalidate: 3600 } });
      if (!res.ok) throw new Error('Marvel fetch failed');
      const data = await res.json();
      const issue = data?.data?.results?.[0] || data?.items?.[0] || data;
      
      const cover = issue.cover || issue.thumbnail;
      const writer = (issue.creators || []).find((c: MarvelCreator) => c.role === 'writer')?.name || 'Marvel';

      // Background metadata for Marvel
      const seriesId = issue.seriesId;
      let series: MarvelSeries | null = null;
      const characters: MarvelCharacter[] = [];
      let seriesIssues: MarvelSeriesIssue[] = [];

      if (seriesId) {
        try {
          const [seriesRes, seriesIssuesRes] = await Promise.all([
            fetch(`${MARVEL_API_BASE}/series/${seriesId}`, { next: { revalidate: 3600 } }),
            fetch(`${MARVEL_API_BASE}/series/${seriesId}/issues`, { next: { revalidate: 3600 } })
          ]);
          if (seriesRes.ok) series = (await seriesRes.json()).data?.results?.[0] || null;
          if (seriesIssuesRes.ok) seriesIssues = (await seriesIssuesRes.json()).data?.results || [];
        } catch (e) { console.error('Marvel series fetch error:', e); }
      }

      return {
        id: String(issue.id),
        title: issue.title,
        description: issue.description || 'Marvel metadata only.',
        coverUrl: normalizeMarvelImage(cover) || '/logo.png',
        bannerUrl: normalizeMarvelImage(cover) || undefined,
        rating: issue.pageCount ? `${issue.pageCount} pages` : 'Marvel Metadata',
        genres: [issue.seriesName, 'Marvel Comics'].filter(Boolean),
        status: 'Metadata',
        year: issue.onSaleDate?.slice(0, 4),
        author: writer,
        source: 'marvel' as const,
        marvelIssue: issue,
        marvelSeries: series || undefined,
        marvelSeriesIssues: seriesIssues,
        marvelCharacters: characters // Could be added later or filtered by series name
      };
    }


    if (source === 'mangadex') {
      const mangaDexId = await resolveMangaDexLookupId(source, id);
      const data = await fetchJsonThroughProxy(
        `manga/${mangaDexId}?includes[]=cover_art&includes[]=author&includes[]=artist`,
        `https://api.mangadex.org/manga/${mangaDexId}?includes[]=cover_art&includes[]=author&includes[]=artist`
      );
      const manga = data.data;

      const coverFileName = pickMangaDexCoverFileName(manga.relationships);
      const author = (manga.relationships as MangaDexRelationship[]).find((r) => r.type === 'author')?.attributes?.name;
      const title = resolveMangaDexLocalizedText(manga.attributes.title, mangaLanguage);
      const description = resolveMangaDexLocalizedText(manga.attributes.description, mangaLanguage);
      const genres = manga.attributes.tags.map((t: MangaDexTag) => resolveMangaDexLocalizedText(t.attributes.name, mangaLanguage)).filter(Boolean);
      const aniListData = manga.attributes.links?.al
        ? await fetchAniListManga(manga.attributes.links.al)
        : null;
      const related = await buildMangaDexRelatedRails(manga, aniListData, mangaLanguage);

      if (manga.attributes.links?.al) {
        cacheMangaDexIdResolution(String(manga.attributes.links.al), manga.id);
      }

      return {
        id: manga.id,
        title: title || Object.values(manga.attributes.title || {})[0] as string,
        description: description || "No description available.",
        coverUrl: coverFileName ? buildMangaDexCoverUrl(manga.id, coverFileName, 'original') : '/logo.png',
        rating: manga.attributes.contentRating,
        genres: genres.length > 0 ? genres : manga.attributes.tags.map((t: MangaDexTag) => t.attributes.name.en),
        status: manga.attributes.status,
        year: manga.attributes.year,
        author: author,
        source: 'mangadex' as const,
        aniListId: manga.attributes.links?.al,
        malId: manga.attributes.links?.mal,
        // Enrich with Big Data
        aniListData,
        jikanData: manga.attributes.links?.mal ? await fetchJikanManga(manga.attributes.links.mal) : null,
        related,
      };
    }

    if (source === 'nhentai') {
      const data = await fetchNHentaiRaw(`gallery/${id}`) as NHentaiGallery;
      if (!data) return null;
      const pageEntries = getNHentaiPageEntries(data.images.pages);
      const firstPage = pageEntries[0];

      // Extract related comics if they exist
      const related = (data as any).related || [];

      return {
        id: data.id.toString(),
        title: data.title?.english || data.title?.japanese || "Untitled",
        description: data.tags?.map((t: NHentaiTag) => t.name).join(', ') || "No description",
        coverUrl: `/api/proxy/nhentai/image?path=galleries/${data.media_id}/thumb.${resolveNHentaiImageExt(data.images.thumbnail.t)}`,
        bannerUrl: firstPage
          ? `/api/proxy/nhentai/image?path=galleries/${data.media_id}/${firstPage.page}.${resolveNHentaiImageExt(firstPage.t)}`
          : `/api/proxy/nhentai/image?path=galleries/${data.media_id}/thumb.${resolveNHentaiImageExt(data.images.thumbnail.t)}`,
        rating: 'pornographic',
        genres: data.tags?.filter((t: NHentaiTag) => t.type === 'tag').map((t: NHentaiTag) => t.name) || [],
        status: 'Completed',
        year: data.upload_date ? new Date(data.upload_date * 1000).getFullYear().toString() : undefined,
        author: data.tags?.find((t: NHentaiTag) => t.type === 'artist')?.name || 'Unknown',
        source: 'nhentai' as const,
        related: related.map((r: any) => {
          const relTitle =
            r.title?.english || r.title?.japanese || r.english_title || r.japanese_title || "Untitled";
          let relCover = '/logo.png';
          if (r.images?.thumbnail?.t) {
            relCover = `/api/proxy/nhentai/image?path=galleries/${r.media_id}/thumb.${resolveNHentaiImageExt(r.images.thumbnail.t)}`;
          } else if (typeof r.thumbnail === 'string' && r.thumbnail) {
            relCover = `/api/proxy/nhentai/image?path=${encodeURIComponent(r.thumbnail)}`;
          }
          return {
            id: r.id.toString(),
            title: relTitle,
            coverUrl: relCover,
            source: 'nhentai' as const,
            rating: 'pornographic',
          };
        }),
      };
    }

    if (['e621', 'danbooru', 'gelbooru', 'rule34'].includes(source)) {
      let targetUrl = '';
      if (source === 'e621') targetUrl = `https://e621.net/posts/${id}.json`;
      else if (source === 'danbooru') targetUrl = `https://danbooru.donmai.us/posts/${id}.json`;
      else if (source === 'gelbooru') targetUrl = `https://gelbooru.com/index.php?page=dapi&s=post&q=index&id=${id}&json=1`;
      else if (source === 'rule34') targetUrl = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&id=${id}&json=1`;

      const res = await fetch(targetUrl, { next: { revalidate: 3600 } });
      if (!res.ok) throw new Error('Booru fetch failed');
      const data = await res.json();
      const post = mapBooruDetail(source as BooruSource, data);
      if (!post) throw new Error('Post not found');
      
      return {
        id: post.id,
        title: post.title || `${source.toUpperCase()} #${post.id}`,
        description: post.description || post.tags.join(', '),
        coverUrl: post.coverUrl,
        rating: post.rating,
        genres: post.tags,
        status: 'Completed',
        author: source,
        source: source as BooruSource
      };
    }

    // Default to archive
    const res = await fetch(`https://archive.org/metadata/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Archive fetch failed');
    const data = await res.json();
    const meta = data.metadata;
    return {
      id: id,
      title: meta.title || id,
      description: meta.description || "No description available.",
      coverUrl: `https://archive.org/services/img/${id}`,
      rating: "N/A",
      genres: meta.subject ? (Array.isArray(meta.subject) ? meta.subject : [meta.subject]) : ['Classic'],
      status: 'Completed',
      year: meta.date,
      author: meta.creator || 'Unknown',
      source: 'archive' as const
    };
  } catch (error) {
    console.error("getComicDetails error:", error);
    return null;
  }
}

export async function getChapters(source: string, id: string, mangaLanguage: MangaLanguage = DEFAULT_MANGA_LANGUAGE) {
  try {
    if (isRestrictedSource(source) && !(await hasAgeVerification())) {
      return [];
    }

    if (source === 'superhero') {
      return [{ id: '1', title: 'Character Profile', chapterNum: '1' }];
    }

    if (source === 'mangadex') {
      const mangaDexId = await resolveMangaDexLookupId(source, id);
      const translatedLanguages = getMangaDexTranslatedLanguages(mangaLanguage);
      const params = new URLSearchParams({
        limit: '500',
        'order[chapter]': 'asc',
      });
      translatedLanguages?.forEach(lang => params.append('translatedLanguage[]', lang));
      
      console.log(`[MangaDex] Fetching chapters for ${id}, lang: ${mangaLanguage}`);
      let data = await fetchJsonThroughProxy(
        `manga/${mangaDexId}/feed?${params.toString()}`,
        `https://api.mangadex.org/manga/${mangaDexId}/feed?${params.toString()}`
      );
      
      // Fallback to English if no chapters found in preferred languages
      if ((!data.data || data.data.length === 0) && mangaLanguage !== 'en') {
        console.log(`[MangaDex] No chapters in ${mangaLanguage}, falling back to EN`);
        const fallbackParams = new URLSearchParams({
          limit: '500',
          'order[chapter]': 'asc',
          'translatedLanguage[]': 'en'
        });
        data = await fetchJsonThroughProxy(
          `manga/${mangaDexId}/feed?${fallbackParams.toString()}`,
          `https://api.mangadex.org/manga/${mangaDexId}/feed?${fallbackParams.toString()}`
        );
      }

      // Aggressive fallback to ANY language if still empty
      if ((!data.data || data.data.length === 0)) {
        console.log(`[MangaDex] Still empty, aggressive fallback to ALL languages`);
        const aggrParams = new URLSearchParams({
          limit: '500',
          'order[chapter]': 'asc',
        });
        data = await fetchJsonThroughProxy(
          `manga/${mangaDexId}/feed?${aggrParams.toString()}`,
          `https://api.mangadex.org/manga/${mangaDexId}/feed?${aggrParams.toString()}`
        );
      }

      console.log(`[MangaDex] Total chapters found: ${data.data?.length || 0}`);

      return data.data?.map((ch: { id: string; attributes: { title?: string; chapter: string; volume?: string; externalUrl?: string } }) => ({
        id: ch.id,
        title: ch.attributes.title || `Chapter ${ch.attributes.chapter}`,
        chapterNum: ch.attributes.chapter,
        volume: ch.attributes.volume,
        externalUrl: ch.attributes.externalUrl
      })) || [];
    }

    if (source === 'nhentai') {
      return [{ id, title: 'Full Gallery', chapterNum: '1' }];
    }

    if (source === 'archive') {
      const res = await fetch(`https://archive.org/metadata/${id}`, { next: { revalidate: 3600 } });
      const data = await res.json();
      const bookFiles = data.files?.filter((f: { format: string }) => 
        ["Image Container PDF", "PDF", "EPUB", "Comic Book Archive"].includes(f.format)
      ) || [];

      if (bookFiles.length > 1) {
        return bookFiles.map((f: { name: string; title?: string }, i: number) => ({
          id: f.name,
          title: f.title || f.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
          chapterNum: (i + 1).toString()
        }));
      }
      return [{ id, title: 'Complete Volume', chapterNum: '1' }];
    }

    return [{ id, title: 'Single Item', chapterNum: '1' }];
  } catch (error) {
    console.error("getChapters error:", error);
    return [];
  }
}

export async function getChapterPages(source: string, id: string, chapterId: string) {
  try {
    if (isRestrictedSource(source) && !(await hasAgeVerification())) {
      return [];
    }

    if (source === 'superhero') {
       const res = await fetch(`${getSuperheroApiBase()}/${id}`, { next: { revalidate: 3600 } });
       const data = await res.json();
       return data.image?.url ? [data.image.url] : [];
    }

    if (source === 'mangadex') {
      const data = await fetchJsonThroughProxy(
        `at-home/server/${chapterId}`,
        `https://api.mangadex.org/at-home/server/${chapterId}`
      );
      const baseUrl = data.baseUrl;
      const hash = data.chapter?.hash;
      let fileNames = data.chapter?.data;
      let quality = 'data';

      // Fallback to dataSaver if original data is missing
      if (!fileNames || fileNames.length === 0) {
        fileNames = data.chapter?.dataSaver;
        quality = 'data-saver';
      }

      if (!baseUrl || !hash || !fileNames || fileNames.length === 0) {
        console.error("MangaDex at-home response missing data:", data);
        return [];
      }

      return fileNames.map((n: string) => `/api/proxy/image?url=${encodeURIComponent(`${baseUrl}/${quality}/${hash}/${n}`)}`);
    }

    if (source === 'nhentai') {
       const data = await fetchNHentaiRaw(`gallery/${id}`) as NHentaiGallery;
       if (!data) return [];
       const pageEntries = getNHentaiPageEntries(data.images.pages);
       return pageEntries.map((p: { page: number; t: string }) => {
          const ext = resolveNHentaiImageExt(p.t);
          return `/api/proxy/nhentai/image?path=${encodeURIComponent(`galleries/${data.media_id}/${p.page}.${ext}`)}`;
       });
    }

    if (source === 'archive') {
      const res = await fetch(`https://archive.org/metadata/${id}`, { next: { revalidate: 3600 } });
      const data = await res.json();
      const isSubFile = chapterId !== id;
      
      let jp2File;
      if (isSubFile) {
        const baseName = chapterId.replace(/\.[^/.]+$/, "");
        jp2File = data.files?.find((f: { name: string; format: string }) => f.name.includes(baseName) && f.format === "Single Page Processed JP2 ZIP");
      } else {
        jp2File = data.files?.find((f: { format: string }) => f.format === "Single Page Processed JP2 ZIP");
      }

      const count = parseInt(jp2File?.filecount || data.metadata?.page_count || "100");
      const pages = [];
      for (let i = 0; i < Math.min(count, 1500); i++) {
        pages.push(`/api/proxy/archive?action=page&id=${encodeURIComponent(id)}&page=${i}${isSubFile ? `&file=${encodeURIComponent(chapterId)}` : ''}`);
      }
      return pages;
    }

    return [];
  } catch (error) {
    console.error("getChapterPages error:", error);
    return [];
  }
}

export async function searchComics(params: {
  source: string;
  query?: string;
  page?: number;
  mangaLanguage?: MangaLanguage;
  ratings?: string[];
  originalLanguages?: string[];
  includedTagIds?: string[];
  excludedTagIds?: string[];
}) {
  const { source, query = '', page = 0, mangaLanguage = DEFAULT_MANGA_LANGUAGE, ratings, originalLanguages, includedTagIds, excludedTagIds } = params;
  
  try {
    if (isRestrictedSource(source) && !(await hasAgeVerification())) {
      return { items: [], hasMore: false };
    }

    if (source === 'superhero') {
      // The API requires a search query. If empty, default to 'batman'.
      const searchQuery = query && query.length >= 2 ? query : 'batman';
      const res = await fetch(`${getSuperheroApiBase()}/search/${encodeURIComponent(searchQuery)}`, { next: { revalidate: 3600 } });
      const data = await res.json();
      const items = data.results || [];
      return {
        items: items.map((item: any) => ({
          id: item.id,
          title: item.name,
          description: item.biography?.['full-name'] || item.name,
          coverUrl: item.image?.url || '/logo.png',
          source: 'superhero',
          rating: item.biography?.publisher || 'Superhero'
        })),
        hasMore: false
      };
    }

    if (source === 'marvel') {
      const searchParams = new URLSearchParams();
      if (query.length >= 2) searchParams.set('q', query);
      else {
        searchParams.set('limit', LIMIT.toString());
        searchParams.set('offset', String(page * LIMIT));
      }

      const res = await fetch(`${MARVEL_API_BASE}/issues?${searchParams.toString()}`, { next: { revalidate: 900 } });
      const data = await res.json();
      const items = data.items || [];
      
      return {
        items: items.map((item: { id: number | string; title: string; seriesName: string; cover: { path: string; extension: string }; pageCount?: number }) => ({
          id: String(item.id),
          title: item.title,
          description: item.seriesName,
          coverUrl: normalizeMarvelImage(item.cover),
          source: 'marvel',
          rating: item.pageCount ? `${item.pageCount} p` : 'Marvel'
        })),
        hasMore: data.has_next || (items.length === LIMIT)
      };
    }

    if (source === 'mangadex') {
      const translatedLanguages = getMangaDexTranslatedLanguages(mangaLanguage);
      const mdxRatings = ratings || ['safe', 'suggestive'];

      const buildMangaDexSearchParams = (langs: string[] | undefined) => {
        const searchParams = new URLSearchParams();
        searchParams.set('limit', LIMIT.toString());
        searchParams.set('offset', String(page * LIMIT));
        searchParams.append('includes[]', 'cover_art');
        appendMangaDexFilters(searchParams, {
          contentRatings: mdxRatings,
          includedTagIds,
          excludedTagIds,
          originalLanguages,
          translatedLanguages: langs,
        });
        if (query.trim().length >= 2) {
          searchParams.set('title', query.trim());
          searchParams.set('order[relevance]', 'desc');
        } else {
          searchParams.set('order[followedCount]', 'desc');
        }
        return searchParams;
      };

      let params = buildMangaDexSearchParams(translatedLanguages);
      let data = await fetchJsonThroughProxy(
        `manga?${params.toString()}`,
        `https://api.mangadex.org/manga?${params.toString()}`
      );
      let rows = data.data || [];

      // Match home-data: if the translation filter yields no hits, retry without it (niche tags × lang often empty).
      if (rows.length === 0 && translatedLanguages !== undefined) {
        params = buildMangaDexSearchParams(undefined);
        data = await fetchJsonThroughProxy(
          `manga?${params.toString()}`,
          `https://api.mangadex.org/manga?${params.toString()}`
        );
        rows = data.data || [];
      }

      const total = typeof data.total === 'number' ? data.total : 0;

      return {
        items: rows.map((item: { id: string; attributes: { title: Record<string, string>; description: Record<string, string>; contentRating: string }; relationships: { type: string; attributes?: { fileName?: string; volume?: string | null; createdAt?: string } }[] }) => {
          const coverFileName = pickMangaDexCoverFileName(item.relationships);
          return {
            id: item.id,
            title: resolveMangaDexLocalizedText(item.attributes.title, mangaLanguage) || Object.values(item.attributes.title || {})[0],
            description: resolveMangaDexLocalizedText(item.attributes.description, mangaLanguage) || '',
            coverUrl: coverFileName ? buildMangaDexCoverUrl(item.id, coverFileName) : '/logo.png',
            source: 'mangadex',
            rating: item.attributes.contentRating
          };
        }),
        hasMore: (page + 1) * LIMIT < total
      };
    }

    if (source === 'archive') {
       // Highly restrictive query for actual comic collections to filter out noise
       const baseQuery = '(collection:comicbooksarchive OR collection:manga OR collection:comics OR (mediatype:texts AND subject:comics AND subject:manga))';
       const finalQuery = query ? `(${query}) AND ${baseQuery}` : baseQuery;
       const res = await fetch(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(finalQuery)}&output=json&rows=${LIMIT}&page=${page + 1}`, { next: { revalidate: 3600 } });
       const data = await res.json();
       const docs = data.response.docs || [];
       
       // Filter out results that definitely aren't comics (e.g. academic papers about comics)
       const filteredDocs = docs.filter((item: any) => {
         const title = (item.title || '').toLowerCase();
         if (title.includes('thesis') || title.includes('dissertation') || title.includes('journal article')) return false;
         return true;
       });

       return {
         items: filteredDocs.map((item: { identifier: string; title: string }) => ({
           id: item.identifier,
           title: item.title,
           coverUrl: `https://archive.org/services/img/${item.identifier}`,
           source: 'archive',
           rating: 'Safe'
         })),
         hasMore: (page + 1) * LIMIT < data.response.numFound
       };
    }

    if (source === 'nhentai') {
      const data = await searchNHentai(query, page);
      if (!data) return { items: [], hasMore: false };
      const results = Array.isArray(data?.result) ? data.result : Array.isArray(data) ? data : [];
      
      if (results.length > 0) {
        console.log("[nHentai Search Result Sample]:", JSON.stringify(results[0], null, 2).substring(0, 500));
        
        // Background Prefetch first 10 items
        results.slice(0, 10).forEach((item: any) => {
          const gid = (item.id ?? item.gallery_id)?.toString?.() || '';
          const gpath = gid ? `gallery/${gid}` : '';
          const prefetchKey = gpath ? `nhentai_${NHENTAI_CACHE_KEY_REV}_${gpath}` : '';
          if (gid && prefetchKey && !nhentaiCache.has(prefetchKey)) {
             fetchNHentaiRaw(gpath).catch(() => {});
          }
        });
      }

      const numPages = Number(data?.num_pages ?? 0);
      return {
        items: results.map((item: any) => ({
          id: (item.id || item.gallery_id || "").toString(),
          title: item.english_title || item.title?.english || item.title?.japanese || "Untitled",
          description: `${item.num_pages} pages`,
          coverUrl: (typeof item.thumbnail === 'object' ? item.thumbnail?.path : item.thumbnail)
            ? `/api/proxy/nhentai/image?path=${encodeURIComponent(typeof item.thumbnail === 'object' ? item.thumbnail?.path : (item.thumbnail || ''))}`
            : '/logo.png',
          source: 'nhentai',
          rating: 'pornographic'
        })),
        hasMore: Number.isFinite(numPages) && numPages > 0 ? page + 1 < numPages : results.length > 0,
      };
    }

    return { items: [], hasMore: false };
  } catch (error) {
    console.error("searchComics error:", error);
    return { items: [], hasMore: false };
  }
}

function normalizeMarvelImage(image?: { path?: string; extension?: string }) {
  if (!image?.path || !image.extension) return '/logo.png';
  const path = image.path.replace('http://', 'https://');
  const finalPath = path.includes('portrait_') ? path : `${path}/portrait_incredible`;
  const url = `${finalPath}.${image.extension}`;
  return `/api/proxy/image?url=${encodeURIComponent(url)}`;
}
