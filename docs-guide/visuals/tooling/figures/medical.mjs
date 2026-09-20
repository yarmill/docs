// Figure spec for the Medical module page — what compose.mjs turns the raw
// captures in raw/medical/ into.
//
// Every figure is either the whole window or a zoom ANCHORED to one of nine
// positions on it (top-left · top · top-right · left · center · right ·
// bottom-left · bottom · bottom-right), so the reader can always see where in
// the app they are. `size` is the crop in raw pixels (captures are 3200×2000);
// the crop origin follows from the anchor.
//
// ─────────────────────────────────────────────────────────────────────────────
// EVERY `callouts[].at` BELOW IS A PLACEHOLDER.
// The raw captures don't exist yet (no session, and the Medical module's
// layout is unverified — see the header of capture/medical.mjs), so the
// coordinates are informed guesses at where each control sits in a 3200×2000
// window. Before publishing, re-measure each one against the real raw with
//
//     node measure.mjs medical <raw>.png <yFrom> <yTo> <xFrom> <xTo>
//
// and drop the `// TODO(measure)` marker once the anchor is real. Crop `size`
// values want the same sanity check: compose first, look, then adjust.
// A dot sits just OUTSIDE the element it names (past the end of a line, at the
// right edge of a panel) and must fall INSIDE the crop, or it is clipped.
// Copy is sentence case, and whatever a callout says the MDX `alt` must say too.
// ─────────────────────────────────────────────────────────────────────────────
export const module = 'medical';

export const FIGURES = {
  // The hero: the team on one dark screen. The group overview is the module's
  // landing screen and the job it does every day ("who can train today?"), so
  // it leads the page — not the record detail, the way Goals leads with a goal.
  // NO CALLOUTS: the red/amber/green status pills and the red "X days overdue"
  // already carry the meaning, and annotating over them would fight the UI
  // (demo-cast.md). Whole window, so its <Frame> needs no bleed.
  // Worth a second look once the raw exists: this is the one hero in the docs
  // that is a DARK screen on the marketing backdrop's indigo. If it reads badly,
  // move `hero: true` to 'record' and drop the marketing variant in the MDX.
  'overview': { src: 'overview.png', align: 'center', size: [3200, 2000], hero: true },

  // A health record with everything on it — properties, key dates,
  // circumstances, note, OSIICS diagnosis, files, activity. Whole window, no
  // callouts (the page names the parts in prose right beside it).
  // Key kept as `record` so it replaces the existing /images/medical/record.png.
  'record': { src: 'record.png', align: 'center', size: [3200, 2000] },

  // Left of the window: the sidebar and the athlete's Open (n) / Closed (n)
  // lists. Clean — the section headers say what they are, and the cards carry
  // status pills whose colour is the point.
  'record-list': { src: 'record-list.png', align: 'left', size: [1900, 2000] },

  // Right of the window: a record the moment it is created, still empty —
  // this is where the parts of a record get named.
  'new-record': {
    src: 'new-record.png', align: 'right', size: [2100, 2000],
    callouts: [
      { at: [1460, 215], label: 'Name the problem', sub: 'Type over "New injury"' },               // TODO(measure)
      { at: [2980, 430], label: 'Properties', sub: 'Classification, treatment, training limitation, staff' }, // TODO(measure)
      { at: [2980, 700], label: 'Key dates', sub: 'Start date, and the expected return' },          // TODO(measure)
      { at: [2980, 1180], label: 'Diagnosis', sub: 'An OSIICS code and the side' },                 // TODO(measure)
      { at: [2420, 1900], label: 'Tool bar', sub: 'New quick entry · help · delete' },              // TODO(measure)
    ],
  },

  // Right of the window: the OSIICS picker mid-search. This is the figure that
  // makes the OSIICS point, so it is the one that gets annotated hardest.
  'diagnosis-picker': {
    src: 'diagnosis-picker.png', align: 'right', size: [2000, 2000],
    callouts: [
      { at: [2520, 620], label: 'Search the codelist', sub: 'Type the problem, not the code' },     // TODO(measure)
      { at: [2520, 840], label: 'OSIICS code', sub: 'Filtered by record type — injury or illness' },// TODO(measure)
      { at: [2520, 1420], label: 'Side', sub: 'Left, right, bilateral, or unknown' },               // TODO(measure)
    ],
  },

  // Whole window: the quick-entry modal sits in the middle of the screen, so a
  // centre crop would cut all four sides and lose the reader. Keep the window.
  'quick-entry': {
    src: 'quick-entry.png', align: 'center', size: [3200, 2000],
    callouts: [
      { at: [2280, 640], label: 'Entry type', sub: 'Injury or illness' },                           // TODO(measure)
      { at: [2280, 900], label: 'Training limitation', sub: 'Full, modified, or no training' },     // TODO(measure)
      { at: [2280, 1360], label: 'Files', sub: 'Drag in a report or a scan' },                      // TODO(measure)
      { at: [2280, 1560], label: 'Save', sub: 'Nothing is created until you do' },                  // TODO(measure)
    ],
  },

  // Left of the window, from the athlete's own session: the point is what
  // ISN'T in the sidebar — no group dropdown, no athlete list, no Entire Group.
  'athlete-view': { src: 'athlete-view.png', align: 'left', size: [1900, 2000] },
};

// Shot but deliberately NOT published: `create-picker.png` (the + → Injury /
// Illness menu — two readable items that the Steps already say) and
// `circumstances-picker.png` (a menu whose values are per-instance codelists,
// so a figure of one team's list would read as the product's). The raws are
// still captured, so either can be added later by putting it back in FIGURES.
// Seven figures for this page, against eight for Goals.
