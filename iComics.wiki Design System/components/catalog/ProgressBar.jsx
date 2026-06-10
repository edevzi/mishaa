import React from "react";

/** ProgressBar — reading-progress track. value 0–100. */
export function ProgressBar({ value = 0, thick = false, className = "", ...rest }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={["ic-progress", thick ? "ic-progress--thick" : "", className].filter(Boolean).join(" ")}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      {...rest}
    >
      <div className="ic-progress__fill" style={{ width: pct + "%" }} />
    </div>
  );
}
