---
name: yarmill-figures
description: >-
  Produce the screenshot figures for a Yarmill docs page — hero, anchored zooms, annotated
  stills — by shooting the live app on the AFC Richmond demo group and composing the result
  with the repo's figure tooling. Use whenever a docs page needs images: "make the images
  for the X page", "redo the screenshots", "add a figure showing Y", "the hero for Z", or
  when the yarmill-docs skill reaches its visuals step. Also the home of the frame/bleed
  rules for placing a figure in MDX. Replaces the earlier yarmill-screenshot / yarmill-visuals
  references for still images; for brand tokens use anthropic-skills:yarmill-design.
---

# Yarmill docs figures

A docs figure is **a picture of the real product**, taken from a logged-in session, then
composed and annotated with the tooling in `docs-guide/visuals/tooling/`. Never rebuild a
screen as HTML and pass it off as a screenshot; never shoot a group other than AFC Richmond.

## Read these first
1. **`docs-guide/visuals/demo-cast.md`** — the cast (Ted Lasso coach · Jamie Tartt athlete ·
   Rebecca Welton admin), the **write-scope rule**, and every framing/callout/backdrop
   convention with the reasoning behind it. The conventions are settled — apply them, don't
   re-derive them.
2. **`docs-guide/visuals/tooling/README.md`** — the runbook for the scripts (setup, sessions,
   the loop, the figure spec format, the `align` → `bleed` table).
3. **`docs-guide/visuals/tooling/figures/goals.mjs`** + `capture/goals.mjs` — the worked
   example: eight figures for `/en/plan/goals`.

## The loop
1. **Decide the shot list from the page**, not the other way round: one figure per thing the
   text can't carry alone. Substantial pages open with a **hero** (the whole window, rendered
   with `<Frame variant="marketing">`); each section that describes a region gets **one
   anchored zoom** of that region; a screen whose colours or labels already explain it gets
   **no callouts**. Fewer, better figures — the Goals page ships eight.
2. **Ask for sessions**, one per role the page serves. Never type credentials. The product
   owner pastes cookies + localStorage; `session.py` turns them into `session.json` /
   `session-jamie.json` (gitignored, chmod 600, deleted after the shoot).
3. **Seed the demo data first** if the module's data isn't there: write `seed/<module>.mjs`
   (+ the prose plan in `docs-guide/visuals/demo-data/<module>-afc-richmond.md`) so every
   figure can be taken from one coherent data set — every state, the empty case, a
   deliberately incomplete record for any "check" UI. Writes go **only** to AFC Richmond;
   the scripts refuse anyone not in `cast.mjs`.
4. **Capture**: `capture/<module>.mjs` — one click path per raw, `data-cy` hooks where the app
   has them (`dumpInteractive` lists them), `dismissAnnouncements` before every shot, a
   scratch record created for a shot is deleted again in the same run. Full 1600×1000 window
   at 2×; never a partial-element screenshot — the crop happens in compose.
5. **Compose**: `figures/<module>.mjs` — `align` (one of nine anchors), `size` (crop in raw px),
   optional `callouts` with anchors measured by `measure.mjs` and copy in sentence case.
   `node compose.mjs <module> --publish` writes `site/public/images/<module>/*.png`.
6. **Place in MDX**: `<Frame bleed="<cut sides>" caption="…"><img src="/images/<module>/<name>.png" alt="…" /></Frame>`.
   `bleed` names the sides that are **not** the window's edge (table in the README). The
   `alt` describes what's shown **and names everything the callouts name** — callout text is
   pixels, invisible to a screen reader.
7. **Check as the reader sees it**: `npm run dev` in `site/`, then `check-frames.mjs` (both
   themes) and `check-zoom.mjs` (Retina crispness). Look at every figure: corners rounded only
   where two window edges meet, hairline only on window edges, no grey slivers, callouts
   legible at column width, no leader crossing another.
8. **Commit together**: the PNGs, the MDX, and the module's `figures/`, `capture/`, `seed/`
   files — the specs are what make the figure re-shootable after a UI change. Update
   `docs-guide/visuals/_VISUAL-TODOS.md` (☑) and the module's notes §13 shot list.

## Rules that were decided the hard way (don't relitigate)
- A figure is the app: whole window or an **anchored** zoom, bleeding on cut sides. No floating
  cut-out cards, no drop-shadow boxes on a backdrop.
- **Transparent PNG**, backdrop from the docs frame CSS — Paper (light) / Ink (dark) / Indigo
  (marketing). One asset, both themes.
- **macOS corner** sized against the rendered column; hairline and shadow **only on real
  window edges**; **no fade** on cut edges (tried, rejected).
- Callouts: **indigo cards, light text, off the app** in a transparent edge strip; chip (Inter
  600) + one line of body (Inter 450); **sentence case**; sized by `k = figureWidth / 700`;
  laid out by the browser, leaders **planar** (own rail each, right-to-left down the list);
  the dot sits just **outside** the element, never on the control. Never white cards, never
  colour-coded cards, never callouts on a screen that already uses colour to mean something.
- Bold in the docs is **600**, never 700.
- Name UI by its real label: **tool bar** (not action bar), **Verification** (not Document
  check), **Open guidelines** — check the live UI, not old notes.

## Hand-offs
- **Writing the page itself** → `yarmill-docs`. This skill is only the images.
- **Brand tokens, icons, type, the GUI 2.0 kit** → `anthropic-skills:yarmill-design`.
- **Motion, GIF/MP4 walkthroughs, marketing composites** → not covered by the tooling yet; see
  `docs-guide/visuals/yarmill-visuals-brief.md` for what's wanted and leave a
  `<Frame>{/* TODO(yarmill): … */}</Frame>` placeholder.
- Anything that is **not** a real capture keeps `{/* NOTE(yarmill): … mockup … */}` in the MDX.
