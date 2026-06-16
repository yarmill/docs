# Visual TODO queue — for the polished `yarmill-screenshot` skill to execute later

> Built during the live spec-verification pass. Each entry tells a future skill-run exactly
> **where to go in live Yarmill**, **what state to set up**, **what to capture**, and **how to
> post-process** (crop type + callouts). Render only when the screenshot skill has been polished.
>
> Status legend: ☐ todo · ☑ done (image in `images/<module>/`).
> Crop types: **full-window** (overviews/dashboards — all 4 edges, traffic lights, no fade) ·
> **corner-zoom+callouts** (detail/"anatomy" — bleed left+bottom, fade, horizontal callout pills) ·
> **modal/popover** (dark overlay, self-contained).
>
> Cast: biathlon **National Team**; **Simpson Lisa** as the example athlete (sandbox);
> Cihlář Adam / Em Krystof / Pe Tomáš for data where noted.

---

## How each entry is structured
```
### <module> — <shot name>   [crop type]   ☐/☑
- Go to: <live nav path / URL in we.yarmill.com> (role: coach/athlete)
- State: <data/selection/dropdown-open to set before capturing>
- Capture: <which panel/region; what must be visible>
- Callouts (if any): <label → element>, kept horizontal, non-overlapping, short sub-lines
- Post-process: <crop type; backdrop; which edges real vs cut; fade; framing>
- Lands in: images/<module>/<file>.png  →  used by en/<path>.mdx
```

---
<!-- entries appended per module during live verification -->

## medical — DONE (pilot)
- ☑ Entire Group overview (full-window) → images/medical/overview.png
- ☑ Record anatomy (corner-zoom + callouts) → images/medical/record.png

## attendance
> Classic light top-nav UI — **render later**, all shots ☐. Live-verified 2026-06-15 on the
> National Team (empty plan → all days "Free"). Shots that need a populated-plan group to set
> up are flagged **BLOCKED**.

### attendance — Week-view grid   [full-window]   ☐
- Go to: `/attendance/week?group=…&week=…&athlete=…` (top-nav **ATTENDANCE**) (role: coach)
- State: Week view active; a week range in the navigator; one row per athlete. Ideally a
  populated week (present/excused/unexcused mix); current demo shows all "Free", totals "-".
- Capture: full top bar + grid — Week|Season toggle, date-range navigator, day columns, totals.
- Callouts: "Week | Season toggle" → toggle · "step weeks" → navigator · "day cell = state
  control" → a day cell · "present / missed / %" → totals columns
- Post-process: full-window; classic UI; traffic lights; no fade.
- Lands in: images/attendance/week-grid.png  →  used by en/reality/attendance.mdx

### attendance — Day cell states (Free + marked)   [corner-zoom+callouts]   ☐
- Go to: `/attendance/week`, hover a day cell (role: coach)
- State: hover a "Free" cell → coffee-cup icon + "Free" tooltip. Ideally also a marked day.
- Capture: zoomed corner of the grid around one or two day cells + their tooltip.
- Callouts: "Free (rest day)" → coffee-cup cell · (when available) "present / excused / unexcused"
- Post-process: corner-zoom; bleed left+bottom; fade; horizontal callout pills.
- Lands in: images/attendance/day-states.png  →  used by en/reality/attendance.mdx

### attendance — Day editor (AM/PM marking)   [modal/popover]   ☐ **BLOCKED: needs populated plan**
- Go to: `/attendance/week`, click a day cell on a **planned** training day (role: coach)
- State: one athlete's day — morning present, afternoon excused. (Not reachable on Free days.)
- Capture: the present/off/excused/unexcused editor with its AM/PM split.
- Callouts: "morning slot" / "afternoon slot" → the two slots · "four states" → the picker
- Post-process: modal/popover; dark overlay; self-contained.
- Lands in: images/attendance/day-editor.png  →  used by en/reality/attendance.mdx

### attendance — Season view   [full-window]   ☐
- Go to: `/attendance/season` (Week|Season → Season) (role: coach)
- State: Season view; year selector at 2026; Jan–Dec columns + totals. Ideally a season with
  marks (else totals show 0 / 0 / "-").
