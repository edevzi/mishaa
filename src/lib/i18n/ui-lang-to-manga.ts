import type { MangaLanguage } from '@/lib/manga-language';
import type { UiLang } from '@/lib/i18n/lang';

/** Preferred MangaDex / chapter language for a given UI locale. */
export function uiLangToPreferredMangaLanguage(ui: UiLang): MangaLanguage {
  switch (ui) {
    case 'ja':
      return 'ja';
    case 'ko':
      return 'ko';
    case 'zh':
      return 'zh';
    case 'ru':
      return 'ru';
    default:
      return 'en';
  }
}
