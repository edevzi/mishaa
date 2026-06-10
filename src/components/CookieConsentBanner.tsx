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
      className="fixed bottom-0 inset-x-0 z-[100010] border-t border-line bg-raised px-4 py-4 text-fg shadow-[var(--shadow-md)]"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-xs leading-relaxed text-fg-secondary sm:max-w-xl">
          {europeAgeCopy
            ? 'EEA, UK, Swiss, and comparable visitors: optional analytics stays off until you allow it.'
            : 'Some regions ask for analytics consent before we send pings.'}{' '}
          Essential cookies cover age gates and preferences only. Toggle details in{' '}
          <Link href="/privacy" className="text-accent-text underline underline-offset-2 hover:text-fg">
            Privacy
          </Link>{' '}
          and{' '}
          <Link href="/content-policy" className="text-accent-text underline underline-offset-2 hover:text-fg">
            Content Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button type="button" onClick={deny} className="ic-btn ic-btn--ghost ic-btn--sm">
            Essentials only
          </button>
          <button type="button" onClick={grant} className="ic-btn ic-btn--primary ic-btn--sm">
            Allow analytics
          </button>
        </div>
      </div>
    </div>
  );
}
