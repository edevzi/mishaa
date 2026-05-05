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

const SITE_NAME = 'iComics Studio';
const DEFAULT_DESCRIPTION = 'The ultimate synthesis environment for independent comic creators.';

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { source, id } = await params;
  const comic = await getComicDetails(source, id);
  
  const type = source === 'mangadex' ? 'Manga' : source === 'marvel' ? 'Comic' : 'Webtoon';
  const title = comic?.title 
    ? `Read ${comic.title} ${type} Online - Chapters, Synopsis & Ratings | ${SITE_NAME}` 
    : `${SITE_NAME} | Digital Comic Archive`;
    
  const description = comic?.description 
    ? `Read ${comic.title} ${type} online on ${SITE_NAME}. ${comic.description.slice(0, 150)}... Explore chapters, author details, and community ratings.`
    : DEFAULT_DESCRIPTION;

  const image = comic?.coverUrl || '/logo.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [{ url: image }],
      section: type,
      tags: comic?.genres || [type, 'Comics', 'Reading'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
      "name": initialComic.author || "iComics Creator"
    },
    "genre": initialComic.genres?.join(', '),
    "aggregateRating": initialComic.rating ? {
      "@type": "AggregateRating",
      "ratingValue": initialComic.rating === 'Safe' ? "5.0" : initialComic.rating,
      "bestRating": "5.0",
      "ratingCount": "100"
    } : undefined
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


