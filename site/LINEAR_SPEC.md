# LINEAR_SPEC — the build contract

Reverse-engineered from linear.app/docs (measured live at viewport ≈1470px).
**Linear is the gold standard for layout, geometry, type, spacing, shapes, and
motion. The ONLY intentional departures are COLOR (Yarmill palette) and FONT
(Inter — which Linear also uses).** Build to these numbers exactly; verify with
`getComputedStyle`, not by eye.

Colors are NOT in this file — use the `--ym-*` tokens in `app/theme/tokens.css`
(light + dark already defined). This file is structure/measurement only.

---

## 0. Architecture (NO Fumadocs)

Fumadocs is removed. We own the whole engine:
- **Next.js App Router** + Tailwind v4 (utilities are fine; the problem was
  fumadocs-ui's layout/preset, not Tailwind).
- **Content layer** (`lib/content.ts`): read `content/docs/**/*.mdx`, parse
  frontmatter with `gray-matter`, expose `{ slug[], lang, frontmatter, body, filePath }`.
- **MDX compile**: `next-mdx-remote/rsc` `compileMDX` (or `@mdx-js/mdx`), with
  remark/rehype: `remark-gfm`, `rehype-slug`, `rehype-pretty-code` (Shiki) for
  code, and a heading collector for the TOC.
- **Routing**: `app/[lang]/[[...slug]]/page.tsx` + `generateStaticParams` from
  the content layer. Home = `content/docs/index.mdx` → `/en`.
- **Nav tree** (`lib/nav.ts`): groups + ordering from `.scaffold-ref/docs.json`
  (`navigation.languages[0].anchors[0].groups[].pages[]`), titles/icons from each
  page's frontmatter.
- **Search**: build a JSON index at build time (title + headings + text per page)
  → client ⌘K command palette (minisearch or flexsearch).
- **Icons**: keep `lib/icons.tsx` (Font-Awesome-name → lucide).
- **i18n**: just the `[lang]` segment, default `en`, `/en/...` URLs. No library.
- **Theme**: `next-themes` for the light/dark toggle (not Fumadocs).
- **Raw route**: keep `/raw/[lang]/[[...slug]]` serving source markdown.

Data contracts the foundation MUST export (chrome/components/search build on these):
- `NavTree`: `{ groups: { label, pages: { title, url, icon? }[] }[] }`
- `TocItem`: `{ id, text, depth }[]` (depth 2–3)
- Page props: `{ frontmatter, toc, navTree, prevNext: {prev?, next?}, compiledContent }`

---

## 1. Layout geometry (exact)

- **Sidebar**: `position: fixed`, width **280px**, full height, left 0.
- **Main**: left margin 280px (clear the sidebar), width = rest.
- **Content wrapper**: `max-width: 1024px`, centered in main, `padding: 0 24px`.
- Inside the wrapper, a row: **article** (flex/auto, fills remaining) + **TOC**
  (fixed **250px**) with a gap of ~**64px**. The article ends up ≈650px at the
  1024 cap — **do NOT hard-cap the article at 650**; let it derive from the grid
  so it fills correctly (this is why ours looked narrow).
- **Top bar**: height **64px**, sticky top, spans the main area, translucent +
  backdrop-blur, hairline bottom border.
- **TOC**: `position: sticky; top: 96px; align-self: start;`
  `max-height: calc(100vh - 96px - 24px); overflow-y: auto;`
- Vertical rhythm: top of article content begins ~32px below the top bar.

---

## 2. Typography (exact — apply to the article container)

Inter. Letter-spacing matters.
- **H1** (page title): 32px / line-height 36px / weight 590 / ls -0.022em / color ink.
- **H2**: 24px / lh 32px / weight 590 / ls -0.012em / **margin-top 56px** / mb 12px.
- **H3**: 16px / lh 24px / weight 590 / ls -0.011em / margin-top 32px.
- **Body p, li**: 15px / lh 24px / weight 400 / ls -0.011em / color `--ym-prose-text`.
- **strong**: weight 590, color ink.
- **Lead/description** paragraph under H1: muted (`--ym-muted`), same size.
- **Inline link** in prose: underline, inherits color, hover → `--ym-accent`.
- **Lists**: `padding-left: 24px`; ordered/unordered with markers; item spacing
  ~8px; nested lists tighten.
- **Block spacing**: paragraphs/blocks separated by ~16px; H2 gets 56px top.
- **Inline code**: mono stack, ~13.5px, `--ym-bg-subtle` bg, `--ym-line` 1px border,
  radius 6px, padding 1px 6px, color ink.
- **Code block** (Shiki): rounded `--ym-radius` (8px), `--ym-bg-subtle` surface,
  1px `--ym-line` border, 16px padding, 13.5px mono, light+dark Shiki themes;
  copy button top-right. Linear has little code, so a tasteful Yarmill-surfaced
  block is fine — must look native in both themes.
- **Blockquote**: 2px `--ym-line` left border, muted text, left padding 16px.
- **hr**: 1px `--ym-line`, generous vertical margin.
- **img**: max-width 100%, rounded; product screenshots use the `<Frame>` component.
- **table**: hairline `--ym-line` borders, header row slightly stronger, 14px cells.

---

## 3. Sidebar (280px)

- **Header** (top, 64px tall, ~16px horizontal padding): Yarmill **symbol-only**
  logo (`/brand/yarmill-icon-blue.png` light, `yarmill-icon-white.png` dark, ~22–24px)
  + "Docs" text (16px, ink) on the left; a **circular search icon button** (32×32,
  radius 9999px, 1px `--ym-line`, bg `--ym-bg`, muted icon, hover `--ym-bg-hover`)
  on the far right. NO full-width search input.
- **Nav** = uniform **collapsible sections**. Each docs.json group is a section row:
  14px / weight 510 / color `--ym-muted` / height 36px / radius 8px / chevron on the
  right that rotates on expand. Click toggles. Section containing the current page
  starts expanded; others collapsed.
- **Page links** (children, indented): 14px / weight 510 / height 32px / radius 8px
  / small 16px icon + label. Inactive = `--ym-muted`-ish; **active = full `--ym-ink`
  text (NO background fill — Linear is color-only), and use `--ym-accent` for the
  active item's icon/text to carry the brand**. Hover (inactive) = `--ym-bg-hover`.
- Scrolls independently if long; thin scrollbar.
- **Footer** (pinned bottom): Changelog, Contact support — 14px / 510 / muted rows
  with small icons.

---

## 4. Top bar (64px)

- **Left**: breadcrumb `Group / Page` (muted, current page ink, slash separators).
- **Right cluster** (in order): theme-toggle **circle** button (32×32) · **"Copy page"**
  pill (radius 9999px, h32, 13px/510, 1px `--ym-line` border, bg `--ym-bg`) + attached
  chevron pill opening a menu (Copy page / View as Markdown → `/raw/...` / Open in
  ChatGPT / Open in Claude) · **"Open Yarmill"** filled-accent pill → `https://yarmill.com/en/sign-in`.

---

## 5. TOC — "On this page" (THE fix)

Mechanism (Linear's, exact): a **single continuous 2px vertical track** the full
height of the list (implement as the list's `::before` or a positioned element),
color `--ym-line`. The active item is shown by **(a)** its text turning from muted
to ink, and **(b)** a **single 2px `--ym-accent` indicator bar that SLIDES** (animated
translateY, ease-out ~180ms) to sit on the track beside the active item — height =
the active item's line box. **No per-item left borders** (that was the "bent line"
bug). 
- Heading "On this page": 12px, muted.
- Items: 13px / lh 19.5px / margin-bottom 8px / muted inactive, ink active.
- Nested (h3) items indented ~12px from h2 items.
- Scroll-spy via IntersectionObserver (highlight the section currently in view;
  pick the topmost in-view heading).
- Hidden ≤1024px.

---

## 6. Bottom-of-article navigation

Linear shows a **"Next → <page title>"** (and "← Previous" when applicable) at the
end of the article, derived from the flat page order. Build a prev/next pair:
left-aligned "Previous", right-aligned "Next", each a bordered/rounded link card
(radius `--ym-radius`) with a small caption ("Previous"/"Next") and the page title,
hover → border `--ym-accent`. Place below the article with generous top margin.

---

## 7. Search (⌘K command palette)

Centered modal, ~640px wide, radius `--ym-radius-lg`, `--ym-shadow-popover`, dim
backdrop. Top: magnifier + text input + "ESC" chip. Results: grouped by page with a
breadcrumb (Group › Page), matched text snippet with the query highlighted in
`--ym-accent`. Full keyboard nav (↑/↓/Enter/Esc), opens via the sidebar header
circle button and the global ⌘K / Ctrl+K. Built on the prebuilt JSON index.

---

## 8. Motion (Emil Kowalski rules)

ease-out entrances (`cubic-bezier(0,0,0.2,1)`), faster exits, transform/opacity only,
≤200ms for chrome / ≤250ms for overlays, no springs on chrome. The TOC indicator and
section chevrons animate. 2px `--ym-accent-ring` focus-visible ring on all
interactive elements. Full `prefers-reduced-motion` fallback (fades, no transforms).

---

## 9. Responsive

- **>1024px**: 3 columns (sidebar 280 · article · TOC 250).
- **≤1024px**: hide the TOC; article fills the wrapper.
- **≤768px**: sidebar → slide-in drawer behind a hamburger in a mobile top bar;
  dim overlay, body-scroll-lock, focus trap, ESC to close; ≥40px tap targets;
  no horizontal scroll at 360px.

---

## 10. Components to reuse (de-Fumadocs)

`components/mdx/*` stay (Card, CardGroup, Columns, Steps/Step, callouts
Info/Tip/Warning/Note/Check, Frame, ParamField, Tabs/Tab, Accordion/AccordionGroup,
Update, PageMeta, TutorialMeta) — but **Accordion must be reimplemented WITHOUT
fumadocs-ui** (Radix `@radix-ui/react-accordion` or a `<details>`-based version).
All are provided to MDX globally via our own MDX components map. Styling already
consumes `--ym-*` tokens; keep that. Verify each still renders after the engine swap.
