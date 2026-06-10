import * as React from "react";

/**
 * Primary action control. Marigold `primary` for the single key action per view;
 * `secondary` outline for supporting actions; `ghost` for low-emphasis; `danger` for destructive.
 *
 * @startingPoint section="Core" subtitle="Buttons — primary / secondary / ghost / danger" viewport="700x180"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual emphasis. @default "primary" */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Stretch to full container width. */
  block?: boolean;
  /** Icon node rendered before the label. */
  iconStart?: React.ReactNode;
  /** Icon node rendered after the label. */
  iconEnd?: React.ReactNode;
  disabled?: boolean;
  /** Render as another element/component (e.g. "a"). @default "button" */
  as?: React.ElementType;
}

export function Button(props: ButtonProps): JSX.Element;
