import React from "react";

/**
 * Button — primary action control for iComics.wiki.
 * Variants: primary (marigold), secondary (outline), ghost, danger.
 */
export function Button({
  variant = "primary",
  size = "md",
  block = false,
  iconStart = null,
  iconEnd = null,
  disabled = false,
  as = "button",
  className = "",
  children,
  ...rest
}) {
  const Tag = as;
  const cls = [
    "ic-btn",
    `ic-btn--${variant}`,
    `ic-btn--${size}`,
    block ? "ic-btn--block" : "",
    className,
  ].filter(Boolean).join(" ");
  return (
    <Tag className={cls} disabled={Tag === "button" ? disabled : undefined} aria-disabled={disabled || undefined} {...rest}>
      {iconStart}
      {children != null && <span>{children}</span>}
      {iconEnd}
    </Tag>
  );
}
