import * as React from "react";

/** Content-rating indicator (colored dot + label): safe (green), suggestive (yellow), erotica (pink). Adult cards/shelves stay gated regardless. */
export interface RatingChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "safe" */
  rating?: "safe" | "suggestive" | "erotica";
  /** Hide the text and show only the dot. @default true */
  showLabel?: boolean;
}

export function RatingChip(props: RatingChipProps): JSX.Element;
