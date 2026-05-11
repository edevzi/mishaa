import type { UiLang } from '@/lib/i18n/lang';
import { en } from '@/lib/i18n/en';
import { ru } from '@/lib/i18n/ru';
import { ja } from '@/lib/i18n/locales/ja';
import { ko } from '@/lib/i18n/locales/ko';
import { zh } from '@/lib/i18n/locales/zh';

export type Lang = UiLang;

export type TranslationBundle = typeof en;

export const translations = {
  en,
  ru,
  ja,
  ko,
  zh,
} satisfies Record<Lang, TranslationBundle>;
