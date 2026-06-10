import React from "react";

/** Deterministic warm gradient for placeholder posters (no real cover image). */
function hueFromString(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}

/**
 * CoverCard — the catalog's primary unit. Poster (image or generated placeholder),
 * title + light metadata below, score overlay, content rating, adult blur/lock, and
 * optional reading-progress bar.
 */
export function CoverCard({
  title = "Untitled",
  cover = null,
  source,
  status,
  score,
  rating,
  adult = false,
  revealed = false,
  progress = null,
  onClick,
  className = "",
  ...rest
}) {
  const hue = hueFromString(title);
  const ph = {
    background: `linear-gradient(155deg,
      oklch(0.42 0.11 ${hue}) 0%,
      oklch(0.30 0.09 ${(hue + 28) % 360}) 60%,
      oklch(0.20 0.06 ${(hue + 50) % 360}) 100%)`,
  };
  const cls = [
    "ic-cover",
    adult ? "ic-cover--adult" : "",
    adult && revealed ? "is-revealed" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button type="button" className={cls} onClick={onClick} {...rest}>
      <span className="ic-cover__poster">
        {cover ? (
          <img src={cover} alt="" loading="lazy" />
        ) : (
          <span className="ic-cover__ph" style={ph}>{title}</span>
        )}
        {score != null && (
          <span className="ic-cover__topmeta">
            <span />
            <span className="ic-score ic-score--oncover">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.6 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
              </svg>
              {Number(score).toFixed(1)}
            </span>
          </span>
        )}
        {adult && (
          <span className="ic-cover__lock">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            18+
          </span>
        )}
        {progress != null && (
          <span style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
            <span className="ic-progress" style={{ borderRadius: 0 }}>
              <span className="ic-progress__fill" style={{ width: Math.max(0, Math.min(100, progress)) + "%" }} />
            </span>
          </span>
        )}
      </span>

      <span className="ic-cover__title">{title}</span>
      {(source || status || rating) && (
        <span className="ic-cover__meta">
          {source && <span className="ic-badge ic-badge--neutral">{source}</span>}
          {rating && <span className={`ic-rating ic-rating--${rating}`}><span className="ic-rating__dot" /></span>}
          {status && <span className="ic-eyebrow" style={{ fontSize: "var(--text-2xs)" }}>{status}</span>}
        </span>
      )}
    </button>
  );
}
