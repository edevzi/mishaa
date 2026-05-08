'use client';

import { Suspense, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppRouteLoading from '@/components/AppRouteLoading';
import { MessageCircle, Send, LifeBuoy } from 'lucide-react';
import { readStorageItem } from '@/lib/browser-storage';
import { translations, type Lang } from '@/lib/translations';

type ReportCategory =
  | 'CONTENT_ISSUE'
  | 'IDENTITY_FORGE_ERROR'
  | 'INKING_ENGINE_LAG'
  | 'EXPORT_FAILURE'
  | 'ACCOUNT_ACCESS';

const CATEGORY_ORDER: ReportCategory[] = [
  'CONTENT_ISSUE',
  'IDENTITY_FORGE_ERROR',
  'INKING_ENGINE_LAG',
  'EXPORT_FAILURE',
  'ACCOUNT_ACCESS',
];

function categoryUiLabel(cat: ReportCategory, lang: Lang): string {
  const t = translations[lang].support;
  switch (cat) {
    case 'CONTENT_ISSUE':
      return t.catContentIssue;
    case 'IDENTITY_FORGE_ERROR':
      return t.catIdentityForgeError;
    case 'INKING_ENGINE_LAG':
      return t.catInkingEngineLag;
    case 'EXPORT_FAILURE':
      return t.catExportFailure;
    case 'ACCOUNT_ACCESS':
      return t.catAccountAccess;
    default:
      return cat;
  }
}

function SupportPageContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Lang>('en');
  const [report, setReport] = useState(() => {
    const category = (searchParams.get('category') as ReportCategory) || 'EXPORT_FAILURE';
    const safeCategory = CATEGORY_ORDER.includes(category) ? category : 'EXPORT_FAILURE';
    const comic = searchParams.get('comic');
    const source = searchParams.get('source');
    const chapter = searchParams.get('chapter');
    const details = searchParams.get('details') || '';

    return {
      email: searchParams.get('email') || '',
      category: safeCategory,
      details: [
        details,
        comic ? `Comic: ${comic}` : '',
        source ? `Source: ${source}` : '',
        chapter ? `Chapter: ${chapter}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    };
  });

  const t = translations[lang].support;

  const categoryOpts = useMemo(
    () => CATEGORY_ORDER.map((value) => ({ value, label: categoryUiLabel(value, lang) })),
    [lang],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = readStorageItem('lang') as Lang;
      if (saved && translations[saved]) setLang(saved);
    }, 0);

    const onLang = (e: Event) => setLang((e as CustomEvent<Lang>).detail);
    window.addEventListener('langChange', onLang as EventListener);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('langChange', onLang as EventListener);
    };
  }, []);

  const submitReport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const friendly = categoryUiLabel(report.category as ReportCategory, lang);

    const subject = encodeURIComponent(`${t.mailSubjectPrefix} ${friendly}`);
    const reporter = report.email.trim() || t.anonymous;
    const body = encodeURIComponent(
      `${t.mailReporterLabel}: ${reporter}\n${t.mailCategoryLabel}: ${friendly}\n\n${report.details}`,
    );

    window.location.href = `mailto:info@icomics.wiki?subject=${subject}&body=${body}`;
    trackEvent('report_submitted', {
      category: report.category,
      hasEmail: Boolean(report.email),
      detailsLength: report.details.length,
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-50 text-neutral-900 selection:bg-[#ff4d00] selection:text-white dark:bg-[#020202] dark:text-white dark:selection:text-white">
      <Navbar />

      <main className="container mx-auto px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-5xl space-y-16 sm:space-y-24"
        >
          <div className="space-y-6 text-center sm:space-y-8">
            <div className="inline-block rounded-xl border border-neutral-200 bg-black/[0.06] px-6 py-2 shadow-[6px_6px_0px_#000] dark:border-white/10 dark:bg-white/10">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">{t.badge}</span>
            </div>
            <h1 className="font-display text-balance text-4xl uppercase italic leading-none tracking-tighter sm:text-6xl md:text-9xl">
              {t.titleLine1}
              <br />
              <span className="text-[#e63946]">{t.titleLine2}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base font-medium opacity-60 sm:text-xl md:text-2xl">{t.intro}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-6 rounded-3xl border border-neutral-200 bg-black/[0.04] p-6 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-neutral-200 bg-white dark:border-white/10">
                <Send size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">{t.cardEmailTitle}</h3>
              <p className="text-sm opacity-60">{t.cardEmailBody}</p>
              <div className="w-full border-t-2 border-neutral-100 pt-4 dark:border-white/5">
                <a href="mailto:info@icomics.wiki" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e63946] hover:underline">
                  info@icomics.wiki
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-6 rounded-3xl border border-neutral-200 bg-black/[0.04] p-6 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-neutral-200 bg-white dark:border-white/10">
                <MessageCircle size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">{t.cardTelegramTitle}</h3>
              <p className="text-sm opacity-60">{t.cardTelegramBody}</p>
              <div className="w-full border-t-2 border-neutral-100 pt-4 dark:border-white/5">
                <a href="https://t.me/icomicsuz" target="_blank" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3b82f6] hover:underline">
                  @icomicsuz
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-6 rounded-3xl border border-neutral-200 bg-[#0a0a0a] p-6 text-center dark:border-white/10 sm:p-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#111111]">
                <LifeBuoy size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">{t.cardFaqTitle}</h3>
              <p className="text-sm opacity-80">{t.cardFaqBody}</p>
              <div className="w-full border-t-2 border-neutral-200 pt-4 dark:border-white/10">
                <Link href="/faq" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffca3a] hover:underline">
                  {t.cardFaqCta}
                </Link>
              </div>
            </div>
          </div>

          <form
            onSubmit={submitReport}
            className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-black/[0.04] p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-10 md:p-16"
          >
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 border-b-4 border-l-4 border-black opacity-20 bg-[#ff4d00]" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-balance font-display text-3xl uppercase tracking-tighter sm:text-5xl">{t.formTitle}</h2>
              <p className="border-l-8 border-neutral-200 py-2 pl-6 font-editorial text-lg italic text-neutral-600 dark:border-white/20 dark:text-white/50">
                {t.formQuote}
              </p>

              <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-2">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.labelEmail}</label>
                  <input
                    type="text"
                    value={report.email}
                    onChange={(event) => setReport((current) => ({ ...current, email: event.target.value }))}
                    className="w-full rounded-xl border border-neutral-300 bg-transparent px-6 py-4 text-xs font-bold text-neutral-900 focus:outline-none dark:border-white/20 dark:text-white"
                    placeholder={t.placeholderEmail}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.labelCategory}</label>
                  <select
                    value={report.category}
                    onChange={(event) =>
                      setReport((current) => ({ ...current, category: event.target.value as ReportCategory }))
                    }
                    className="w-full appearance-none rounded-xl border border-neutral-300 bg-transparent px-6 py-4 text-xs font-bold uppercase tracking-wide text-neutral-900 focus:outline-none dark:border-white/20 dark:text-white"
                  >
                    {categoryOpts.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.labelDetails}</label>
                  <textarea
                    value={report.details}
                    onChange={(event) => setReport((current) => ({ ...current, details: event.target.value }))}
                    className="min-h-[200px] w-full rounded-xl border border-neutral-300 bg-transparent px-6 py-4 text-xs font-bold text-neutral-900 focus:outline-none dark:border-white/20 dark:text-white"
                    placeholder={t.placeholderDetails}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-black px-8 py-4 uppercase font-black tracking-widest text-white transition-all sm:w-auto sm:px-16 sm:py-6 dark:hover:bg-[#ff4d00]"
              >
                {t.submitBtn}
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={<AppRouteLoading />}>
      <SupportPageContent />
    </Suspense>
  );
}
