---
name: yarmill-changelog
description: >-
  Generate Yarmill changelog posts from Linear (and later GitHub), in Linear.app's
  changelog structure and voice, into the React docs site's Changelog space. Use
  whenever the user wants to create, draft, refresh, or backfill changelog/release-note
  entries from Linear issues/projects — "draft the changelog", "what shipped since X",
  "new changelog post", "update the changelog", "run the changelog pipeline", or on a
  scheduled biweekly run. Handles sync, de-noising, clustering into per-shipment posts,
  CZ→EN editorial rewriting, and opening a draft PR for human review.
---

# Yarmill changelog pipeline

Turn Yarmill's Linear engineering tracker into a customer-facing changelog that mirrors
**linear.app/changelog** in structure and voice. Output lands in
`site/content/docs/changelog/changelog.mdx` (the React docs site's Changelog space).

**Full rationale & decisions:** `specs/_changelog-automation-architecture.md`. This file is
the operational checklist; read the spec when a judgment call isn't covered here.

## Golden rules (read first)
- **Nothing auto-publishes.** Every run ends in a **draft PR** for human review.
- **Linear "completed" ≠ shipped.** Exclude unreleased/flag-gated work (e.g. anything named
  `v2`/`beta`/`WIP`, or a feature you can't confirm is live). When unsure, list it in the PR
  description for the human instead of publishing it.
- **Product, not per-customer.** Drop per-instance config/onboarding work. Yarmill is
  configured per customer — instance work is not a product change.
- **Don't invent.** If you can't tell what a ticket shipped for users, leave it out (or flag
  it). Get product/feature names exactly right (verify spelling, e.g. VALD `NordBord`).

## Prerequisites
- Run from the repo root. `LINEAR_API_KEY` (+ optional `LINEAR_SINCE`) in `site/.env.local`.
- Node ≥ 20. Scripts live in `site/scripts/`. Raw cache + plan in `site/scripts/.cache/` (gitignored).

## Pipeline

### 1. Sync (deterministic)
```bash
cd site && node scripts/linear-sync.mjs pull
```
Pulls completed issues + projects → `scripts/.cache/linear/*.json`. (`probe` first if auth/
teams/labels are unknown.) For the recurring routine this can be windowed via `LINEAR_SINCE`.

### 2. Map check — keep the category map current (LLM + file edit)
```bash
cd site && node scripts/linear-curate.mjs   # prints "UNMAPPED project area(s)"
```
For every unmapped project area, **propose a category** (`feature|improvement|maintenance|
internal|client|review`) using `scripts/linear-categories.mjs` as the worked example, and add
it to that file with a `// AI-proposed — confirm` comment. List the additions in the PR body.
Unmapped areas default to `review` (dropped) until classified — never silently include them.
Category meanings: `feature`=own post; `improvement`=monthly list; `maintenance`=mine for the
few user-noticeable fixes/tweaks (Operational Needs/Tech Debt/SIP), never headline;
`internal`=drop; `client`=drop but mine for generalizable features (a new integration first
built for one client).

### 3. Curate (deterministic)
`linear-curate.mjs` writes `scripts/.cache/changelog-plan.json`: per-issue records
(`title, description, priority, theme, kind: change|fix, completedAt, url`), de-noised
(internal/client/config dropped, bug→fix). Use it as the candidate set — **you** do the
clustering and editorial below.

### 4. Cluster into per-shipment posts (LLM)
Get the dated, de-noised candidate timeline:
```bash
cd site && node scripts/linear-curate.mjs timeline 2026-05   # or a YYYY-MM-DD since-date
```
(Columns: date · kind `chg`/`FIX` · category initial · theme · title.)
- A **post = one shipment cluster**, NOT a calendar month. Group `feature` items by **theme +
  time-proximity**: a theme that shipped as a coherent drop within a few days = one post; a
  time gap within a theme starts a new post. One month can yield several posts.
- **Date** each post `Month D, YYYY` = the cluster's latest `completedAt` (proxy for ship date;
  will firm up to the GitHub merge-to-`main` date in Phase 1.5).
- **Cadence sanity:** never two *major* posts within ~3 days — merge into one post (one lead +
  the other as a secondary `##`).
- **Minor-item windowing:** each post sweeps up the Improvements/Fixes that shipped **since the
  previous post's date** (not the month). Assigning a date to one post shifts which minor items
  land in its neighbours — process newest→oldest and track the boundary.

### 5. Draft each post (LLM editorial)
- **Translate** Czech → English; rewrite engineer-speak into what a *user* gained.
- **Drop internal plumbing** even inside kept themes (`eval dataset`, `MLflow db`,
  `tracking event`, `BE: bulk create…`); `maintenance` gets the most aggressive cut.
- **Demote, don't pad:** a theme that loses its substance to plumbing/config (e.g. only 1
  user-facing change survives) becomes an Improvements line, not a headline.
