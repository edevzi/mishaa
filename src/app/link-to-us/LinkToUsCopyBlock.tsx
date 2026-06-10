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
      className="rounded-card border border-line bg-card p-6 sm:p-8"
      aria-labelledby={id}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 id={id} className="ic-eyebrow">
            {title}
          </h2>
          {description ? (
            <p className="max-w-xl text-xs leading-relaxed text-fg-secondary">{description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="ic-btn ic-btn--secondary ic-btn--sm shrink-0"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="mt-5 overflow-x-auto rounded-btn border border-line bg-sunken p-4 font-mono text-[11px] leading-relaxed text-fg-secondary sm:text-xs">
        <code>{code}</code>
      </pre>
    </section>
  );
}
