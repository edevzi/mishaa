import React from "react";

/** Avatar — user image or initials fallback. */
export function Avatar({ src, name = "", size = "md", className = "", ...rest }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className={["ic-avatar", `ic-avatar--${size}`, className].filter(Boolean).join(" ")} {...rest}>
      {src ? <img src={src} alt={name} /> : <span>{initials || "?"}</span>}
    </span>
  );
}
