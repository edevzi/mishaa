export const runtime = "edge";
import type { Metadata } from 'next';
import ComicReaderClient from './ComicReaderClient';
import { getComicDetails, getChapters } from '@/actions/comic';

type RouteParams = {
  source: string;
  id: string;
  chapterId: string;
};

type MetadataProps = {
  params: Promise<RouteParams>;
};

const SITE_NAME = 'iComics Studio';

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { source, id, chapterId } = await params;
  const comic = await getComicDetails(source, id);
  
  const title = comic?.title ? `Reading ${comic.title} | ${SITE_NAME}` : `${SITE_NAME} | Reader`;
  const description = `Read ${comic?.title || 'comics'} online.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<RouteParams> }) {
  const { source, id, chapterId } = await params;
  
  // Fetch initial data on server in parallel
  const [initialComic, initialChapters] = await Promise.all([
    getComicDetails(source, id),
    getChapters(source, id)
  ]);
  
  return (
    <ComicReaderClient 
      initialComic={initialComic} 
      initialChapters={initialChapters}
      source={source} 
      id={id} 
      chapterId={chapterId}
    />
  );
}
