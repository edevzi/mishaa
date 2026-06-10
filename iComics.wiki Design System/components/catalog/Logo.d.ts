import * as React from "react";

/**
 * Brand lockup: monogram mark + "iComics·wiki" wordmark. The mark is a PLACEHOLDER
 * until the real logo asset is supplied — do not redesign it; swap the SVG/asset.
 */
export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Mark height in px (wordmark scales from it). @default 28 */
  size?: number;
  /** Show the "iComics·wiki" wordmark beside the mark. @default true */
  showWordmark?: boolean;
}

export function Logo(props: LogoProps): JSX.Element;
