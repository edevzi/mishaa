/** ISO 3166-1 alpha-2 — geographic hints from hosting (e.g. Vercel `x-vercel-ip-country`). */

const EU_MEMBER_STATES = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
] as const;

/** EU + EEA (non‑EU) + CH/UK commonly aligned with strict analytics/cookie UX. Tune with counsel. */
export const ANALYTICS_CONSENT_ISO2 = new Set<string>([
  ...EU_MEMBER_STATES,
  'IS',
  'LI',
  'NO',
  'GB',
  'CH',
  /** Korea, Japan, greater China — strong privacy regimes; default to opt‑in analytics. */
  'KR',
  'JP',
  'CN',
  'HK',
  'TW',
  'MO',
]);

/** Stronger jurisdiction wording on adult gate — product UX, not legal certainty. Review locally. */
export const EAST_ASIA_EXTRA_AGE_COPY_ISO2 = new Set<string>(['KR', 'JP', 'CN', 'HK', 'TW', 'MO']);

/** EU + EEA + CH/UK — extra truthful-age note on adult gate (separate from analytics list). */
export const EUROPE_EXTRA_AGE_COPY_ISO2 = new Set<string>([
  ...EU_MEMBER_STATES,
  'IS',
  'LI',
  'NO',
  'GB',
  'CH',
]);
