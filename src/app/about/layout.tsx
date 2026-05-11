import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const metadata: Metadata = staticPageMetadata({
  title: 'About iComics.wiki — online comic & manga wiki library',
  description:
    'What iComics.wiki is: a reader‑first manga, manhwa & vertical webtoon browser library (incl. age‑aware shelves)—not the iOS iComics file app or unrelated Fandom wikis. Mission and transparency.',
  path: '/about',
});

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
