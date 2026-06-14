'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { RegionSignals } from '@/lib/regional/resolve-region';
import { readClientCookie } from '@/lib/cookie-client';

const defaultSignals: RegionSignals = {
  analyticsConsentRequired: false,
  eastAsiaAgeCopy: false,
  europeAgeCopy: false,
};

const RegionUiContext = createContext<RegionSignals>(defaultSignals);

export function useRegionUi(): RegionSignals {
  return useContext(RegionUiContext);
}

/**
 * Region UX flags (analytics-consent prompt, age-gate copy variant) come from
 * client-readable cookies the proxy/middleware sets per request. We read them AFTER
 * hydration so the root layout no longer calls cookies()/headers() — which had opted
 * EVERY route into dynamic rendering. Defaults are the privacy-safe "no special region"
 * values and self-correct on mount.
 *
 * This is compliance-safe: analytics firing is gated independently by
 * `shouldSendAnalyticsEvents()` reading the same `ics_analytics_consent_required` cookie,
 * so a brief default-false window here never lets analytics fire without consent.
 */
export default function RegionalShell({ children }: { children: ReactNode }) {
  const [signals, setSignals] = useState<RegionSignals>(defaultSignals);

  useEffect(() => {
    setSignals({
      analyticsConsentRequired: readClientCookie('ics_analytics_consent_required') === '1',
      eastAsiaAgeCopy: readClientCookie('ics_east_age_copy') === '1',
      europeAgeCopy: readClientCookie('ics_europe_age_copy') === '1',
    });
  }, []);

  return <RegionUiContext.Provider value={signals}>{children}</RegionUiContext.Provider>;
}
