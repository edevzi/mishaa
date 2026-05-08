'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Bookmark,
  Clock3,
  Shield,
  Mail,
  MessageCircle,
  Trash2,
  Languages,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { translations, type Lang } from '@/lib/translations';
import { readStorageItem, writeStorageItem } from '@/lib/browser-storage';
import {
  MANGA_LANGUAGE_OPTIONS,
  type MangaLanguage,
  persistStoredMangaLanguage,
  readStoredMangaLanguage,
} from '@/lib/manga-language';
import { clearAgeVerification, persistAgeVerification, readAgeVerification } from '@/lib/age-verification';
import {
  BOOKMARKS_STORAGE_KEY,
  LIBRARY_ACTIVITY_EVENT,
  clearReadingHistory,
  readBookmarks,
  readRecentHistoryItems,
} from '@/lib/library-storage';

export default function SettingsPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [mangaLanguage, setMangaLanguage] = useState<MangaLanguage>('en');
  const [ageEnabled, setAgeEnabled] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);

  const s = translations[lang].settings;

  useEffect(() => {
    const sync = () => {
      setBookmarkCount(readBookmarks().length);
      setHistoryCount(readRecentHistoryItems(100).length);
      setAgeEnabled(readAgeVerification());
      setMangaLanguage(readStoredMangaLanguage());
    };

    const savedLang = readStorageItem('lang') as Lang;
    const timer = window.setTimeout(() => {
      if (savedLang && translations[savedLang]) setLang(savedLang);
      sync();
    }, 0);

    const onLang = (event: Event) => {
      const next = (event as CustomEvent<Lang>).detail;
      if (next && translations[next]) setLang(next);
    };

    window.addEventListener(LIBRARY_ACTIVITY_EVENT, sync);
    window.addEventListener('storage', sync);
    window.addEventListener('langChange', onLang as EventListener);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(LIBRARY_ACTIVITY_EVENT, sync);
      window.removeEventListener('storage', sync);
      window.removeEventListener('langChange', onLang as EventListener);
    };
  }, []);

  const applyLang = (nextLang: Lang) => {
    setLang(nextLang);
    writeStorageItem('lang', nextLang);
    window.dispatchEvent(new CustomEvent('langChange', { detail: nextLang }));
  };

  const applyMangaLanguage = (nextLanguage: MangaLanguage) => {
    setMangaLanguage(nextLanguage);
    persistStoredMangaLanguage(nextLanguage);
    window.dispatchEvent(new Event(LIBRARY_ACTIVITY_EVENT));
  };

  const enableAdultContent = () => {
    persistAgeVerification();
    setAgeEnabled(true);
  };

  const disableAdultContent = () => {
    clearAgeVerification();
    setAgeEnabled(false);
  };

  const clearLibraryData = async () => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(BOOKMARKS_STORAGE_KEY);
    clearReadingHistory();

    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json().catch(() => null);
      if (meData?.user) {
        await fetch('/api/reading-progress', { method: 'DELETE' });
      }
    } catch (error) {
      console.error('Failed to clear cloud reading progress:', error);
    }
  };

  const interfaceLangButtons: { code: Lang; label: string }[] = [
    { code: 'en', label: s.langEnglish },
    { code: 'ru', label: s.langRussian },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-50 text-neutral-900 selection:bg-[#ff4d00] selection:text-white dark:bg-[#020202] dark:text-white dark:selection:text-white">
      <Navbar />

      <main className="container mx-auto px-6 pb-24 pt-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl space-y-10">
          <section className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-black/[0.04] px-4 py-2 dark:border-white/10 dark:bg-white/5">
              <SettingsIcon size={14} className="text-[#ff4d00]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-white/50">
                {s.eyebrow}
              </span>
            </div>
            <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-7xl">
              {s.titleLine1}{' '}
              <span className="text-[#ff4d00]">{s.titleAccent}</span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-white/45 md:text-base">{s.intro}</p>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-neutral-200 bg-white/[0.03] p-6 backdrop-blur-xl dark:border-white/10">
              <div className="mb-4 flex items-center gap-3">
                <Languages size={18} className="text-[#ffca3a]" />
                <h2 className="text-lg font-black uppercase tracking-widest">{s.interfaceLang}</h2>
              </div>
              <div className="grid gap-2">
                {interfaceLangButtons.map(({ code, label }) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => applyLang(code)}
                    className={`rounded-2xl border px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.35em] transition-all ${
                      lang === code
                        ? 'border-[#ff4d00] bg-[#ff4d00] text-white'
                        : 'border-neutral-200 bg-black/30 text-neutral-600 hover:border-white/25 hover:text-neutral-900 dark:border-white/10 dark:text-white/45 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-neutral-200 bg-white/[0.03] p-6 backdrop-blur-xl dark:border-white/10">
              <div className="mb-4 flex items-center gap-3">
                <Bookmark size={18} className="text-[#ffca3a]" />
                <h2 className="text-lg font-black uppercase tracking-widest">{s.mangaLang}</h2>
              </div>
              <select
                value={mangaLanguage}
                onChange={(event) => applyMangaLanguage(event.target.value as MangaLanguage)}
                className="w-full rounded-2xl border border-neutral-200 bg-black/40 px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] outline-none dark:border-white/10"
              >
                {MANGA_LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-[2rem] border border-neutral-200 bg-white/[0.03] p-6 backdrop-blur-xl dark:border-white/10">
              <div className="mb-4 flex items-center gap-3">
                <Shield size={18} className="text-[#ff4d00]" />
                <h2 className="text-lg font-black uppercase tracking-widest">{s.contentSafety}</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-neutral-600 dark:text-white/45">
                {ageEnabled ? s.adultEnabled : s.adultDisabled}
              </p>
              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={enableAdultContent}
                  className={`rounded-2xl border px-4 py-3 text-[10px] font-black uppercase tracking-[0.35em] transition-all ${
                    ageEnabled
                      ? 'border-[#ff4d00] bg-[#ff4d00] text-white'
                      : 'border-neutral-200 bg-black/30 text-neutral-600 hover:border-white/25 hover:text-neutral-900 dark:border-white/10 dark:text-white/45 dark:hover:text-white'
                  }`}
                >
                  {s.enable18}
                </button>
                <button
                  type="button"
                  onClick={disableAdultContent}
                  className="rounded-2xl border border-neutral-200 bg-black/30 px-4 py-3 text-[10px] font-black uppercase tracking-[0.35em] text-neutral-600 transition-all hover:border-white/25 hover:text-neutral-900 dark:border-white/10 dark:text-white/45 dark:hover:text-white"
                >
                  {s.disable18}
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-neutral-200 bg-white/[0.03] p-6 backdrop-blur-xl md:p-8 dark:border-white/10">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#ff4d00]">{s.snapshotEyebrow}</p>
                  <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">{s.savedDataTitle}</h2>
                </div>
                <div className="text-right text-[9px] font-black uppercase tracking-[0.35em] text-neutral-500 dark:text-white/30">
                  <div>{s.bookmarksCount.replace('{count}', String(bookmarkCount))}</div>
                  <div>{s.readsCount.replace('{count}', String(historyCount))}</div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/library"
                  className="rounded-2xl border border-neutral-200 bg-black/30 p-4 transition-all hover:border-[#ff4d00]/40 dark:border-white/10"
                >
                  <div className="text-[9px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-white/30">
                    {s.browseCta}
                  </div>
                  <div className="mt-2 text-lg font-black uppercase tracking-tight">{s.openLibrary}</div>
                </Link>
                <Link
                  href="/support"
                  className="rounded-2xl border border-neutral-200 bg-black/30 p-4 transition-all hover:border-[#ff4d00]/40 dark:border-white/10"
                >
                  <div className="text-[9px] font-black uppercase tracking-[0.4em] text-neutral-500 dark:text-white/30">
                    {s.reportCta}
                  </div>
                  <div className="mt-2 text-lg font-black uppercase tracking-tight">{s.sendIssue}</div>
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={clearLibraryData}
                  className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-black/30 px-4 py-3 text-[10px] font-black uppercase tracking-[0.35em] text-neutral-600 transition-all hover:border-red-500/40 hover:text-red-400 dark:border-white/10 dark:text-white/45"
                >
                  <Trash2 size={14} />
                  {s.clearData}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-neutral-200 bg-white/[0.03] p-6 backdrop-blur-xl md:p-8 dark:border-white/10">
              <div className="mb-4 flex items-center gap-3">
                <Mail size={18} className="text-[#ffca3a]" />
                <h2 className="text-lg font-black uppercase tracking-widest">{s.reportShortcuts}</h2>
              </div>
              <div className="space-y-3">
                <a
                  href="mailto:info@icomics.wiki?subject=iComics%20Support%20Report"
                  className="block rounded-2xl border border-neutral-200 bg-black/30 px-4 py-4 text-[10px] font-black uppercase tracking-[0.35em] text-neutral-600 transition-all hover:border-white/25 hover:text-neutral-900 dark:border-white/10 dark:text-white/60 dark:hover:text-white"
                >
                  {s.emailSupport}
                </a>
                <a
                  href="https://t.me/icomicsuz"
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-neutral-200 bg-black/30 px-4 py-4 text-[10px] font-black uppercase tracking-[0.35em] text-neutral-600 transition-all hover:border-white/25 hover:text-neutral-900 dark:border-white/10 dark:text-white/60 dark:hover:text-white"
                >
                  {s.telegramDispatch}
                </a>
                <Link
                  href="/support"
                  className="block rounded-2xl border border-neutral-200 bg-black/30 px-4 py-4 text-[10px] font-black uppercase tracking-[0.35em] text-neutral-600 transition-all hover:border-white/25 hover:text-neutral-900 dark:border-white/10 dark:text-white/60 dark:hover:text-white"
                >
                  {s.fullSupportForm}
                </Link>
                <Link
                  href="/profile"
                  className="block rounded-2xl border border-neutral-200 bg-black/30 px-4 py-4 text-[10px] font-black uppercase tracking-[0.35em] text-neutral-600 transition-all hover:border-white/25 hover:text-neutral-900 dark:border-white/10 dark:text-white/60 dark:hover:text-white"
                >
                  {s.accountProfile}
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-neutral-200 bg-white/[0.03] p-6 backdrop-blur-xl md:p-8 dark:border-white/10">
            <div className="mb-6 flex items-center gap-3">
              <Clock3 size={18} className="text-[#ffca3a]" />
              <h2 className="text-lg font-black uppercase tracking-widest">{s.recentReads}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {readRecentHistoryItems(6).map((item) => (
                <Link
                  key={`${item.source}:${item.id}`}
                  href={item.href}
                  className="rounded-2xl border border-neutral-200 bg-black/30 p-4 transition-all hover:border-[#ff4d00]/40 dark:border-white/10"
                >
                  <div className="text-[9px] font-black uppercase tracking-[0.35em] text-[#ff4d00]">{s.resume}</div>
                  <div className="mt-2 line-clamp-2 text-sm font-black uppercase tracking-widest">{item.title}</div>
                  <div className="mt-2 line-clamp-2 text-[10px] text-neutral-500 dark:text-white/35">
                    {item.chapterTitle || s.continueReadingChip}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-neutral-200 bg-gradient-to-r from-[#ff4d00]/15 via-white/[0.03] to-white/[0.03] p-6 md:p-8 dark:border-white/10">
            <div className="mb-3 flex items-center gap-3">
              <MessageCircle size={18} className="text-[#ff4d00]" />
              <h2 className="text-lg font-black uppercase tracking-widest">{s.reportSectionTitle}</h2>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-white/45">{s.reportSectionBody}</p>
            <Link
              href="/support"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-black px-5 py-3 text-[10px] font-black uppercase tracking-[0.35em] text-white transition-all hover:bg-[#ff4d00] dark:border-white/10"
            >
              {s.openSupportForm}
            </Link>
          </section>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
