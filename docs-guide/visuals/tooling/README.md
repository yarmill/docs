# Figure tooling — shoot the real app, compose the docs figure

The scripts that produce every screenshot-based figure in the docs, from a logged-in
session on we.yarmill.com to a PNG under `site/public/images/<module>/`. The
conventions they encode are written up in [`../demo-cast.md`](../demo-cast.md); the
operating procedure for a new page is the **`yarmill-figures`** skill
(`.claude/skills/yarmill-figures/SKILL.md`). This file is the runbook for the scripts.

```
tooling/
├── yarmill.mjs        browser harness: Chromium, proxy/TLS quirks, sessions, the 1600×1000@2× viewport
├── session.py         pasted cookies + localStorage  →  session.json (Playwright storageState)
├── cast.mjs           AFC Richmond member IDs — the only people the scripts can navigate to
├── capture-lib.mjs    dismissAnnouncements · goTo · shooter · typeIn · pick · dumpInteractive
├── capture.mjs        node capture.mjs <module>      → runs capture/<module>.mjs → raw/<module>/*.png
├── compose.mjs        node compose.mjs <module> [--publish]  → figures/<module>.mjs + raw → out/<module>/*.png
├── measure.mjs        node measure.mjs <module> <raw.png> y0 y1 x0 x1 → where content ends (for callout anchors)
├── seed.mjs           node seed.mjs <module> [member …] → wipes + re-creates the demo data (seed/<module>.mjs)
├── check-frames.mjs   node check-frames.mjs /en/plan/goals → every <Frame> on the page, light + dark, at 2×
├── check-zoom.mjs     node check-zoom.mjs   /en/plan/goals → is click-to-zoom crisp on Retina
├── figures/<module>.mjs   the figure spec: anchor, crop size, callouts
├── capture/<module>.mjs   the click path that produces each raw capture
└── seed/<module>.mjs (+ <module>-lib.mjs)   the demo data and the UI driver that creates it
```

Everything under `raw/`, `out/`, `work/`, `shots/` and every `session*.json` / `paste*.json`
is gitignored. The **figure specs, capture scripts and seed data are the deliverable** — with
them, any figure can be re-shot after a UI change without redoing the design work.

## Setup

```bash
cd docs-guide/visuals/tooling
npm install                       # playwright; uses the pre-installed Chromium if there is one
```

Chromium is found under `$PLAYWRIGHT_BROWSERS_PATH` (default `/opt/pw-browsers`) or
`$CHROMIUM_PATH`; otherwise Playwright's own download is used. Behind the remote environment's
egress proxy the harness reads `$HTTPS_PROXY` on every launch (the port rotates) and caps TLS at
1.2 (the tunnel resets a 1.3 ClientHello). Neither setting does anything on a plain machine.

## Getting a session

The scripts never log in and never see a password. The product owner hands over an already
logged-in session, one per role the page serves (coach = **Ted Lasso**, athlete = **Jamie
Tartt**; see [`../demo-cast.md`](../demo-cast.md)):

1. Log in to we.yarmill.com as that person in a normal browser.
2. DevTools → **Network** → pick any request to `we.yarmill.com` → copy the **Cookie**
   request header, verbatim.
3. DevTools → **Console** →
   `copy(JSON.stringify(Object.fromEntries(Object.entries(localStorage))))`
   for the localStorage.
4. Paste both into `paste.json` as `{ "cookie": "…", "ls": { … } }`, then
   `python3 session.py paste.json session.json` (or `session-jamie.json` for the athlete).

Both files are `chmod 600`, gitignored, and deleted when the shoot is over. A session that has
expired shows up as the login page in the first raw capture.

## The loop for a page

```bash
node seed.mjs goals                 # 1. demo data — only if the page's data isn't there yet
node capture.mjs goals              # 2. raw/goals/*.png — full 3200×2000 windows
node measure.mjs goals new-goal.png 195 250 1200 3120   # 3. find where a line of content ends
node compose.mjs goals --publish    # 4. out/goals/*.png → site/public/images/goals/
cd ../../../site && npm run dev     # 5. look at it as the reader will
node check-frames.mjs /en/plan/goals
node check-zoom.mjs   /en/plan/goals
```

**Seeding is a write to the live product.** `seed.mjs` wipes the member's data first, and it
can only reach members listed in `cast.mjs` — AFC Richmond. That is the whole write scope
(rule in `../demo-cast.md`); do not add anyone else to that file.

## Writing a figure spec

```js
// figures/<module>.mjs
export const module = 'attendance';
export const FIGURES = {
  'week-grid': { src: 'week.png', align: 'top', size: [3200, 1200] },
  'day-editor': {
    src: 'day-editor.png', align: 'bottom-right', size: [2100, 1300],
    callouts: [
      { at: [2147, 1190], label: 'Morning', sub: 'Present, excused, or unexcused' },
    ],
  },
  'hero': { src: 'week.png', align: 'center', size: [3200, 2000], hero: true },
};
```

- `align` — one of the nine anchors; the crop origin follows from it. Pick the one that shows
  *where the thing lives*.
- `size` — crop in raw pixels. A side that reaches the capture's edge is treated as the
  window's own edge (margin, hairline, rounded corner); a side that doesn't is a cut and bleeds.
- `callouts[].at` — full-capture coordinates, just outside the element. Use `measure.mjs`.
  Sentence case. Two lines at most: a `label` chip and a short `sub`. Leave a figure clean if
  the screen explains itself.
- `hero: true` — a little more margin; render it with `<Frame variant="marketing">`.

Then in the MDX, `bleed=` names the cut sides — the sides that are *not* the window's edge:

```mdx
<Frame bleed="left top" caption="…">
  <img src="/images/attendance/day-editor.png" alt="… names everything the callouts name …" />
</Frame>
```

| `align` | cut sides → `bleed=` |
|---|---|
| `top-left` | `right bottom` |
| `top` | `left right bottom` (or just `bottom` when the crop spans the full width) |
| `top-right` | `left bottom` |
| `left` | `right` (+ `top`/`bottom` unless the crop spans the full height) |
| `center` (full window) | none |
| `right` | `left` (+ `top`/`bottom` unless full height) |
| `bottom-left` | `right top` |
| `bottom` | `top` (+ `left`/`right` unless full width) |
| `bottom-right` | `left top` |

## Adding a module

1. `seed/<module>.mjs` — the demo data, mirrored in prose under `../demo-data/`; plus a
   `seed/<module>-lib.mjs` that drives that module's UI (start from `seed/goals-lib.mjs`).
2. `capture/<module>.mjs` — one click path per raw capture. Use `data-cy` hooks where the app
   has them (`dumpInteractive` lists them); always `goTo`/`dismissAnnouncements` first.
3. `figures/<module>.mjs` — the spec above.
4. Compose, publish, check in the running site in both themes, then commit the three files
   together with the PNGs and the MDX.
