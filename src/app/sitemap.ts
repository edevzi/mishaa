import { MetadataRoute } from 'next';
import { searchComics } from '@/actions/comic';
import { getPublicSiteUrl } from '@/lib/og-metadata';

/** Extra MangaDex listing pages merged into sitemap (36 titles each). */
const MANGA_SITEMAP_EXTRA_PAGES = 5;

function routeEntry(
  baseUrl: string,
  path: string,
  opts: { changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency']; priority: number },
): MetadataRoute.Sitemap[0] {
  return {
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getPublicSiteUrl().replace(/\/$/, '');

  const staticPaths = [
    '',
    '/about',
    '/gallery',
    '/comic',
    '/library',
    '/studio',
    '/contact',
    '/faq',
    '/support',
    '/superheroes',
    '/privacy',
    '/terms',
    '/content-policy',
    '/dmca',
  ];

  const staticRoutes = staticPaths.map((route) =>
    routeEntry(baseUrl, route, {
      changeFrequency: route === '' || route === '/library' ? 'daily' : 'weekly',
      priority:
        route === ''
          ? 1
          : route === '/library' || route === '/studio'
            ? 0.9
            : 0.6,
    }),
  );

  const byUrl = new Map<string, MetadataRoute.Sitemap[0]>();
  for (const entry of staticRoutes) {
    byUrl.set(entry.url, entry);
  }

  try {
    const mangaPages = await Promise.all(
      Array.from({ length: MANGA_SITEMAP_EXTRA_PAGES }, (_, page) =>
        searchComics({
          source: 'mangadex',
          page,
          query: '',
        }),
      ),
    );

    for (const page of mangaPages) {
      for (const item of page.items) {
        const url = `${baseUrl}/library/mangadex/${item.id}`;
        if (!byUrl.has(url)) {
          byUrl.set(url, {
            url,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      }
    }

    const marvelPage = await searchComics({ source: 'marvel', page: 0, query: '' });
    for (const item of marvelPage.items) {
      const url = `${baseUrl}/library/marvel/${item.id}`;
      if (!byUrl.has(url)) {
        byUrl.set(url, {
          url,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.65,
        });
      }
    }

    return [...byUrl.values()];
  } catch (e) {
    console.error('Sitemap generation error:', e);
    return staticRoutes;
  }
}
