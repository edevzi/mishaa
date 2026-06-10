import * as React from "react";

/** Slim reading-progress bar (0–100). Powers "continue reading", chapter progress, and the reader's progress indicator. */
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100. */
  value: number;
  /** 6px instead of 4px. */
  thick?: boolean;
}

export function ProgressBar(props: ProgressBarProps): JSX.Element;
