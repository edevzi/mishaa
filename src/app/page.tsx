import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import HomeClient from '@/components/HomeClient';
import { getPublicSiteUrl } from '@/lib/og-metadata';
import { openGraphTwitterFromLogo } from '@/lib/seo/page-metadata';
import { getHomeData } from '@/lib/home-data';
import type { MangaLanguage } from '@/lib/manga-language';

const site = getPublicSiteUrl().replace(/\/$/, '');

const HOME_META_DESCRIPTION =
  'Browse manga, manhwa, vertical webtoons, and optional age‑gated catalogs in one browser reader—quick search (e.g. MangaDex‑style IDs), fullscreen chapters, bookmarks, progress where syncing is on, English/Russian UI, guides & RSS on icomics.wiki. Official site—not the DRM iOS “iComics” comic file app.';

export const metadata: Metadata = {
  title: 'Manga, manhwa & webtoons online — icomics.wiki reader',
  description: HOME_META_DESCRIPTION,
  ...openGraphTwitterFromLogo({
    origin: site,
    pageAbsoluteUrl: site,
    openGraphTitle: 'Read manga, manhwa & webtoons in your browser',
    twitterTitle: 'Online manga, manhwa & webtoons | icomics.wiki',
    description: HOME_META_DESCRIPTION,
    openGraphDescription:
      'One reader for manga, manhwa, webtoons, and verified adult shelves: search titles, fullscreen chapters, bookmarks, multilingual UI. Brand disambiguation: FAQ & /icomics-wiki—not the unrelated iOS iComics app.',
    twitterDescription:
      'Manga / manhwa / webtoon browser library—bookmarks, progress, RSS, guides. Official icomics.wiki.',
  }),
  alternates: {
    canonical: site,
  },
};

import { UI_LANG_COOKIE } from '@/lib/i18n/cookies';
import { isUiLang } from '@/lib/i18n/lang';
import { uiLangToPreferredMangaLanguage } from '@/lib/i18n/ui-lang-to-manga';

const MANGA_QUERY_LANGS: MangaLanguage[] = [
  'en',
  'ja',
  'ko',
  'ru',
  'es',
  'fr',
  'de',
  'pt-br',
  'zh',
  'zh-hk',
  'th',
  'it',
  'all',
];

const normalizeLanguage = (
  queryLang: string | undefined,
  uiCookie: string | undefined
): MangaLanguage => {
  if (queryLang && (MANGA_QUERY_LANGS as readonly string[]).includes(queryLang)) {
    return queryLang as MangaLanguage;
  }
  if (isUiLang(uiCookie)) return uiLangToPreferredMangaLanguage(uiCookie);
  return 'en';
};

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const cookieStore = await cookies();
  const headerList = await headers();
  const userAgent = headerList.get('user-agent') || '';
  const includeAdultContent = cookieStore.get('age_verified')?.value === 'true';
  const initialIsTouchDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
  const uiCookie = cookieStore.get(UI_LANG_COOKIE)?.value;
  const initialMangaLanguage = normalizeLanguage(lang, uiCookie);
  const initialData = await getHomeData(initialMangaLanguage, { includeAdultContent });

  return (
    <HomeClient
      initialData={initialData}
      initialAgeVerified={includeAdultContent}
      initialIsTouchDevice={initialIsTouchDevice}
      initialMangaLanguage={initialMangaLanguage}
    />
  );
}
