import * as React from "react";

/** Numeric score (0–10) with a marigold star. `onCover` renders the frosted pill for placement over cover art. */
export interface ScoreBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Score value, rendered to one decimal. */
  score: number;
  onCover?: boolean;
}

export function ScoreBadge(props: ScoreBadgeProps): JSX.Element;