- Capture: full top bar + grid — Week|Season toggle, year selector, Jan–Dec columns, totals.
- Callouts: "year selector" → dropdown · "month-by-month" → Jan–Dec columns · "present / missed / %" → totals
- Post-process: full-window; classic UI; traffic lights; no fade.
- Lands in: images/attendance/season-grid.png  →  used by en/reality/attendance.mdx

### attendance — Export menu   [modal/popover]   ☐
- Go to: `/attendance/week`, click the export pill (download icon + chevron) (role: coach)
- State: export dropdown open — shows "Monthly export to XLSX" item; button labelled "Export to PDF".
- Capture: the export pill + open dropdown menu.
- Callouts: "Export to PDF" → button · "Monthly export to XLSX" → menu item
- Post-process: corner-zoom or modal/popover; fade; horizontal callout pills.
- Lands in: images/attendance/export-menu.png  →  used by en/reality/attendance.mdx

### attendance — Copy plan (from Attendance)   [modal/popover]   ☐ **BLOCKED: needs populated plan**
- Go to: `/attendance/week`, **Copy plan** button (top-right, magenta) (role: coach)
  (TODO(verify) whether this button appears in this view.)
- State: Copy plan dialog with present-only athletes selected. (Needs a populated plan + marks.)
- Capture: the Copy plan dialog.
- Callouts: "present athletes only" → athlete selection · "whole day" → scope note
- Post-process: modal/popover; dark overlay; self-contained.
- Lands in: images/attendance/copy-plan.png  →  used by en/reality/attendance.mdx

## season-calendar
> Refreshed **Planner** (light year-wall shell; Add-event + pickers + Events box are **DARK**).
> Live-verified 2026-06-15 on the National Team / Simpson Lisa. **Render later — Planner
> refresh** (Plan + Planner slated to merge; UI still provisional), all shots ☐.
> Live nav needs the **full param set**: `/planner?group={id}&athlete={id}&week={yyyy-mm-dd}`
> (with only `?group=` the wall is blank). Opening the **+** panel auto-creates a stray draft
> event — clean it up after capturing.

### season-calendar — Year wall (filled)   [full-window]   ☐ **render later — Planner refresh**
- Go to: `/planner?group=…&athlete=…&week=…` (MENU → **Planner**) (role: coach)
- State: a populated season — July **Training camp** (amber) block, autumn **Competition**
  (red) blocks, a **Test** (blue) day, a **Vacation** (green) block incl. Lisa's "Family
  holiday". Year selector at 2026.
- Capture: full window — header, MENU sidebar, top bar (Hide panel · New event · Events box ·
  year selector · filter), the month-column wall, and the footer (zoom / scroll).
- Callouts: "month columns" → headers · "day rows" → numbers · "event block (date kicker +
  title)" → a block · "year selector" → dropdown · "filter" → dropdown · "zoom / scroll" → footer
- Post-process: full-window; light Planner shell; traffic lights; no fade.
- Lands in: images/season-calendar/year-wall.png  →  used by en/plan/season-calendar.mdx

### season-calendar — Add event panel (dark)   [modal/popover]   ☐ **render later — Planner refresh**
- Go to: `/planner?…`, click **New event (+)** (role: coach)
- State: dark "New event" panel — TITLE "Altitude camp — Font Romeu" · type Training camp
  (amber) · STARTS/ENDS 06–20 Jul · ADD LOCATION · ADD ATTRIBUTES · NOTE · CREATE EVENT.
  Capture the "✓ Saved" toast if visible (auto-save on open).
- Capture: the dark right-side panel, all fields top→bottom + the CREATE EVENT button.
- Callouts: "title" → TITLE · "type + colour" → type row · "date range" → STARTS/ENDS ·
  "location" → ADD LOCATION · "attributes (tags)" → ADD ATTRIBUTES · "✓ Saved on open" → toast
- Post-process: modal/popover; DARK panel; self-contained.
- Lands in: images/season-calendar/add-event.png  →  used by en/plan/season-calendar.mdx

### season-calendar — Type picker + colour palette (dark)   [modal/popover]   ☐ **render later — Planner refresh**
- Go to: `/planner?…`, **New event (+)** → click the type ▶ expander (role: coach)
- State: dark type list (7 types, each radio + colour dot) + the 7-swatch colour palette open.
- Capture: the expanded type list and the recolour swatches.
- Callouts: "7 types (per-team)" → list · "default colour" → a dot · "recolour palette" → swatches
- Post-process: modal/popover; DARK; self-contained.
- Lands in: images/season-calendar/type-picker.png  →  used by en/plan/season-calendar.mdx

