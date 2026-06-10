import React from "react";

const LABELS = { safe: "Safe", suggestive: "Suggestive", erotica: "Erotica" };

/** RatingChip — content rating indicator (dot + label). */
export function RatingChip({ rating = "safe", showLabel = true, className = "", ...rest }) {
  return (
    <span className={["ic-rating", `ic-rating--${rating}`, className].filter(Boolean).join(" ")} {...rest}>
      <span className="ic-rating__dot" />
      {showLabel && (LABELS[rating] || rating)}
    </span>
  );
}
