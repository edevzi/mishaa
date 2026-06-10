import * as React from "react";

/**
 * Square icon-only button. Always pass `label` for accessibility. Use `ghost-scrim`
 * for controls floating over cover art / the reader; `accent` for the one key glyph action.
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default "plain" */
  variant?: "plain" | "solid" | "accent" | "ghost-scrim";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Toggle state — renders the marigold-tinted pressed style. */
  pressed?: boolean;
  /** Accessible name (required — there is no visible text). */
  label: string;
}

export function IconButton(props: IconButtonProps): JSX.Element;
