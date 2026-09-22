// Figure spec for the Medical module page — what compose.mjs turns the raw
// captures in raw/medical/ into.
//
// Every figure is either the whole window or a zoom ANCHORED to one of nine
// positions on it (top-left · top · top-right · left · center · right ·
// bottom-left · bottom · bottom-right), so the reader can always see where in
// the app they are. `size` is the crop in raw pixels (captures are 3200×2000);
// the crop origin follows from the anchor.
//
// Crops and callout anchors here were set against the real raws (shot
// 2026-09-21 on the seeded AFC Richmond data), not estimated. Re-measure with
// measure.mjs if the UI moves. Copy is sentence case, and whatever a callout
// says the MDX `alt` must say too — callout text is pixels to a screen reader.
export const module = 'medical';

export const FIGURES = {
  // The hero: Jamie Tartt's open ankle sprain with everything on it —
  // properties, key dates, all five circumstances, the note, the OSIICS
  // diagnosis with its auto-tags, and the Open/Closed list beside it. Whole
  // window, no callouts: the page names every part in prose right next to it.
  'record': { src: 'record.png', align: 'center', size: [3200, 2000], hero: true },

  // The squad on one dark screen. Cropped to the top: the table is six rows
  // and the rest of the window is empty dark space, which a full-window figure
  // would spend two thirds of itself on. NO CALLOUTS — the red/amber/green
  // pills and the red "22 days overdue" already carry the meaning, and
  // annotating over them would fight the UI (demo-cast.md).
  'overview': { src: 'overview.png', align: 'top', size: [3200, 1150] },

  // Top-left: the + at the top of the record list, with its Injury / Illness
  // menu open. This is the primary way a record is created, so it gets a
  // figure; two readable items need no callouts.
  'create-picker': { src: 'create-picker.png', align: 'top-left', size: [1800, 900] },

  // Left of the window: the sidebar and Jamie's Open (2) / Closed (4) lists,
  // the closed cards carrying their closure dates and checks. Clean — the
  // section headers say what they are.
  'record-list': { src: 'record-list.png', align: 'left', size: [1400, 2000] },

  // Bottom-right: the New entry modal where it actually opens. The crop is
  // taller than the modal needs because the three callout cards have to fit
  // down the side of it — cards are sized in rendered CSS px, so a short figure
  // cannot hold them and the compositor ends up clamping them into each other.
  'quick-entry': {
    src: 'quick-entry.png', align: 'bottom-right', size: [2000, 1800],
    callouts: [
      { at: [2095, 1467], label: 'Entry type', sub: 'Injury or illness' },
      { at: [2230, 1629], label: 'Status', sub: 'How much they can train — colours the group screen' },
      { at: [2675, 1885], label: 'Save', sub: 'Or Open full detail — both create the record' },
    ],
  },

  // Right of the window: the OSIICS picker mid-search. This is the figure that
  // carries the diagnosis section, so it is the one that gets annotated.
  'diagnosis-picker': {
    src: 'diagnosis-picker.png', align: 'right', size: [2000, 2000],
    callouts: [
      { at: [2100, 986], label: 'OSIICS code', sub: 'Beside every diagnosis in the list' },
      { at: [2100, 1267], label: 'Search in plain words', sub: 'Type the problem, not the code' },
      { at: [2340, 1357], label: 'Side', sub: 'Left, right, bilateral, or unknown' },
    ],
  },

  // The whole window, from Jamie's own session: the point is what ISN'T in the
  // sidebar — no group dropdown, no athlete list, no Entire Group — but a left
  // crop of that is a tall strip of empty sidebar, so keep the window and let
  // his own record fill the rest of it.
  'athlete-view': { src: 'athlete-view.png', align: 'center', size: [3200, 2000] },
};

// Shot but deliberately NOT published:
// - `new-record.png` — an empty record. Goals needs its equivalent because a
//   goal starts blank; here the way in is quick entry, and the hero already
//   shows a filled record, so an empty one adds a figure without adding a fact.
// - `circumstances-picker.png` — a menu whose values are per-instance
//   codelists, so a figure of one team's list would read as the product's.
//   (Its capture is also flaky: the submenu opens on hover.)
// The raws are captured, so any of them can be added by putting a key back.
// Seven figures for this page, against eight for Goals.
