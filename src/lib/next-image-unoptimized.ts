/**
 * Next.js `/ _next/image` rejects some proxied sources: a `src` like
 * `/api/proxy/image?url=https%3A%2F%2F...` becomes an invalid optimize request
 * (`INVALID_IMAGE_OPTIMIZE_REQUEST`). Use `unoptimized` so the browser loads
 * the app proxy URL directly.
 *
 * `/api/proxy/nhentai/image` must also load in the browser: the optimizer
 * fetches server-side without the user's `AGE_VERIFICATION` cookie, so the
 * proxy returns 403 and covers break (Doujinshi / Mature / NTR shelves).
 */
export function imageUnoptimizedForSrc(src: string | undefined | null): boolean {
  return (
    typeof src === 'string' &&
    (src.startsWith('/api/proxy/image') || src.startsWith('/api/proxy/nhentai/image'))
  );
}
