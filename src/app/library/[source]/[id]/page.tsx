import type { Metadata } from 'next';
import { headers } from 'next/headers';
import ComicDetailsClient from './ComicDetailsClient';
import { mapBooruDetail, type BooruSource } from '@/lib/booru';
import { buildMangaDexCoverUrl, pickMangaDexCoverFileName } from '@/lib/mangadex';
import { resolveMangaDexLocalizedText, type MangaLanguage } from '@/lib/manga-language';

type RouteParams = {
  source: string;
  id: string;
};

type MetadataProps = {
  params: Promise<RouteParams> | RouteParams;
};

const SITE_NAME = 'iComics Studio';
const DEFAULT_DESCRIPTION = 'The ultimate synthesis environment for independent comic creators.';
const FALLBACK_IMAGE = '/logo.png';

const getOrigin = async () => {
  const headerList = await headers();
  const proto = headerList.get('x-forwarded-proto') ?? 'https';
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? 'icomics.uz';
  return `${proto}://${host}`;
};

const toAbsoluteUrl = async (path: string) => {
  const origin = await getOrigin();
  return new URL(path, origin).toString();
};

const trimDescription = (value: string, fallback: string) => {
  const cleaned = String(value || '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return fallback;
  return cleaned.length > 220 ? `${cleaned.slice(0, 217)}...` : cleaned;
};

const buildMetadataFromSource = async (source: string, id: string) => {
  if (source === 'nhentai') {
    const res = await fetch(await toAbsoluteUrl(`/api/proxy/nhentai?path=${encodeURIComponent(`galleries/${id}`)}`), {
      cache: 'no-store',
    });
    if (!res.ok) return null;

    const data = await res.json();
    const title = data.english_title || data.title?.english || data.title?.japanese || data.title?.pretty || `Gallery ${id}`;
    const tagNames = Array.isArray(data.tags) ? data.tags.map((tag: { name?: string }) => tag.name).filter(Boolean) : [];
    const description = trimDescription(
      `${tagNames.slice(0, 6).join(', ')}${tagNames.length > 6 ? '...' : ''}` || '',
      'Adult gallery',
    );
    const imagePath = data.cover?.path || data.thumbnail?.path || data.thumbnail;
    const image = imagePath ? `https://t3.nhentai.net/${imagePath}` : await toAbsoluteUrl(FALLBACK_IMAGE);

    return {
      title,
      description: `${description} • 18+`,
      image,
    };
  }

  if (source === 'mangadex') {
    const res = await fetch(`https://api.mangadex.org/manga/${encodeURIComponent(id)}?includes[]=cover_art`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;

    const payload = await res.json();
    const manga = payload?.data;
    if (!manga) return null;

    const title = resolveMangaDexLocalizedText(manga.attributes?.title, 'en' as MangaLanguage) || `Manga ${id}`;
    const description = trimDescription(
      resolveMangaDexLocalizedText(manga.attributes?.description, 'en' as MangaLanguage),
      'MangaDex entry',
    );
    const coverFile = pickMangaDexCoverFileName(manga.relationships);
    const image = coverFile
      ? buildMangaDexCoverUrl(manga.id, coverFile)
      : await toAbsoluteUrl(FALLBACK_IMAGE);

    return { title, description, image };
  }

  if (source === 'marvel') {
    const res = await fetch(await toAbsoluteUrl(`/api/marvel/issues/${encodeURIComponent(id)}`), {
      cache: 'no-store',
    });
    if (!res.ok) return null;

    const issue = await res.json();
    const title = issue?.title || `Marvel Issue ${id}`;
    const description = trimDescription(issue?.description || issue?.seriesName || 'Marvel issue metadata', 'Marvel issue');
    const image = issue?.cover?.path && issue?.cover?.extension
      ? `${String(issue.cover.path).replace(/^http:\/\//, 'https://')}.${issue.cover.extension}`
      : await toAbsoluteUrl(FALLBACK_IMAGE);

    return { title, description, image };
  }

  if (source === 'archive') {
    const res = await fetch(`https://archive.org/metadata/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;

    const data = await res.json();
    const meta = data?.metadata || {};
    const title = meta.title || id;
    const description = trimDescription(meta.description || meta.subject || 'Archive comic', 'Archive comic');
    const image = `https://archive.org/services/img/${encodeURIComponent(id)}`;

    return { title, description, image };
  }

  const booruSources: BooruSource[] = ['e621', 'danbooru', 'gelbooru'];
  if (booruSources.includes(source as BooruSource)) {
    const booruSource = source as BooruSource;
    const searchParams = new URLSearchParams({ source: booruSource, kind: 'post', id });
    const res = await fetch(await toAbsoluteUrl(`/api/proxy/booru?${searchParams.toString()}`), {
      cache: 'no-store',
    });
    if (!res.ok) return null;

    const data = await res.json();
    const post = mapBooruDetail(booruSource, data);
    if (!post) return null;

    return {
      title: post.title || `${booruSource.toUpperCase()} #${post.id}`,
      description: trimDescription(post.description || post.tags.join(', ') || `${booruSource} post`, `${booruSource} post`),
      image: post.coverUrl || await toAbsoluteUrl(FALLBACK_IMAGE),
    };
  }

  return null;
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { source, id } = await params;
  const baseUrl = await getOrigin();
  const shareData = await buildMetadataFromSource(source, id);
  const title = shareData?.title ? `${shareData.title} | ${SITE_NAME}` : `${SITE_NAME} | Library`;
  const description = shareData?.description || DEFAULT_DESCRIPTION;
  const canonical = `${baseUrl}/library/${encodeURIComponent(source)}/${encodeURIComponent(id)}`;
  const image = shareData?.image || `${baseUrl}${FALLBACK_IMAGE}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'article',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: shareData?.title || SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export const dynamic = 'force-dynamic';

export default function Page() {
  return <ComicDetailsClient />;
}
