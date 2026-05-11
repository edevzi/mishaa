import { getPublicSiteUrl } from '@/lib/og-metadata';
import { ICS_SITE_DISPLAY_NAME } from '@/lib/seo/page-metadata';

const INDEXED_LANGUAGES = ['en-US', 'ru-RU'] as const;

/** Site-wide Organization — emitted once from root layout. */
export function buildOrganizationJsonLd() {
  const u = getPublicSiteUrl().replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${u}#organization`,
    inLanguage: [...INDEXED_LANGUAGES],
    availableLanguage: ['en', 'ru'],
    name: ICS_SITE_DISPLAY_NAME,
    alternateName: ['iComics wiki', 'icomics.wiki'],
    url: u,
    logo: `${u}/logo.png`,
    description:
      'Online reader for manga, manhwa, webtoons, and gated shelves—catalog search, fullscreen chapters, bookmarks, bilingual UI, Telegram community, guides & RSS.',
    disambiguatingDescription:
      'This domain hosts the icomics.wiki reader — not the iOS “iComics” comic file app, not Hey Kids Comics on Fandom, and not Marvel’s discontinued Icon Comics line.',
    sameAs: ['https://t.me/icomicsuz'],
  };
}

/** WebSite + SearchAction (library search) — emitted once from root layout. */
export function buildWebSiteJsonLd() {
  const u = getPublicSiteUrl().replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${u}#website`,
    inLanguage: [...INDEXED_LANGUAGES],
    availableLanguage: ['en', 'ru'],
    name: ICS_SITE_DISPLAY_NAME,
    alternateName: ['icomics wiki', 'iComics wiki online library'],
    url: u,
    publisher: { '@id': `${u}#organization` },
    description:
      'Official icomics.wiki — browse manga, manhwa, webtoons, and age‑gated catalogs; fullscreen reader, bookmarks, resume where supported; FAQ explains brand disambiguation from the unrelated iOS iComics reader.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${u}/library?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
