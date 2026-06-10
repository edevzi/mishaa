import React from "react";

/** Tag — pill for genres/keywords. Set `interactive` + `pressed` for filter chips. */
export function Tag({ interactive = false, pressed, className = "", children, ...rest }) {
  const cls = ["ic-tag", interactive ? "ic-tag--interactive" : "", className].filter(Boolean).join(" ");
  if (interactive) {
    return (
      <button type="button" className={cls} aria-pressed={!!pressed} {...rest}>
        {children}
      </button>
    );
  }
  return <span className={cls} {...rest}>{children}</span>;
}
