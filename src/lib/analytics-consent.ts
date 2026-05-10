'use client';

const STORAGE_KEY = 'ics_analytics_consent';

export type AnalyticsConsentValue = 'granted' | 'denied';

export function getAnalyticsConsentDecision(): AnalyticsConsentValue | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === 'granted' || v === 'denied' ? v : null;
}

export function persistAnalyticsConsent(value: AnalyticsConsentValue) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent<AnalyticsConsentValue>('ics-analytics-consent-changed', { detail: value }));
}

export function subscribeAnalyticsConsentChange(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('ics-analytics-consent-changed', handler as EventListener);
  return () => window.removeEventListener('ics-analytics-consent-changed', handler as EventListener);
}
