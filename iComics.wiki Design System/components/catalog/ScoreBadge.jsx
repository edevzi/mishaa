import React from "react";

/** ScoreBadge — mono score with a star. Use `onCover` for the frosted variant over art. */
export function ScoreBadge({ score, onCover = false, className = "", ...rest }) {
  return (
    <span className={["ic-score", onCover ? "ic-score--oncover" : "", className].filter(Boolean).join(" ")} {...rest}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.6 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
      </svg>
      {Number(score).toFixed(1)}
    </span>
  );
}
