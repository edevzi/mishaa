import React from "react";

/**
 * Logo — the iComics.wiki lockup: monogram mark + "iComics·wiki" wordmark.
 * NOTE: the mark here is a PLACEHOLDER pending the real brand logo (logo.png).
 */
export function Logo({ size = 28, showWordmark = true, className = "", ...rest }) {
  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: Math.round(size * 0.34) }}
      {...rest}
    >
      <svg width={size} height={size} viewBox="0 0 512 512" fill="none" aria-label="iComics.wiki" role="img" style={{ borderRadius: size * 0.26, flex: "none" }}>
        <rect width="512" height="512" rx="116" fill="#F2994A" />
        <circle cx="168" cy="150" r="30" fill="#2A1705" />
        <rect x="142" y="208" width="52" height="190" rx="20" fill="#2A1705" />
        <path d="M392 214c-22-20-52-32-86-32-62 0-110 44-110 122s48 122 110 122c34 0 64-12 86-32" stroke="#2A1705" strokeWidth="52" strokeLinecap="round" fill="none" />
      </svg>
      {showWordmark && (
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: size * 0.62, letterSpacing: "-0.01em", color: "var(--text-primary)", lineHeight: 1 }}>
          iComics<span style={{ color: "var(--text-muted)", fontWeight: 500 }}>·wiki</span>
        </span>
      )}
    </span>
  );
}
