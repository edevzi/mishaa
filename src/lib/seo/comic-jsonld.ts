import { preferSocialPreviewCover, toAbsoluteAssetUrl } from '@/lib/og-metadata';
import { ICS_SITE_DISPLAY_NAME } from '@/lib/seo/page-metadata';

/** Cover URL aligned with Open Graph (proxy + Mangadex 512 derivative when applicable). */
export function absoluteComicCoverForSchema(coverUrl: string | undefined, siteOrigin: string): string | undefined {
  if (!coverUrl?.trim()) return undefined;
  const absolute = toAbsoluteAssetUrl(coverUrl, siteOrigin);
  return preferSocialPreviewCover(absolute, siteOrigin);
}

export function buildComicCoverImageObjects(
  coverUrl: string | undefined,
  siteOrigin: string,
  title?: string,
): Array<{ '@type': 'ImageObject'; url: string; width: number; height: number; caption?: string }> {
  const url = absoluteComicCoverForSchema(coverUrl, siteOrigin);
  if (!url) return [];
  return [
    {
      '@type': 'ImageObject',
      url,
      width: 512,
      height: 728,
      ...(title ? { caption: `${title} — cover on ${ICS_SITE_DISPLAY_NAME}` } : {}),
    },
  ];
}
