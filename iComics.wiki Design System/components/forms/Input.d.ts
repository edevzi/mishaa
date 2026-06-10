import * as React from "react";

/** Single-line text field. Pass `icon` (a node) for a leading glyph, e.g. search. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Mono uppercase label rendered above the field. */
  label?: string;
  /** Leading icon node. */
  icon?: React.ReactNode;
  /** @default "md" */
  size?: "sm" | "md";
  wrapClassName?: string;
}

export function Input(props: InputProps): JSX.Element;
