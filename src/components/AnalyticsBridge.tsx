'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { shouldSendAnalyticsEvents, trackPageView } from '@/lib/analytics';
import { subscribeAnalyticsConsentChange } from '@/lib/analytics-consent';

export default function AnalyticsBridge() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const flush = () => {
      if (!shouldSendAnalyticsEvents()) return;
      const search = searchParams.toString();
      trackPageView({
        pathname,
        search: search || null,
      });
    };

    flush();
    return subscribeAnalyticsConsentChange(flush);
  }, [pathname, searchParams]);

  return null;
}
