'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { RegionSignals } from '@/lib/regional/resolve-region';

const defaultSignals: RegionSignals = {
  analyticsConsentRequired: false,
  eastAsiaAgeCopy: false,
  europeAgeCopy: false,
};

const RegionUiContext = createContext<RegionSignals>(defaultSignals);

export function useRegionUi(): RegionSignals {
  return useContext(RegionUiContext);
}

export default function RegionalShell({
  analyticsConsentRequired,
  eastAsiaAgeCopy,
  europeAgeCopy,
  children,
}: RegionSignals & { children: ReactNode }) {
  const value = useMemo(
    () => ({ analyticsConsentRequired, eastAsiaAgeCopy, europeAgeCopy }),
    [analyticsConsentRequired, eastAsiaAgeCopy, europeAgeCopy],
  );
  return <RegionUiContext.Provider value={value}>{children}</RegionUiContext.Provider>;
}
