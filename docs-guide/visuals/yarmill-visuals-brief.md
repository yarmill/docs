# Brief: what the `yarmill-visuals` skill must produce for docs tutorials

Paste-in brief for the session that prepares/refines the **`yarmill-visuals`** skill.
Goal: make the skill able to produce every visual a Yarmill **docs tutorial** needs, so a
later session can request them by shot list and drop them straight into the React docs MDX (`site/content/docs/`).

## Who consumes the output
The Yarmill docs (the React/Next.js site under `site/`, MDX, Linear-style: one-line lead → hero → short
scannable sections; `cd site && npm run dev`). We're adding **Tutorials** (task-based how-to journeys) and later
**Use cases** (role stories). Images are shown via `<Frame caption="…"><img src="…" alt="…"/></Frame>`,
referenced root-relative (`/images/tutorials/<slug>/…`), displayed in a ~700px content
column (so render at 2× for retina). The site has light **and** dark mode.

## The tutorial page template these visuals must serve
`promise → meta pills → HERO → Before you start → What you'll do → STEPS (a visual ~every
2 steps) → You're done (outcome) → Next steps (cards) → Reference`. So the skill must cover
a **hero**, **per-step annotated stills**, an optional **motion walkthrough**, an
**outcome** shot, and **landing-card thumbnails**.

## Required artifact types (the skill must produce all of these)

1. **Hero still** — one per tutorial. The outcome or the main screen, framed (browser/Safari
   chrome with edge bleed + soft fade), clean brand backdrop. ~1600×1000 (16:10), PNG @2×.
2. **Step still (annotated)** — a screen (or cropped region) with ONE focus callout: numbered
   badge, arrow/pointer, label pill, or spotlight/dim. ~1400×900 PNG @2×, or tight crop to the
   region. Must support cropping/zoom to a feature without over-zooming (keep neighbour bleed).
3. **Numbered step sequence** — 2-up / 3-up composite of several stills as a single image, each
   panel carrying a step number, for short flows that don't merit motion.
4. **Motion walkthrough** — scripted cursor moves, click ripples, spotlight reveals, panel
   transitions, count-ups. Two outputs:
   - **GIF** (inline in docs, autoplay-loops): ≤ ~8 s, ~15–20 fps, ≤ ~4 MB (optimize via gifski), ~1280px wide.
   - **MP4** (H.264, for longer/heavier flows): ≤ ~20 s, higher fidelity, + a poster/first frame.
5. **Outcome / "You're done" still** — the end-state where the result is visible (often a crop of the hero).
6. **Comparison visual** — side-by-side or before/after for Yarmill-specific contrasts
   (plan dashed vs reality solid; readiness states; empty vs populated data).
7. **Inline UI micro-crop** — a single button / state pill / icon on transparent background,
   for referencing in prose. Small, exact.
8. **Landing-card thumbnail** — consistent crop for `<Card>` galleries on the tutorials/use-cases
   index. Fixed aspect (16:10), ~1200×750, PNG.

## Annotation primitives (the skill must offer, composably)
Numbered step badge · arrow/pointer · label pill (indigo) · spotlight/dim mask · box highlight ·
zoom-inset (magnifier callout) · cursor + click ripple · blur/redact (for PII). Rules: callouts
horizontal and non-overlapping; design-token corner rounding; labels in the brand language; never
crop a callout; don't over-zoom.

## Brand & UI-shell rules (must be baked in)
- Tokens via the **`anthropic-skills:yarmill-design`** skill: **Inter**; brand indigo **#513FF8**;
  **Yollanda accents Blush #FC7B9B, never indigo**; real product icons + avatars.
- Render the **correct shell per screen**: "classic" light top-nav for most modules; **GUI 2.0**
  ("totem panel" + sidebar) for Goals + Medical, where **overviews and modals/dropdowns are DARK**;
  the Planner is its own light year-wall. Don't recolor a screen out of its real theme.
- Prefer **real product screenshots, then prettify**, OR rebuild the screen from design-system HTML
  → headless Chrome PNG. Two source modes the skill must support: (a) rebuild-from-tokens,
  (b) annotate a real capture I provide.
- Use realistic demo data (e.g. Pé Tomáš = device/sleep data; Em Krystof = wellness; Cihlář Adam =
  reality log) so "populated" screens look real. Mark any non-production image as a mockup in a comment.

## Light/dark handling (decide and document in the skill)
Each framed image is self-contained, so default to **one brand-neutral framing** that reads fine on
both docs themes (GUI 2.0 dark screens stay dark; classic light screens stay light — the framing
backdrop is the neutral constant). Only produce light+dark **pairs** for a screen if it genuinely
looks wrong on one theme; if so, document the light/dark image-swap technique.

## Output contract (what I need back to wire into MDX)
- Files written to `site/public/images/tutorials/<slug>/` (and `site/public/images/use-cases/<slug>/`) with predictable names
  (`hero.png`, `step-1.png`, `step-3.png`, `walkthrough.gif`, `walkthrough.mp4`, `thumb.png`).
- PNG @2×, sRGB; GIF optimized; MP4 H.264 + poster.
- For each artifact, return a **ready-to-paste `<Frame caption="…"><img alt="…"/></Frame>` snippet**
  (and for GIFs, the inline `<img>`), plus a one-line **alt-text** suggestion.
- **Batch mode:** accept a per-tutorial **shot list** (screen/region + shell + annotations + output
  name + crop type) and produce the whole folder in one run.

## Repeatability
Scripted and re-runnable so a tutorial's visuals can be regenerated when the UI changes. Calibrate
cursor/annotation coordinates with a probe pass before final render (don't hand-guess pixel coords).

## Tooling expected
Headless Chrome (render), **ffmpeg** (MP4), **gifski** (GIF), **imagemagick** (compose/crop). Skill
should check these exist and say what's missing.

## Acceptance checklist (skill is "ready for tutorials" when it can, end to end)
- [ ] Produce a framed **hero** still from either source mode, on the correct shell/theme.
- [ ] Produce an **annotated step still** with each annotation primitive, callouts non-overlapping.
- [ ] Produce a **GIF + MP4** walkthrough from a scripted cursor path, within the size/length budgets.
- [ ] Produce a **landing thumbnail** at the fixed card aspect.
- [ ] Run in **batch** from a shot list → a populated `site/public/images/tutorials/<slug>/` folder.
- [ ] Return paste-ready `<Frame>` snippets + alt text for every artifact.
- [ ] Re-run deterministically after a UI change.

## Reference / context for the skill author
- Existing skills: `yarmill-screenshot` (single framed still) and `yarmill-visuals` (annotated stills,
  step sequences, GIF/MP4) — this brief extends the latter for the docs-tutorial use case.
- Style model: linear.app/docs (one hero per page; a tight sentence sets up each following visual).
- Project rules: `CLAUDE.md` (screenshots § + image rules; mark mockups; alt text mandatory; build must
  pass `npx tsc --noEmit` + `npm run lint`). Tutorials/use-cases content types: `docs-guide/writing-instructions.md` §5.
- Starter tutorials these visuals will serve first: *Plan & publish your first week · Log a session ·
  Connect a watch & read recovery · Read team readiness · Set season goals.*
