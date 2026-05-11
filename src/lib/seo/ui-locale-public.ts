import type { Metadata } from 'next';
import type { UiLang } from '@/lib/i18n/lang';
import { isUiLang } from '@/lib/i18n/lang';
import { translations } from '@/lib/translations';
import {
  ICS_SITE_DISPLAY_NAME,
  openGraphTwitterFromLogo,
} from '@/lib/seo/page-metadata';
import {
  UI_LANG_SEARCH_PARAM,
  hreflangAlternates,
} from '@/lib/seo/hreflang-urls';

export {
  UI_LANG_SEARCH_PARAM,
  hreflangCodeForUiLang,
  hreflangAlternates,
} from '@/lib/seo/hreflang-urls';

export function openGraphLocaleForUiLang(lang: UiLang): string {
  switch (lang) {
    case 'ja':
      return 'ja_JP';
    case 'ko':
      return 'ko_KR';
    case 'zh':
      return 'zh_CN';
    case 'ru':
      return 'ru_RU';
    default:
      return 'en_US';
  }
}

export function resolveUiLang(cookieValue: string | undefined, uiParam: string | undefined): UiLang {
  if (isUiLang(uiParam)) return uiParam;
  if (isUiLang(cookieValue)) return cookieValue;
  return 'en';
}

export function truncateMeta(text: string, max = 158): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

export function mergeHreflangAlternates(
  meta: Metadata,
  origin: string,
  pathname: string,
): Metadata {
  const languages = hreflangAlternates(origin, pathname);
  const prev = meta.alternates?.languages;
  const prevRec =
    prev && typeof prev === 'object' && !Array.isArray(prev)
      ? (prev as Record<string, string>)
      : {};
  return {
    ...meta,
    alternates: {
      ...meta.alternates,
      languages: { ...prevRec, ...languages },
    },
  };
}

const HOME_KEYWORDS_EN = [
  'manga online',
  'hentai manga',
  'read manga browser',
  'MangaDex',
  'manhwa',
  'webtoon',
  'adult manga',
  'doujinshi online',
  'manga hentai',
  'icomics.wiki',
] as const;

export function buildHomeMetadata(opts: {
  site: string;
  uiLang: UiLang;
  uiSearchParam?: string;
}): Metadata {
  const site = opts.site.replace(/\/$/, '');
  const t = translations[opts.uiLang];
  const title = `${t.hero.pageH1} — ${ICS_SITE_DISPLAY_NAME}`;
  const description = truncateMeta(t.hero.desc);
  const canonical = isUiLang(opts.uiSearchParam)
    ? `${site}/?${UI_LANG_SEARCH_PARAM}=${opts.uiSearchParam}`
    : site;

  const ogTw = openGraphTwitterFromLogo({
    origin: site,
    pageAbsoluteUrl: canonical,
    openGraphTitle: title,
    description,
    openGraphLocale: openGraphLocaleForUiLang(opts.uiLang),
  });

  return {
    title,
    description,
    keywords: [...HOME_KEYWORDS_EN],
    ...ogTw,
    alternates: {
      canonical,
      languages: hreflangAlternates(site, '/'),
    },
  };
}
