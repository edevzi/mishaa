import { Metadata } from 'next';
import { getPublicSiteUrl } from '@/lib/og-metadata';
import { openGraphTwitterFromLogo } from '@/lib/seo/page-metadata';

const siteUrl = getPublicSiteUrl().replace(/\/$/, '');

const META_DESC =
  'Manga, manhwa, vertical webtoons, and adult/hentai-friendly titles (incl. MangaDex)—bookmarks, genres, chapters, and a fullscreen browser reader with progress on iComics.wiki.';

export const metadata: Metadata = {
  title: 'Browse manga, manhwa & webtoons — library search',
  description: META_DESC,
  ...openGraphTwitterFromLogo({
    origin: siteUrl,
    pageAbsoluteUrl: `${siteUrl}/library`,
    openGraphTitle: 'Manga, manhwa & vertical webtoon library — search & bookmarks',
    twitterTitle: 'Library — iComics.wiki manga / manhwa / webtoon reader',
    description: META_DESC,
    openGraphDescription:
      'Huge manga, manhwa & vertical webtoon index (incl. age‑aware shelves)—bookmarks, chapters, synced browser reader progress.',
    twitterDescription:
      'Search manga, manhwa, webtoons & age‑gated catalogs — bookmarks & fullscreen reader in browser.',
  }),
  alternates: {
    canonical: `${siteUrl}/library`,
  },
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
