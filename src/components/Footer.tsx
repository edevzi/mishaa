'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { translations, Lang } from '@/lib/translations';
import { readStorageItem } from '@/lib/browser-storage';
import { TELEGRAM_CHANNEL_URL } from '@/lib/telegram-config';

export default function Footer() {
  const [lang, setLang] = useState<Lang>('en');
  const t = translations[lang].footer;

  useEffect(() => {
    let t_timeout: NodeJS.Timeout;
    const savedLang = readStorageItem('lang') as Lang;
    if (savedLang && translations[savedLang]) {
      t_timeout = setTimeout(() => setLang(prev => (savedLang !== prev ? savedLang : prev)), 0);
    }

    const handleLang = (e: Event) => setLang((e as CustomEvent<Lang>).detail);
    window.addEventListener('langChange', handleLang as EventListener);
    return () => {
      window.removeEventListener('langChange', handleLang as EventListener);
      clearTimeout(t_timeout);
    };
  }, []);

  return (
    <footer className="mt-24 border-t border-line-subtle bg-app text-fg">
      <div className="wrap py-12 sm:py-16">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-16">
          <div className="max-w-md space-y-5">
            {/* Brand mark — the logo stays as-is (fixed asset) */}
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="font-accent text-xl leading-none tracking-wider select-none" style={{ letterSpacing: '0.04em' }}>
                <span className="text-neutral-900 dark:text-white">iComics</span>
                <span style={{ color: '#ffd36b', margin: '0 1px' }}>·</span>
                <span style={{ color: '#ff5a1f' }}>wiki</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-fg-muted">
              {t.taglineLine1} {t.taglineLine2} {t.taglineLine3}
            </p>
            <p className="text-xs leading-relaxed text-fg-muted">
              {t.wikiOfficialLine}
            </p>
            <p className="font-mono text-[11px] tracking-[0.04em] text-fg-muted">
              {t.copyrightNotice}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-12 lg:gap-16">
            <div className="space-y-4">
              <span className="ic-eyebrow">{t.studio}</span>
              <div className="flex flex-col gap-3 text-sm">
                <Link href="/library" className="text-fg-secondary transition-colors hover:text-fg">{t.launch}</Link>
                <Link href="/about" className="text-fg-secondary transition-colors hover:text-fg">{t.about}</Link>
              </div>
            </div>
            <div className="space-y-4">
              <span className="ic-eyebrow">{t.support}</span>
              <div className="flex flex-col gap-3 text-sm">
                <Link href="/faq" className="text-fg-secondary transition-colors hover:text-fg">{t.faq}</Link>
                <Link href="/guides" className="text-fg-secondary transition-colors hover:text-fg">{t.guides}</Link>
                <Link href="/reading" className="text-fg-secondary transition-colors hover:text-fg">{t.readingHub}</Link>
                <Link href="/support" className="text-fg-secondary transition-colors hover:text-fg">{t.customer}</Link>
                <Link href="/link-to-us" className="text-fg-secondary transition-colors hover:text-fg">{t.linkToUs}</Link>
                <Link href="/settings" className="text-fg-secondary transition-colors hover:text-fg">{t.settingsLink}</Link>
                <a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noreferrer" className="text-fg-secondary transition-colors hover:text-fg">{t.telegramChannel}</a>
              </div>
            </div>
            <div className="space-y-4">
              <span className="ic-eyebrow">{t.legal}</span>
              <div className="flex flex-col gap-3 text-sm">
                <Link href="/privacy" className="text-fg-secondary transition-colors hover:text-fg">{t.privacyPolicy}</Link>
                <Link href="/terms" className="text-fg-secondary transition-colors hover:text-fg">{t.termsShort}</Link>
                <Link href="/content-policy" className="text-fg-secondary transition-colors hover:text-fg">{t.contentPolicy}</Link>
                <Link href="/dmca" className="text-fg-secondary transition-colors hover:text-fg">{t.dmca}</Link>
                <Link href="/contact" className="text-fg-secondary transition-colors hover:text-fg">{t.contactEmail}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
