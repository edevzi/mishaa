import { UI_LANG_COOKIE } from '@/lib/i18n/cookies';
import type { UiLang } from '@/lib/i18n/lang';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 400;

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function readBrowserCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`)
  );
  return m ? decodeURIComponent(m[1] ?? '') : null;
}

export function persistUiLangCookie(lang: UiLang): void {
  if (typeof document === 'undefined') return;
  const secure = isProduction() ? ';secure' : '';
  document.cookie = `${UI_LANG_COOKIE}=${encodeURIComponent(lang)};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax${secure}`;
}
