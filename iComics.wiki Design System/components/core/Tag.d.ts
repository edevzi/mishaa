import * as React from "react";

/**
 * Rounded pill for genres / keywords. Static by default (renders a span);
 * set `interactive` to render a toggleable filter chip (button) and use `pressed`.
 */
export interface TagProps extends React.HTMLAttributes<HTMLElement> {
  /** Render as a toggle button. */
  interactive?: boolean;
  /** Selected state (only meaningful when interactive). */
  pressed?: boolean;
}

export function Tag(props: TagProps): JSX.Element;