### season-calendar — Events box / event sets (dark)   [modal/popover]   ☐ **render later — Planner refresh**
- Go to: `/planner?…`, click the **Events box** (clipboard) button (role: coach)
- State: dark Events box panel with the EVENTS SET list (e.g. "Events calendar 2024").
- Capture: the panel + the event-set list.
- Callouts: "event sets" → EVENTS SET list
- Post-process: modal/popover; DARK; self-contained.
- Lands in: images/season-calendar/events-box.png  →  used by en/plan/season-calendar.mdx

### season-calendar — Event surfacing in the Plan (locked)   [full-window]   ☐ **render later — Planner refresh**
- Go to: the Plan week view on the camp dates (role: coach)
- State: the camp block shown read-only (locked) in the Plan's week view.
- Capture: the Plan week view with the locked event block.
- Callouts: "locked event in the Plan" → the block · "edit it back in the Planner" → note
- Post-process: full-window; Plan shell; no fade.
- Lands in: images/season-calendar/event-in-plan.png  →  used by en/plan/season-calendar.mdx

### season-calendar — Athlete adds own event   [modal/popover]   ☐ **render later — Planner refresh**
- Go to: `/planner?…athlete=Simpson Lisa`, **New event (+)** (role: athlete)
- State: dark "New event" panel — TITLE "Family holiday" · type Vacation (green).
- Capture: the dark panel with the athlete's own event filled in.
- Callouts: "your own event" → TITLE/type
- Post-process: modal/popover; DARK; self-contained.
- Lands in: images/season-calendar/athlete-event.png  →  used by en/plan/season-calendar.mdx

## wellness-questionnaire
> Live-verified 2026-06-15 (clean coach session, coach *Bart Simpson*, group *National Team*,
> athlete *Em Krystof* with rich daily data). The coach record table is **classic light top-nav
> UI — render later**; the **input-form wizard is a PRIORITY new-GUI render target** (the clean
> new-design form the team wants imaged). Coach view route: `/evidence/wellness?group={id}&athlete={id}`.

### wellness-questionnaire — Coach record table   [full-window]   ☐ **classic UI — render later**
- Go to: `/evidence/wellness?group=12&athlete=4` (top-nav **OTHER → Wellness questionnaire**;
  athlete via the left group panel) (role: coach)
- State: Em Krystof selected, several days of records filled — Date · Sleep · Stress · Mood ·
  Soreness · Fatigue · Notes. Renders light.
- Capture: full window — title "Wellness questionnaire", top-right **share-link icon** + magenta
  **New record**, the table with funnel-filterable headers and per-row edit/delete.
- Callouts: "New record → wizard" → button · "share link" → chain icon · "one row = one day" → a
  row · "edit / delete" → per-row pencil/trash · "filter a column" → a funnel header
- Post-process: full-window; classic UI; traffic lights; no fade.
- Lands in: images/wellness/coach-table.png  →  used by en/reality/wellness-questionnaire.mdx

### wellness-questionnaire — Input-form wizard (Sleep step)   [full-window]   ☐ **new GUI — PRIORITY**
- Go to: `/evidence/wellness?group=12&athlete=4`, click **New record**, then **Continue** from
  the Date step to the **Sleep** step (role: coach; same wizard athletes fill themselves)
- State: the Sleep step of the 7-step wizard — breadcrumb "Wellness questionnaire > Em Krystof",
  green progress bar, question **"How did you sleep today?"**, the 5 option rows (1 Excellent ·
  2 Good sleep · 3 Neutral · 4 Bad sleep · 5 Very bad sleep), Back/Continue bottom bar. Light.
  Note: not auto-save — don't leave a stray draft; close via "Yes, close" if abandoning.
- Capture: the full window — breadcrumb + green progress bar at top, the question + 5 large
  tappable option rows (number badge + label), the Back/Continue bar at the bottom.
- Callouts: "green progress bar" → bar · "one question per step" → the question · "tap an option
  (number + label)" → an option row · "Back / Continue (↵ Enter)" → bottom bar
- Post-process: clean full-window new-GUI shot; light GUI 2.0 shell; traffic lights; no fade.
- Lands in: images/wellness/input-wizard.png  →  used by en/reality/wellness-questionnaire.mdx
