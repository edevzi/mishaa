'use client';

import { useCallback, useState } from 'react';

type LinkToUsCopyBlockProps = {
  id: string;
  title: string;
  description?: string;
  code: string;
  copyLabel: string;
  copiedLabel: string;
};

export function LinkToUsCopyBlock({
  id,
  title,
  description,
  code,
  copyLabel,
  copiedLabel,
}: LinkToUsCopyBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [code]);

  return (
    <section
      className="rounded-[1.75rem] border border-black/10 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,15,25,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/4 dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-8"
      aria-labelledby={id}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2
            id={id}
            className="text-[11px] font-black uppercase tracking-[0.32em] text-neutral-500 dark:text-white/50"
          >
            {title}
          </h2>
          {description ? (
            <p className="max-w-xl text-xs leading-relaxed text-neutral-600 dark:text-white/60">{description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 rounded-xl border border-black/15 bg-neutral-900 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#ff5a1f] dark:border-white/15 dark:bg-white dark:text-black dark:hover:bg-[#ff5a1f] dark:hover:text-white"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="mt-5 overflow-x-auto rounded-2xl border border-black/8 bg-neutral-50/90 p-4 text-[11px] leading-relaxed text-neutral-800 dark:border-white/10 dark:bg-black/50 dark:text-white/85 sm:text-xs">
        <code>{code}</code>
      </pre>
    </section>
  );
}
