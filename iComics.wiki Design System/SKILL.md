---
name: icomics-wiki-design
description: Use this skill to generate well-branded interfaces and assets for iComics.wiki, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping a manga/manhwa/webtoon/comic reader.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation
- **Concept:** "Reading Room" — calm, editorial; **cover art is the hero**, chrome is quiet. Dark-first (warm plum-ink), with an intentional warm-paper light mode. One signature **marigold** accent (`#F2994A`).
- **Entry CSS:** link `styles.css`; set `data-theme="dark"` or `"light"` on a root element.
- **Type:** Instrument Serif (display) · Onest (UI/body, Latin+Cyrillic) · IBM Plex Mono (labels) · Noto Sans JP/KR/SC (CJK). Loaded from Google Fonts CDN.
- **Icons:** Lucide (CDN) — clean 2px line. No emoji.
- **Motion:** minimal, accessibility-first (fades only; honor `prefers-reduced-motion`).
- **Components:** compiled to `_ds_bundle.js`, exposed on `window.IComicsWikiDesignSystem_3734a1` (Button, IconButton, Badge, Tag, Avatar, Switch, Input, Select, SegmentedControl, Tabs, CoverCard, ScoreBadge, RatingChip, ProgressBar, Logo). Each has a `.prompt.md`.
- **UI kits:** `ui_kits/home/` (the home page) and `ui_kits/reader/` (the fullscreen reader — Classic/Journal/Flow + LTR/RTL + all controls). Read these before recreating product surfaces.

## Hard product rules (do not break)
- **Keep the existing logo** — the mark here is a placeholder; never redesign it.
- The reader's three modes (Classic / Journal / Flow), reading direction (LTR/RTL), the spread-cover rule, every gesture, and progress semantics are **functional** — restyle freely but never change behavior.
- It is a **reader only** — no authoring / upload / studio UI, ever.
- Support anonymous + logged-in, age-verified + not, and 5 UI languages (design for text expansion).
