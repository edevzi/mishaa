import * as React from "react";

export interface TabItem { value: string; label: React.ReactNode; }

/** Horizontal underline tab bar — Library source/category tabs, profile sections. Scrolls horizontally when overflowing. */
export interface TabsProps {
  /** Strings or {value,label} objects. */
  tabs: (string | TabItem)[];
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Tabs(props: TabsProps): JSX.Element;
