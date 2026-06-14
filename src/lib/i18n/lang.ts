export type UiLang = 'en' | 'ru' | 'ja' | 'ko' | 'zh';

export const UI_LANGS: readonly UiLang[] = ['en', 'ja', 'ko', 'zh', 'ru'];

export function isUiLang(v: string | null | undefined): v is UiLang {
  return v === 'en' || v === 'ru' || v === 'ja' || v === 'ko' || v === 'zh';
}

/**
 * Maps a UI language to the value for the document `lang` attribute. Shared between the
 * server (root layout) and client (language switcher) so the zh→zh-Hans normalization
 * can never drift between SSR and the immediate client update.
 */
export function htmlLangFromUiLang(lang: UiLang): string {
  return lang === 'zh' ? 'zh-Hans' : lang;
}
