import * as React from "react";

/** User avatar — shows `src` image or initials derived from `name`. */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  /** Used for the alt text and the initials fallback. */
  name?: string;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
}

export function Avatar(props: AvatarProps): JSX.Element;
