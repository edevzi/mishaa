'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRegionUi } from '@/components/RegionalShell';
import { getAnalyticsConsentDecision, persistAnalyticsConsent } from '@/lib/analytics-consent';

export default function CookieConsentBanner() {
  const { analyticsConsentRequired, europeAgeCopy } = useRegionUi();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!analyticsConsentRequired) return;
    setVisible(getAnalyticsConsentDecision() === null);
  }, [analyticsConsentRequired]);

  const grant = useCallback(() => {
    persistAnalyticsConsent('granted');
    setVisible(false);
  }, []);

  const deny = useCallback(() => {
    persistAnalyticsConsent('denied');
    setVisible(false);
  }, []);

  if (!analyticsConsentRequired || !visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie and analytics consent"
      className="fixed bottom-0 inset-x-0 z-[100010] border-t border-neutral-200 bg-neutral-100/95 px-4 py-4 text-neutral-900 backdrop-blur-xl dark:border-white/10 dark:bg-[#090a0f]/95 dark:text-white"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-[10px] leading-relaxed tracking-wide text-neutral-700 dark:text-white/70 sm:max-w-xl">
          {europeAgeCopy
            ? 'EEA, UK, Swiss, and comparable visitors: optional analytics stays off until you allow it.'
            : 'Some regions ask for analytics consent before we send pings.'}{' '}
          Essential cookies cover age gates and preferences only. Toggle details in{' '}
          <Link href="/privacy" className="text-[#ff5a1f] underline underline-offset-2 hover:text-neutral-900 dark:hover:text-white">
            Privacy
          </Link>{' '}
          and{' '}
          <Link href="/content-policy" className="text-[#ff5a1f] underline underline-offset-2 hover:text-neutral-900 dark:hover:text-white">
            Content Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={deny}
            className="min-h-11 px-4 text-[9px] font-black uppercase tracking-widest text-neutral-600 transition-colors hover:text-neutral-900 dark:text-white/50 dark:hover:text-white"
          >
            Essentials only
          </button>
          <button
            type="button"
            onClick={grant}
            className="min-h-11 bg-[#ff5a1f] px-5 text-[9px] font-black uppercase tracking-widest text-white transition-colors hover:bg-black dark:hover:bg-white dark:hover:text-black"
          >
            Allow analytics
          </button>
        </div>
      </div>
    </div>
  );
}
