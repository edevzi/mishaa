'use client';

import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { readStorageItem } from '@/lib/browser-storage';
import { translations, type Lang } from '@/lib/translations';

/** Shown while the reader route’s server work (metadata + RSC) is in flight. */
export default function ReaderRouteLoading() {
  const label = useMemo(() => {
    const l = readStorageItem('lang') as Lang;
    if (l && translations[l]) return translations[l].library.openingReader;
    return translations.en.library.openingReader;
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-[#020202]">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="h-12 w-12 animate-spin text-[#ff4d00]" aria-hidden />
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.5em] text-neutral-400 dark:text-white/20">
          {label}
        </p>
      </div>
    </div>
  );
}
