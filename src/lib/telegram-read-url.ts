/** Pure helpers for Telegram caption “Read” links — tested independently of env/Prisma. */

export type TelegramReadUrlInput = {
  id: string;
  href: string;
  shelf: string;
  source?: string;
};

function absoluteSitePath(siteOrigin: string, pathOrUrl: string) {
  const origin = siteOrigin.replace(/\/$/, '');
  const raw = pathOrUrl.trim();
  if (!raw) return origin;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('/')) return `${origin}${raw}`;
  return `${origin}/${raw}`;
}

const NHENTAI_TELEGRAM_SHELVES = new Set(['doujinshi', 'milf', 'ntr']);

function inferTelegramLibrarySource(shelf: string, explicit?: string): 'mangadex' | 'nhentai' {
  const fromItem = explicit?.trim().toLowerCase();
  if (fromItem === 'nhentai' || fromItem === 'mangadex') return fromItem;
  return NHENTAI_TELEGRAM_SHELVES.has(shelf) ? 'nhentai' : 'mangadex';
}

function libraryDetailPathFromHref(pathname: string): string | null {
  const m = pathname.match(/^\/library\/([^/]+)\/([^/]+)\/?/);
  if (!m?.[1] || !m?.[2]) return null;
  return `/library/${m[1]}/${m[2]}`;
}

/**
 * Canonical comic URL for Telegram captions: never leave users on site root when `id` is known.
 */
export function resolveTelegramComicReadUrl(originInput: string, comic: TelegramReadUrlInput): string {
  const origin = originInput.replace(/\/$/, '');
  const rawHref = String(comic.href ?? '').trim();
  const id = String(comic.id ?? '').trim();

  const sameOriginDetail = (absolute: string): string | null => {
    try {
      const u = new URL(absolute);
      const o = new URL(origin);
      if (u.hostname.replace(/^www\./i, '') !== o.hostname.replace(/^www\./i, '')) return null;
      const detail = libraryDetailPathFromHref(u.pathname);
      return detail ? `${origin}${detail}` : null;
    } catch {
      return null;
    }
  };

  if (/^https?:\/\//i.test(rawHref)) {
    const coerced = sameOriginDetail(rawHref);
    if (coerced) return coerced;
  } else if (rawHref.startsWith('/')) {
    const detail = libraryDetailPathFromHref(rawHref);
    if (detail) return `${origin}${detail}`;
  }

  if (id) {
    const source = inferTelegramLibrarySource(comic.shelf, comic.source);
    return `${origin}/library/${source}/${encodeURIComponent(id)}`;
  }

  if (!rawHref) return origin;
  if (/^https?:\/\//i.test(rawHref)) return rawHref;
  return absoluteSitePath(origin, rawHref);
}
