import { MetadataRoute } from 'next';
import { searchComics } from '@/actions/comic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://icomics.wiki';
  
  // Base static routes
  const staticRoutes = [
    '',
    '/library',
    '/studio',
    '/contact',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Fetch popular manga from MangaDex for dynamic indexing
    const popularManga = await searchComics({
      source: 'mangadex',
      page: 0,
      query: '', // Empty query + FollowedCount desc = Popular
    });

    const dynamicMangaRoutes = popularManga.items.map((item: { id: string }) => ({
      url: `${baseUrl}/library/mangadex/${item.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Fetch some marvel items if needed, but MangaDex is our main library for indexing
    return [...staticRoutes, ...dynamicMangaRoutes];
  } catch (e) {
    console.error('Sitemap generation error:', e);
    return staticRoutes;
  }
}
