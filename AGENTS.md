<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## UI Direction Notes — "Reading Room" design system

The app follows the design system in `iComics.wiki Design System/` (tokens ported into `src/app/globals.css`). Read its `readme.md` before styling anything.

- Calm, editorial, cover-art-forward. Dark default (warm plum-ink), light mode (warm paper) via `data-theme`; semantic token utilities (`bg-app`, `bg-card`, `text-fg`, `text-fg-secondary`, `border-line`, `bg-accent`, …) flip automatically.
- ONE accent: marigold `#F2994A` (`--accent`). Never reintroduce the legacy orange-on-black palette, gradients, glass/halftone/neon effects, or decorative motion.
- Type: Onest (sans, UI/body) · Instrument Serif (display, regular weight, never uppercase) · IBM Plex Mono (micro-labels). Sentence case everywhere; uppercase only in `.ic-eyebrow` mono micro-labels.
- Reusable primitives are CSS classes in globals.css (`.ic-btn`, `.ic-input`, `.ic-tabs`, `.ic-cover`, `.ic-dialog`, `.ic-eyebrow`, `.section`, `.shelf`, `.sk`, `.state-block`, …) — use them instead of re-deriving styles.
- Motion is minimal and accessibility-first: fades/tiny slides, 140–360ms, honor `prefers-reduced-motion`.
- THE LOGO IS FIXED: the `iC` monogram + `iComics·wiki` wordmark (font-accent, `#ff5a1f`/`#ffd36b`) must never be restyled.
- Avoid AI-flavored filler copy such as `Live feature`, `Featured now`, `Focus`, `Neural`, or similar decorative labels.

## Server surface (official)

Follow this split when adding endpoints or data access:

### Server Actions (`src/actions/**`)

Use for **library / comic UX** invoked from Client Components via Next server actions:

- Canonical example: `@/actions/comic` (`getComicDetails`, `searchComics`, `getChapters`, `getChapterPages`, …).

Prefer actions when the caller is React client code inside app routes (forms, suspense-friendly flows) and responses are typed domain objects fetched on the server.

### HTTP Route Handlers (`src/app/api/**`)

Use **`/api/**`** when:

- The client calls `fetch()` with a stable URL or you need CDN/edge caching headers on HTTP.
- Cron, webhooks, third-party integrations, or OAuth callbacks require a plain HTTP verb + path.
- Public proxies (`/api/proxy/*`), auth JSON (`/api/auth/*`), `/api/home/data`, `/api/reading-progress`, Telegram routes, studio AI routes, etc.

Do **not** add new “self-fetch” hops from one route to another route on the same app (e.g. avoid `fetch(origin + '/api/...')` for internal aggregation). Prefer a shared **`@/lib/...`** function used by multiple routes instead.

- **`@/lib/comic-types.ts`** — **`ComicListItem`** (search/grid), **`ComicDetail`** (+ optional Marvel extras), **`ComicChapter`**, enrichment stubs **`ComicDetailAniListData`** / **`ComicDetailJikanData`**. Consumers should import these (or re-exports from **`@/actions/comic`**) instead of re-declaring `ComicDetails` in each client file.

- **`@/lib/nhentai/`** — mirror list, canonical headers, and **proxy allowlists** (`isAllowedNHentaiProxyApiPath`, `isAllowedNHentaiImageCdnPath`).
- **`@/lib/http/cookie-header.ts`** — safe parsing of verification cookies from `Cookie` headers (substring matching on raw header strings is discouraged).
