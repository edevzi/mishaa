import * as React from "react";

export interface SegOption {
  value: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * Single-select pill group. The backbone of reader settings (view mode classic/journal/flow,
 * reading direction LTR/RTL, reader theme light/dark/sepia) and other compact mode switches.
 *
 * @startingPoint section="Forms" subtitle="Segmented control — reader modes & toggles" viewport="700x120"
 */
export interface SegmentedControlProps {
  /** Strings or {value,label,icon} objects. */
  options: (string | SegOption)[];
  /** Currently selected value. */
  value: string;
  onChange?: (value: string) => void;
  /** Marigold fill on the active segment (vs neutral raised). */
  accent?: boolean;
  className?: string;
}

export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
