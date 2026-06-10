# iComics.wiki — Design System

A from-scratch visual identity for **iComics.wiki**, an online **reader & catalog** for manga, manhwa, webtoons and comics. The product aggregates several public sources (MangaDex, AniList/Jikan, Marvel, Superhero DB, Internet Archive, and age-gated adult sources) into one browse → read → track experience. It is **consumption-only** — there is no authoring/upload/studio anywhere.

This system establishes the **new look** the whole app inherits, starting from the **Home page** and the **fullscreen Reader**.

> **Design concept — "Reading Room."** A calm, editorial reading product where **the cover art is the hero** and the chrome is quiet and typographic. Warm **plum-ink** dark mode (the default), warm **paper** light mode, and a single signature **marigold** signal for actions, focus and progress. Deliberately *not* the legacy orange-on-black.

---

## Sources & provenance

- **Live product:** https://icomics.wiki (functional + content reference only).
- **Functional brief:** the redesign brief provided with this project (purpose, users, flows, home-page functions, and the detailed read-modes spec). All *behavioral* requirements come from there.
- **Legacy codebase:** the brief references an attached project folder. It was **not present** in this project and no local-folder access was available, so this system is built **from the functional brief + the live site's content structure**, exactly as the brief intends (the codebase is a *functional* reference only; its visuals were explicitly **not** to be copied). If exact data shapes or reader internals matter, re-attach the repo via the Import menu and ask for a reconciliation pass.

### ⚠️ Open items for the user
- **Logo:** the brief's one fixed asset is "keep the existing logo." Binary assets can't be pulled off the live site here, so the mark in `assets/logo-mark.svg` and the `Logo` component is a **faithful placeholder** (rounded-square `iC` monogram + `iComics·wiki` wordmark). **Please upload `logo.png` / the real wordmark** and we'll swap it in everywhere.
- **Fonts:** loaded from **Google Fonts CDN** (not self-hosted binaries) — see Iconography/Type notes. If you need offline/self-hosted fonts, say so and we'll vendor the `.woff2` files + `@font-face`.

---

## Type system (foundations)

| Role | Family | Use |
|---|---|---|
| **Display** | **Instrument Serif** | Hero titles, section moments, oversized numerals. High-contrast, editorial. |
| **Sans (UI + body)** | **Onest** | Everything interface: nav, buttons, card titles, body. Full **Latin + Cyrillic**. |
| **Mono (labels)** | **IBM Plex Mono** | Eyebrows, metadata, scores, chapter/page counts, kbd. UPPERCASE + tracked. |
| **CJK fallback** | **Noto Sans JP / KR / SC** | Ensures JA/KO/ZH UI text renders. |

Five UI languages must be supported (EN/JA/KO/ZH/RU) — **design for text expansion**; never assume fixed-width labels. Content language is a separate, larger axis.

---

## Content fundamentals (voice & tone)

The product talks like a **calm, knowledgeable librarian** — never hypey, never an "engagement" growth-app.

- **Address:** second person, gentle. "Continue where you left off." "Pick up where you left off." Imperatives for actions ("Read now", "See all", "Add to library").
- **Casing:** **Sentence case** for headings, titles, buttons ("Read now", not "READ NOW"). UPPERCASE is reserved for **mono eyebrows/labels** only ("CONTINUE READING", "FOR YOU", "TRENDING").
- **Tone:** quiet confidence, plain language, a little editorial warmth. Section eyebrows have a curatorial flavor: *"Reader picks", "Adventure reads", "Emotional storytelling", "Popular now", "Japanese comics", "Vertical reads", "Discover"*. The heading is the plain category ("Romance", "Fantasy", "Manhwa").
- **Honesty about being an aggregator:** transparent, slightly technical asides are welcome and on-brand: *"Results are cached briefly — repeats won't hammer the API."* / *"icomics.wiki is independent — not MangaDex.org."*
- **Empty / error states** are reassuring, never dead-ends: *"That source came back empty — try the Library."* / *"You're all caught up."*
- **Adult content** is handled plainly and without judgement: *"Confirm you're 18+ to view mature shelves."* Verification language is factual; "remembered for ~24h."
- **Emoji:** **none.** Iconography does the lifting.
- **No exclamation-mark spam**, no "Oops!", no growth-marketing copy.

Examples (verbatim flavor): "Read now", "See all", "Continue reading", "For you", "More titles", "Scroll to load more — picks refresh as you explore", "You're all caught up."

---

## Visual foundations

**Color.** Two intentional themes, not auto-inverted.
- **Dark (hero):** warm **plum-charcoal ink** (`--ink-950` app, `--ink-800` cards, `--ink-990` reader) — never pure black. Text is a warm off-white.
- **Light:** warm **paper** (`--paper-50` app, `--paper-0` cards). Text is a warm near-black.
- **Accent:** a single **marigold** (`#F2994A`, `--accent`) used sparingly — primary CTA, focus ring, progress, active states, the one star. On paper it deepens to `--marigold-700` for contrast. A muted **dusk** plum-blue exists as a rare secondary.
- **System hues** (success/danger/info/warning) appear **only** for state. **Content ratings**: safe=green, suggestive=yellow, erotica=pink (always a small dot, never loud).
- Color is built on base palettes + **semantic aliases** (`--surface-*`, `--text-*`, `--border*`, `--accent*`) that flip under `[data-theme="light"]`.

