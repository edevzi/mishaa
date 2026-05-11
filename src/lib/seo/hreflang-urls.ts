import type { UiLang } from '@/lib/i18n/lang';
import { UI_LANGS } from '@/lib/i18n/lang';

/** Query param — sets UI cookie via middleware (not manga catalog `lang`). */
export const UI_LANG_SEARCH_PARAM = 'ui';

export function hreflangCodeForUiLang(lang: UiLang): string {
  switch (lang) {
    case 'zh':
      return 'zh-Hans';
    case 'ja':
      return 'ja';
    case 'ko':
      return 'ko';
    case 'ru':
      return 'ru';
    default:
      return 'en';
  }
}

/**
 * hreflang map: every UI language + x-default (clean URL, no ?ui=).
 * `pathname` is `/`, `/library`, `/reading`, etc.
 */
export function hreflangAlternates(origin: string, pathname: string): Record<string, string> {
  const path = pathname === '/' || pathname === '' ? '/' : pathname.startsWith('/') ? pathname : `/${pathname}`;
  const originClean = origin.replace(/\/$/, '');
  const absoluteBase =
    path === '/' ? `${originClean}/` : `${originClean}${path}`;
  const xDefault = path === '/' ? originClean : `${originClean}${path}`;
  const out: Record<string, string> = {};
  for (const lang of UI_LANGS) {
    const u = new URL(absoluteBase);
    u.searchParams.set(UI_LANG_SEARCH_PARAM, lang);
    out[hreflangCodeForUiLang(lang)] = u.href;
  }
  out['x-default'] = xDefault;
  return out;
}
