import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const metadata: Metadata = staticPageMetadata({
  title: 'Superhero catalog',
  description:
    'Explore superhero characters and comic tie‑ins on iComics.wiki — profiles linked into the manga, manhwa & webtoon browser library.',
  path: '/superheroes',
});

export default function SuperheroesLayout({ children }: { children: ReactNode }) {
  return children;
}
