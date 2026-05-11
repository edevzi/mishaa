import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const metadata: Metadata = staticPageMetadata({
  title: 'Contact — iComics.wiki',
  description:
    'Contact iComics.wiki — feedback, partnerships, and reader support for the browser manga, manhwa & vertical webtoon library at icomics.wiki.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
