import React from "react";

/** Badge — compact mono status pill (source name, "NEW", count, status). */
export function Badge({ variant = "neutral", className = "", children, ...rest }) {
  return (
    <span className={["ic-badge", `ic-badge--${variant}`, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </span>
  );
}
