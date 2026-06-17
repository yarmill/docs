# Spec review gate — acceptance checklist

A spec passes (and can be translated into a docs page) only when **all** are true. If any
fail, bounce back to the explorer/writer with the specific gaps named.

## Coverage
- [ ] Every screen/view in the module is inventoried (§6), including overlays, modals, menus.
- [ ] Every control and field is documented with type, default, validation, who-can-edit, auto-save.
- [ ] All meaningful states covered: empty, loading, filled, error.
- [ ] Every action documented with side effects + Activity-log behaviour (§7).

## Depth
- [ ] JTBD present for each relevant role (§2), phrased as real jobs, not feature restatements.
- [ ] At least one complete journey per relevant role (§8), entry → outcome.
- [ ] Concrete, named use cases (§9).
- [ ] Cross-module data flow captured (§12).

## Fidelity
- [ ] Observed live (not assumed); §15 source log distinguishes live vs reference, with confidence.
- [ ] Instance-specific vs universal behaviour separated and marked `[CONFIG]` (§10).
- [ ] Open questions / unverified items flagged `TODO(verify)` (§14), not asserted.

## Docs-readiness
- [ ] Shot list complete (§13): each image has screen, state, sample data, **caption draft**, callouts, doc section, role, render-now flag.
- [ ] **§16 Docs page plan present:** audience line, page outline (H2s mapped to spec sections), exact cross-link paths, and UI-label → doc-term mapping.
- [ ] Enough material that the user-facing page can be written without re-opening the app.
- [ ] Coach and athlete perspectives both represented (separate sections or clearly labelled).
