'use client';

import { useMemo } from 'react';
import { useRegionUi } from '@/components/RegionalShell';
import { buildAgeGateDescription } from '@/lib/regional/age-gate-copy';

export function useLibraryAgeDescription(
  ageDesc: string,
  extras?: { ageDescEastAsia?: string; ageDescEurope?: string },
): string {
  const { eastAsiaAgeCopy, europeAgeCopy } = useRegionUi();
  return useMemo(
    () =>
      buildAgeGateDescription(
        {
          ageDesc,
          ageDescEastAsia: extras?.ageDescEastAsia,
          ageDescEurope: extras?.ageDescEurope,
        },
        { eastAsiaAgeCopy, europeAgeCopy },
      ),
    [
      ageDesc,
      extras?.ageDescEastAsia,
      extras?.ageDescEurope,
      eastAsiaAgeCopy,
      europeAgeCopy,
    ],
  );
}
