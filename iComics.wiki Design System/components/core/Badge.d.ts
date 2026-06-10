import * as React from "react";

/**
 * Compact uppercase mono label for status/source/meta — e.g. "MANGADEX", "NEW",
 * "ONGOING", a chapter count. Not interactive; use Tag for genre filters.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "neutral" */
  variant?: "neutral" | "accent" | "success" | "danger" | "info" | "solid";
}

export function Badge(props: BadgeProps): JSX.Element;
