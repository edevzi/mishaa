import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { staticPageMetadata } from '@/lib/seo/page-metadata';

export const metadata: Metadata = staticPageMetadata({
  title: 'Settings',
  description:
    'Reading preferences, language, age gate, and account settings for the iComics.wiki manga, manhwa & vertical webtoon reader.',
  path: '/settings',
  robots: { index: false, follow: true },
});

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return children;
}
