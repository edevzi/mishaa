import React from "react";

/**
 * IconButton — square control for a single glyph. Pass a Lucide (or any) icon as children.
 * Variants: plain, solid (surface), accent (marigold), ghost-scrim (over imagery).
 */
export function IconButton({
  variant = "plain",
  size = "md",
  pressed,
  label,
  className = "",
  children,
  ...rest
}) {
  const cls = [
    "ic-iconbtn",
    variant !== "plain" ? `ic-iconbtn--${variant}` : "",
    `ic-iconbtn--${size}`,
    className,
  ].filter(Boolean).join(" ");
  return (
    <button
      type="button"
      className={cls}
      aria-label={label}
      aria-pressed={pressed}
      {...rest}
    >
      {children}
    </button>
  );
}
