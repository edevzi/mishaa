export type UiLang = 'en' | 'ru' | 'ja' | 'ko' | 'zh';

export const UI_LANGS: readonly UiLang[] = ['en', 'ja', 'ko', 'zh', 'ru'];

export function isUiLang(v: string | null | undefined): v is UiLang {
  return v === 'en' || v === 'ru' || v === 'ja' || v === 'ko' || v === 'zh';
}
