export const runtime = "edge";
import type { Metadata } from 'next';
import { cache } from 'react';
import ComicDetailsClient from './ComicDetailsClient';
import { getComicDetails as getComicDetailsAction, getChapters } from '@/actions/comic';
import { MangaLanguage } from '@/lib/manga-language';

const getComicDetails = cache(getComicDetailsAction);

type RouteParams = {
  source: string;
  id: string;
};

type MetadataProps = {
  params: Promise<RouteParams>;
};

const SITE_NAME = 'iComics.wiki Studio';
const DEFAULT_DESCRIPTION = 'The ultimate synthesis environment for independent comic creators.';

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { source, id } = await params;
  const comic = await getComicDetails(source, id);
  
  const type = source === 'mangadex' ? 'Manga' : source === 'marvel' ? 'Comic' : 'Webtoon';
  
  // Big Data Enrichment for SEO
  const aniList = (comic as any)?.aniListData;
  const jikan = (comic as any)?.jikanData;
  
  const ratingText = aniList?.averageScore ? `Rated ${aniList.averageScore}/100` : jikan?.score ? `Rated ${jikan.score}/10` : '';
  const statusText = aniList?.status || jikan?.status || '';
  
  const title = comic?.title 
    ? `Read ${comic.title} ${type} Online ${ratingText ? `- ${ratingText}` : ''} | ${SITE_NAME}` 
    : `${SITE_NAME} | Digital Comic Archive`;
    
  // Combine descriptions for maximum SEO density
  const baseDescription = comic?.description || '';
  const aniDescription = aniList?.description?.replace(/<[^>]*>/g, '') || '';
  const finalDescription = `${baseDescription} ${aniDescription}`.slice(0, 160).trim() || DEFAULT_DESCRIPTION;

  const image = comic?.coverUrl || '/logo.png';

  return {
    title,
    description: finalDescription,
    openGraph: {
      title,
      description: finalDescription,
      type: 'article',
      images: [{ url: image }],
      section: type,
      tags: comic?.genres || [type, 'Comics', 'Reading'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: finalDescription,
      images: [image],
    },
    alternates: {
      canonical: `https://icomics.wiki/library/${source}/${id}`,
    }
  };
}

import JsonLd from '@/components/JsonLd';

export default async function Page({ params }: { params: Promise<RouteParams> }) {
  const { source, id } = await params;
  
  const [initialComic, initialChapters] = await Promise.all([
    getComicDetails(source, id),
    getChapters(source, id)
  ]);

  const comicSchema = initialComic ? {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": initialComic.title,
    "description": initialComic.description,
    "image": initialComic.coverUrl,
    "author": {
      "@type": "Person",
      "name": initialComic.author || (initialComic as any).jikanData?.authors?.[0]?.name || "iComics.wiki Creator"
    },
    "genre": Array.from(new Set([
      ...(initialComic.genres || []),
      ...((initialComic as any).aniListData?.genres || []),
      ...((initialComic as any).jikanData?.genres?.map((g: any) => g.name) || [])
    ])).join(', '),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (initialComic as any).aniListData?.averageScore 
        ? ((initialComic as any).aniListData.averageScore / 10).toFixed(1)
        : (initialComic as any).jikanData?.score 
          ? (initialComic as any).jikanData.score.toString()
          : "4.8",
      "bestRating": "10",
      "ratingCount": (initialComic as any).aniListData?.popularity || (initialComic as any).jikanData?.members || "1000"
    }
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://icomics.wiki"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Library",
        "item": "https://icomics.wiki/library"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": initialComic?.title || "Comic",
        "item": `https://icomics.wiki/library/${source}/${id}`
      }
    ]
  };
  
  return (
    <article>
      {comicSchema && <JsonLd data={comicSchema} />}
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <ComicDetailsClient 
        initialComic={initialComic} 
        initialChapters={initialChapters}
        source={source} 
        id={id} 
      />
    </article>
  );
}


