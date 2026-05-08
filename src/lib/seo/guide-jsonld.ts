import { getPublicSiteUrl } from '@/lib/og-metadata';
import { GUIDES_ORDER } from '@/lib/guides/registry';

/** Article schema for individual guide URLs (English editorial hub). */
export function buildGuideArticleJsonLd(slug: string) {
  const g = GUIDES_ORDER.find((x) => x.slug === slug);
  if (!g) return null;
  const site = getPublicSiteUrl().replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: g.title,
    description: g.description,
    datePublished: g.publishedIso,
    dateModified: g.publishedIso,
    author: {
      '@type': 'Organization',
      name: 'iComics.wiki',
      url: site,
    },
    publisher: {
      '@type': 'Organization',
      name: 'iComics.wiki',
      url: site,
      logo: {
        '@type': 'ImageObject',
        url: `${site}/icon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${site}/guides/${g.slug}`,
    },
  };
}

/** ItemList for /guides index — surfaces linked editorial URLs to crawlers. */
export function buildGuidesIndexItemListJsonLd() {
  const site = getPublicSiteUrl().replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: GUIDES_ORDER.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: g.title,
      item: `${site}/guides/${g.slug}`,
    })),
  };
}

/** HowTo aligned with the getting-started guide narrative. */
export function buildGettingStartedHowToJsonLd() {
  const site = getPublicSiteUrl().replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Start reading comics on iComics.wiki',
    description:
      'Open the library, choose a series from the catalog, and launch the chapter reader on desktop or mobile.',
    totalTime: 'PT3M',
    tool: [{ '@type': 'HowToTool', name: 'Modern web browser' }],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Open the Library',
        text: 'Use the Library link in the navigation menu to browse manga, manhwa, and comic sources.',
        url: `${site}/library`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Open a title detail page',
        text: 'Review chapters, descriptions, and ratings before you start reading.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Read a chapter',
        text: 'Choose Read on any chapter to open the full-page reader.',
      },
    ],
  };
}