**Imagery / backgrounds.** The product is **cover-art-forward**: full-bleed featured banners with a left-to-bottom **scrim** (`--scrim-strong`, `--scrim-side`) for legibility; everywhere else, **2:3 poster covers** with a hairline "matte" frame (`--cover-frame`). No decorative gradients as backgrounds, no patterns/textures behind content — surfaces are flat ink/paper so the art pops. Placeholder posters (when a cover is missing) are deterministic warm `oklch` gradients keyed off the title.

**Type in use.** Serif display for big editorial moments and the hero title; sans for all UI; mono eyebrows label every section and all numeric metadata. Generous line-height (1.5 body), tight display leading.

**Spacing & layout.** 4px base grid; generous, editorial whitespace. Content max width `--page-max: 1320px`. Sticky 64px header. Shelves are horizontal-scroll rows of poster cards (`--row-gap`). Sections separated by `--section-gap` (56px).

**Corners.** Modest, editorial radii — covers `--radius-sm` (6, poster-like), buttons/inputs `--radius-md` (10), cards/panels `--radius-lg` (14), sheets `--radius-xl` (20), pills 999. Nothing overly soft.

**Borders & elevation.** **Hairline borders** (`--border`) define structure. **Dark mode leans on borders + faint shadows**; **light mode uses soft, low shadows** (`--shadow-sm/md`). Covers get the inset matte frame; on hover they lift with `--shadow-md` and a 1.03 image scale. Focus is always the marigold **glow ring** (`--glow-accent`), never a hard outline.

**Transparency & blur.** Used purposefully: frosted controls **over imagery** (the reader UI, on-cover score pills, `ghost-scrim` icon buttons) use `rgba` ink + `backdrop-filter: blur`. Scrims protect text on covers. Dialog scrim blurs the page behind.

**Motion (minimal, accessibility-first — per the chosen direction).** Fades and tiny slides only; calm ease-out (`--ease-out`), short durations (140–360ms). **No bounces, no overshoot, no looping decorative motion.** Press = subtle `scale(0.985)`. Hover = lighter surface / lift. Featured carousel and shelf auto-advance are **pausable and disabled under `prefers-reduced-motion`** — which the system honors globally (all transitions collapse to ~0ms).

**Hover / press / focus conventions.**
- Hover: surfaces lighten (`--surface-card-hov`), covers lift + slight image zoom, text brightens to `--text-primary`.
- Press: `scale(--press-scale)`; primary buttons darken to `--accent-press`.
- Focus-visible: marigold glow ring everywhere.

---

## Iconography

- **Library: [Lucide](https://lucide.dev)** — clean 2px-stroke, rounded line icons. It matches the minimal, editorial, accessibility-first direction (consistent stroke, no fills, neutral). Loaded from CDN in cards/kits (`https://unpkg.com/lucide`), used via `<i data-lucide="name">` + `lucide.createIcons()`, or as React nodes passed into `Button`/`IconButton`. **This is a substitution** — the legacy codebase's own icon set wasn't accessible; if it shipped a specific icon font/sprite, re-attach it and we'll swap.
- **Sizes:** 16px inside buttons/inline, 18px in icon buttons/toolbars, 15px inside segmented controls.
- **Stars** (scores) are a custom inline SVG glyph (so they can be marigold and frosted on covers).
- **No emoji**, no unicode-as-icon. Keyboard hints use styled mono `kbd` chips.
- **Brand mark** is an SVG monogram (`assets/logo-mark.svg`) — placeholder pending the real logo.

---

## What's in this project (index / manifest)

**Root**
- `styles.css` — the single entry consumers link (imports only).
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skill wrapper for use in Claude Code.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `motion.css`, `base.css`, `components.css` (all reached from `styles.css`).

**`assets/`** — `logo-mark.svg` (placeholder brand mark).

**`components/`** — reusable React primitives (load `_ds_bundle.js`, read from `window.IComicsWikiDesignSystem_3734a1`):
- `core/` — **Button, IconButton, Badge, Tag, Avatar, Switch**
- `forms/` — **Input, Select, SegmentedControl**
- `navigation/` — **Tabs**
- `catalog/` — **CoverCard, ScoreBadge, RatingChip, ProgressBar, Logo**

**`foundations/`** — Design-System-tab specimen cards (Colors, Type, Spacing, Brand).

**`ui_kits/`**
- `home/` — the Home page (primary deliverable; light + dark; all functional regions).
- `reader/` — the fullscreen Reader (Classic / Journal / Flow + LTR/RTL + all controls).

---

## Using the system

Link the stylesheet and set a theme on a root element:

```html
<link rel="stylesheet" href="styles.css" />
<html data-theme="dark">  <!-- or data-theme="light" -->
```

Then either use the CSS classes directly (`.ic-btn--primary`, `.ic-cover`, …) or the React components from the compiled bundle. See each component's `.prompt.md` for usage.