- **Keep co-shipped sub-features in the post** as a secondary `##` heading — don't bury an
  important capability in Improvements (Improvements = genuinely minor items only).
- **Benefit / jobs-to-be-done framing** for features: name real use cases + concrete terms a
  coach knows (VALD → CMJ trends, pre-season testing, L/R asymmetry; name devices).
- **Instance-specific behaviour** → `<Info>` ("connected per team"), never stated as universal.
- **Voice:** Linear's register — imperative, benefit-first, concrete, calm, no fluff. Pattern:
  set up the context/problem, then "Now …" delivers the change + benefit. **No ellipses.**
  Polish with `anthropic-skills:yarmill-copy` if needed.
- **Cross-link** to module docs (`/en/<module>/…`) where it helps (verify the page exists).

### 6. Emit MDX
Newest post first in `site/content/docs/changelog/changelog.mdx`, each as one `<Update>`:
```mdx
<Update label="May 29, 2026" title="Lead feature headline">
  <Frame caption="…">
    <img src="/images/changelog/<slug>.svg" alt="…" />
  </Frame>

  Lead paragraph 1 (context/problem). Lead paragraph 2 ("Now …" + benefit).

  <Info>…instance-specific caveat, if any…</Info>

  ## Secondary feature heading
  1–3 short paragraphs. (Optional own <Frame>.)

  ### Improvements
  - **Tag** — Full sentence (1–2) saying what changed and the benefit. Tag ONLY where it adds clarity.
  - Plus a range of smaller improvements across the app.

  ### Fixes
  - **Tag** — Full sentence describing the fix and its effect.
  - Plus a number of smaller fixes and performance improvements.
</Update>
```
Rules: each Improvements/Fixes bullet is a **full sentence**; bold `**Tag**` prefix only where
it adds clarity (don't force it); each section ends with its **own** "Plus …" collapse bullet
(separate, not shared); omit a section entirely if it has nothing. Hero images: until the
visual phase, reuse `/images/changelog/_placeholder.svg` and mark real ones with a
`{/* NOTE(yarmill): … mockup … */}`.

### 7. Idempotency
Don't re-emit posts already in `changelog.mdx`. On a recurring run, only add posts for
shipments after the newest existing post's date (and you may extend the newest existing post's
window if it's still "open"). Never duplicate an entry.

### 8. Verify + publish
```bash
cd site && npx tsc --noEmit && npm run build   # must pass
```
Preview at `/en/changelog/changelog` (NOTE: the content layer caches MDX at module load —
**restart `next dev`** to see edits). Then open a **draft PR** on a `changelog/<date>` branch
against the working branch, with a body that lists: posts added, any AI-proposed category
changes to confirm, and any items held back as possibly-unreleased.

## Content contract (decoupled from visual design)
This skill emits **semantic MDX only** — it is independent of how the Changelog page looks.
Visual design (CSS in `components/mdx/mdx.css`, the internals of `Update.tsx`/`Frame.tsx`,
hero treatment, page layout) can be polished freely without touching this skill or any
generated `.mdx`. The skill depends ONLY on this stable contract:
- Components & props: `<Update label="Month D, YYYY" title="…">`, `<Frame caption>`, `<Info>`.
- Conventions: `##` for secondary features; `### Improvements` / `### Fixes` + bullet lists;
  hero images at `/images/changelog/…`.
If a redesign changes that API (renames a component/prop, or moves Improvements/Fixes off
`###` headings into a prop/array), update **only** the emit template in step 6 to match.

## Modes
- **On-demand** (manual): "draft the changelog since <date>" → run for that window, open PR.
- **Scheduled** (biweekly Claude Code cloud routine): same steps, windowed to since-last-run.

## Reference: the canonical May 2026 output
See `site/content/docs/changelog/changelog.mdx` (the approved proof) for the exact target —
two posts (VALD Performance + Yollanda settings merged @ May 29; Yollanda squad @ May 11),
showing lead+secondary structure, full-sentence Improvements/Fixes, the `<Info>` caveat, and
Sailing/Planner-v2 correctly excluded (per-client / unreleased).

## Do not
- Don't publish without a human PR review. Don't announce unreleased/`v2`/`beta` work.
- Don't include per-client/instance config or internal plumbing. Don't bury major features in
  Improvements. Don't state instance-specific behaviour as universal. Don't use ellipses.
- Don't edit anything under `internal/`. Don't commit secrets or the `.cache/`.
