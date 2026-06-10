import * as React from "react";

/**
 * The catalog's primary unit — a poster cover with title and light metadata.
 * Used across the home shelves, the infinite grid, Library, and "related titles".
 * If `cover` is omitted it renders a deterministic warm placeholder poster.
 *
 * @startingPoint section="Catalog" subtitle="Cover card — poster + meta + states" viewport="220x380"
 */
export interface CoverCardProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  title: string;
  /** Cover image URL. Falls back to a generated placeholder poster. */
  cover?: string | null;
  /** Source badge, e.g. "MangaDex", "Marvel". */
  source?: string;
  /** Status eyebrow, e.g. "Ongoing", "Completed". */
  status?: string;
  /** Numeric score (0–10) shown as a frosted star pill on the cover. */
  score?: number;
  /** Content rating dot. */
  rating?: "safe" | "suggestive" | "erotica";
  /** Mark as age-restricted — blurs art + shows a lock until revealed/verified. */
  adult?: boolean;
  /** When adult, reveal the art (verified + hovered/tapped). */
  revealed?: boolean;
  /** Reading progress 0–100 — draws a marigold bar at the poster's base. */
  progress?: number | null;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function CoverCard(props: CoverCardProps): JSX.Element;
