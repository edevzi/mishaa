import type { NextRequest } from 'next/server';
import type { RegionSignals } from '@/lib/regional/resolve-region';
import { resolveRegionSignals } from '@/lib/regional/resolve-region';

const HEADER_COUNTRY = 'x-ics-ip-country';
const HEADER_ANALYTICS_CONSENT = 'x-ics-analytics-consent-required';
const HEADER_EAST_AGE = 'x-ics-east-age-copy';
const HEADER_EUROPE_AGE = 'x-ics-europe-age-copy';

/** Forward geo + UX flags to App Router `headers()` / Server Components. */
export function withIcsGeoRequestHeaders(request: NextRequest): Headers {
  const incoming = new Headers(request.headers);
  const country = incoming.get('x-vercel-ip-country') ?? '';
  const signals = resolveRegionSignals(country);
  incoming.set(HEADER_COUNTRY, country);
  incoming.set(HEADER_ANALYTICS_CONSENT, signals.analyticsConsentRequired ? '1' : '0');
  incoming.set(HEADER_EAST_AGE, signals.eastAsiaAgeCopy ? '1' : '0');
  incoming.set(HEADER_EUROPE_AGE, signals.europeAgeCopy ? '1' : '0');
  return incoming;
}

export function readRegionSignalsFromHeaders(h: Headers): RegionSignals {
  return {
    analyticsConsentRequired: h.get(HEADER_ANALYTICS_CONSENT) === '1',
    eastAsiaAgeCopy: h.get(HEADER_EAST_AGE) === '1',
    europeAgeCopy: h.get(HEADER_EUROPE_AGE) === '1',
  };
}
