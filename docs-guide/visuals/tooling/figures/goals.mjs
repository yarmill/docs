// Figure spec for the Goals page — what compose.mjs turns raw captures into.
//
// Every figure is either the whole window or a zoom ANCHORED to one of nine
// positions on it (top-left · top · top-right · left · center · right ·
// bottom-left · bottom · bottom-right), so the reader can always see where in
// the app they are. `size` is the crop in raw pixels (captures are 3200×2000);
// the crop origin follows from the anchor.
//
// Callout anchors are in full-capture coordinates and land just OUTSIDE the
// element they name (past the end of a line, at the right edge of a table) —
// measure them off the raw pixels with measure.mjs rather than guessing.
// Copy is sentence case. Whatever the callouts say, the figure's alt text in
// the MDX must say too.
export const module = 'goals';

export const FIGURES = {
  // the whole window — the page's lead (rendered with <Frame variant="marketing">)
  'goal-hero': { src: 'goal-detail.png', align: 'center', size: [3200, 2000], hero: true },

  // right side of the window: an empty goal, ready to fill in
  'new-goal': {
    src: 'new-goal.png', align: 'right', size: [2100, 2000],
    callouts: [
      { at: [1443, 219], label: 'Give it a title', sub: 'Type over the placeholder' },
      { at: [1369, 312], label: 'Describe it', sub: 'What success looks like' },
      { at: [2137, 400], label: 'Set the attributes', sub: 'Each one a button' },
      { at: [3120, 592], label: 'Add key results', sub: 'Type into the empty row' },
      { at: [2419, 1893], label: 'Tool bar', sub: 'New goal · verification · delete' },
    ],
  },

  // left side of the window: the two-level category menu, in context
  'category-picker': { src: 'category-picker.png', align: 'left', size: [2400, 2000] },

  // bottom-right: the Verification popover where it actually opens. No callouts:
  // the screen already uses red/amber/green to mean something.
  'verification': { src: 'verification.png', align: 'bottom-right', size: [2100, 1250] },

  // bottom-right: a closed goal — its evaluation and the log behind it
  'final-evaluations': {
    src: 'final-evaluation.png', align: 'bottom-right', size: [2100, 1300],
    callouts: [
      { at: [2147, 1190], label: 'Final evaluation', sub: 'Only once the goal is closed' },
      { at: [2130, 1660], label: 'Activity', sub: 'Every change, and comments' },
    ],
  },

  // top of the window: the squad on one screen. The colours speak for themselves.
  'group-overview': { src: 'group-overview.png', align: 'top', size: [3200, 1150] },

  // top-left: the export menu, open over the goals list
  'export-options': { src: 'export-options.png', align: 'top-left', size: [2300, 1000] },

  // left of the window, from an athlete's own session: the point is what ISN'T
  // in the sidebar — no group dropdown, no athlete list, no Entire Group.
  'athlete-view': { src: 'athlete-view.png', align: 'left', size: [1900, 2000] },
};
