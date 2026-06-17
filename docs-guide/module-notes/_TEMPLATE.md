# Module Spec: <Module name> — internal

> Internal specification. NOT published (excluded via `.mintignore`). Source for the
> user-facing docs page + image plan. Fill every section; leave `TODO(verify)` where unsure.

## 0. Meta
- **Module:** <name>
- **Route(s):** <url path(s)>
- **Nav path:** <how you reach it, e.g. OTHER → Medical module>
- **UI shell:** classic light top-nav | GUI 2.0 (totem panel) | Planner wall
- **Surfaces:** web | PWA | iOS | Android
- **Primary roles:** coach | athlete | admin | medical/staff
- **Config-dependence:** low | medium | high — what varies per instance
- **Explored:** <date> · instance/group <…> · athlete <…> · by <agent>
- **Render images now?** yes (new GUI) | no (shot list only)

## 1. Purpose & why it exists
One or two lines: the problem this module solves and the value it delivers.

## 2. Jobs to be done (per role)
> Format: "When I <situation>, I want to <motivation>, so that <outcome>."
- **Coach:** …
- **Athlete:** …
- **Admin / staff:** …

## 3. Personas & permissions
Who uses it; what each role can **see / do / not do**; permission gates and how access is
configured.

## 4. Key concepts & vocabulary
Entities, states, units, and any state machines (e.g. record statuses, goal states).
Note instance-specific terminology (the demo's configured field labels are Czech — flag it).

## 5. Information architecture
Where it lives, how you navigate to it, sub-views/tabs, and the related modules around it.

## 6. Screen & UI inventory
For each screen/view: layout + every panel, control, and field.
> Per field: **label · type · default · validation · who-can-edit · auto-save?**
> Per screen: states — **empty / loading / filled / error**, plus overlays/modals/menus.

### 6.1 <Screen / view name>
- Layout: …
- Controls: …
- Fields: …
- States: …

## 7. Actions & interactions
Every button/menu/action: what it does, side effects, confirmations, auto-save behaviour,
and what gets written to the Activity log.

## 8. User journeys / flows (per role)
Step-by-step happy paths with entry point → decisions → outcome, plus key variations.
> e.g. "Coach records a new injury", "Athlete reviews their open problems".

## 9. Use cases / scenarios
Named, concrete scenarios grounded in real usage.

## 10. Configuration & variants
`[CONFIG]` instance-specific bits vs universal mechanics; sport/role/permission variants.

## 11. Edge cases, limits, gotchas
Validation limits, locked/derived fields, permission walls, mobile differences, empty states.

## 12. Cross-module integration & data flow
Inputs from / outputs to other modules (e.g. medical status → Analytics readiness).

## 13. Shot list (images for the docs page)
> One row per planned image.
| # | Screen / state | Sample data | Caption (draft) | Callouts | Supports doc section | Role | Render now? |
|---|----------------|-------------|-----------------|----------|----------------------|------|-------------|
| 1 | … | … | … | … | … | coach/athlete | new-GUI: yes / later |

## 14. Open questions / TODO(verify)
- …

## 15. Source log
What was observed **live** (with which athlete/data) vs taken from the **master reference**;
note confidence and anything that couldn't be verified.

## 16. Docs page plan
> The bridge from spec → published page. Fill this so the page can be written without
> re-deriving structure.
- **Audience line:** `**For:** … · **Where:** …`
- **Proposed page outline** (H2s → which spec sections feed them):
  | Page section (H2) | Fed by |
  |-------------------|--------|
  | intro + audience line | §1, §0 |
  | … | … |
- **Cross-links** (exact paths/anchors to link from this page): e.g. `/en/analytics/analytics#…`
- **UI label → doc term** (pin wording where the UI label and the doc word differ):
  | UI label | Doc term |
  |----------|----------|
  | … | … |
