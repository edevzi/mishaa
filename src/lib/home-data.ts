import { 
  appendMangaDexFilters, 
  pickMangaDexCoverFileName, 
  buildMangaDexCoverUrl, 
  MANGADEX_LONG_STRIP_TAG_ID 
} from "@/lib/mangadex";
import { 
  getMangaDexTranslatedLanguages, 
  resolveMangaDexLocalizedText, 
  MangaLanguage 
} from "@/lib/manga-language";

const MARVEL_API_BASE = "https://marvel.emreparker.com/v1";

const safeText = (value: unknown, fallback = '') => typeof value === 'string' && value.trim() ? value : fallback;

async function loadMangaDex(params: URLSearchParams, lang: MangaLanguage) {
  try {
    const res = await fetch(`https://api.mangadex.org/manga?${params.toString()}`, {
      headers: { 'User-Agent': 'iComics/1.0' },
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data?.data) ? data.data : [];
    return items.map((item: any) => {
      const coverFileName = pickMangaDexCoverFileName(item.relationships);
      return {
        id: item.id,
        title: resolveMangaDexLocalizedText(item.attributes?.title, lang) || safeText(Object.values(item.attributes?.title || {})[0], 'Untitled'),
        description: resolveMangaDexLocalizedText(item.attributes?.description, lang) || 'Catalog entry',
        coverUrl: coverFileName ? buildMangaDexCoverUrl(item.id, coverFileName) : '/logo.png',
        source: 'mangadex',
        href: `/library/mangadex/${item.id}`,
        meta: item.attributes?.status?.toUpperCase() || 'MANGA',
        rating: (Math.random() * 2 + 3).toFixed(1),
      };
    }).filter((c: any) => c.id && c.title);
  } catch { return []; }
}

async function loadMarvelShelf() {
  try {
    const res = await fetch(`${MARVEL_API_BASE}/issues?limit=12`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.items || [];
    return items.map((item: any) => ({
      id: String(item.id),
      title: item.title,
      description: item.seriesName,
      coverUrl: item.cover?.path ? `${item.cover.path}/portrait_incredible.${item.cover.extension}` : '/logo.png',
      source: 'marvel',
      href: `/library/marvel/${item.id}`,
      meta: 'MARVEL',
      rating: '5.0',
    }));
  } catch { return []; }
}

export async function getHomeData(lang: MangaLanguage = 'en') {
  const filters = {
    contentRatings: ['safe', 'suggestive'],
    translatedLanguages: getMangaDexTranslatedLanguages(lang),
  };

  const mangaParams = new URLSearchParams({ limit: '12', offset: '0', 'order[followedCount]': 'desc' });
  mangaParams.append('includes[]', 'cover_art');
  appendMangaDexFilters(mangaParams, { ...filters, originalLanguages: ['ja'] });

  const webtoonsParams = new URLSearchParams({ limit: '12', offset: '0', 'order[followedCount]': 'desc' });
  webtoonsParams.append('includes[]', 'cover_art');
  appendMangaDexFilters(webtoonsParams, { ...filters, includedTagIds: [MANGADEX_LONG_STRIP_TAG_ID] });

  const manhwaParams = new URLSearchParams({ limit: '12', offset: '0', 'order[followedCount]': 'desc' });
  manhwaParams.append('includes[]', 'cover_art');
  appendMangaDexFilters(manhwaParams, { ...filters, originalLanguages: ['ko'], excludedTagIds: [MANGADEX_LONG_STRIP_TAG_ID] });

  const [manga, webtoons, manhwa, marvel] = await Promise.all([
    loadMangaDex(mangaParams, lang),
    loadMangaDex(webtoonsParams, lang),
    loadMangaDex(manhwaParams, lang),
    loadMarvelShelf()
  ]);

  return {
    'manga-hub': manga,
    'webtoons': webtoons,
    'manhwa': manhwa,
    'marvel': marvel
  };
}
