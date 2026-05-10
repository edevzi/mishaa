import {
  ANALYTICS_CONSENT_ISO2,
  EAST_ASIA_EXTRA_AGE_COPY_ISO2,
  EUROPE_EXTRA_AGE_COPY_ISO2,
} from '@/lib/regional/country-groups';

export type RegionSignals = {
  analyticsConsentRequired: boolean;
  eastAsiaAgeCopy: boolean;
  europeAgeCopy: boolean;
};

export function resolveRegionSignals(countryRaw: string | undefined | null): RegionSignals {
  const iso = (countryRaw ?? '').trim().toUpperCase();
  if (iso.length !== 2) {
    return { analyticsConsentRequired: false, eastAsiaAgeCopy: false, europeAgeCopy: false };
  }
  return {
    analyticsConsentRequired: ANALYTICS_CONSENT_ISO2.has(iso),
    eastAsiaAgeCopy: EAST_ASIA_EXTRA_AGE_COPY_ISO2.has(iso),
    europeAgeCopy: EUROPE_EXTRA_AGE_COPY_ISO2.has(iso),
  };
}
