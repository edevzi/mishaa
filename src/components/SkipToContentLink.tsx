'use client';

import { useResolvedLang } from '@/hooks/useResolvedLang';
import { translations } from '@/lib/translations';

/**
 * Accessibility skip-link, rendered client-side so the root layout can stay static.
 * `useResolvedLang` returns 'en' for the SSR/first-paint snapshot (matching the static
 * HTML) and reconciles to the stored language after hydration without a flash.
 */
export default function SkipToContentLink() {
  const lang = useResolvedLang();
  const label = translations[lang].common.skipToContent;
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only fixed left-4 top-4 z-[99999] rounded-btn bg-accent px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-on-accent"
    >
      {label}
    </a>
  );
}
