import type { UiLang } from '@/lib/i18n/lang';

const JP = new Set(['JP']);
const KR = new Set(['KR']);
/** Mainland China + Hong Kong SAR + Macau + Taiwan use Chinese UI (`zh` covers MangaDex simplified + UI). */
const ZH = new Set(['CN', 'HK', 'MO', 'TW']);
const RU = new Set([
  'RU',
  'BY',
  'KZ',
  'KG',
  'UZ', // Russian widely used; user can switch in-app
  'UA', // eastern regions / legacy use — still default en per policy? User said RU for Russia. UA -> en is safer
]);

/**
 * Default **interface** language from CDN geo (e.g. Vercel `x-vercel-ip-country`).
 * Any ISO-3166 alpha-2 not listed falls back to English.
 */
export function suggestedUiLangFromCountry(iso2Raw: string | undefined | null): UiLang {
  const iso = (iso2Raw ?? '').trim().toUpperCase();
  if (iso.length !== 2) return 'en';
  if (JP.has(iso)) return 'ja';
  if (KR.has(iso)) return 'ko';
  if (ZH.has(iso)) return 'zh';
  if (RU.has(iso)) return 'ru';
  return 'en';
}
