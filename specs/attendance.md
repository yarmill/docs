# Module Spec: Attendance (Docházka) — internal

> Internal specification. NOT published. Source for the user-facing docs page + image plan.

## 0. Meta
- **Module:** Attendance — Czech UI term **Docházka**; participation tracking
- **Route(s):** **`/attendance/week`** and **`/attendance/season`** (live-confirmed). Plain
  `/attendance` renders an empty body. Nav menu item href is
  `/attendance/week?group=…&week=…&athlete=…`.
- **Nav path:** classic top-nav → **ATTENDANCE**; in the new left-rail shell it sits under **Journal → Attendance**. (Never describe by shell — name the module.)
- **UI shell:** **classic light top-nav** (this is where it was explored and where the docs images will be framed)
- **Surfaces:** web (PWA)
- **Primary roles:** **coaches** (athletes do not edit attendance; it's a coach-side register). `[CONFIG]` the module is enabled per instance.
- **Config-dependence:** **medium** — whether the module is enabled at all is per instance; it's intended for groups whose athletes don't keep their own diary (sport schools, youth squads). The state set (**Present · Free · Excused · Not excused**) is a universal mechanic; the **morning/afternoon (AM/PM) split is `[CONFIG]`** — not observed in this instance (see §4).
- **Explored:** 2026-06-15 · group *National Team* (biathlon elite squad, **7 athletes**) ·
  coach *Bart Simpson* · classic light top-nav · live-verified on we.yarmill.com by main
  agent. **Re-verified 2026-06-15 with a clean coach session** after an earlier pass was
  contaminated by a colliding athlete session; the clean coach view is authoritative (see §15).
- **Render images now?** **NO** — shot list only (classic UI; render later)

## 1. Purpose & why it exists
A coach-side register of who actually showed up to training — a **single daily mark** per
athlete in this instance (an optional morning/afternoon split is `[CONFIG]`; see §4) —
totalled into **present / missed / %** numbers you can report.
It exists for groups whose athletes **don't keep their own diary**: sport schools and
youth squads that train once or twice daily, where one coach logs for the whole group.
It also doubles as the source for **participation reporting to national agencies and
schools**.

## 2. Jobs to be done (per role)
- **Coach:**
  - When I run a youth group whose athletes don't self-log, I want to mark who was at
    each session, so I have a participation record without asking kids to keep a diary.
  - When a school or national agency asks for attendance, I want per-period and
    per-season percentages, so I can report participation without tallying by hand.
  - When I've planned the week for the whole group, I want to push that plan into the
    diaries of just the kids who actually turned up, so Reality reflects who trained.
- **Athlete:** (no direct job — athletes in these groups don't keep their own diary; the
  coach maintains attendance on their behalf.) `TODO(verify)` whether athletes can *view*
  their own attendance/percentage anywhere.

## 3. Personas & permissions
- **Coach:** full access — marks attendance per athlete per day (a single daily mark in
  this instance; AM/PM split is `[CONFIG]`), switches Week/Season, and triggers
  attendance-based **Copy plan**. Logging Attendance is
  one of the coach's listed capabilities ("logs training and (if enabled) Attendance").
- **Athlete:** not an editor of this module. `TODO(verify)` athlete-side visibility of
  their own attendance record/percentage.
- **Admin / staff:** `[CONFIG]` whether the Attendance module is enabled for the instance/group.
- `TODO(verify)` exact per-role permission gates (who can edit vs view) in the live UI.

## 4. Key concepts & vocabulary
- **Daily mark (single, in this instance):** each athlete has **one markable state per day**
  — a single set of state buttons per day-cell (live-confirmed, clean coach view). **No
  morning/afternoon (AM/PM) split was observed** in this instance. The master reference
  describes an AM/PM split, so it may be **instance-configured** (present in some instances,
  absent here) — `[CONFIG]` / `TODO(verify)` the AM/PM layout where enabled.
- **Attendance states (per athlete per day):** **Present · Free · Excused · Not excused**
  (live-confirmed via tooltips, clean coach view):
  - **Present** — a **circle-check (✓)** icon.
  - **Free** — a **coffee-cup** icon; the **default / rest (day-off) state** (this is the cup
    shown when a column is *not* in edit mode).
  - **Excused** — a **circle-minus (⊖)** icon.
  - **Not excused** — a **circle-x (✕)** icon (this is the "unexcused" state).
- **Bulk "all present":** set via the **Entire Group row** — in a day-column's edit mode the
  Entire Group row shows the same 4 state buttons, and pressing its **Present** button sets
  the whole group for that day at once. So bulk is **per-day**, not week-wide (see §6.1, §7).
- **Totals (right-hand columns):** **Total present · Total missed · %** — computed per
  athlete; "missed" aggregates the non-present states. Live-confirmed column set: **Total
  present · Total missed · %** (Week view), with the same totals in Season view. Empty totals
  show **"-"**. `TODO(verify)` whether Excused vs Not excused both count as "missed" in the %.
- **Views:** **Week** (the markable register, day-by-day) and **Season** (the long-run
  participation picture, **month-by-month**). Percentages are available **per-period and
  per-season**. (Live-confirmed: Week = Mon–Sun columns; Season = Jan–Dec columns + a year
  selector.)
- **Entire Group row:** a **summary row at the top** of the Week grid (with a **grid icon**),
  shown **above all per-athlete rows** (live-confirmed, clean coach view). In a day-column's
  edit mode it also carries the 4 state buttons and acts as the **bulk set** for that day. The
  earlier "only one athlete / no Entire Group row" finding was a **session-collision artifact**
  and is wrong. `TODO(verify)` exactly what it totals.
- **Attendance-based "Copy plan":** publishing the week's plan into Reality **only for
  athletes marked present** that day (see §7, §12). **Whole-day, single daily mark** in this
  instance.
- Czech UI term: **Docházka**. `[CONFIG]` instance UI language may differ.

## 5. Information architecture
- Lives at **`/attendance/week`** and **`/attendance/season`**; reached from the classic
  top-nav **ATTENDANCE** entry (or **Journal → Attendance** in the new left-rail shell).
  Plain `/attendance` renders an empty body.
- **Two views via a toggle:** **Week** and **Season** (segmented **Week | Season** control,
  active item shown with an indigo outline).
- **Top bar (Week view):** **Week | Season** toggle · a **date-range navigator** = ◀ button,
  a **calendar-icon chip** reading the range (e.g. "15/06 - 21/06/2026"), ▶ button · far
  right an **export** button (download icon + chevron) in a magenta/indigo pill.
- **Top bar (Season view):** **Week | Season** toggle · a **year-selector dropdown** (e.g.
  "2026") in place of the week navigator · export button on the right.
- **Body:** a grid — an **Entire Group** summary row at the top (grid icon) followed by
  **one row per athlete**; **Week view** columns are the days **Mon–Sun** (each header showing
  the weekday over the date, e.g. "Mon / 15/06"); **Season view** columns are the months
  **Jan–Dec**; both then have the totals columns **Total present · Total missed · %**.
  (Live-confirmed in the clean coach view: Entire Group row + all 7 National Team athletes.)
- **Sidebar:** the left sidebar shows the **group selector** "National Team / 7 athletes".
- **Note (Copy plan):** a top-right primary **Copy plan** button (**magenta**) **is present**
  in the clean coach view (live-confirmed), alongside the **export** button.
- **Related modules:** **[Training Log / Reality](/en/reality/training-log)** (attendance-
  based Copy plan writes here); Plan (the source of the copied week); reporting/export out
  to schools/agencies.

## 6. Screen & UI inventory

### 6.1 Attendance grid — Week view (coach)
- **Layout:** top bar (Week | Season toggle · date-range navigator · top-right **Copy plan**
  (magenta) + **export**) over a table. Left sidebar carries the group selector
  ("National Team / 7 athletes"). (`/attendance/week`.)
- **Rows:** an **Entire Group** summary row at the top (with a **grid icon**), then **one row
  per athlete** (avatar + name). Live-confirmed: all 7 National Team athletes shown —
  Cihlář Adam, Em Krystof, Ká Ani, Kožnar Fanoušek, Kroczek Tomiš, Pé Tomáš, Simpson Lisa.
- **Columns:** **Mon · Tue · Wed · Thu · Fri · Sat · Sun**, each header showing the weekday
  over the date (e.g. "Mon / 15/06"); then right-hand totals **Total present · Total missed
  · %**.
- **Marking is inline, per day-column, via an "Edit" link (corrected):**
  - Each **day-column header** (Mon 15/06 … Sun 21/06) has an **"Edit"** link beneath the
    date. Clicking it switches **that day's column into edit mode**: the header label changes
    to **"Close"**, and **every athlete's cell in that column** (plus the Entire Group row)
    shows **4 inline state buttons**. Clicking **Close** (or Edit again) exits edit mode.
  - So marking is **inline in the grid, per day-column** — **not** a popover or modal, and
    the day cell is **not** itself a single state control.
  - **The 4 states** (live-confirmed via tooltips): **Present** (circle-check ✓) · **Free**
    (coffee-cup; default/rest) · **Excused** (circle-minus ⊖) · **Not excused** (circle-x ✕).
  - **Single daily mark:** one set of 4 buttons per day-cell — **no AM/PM split** observed in
    this instance (the AM/PM split is `[CONFIG]`; see §4).
  - **who-can-edit:** coach. **Auto-save** behaviour is `TODO(verify)`.
- **Bulk "all present":** in a day-column's edit mode the **Entire Group row** also shows the
  4 buttons; pressing its **Present** button sets the whole group for that day at once. Bulk
  is therefore **per-day**, via the Entire Group row.
- **States:**
  - **default (Free):** out of edit mode, an unmarked day cell shows the **coffee-cup "Free"**
    icon; empty **Week totals show "-".**
  - **edit mode (per column):** header reads "Close"; every cell in that column + the Entire
    Group row shows the 4 state buttons.
  - **filled:** marks per day, totals + % populated per row and on the Entire Group row.
  - **loading / error:** `TODO(verify)`.

### 6.2 Season view
- Same grid identity switched to the **long-run** picture (`/attendance/season`). Columns are
  the months **Jan · Feb · Mar · Apr · May · Jun · Jul · Aug · Sept · Oct · Nov · Dec**, then
  totals **Total present · Total missed · %** — i.e. a **month-by-month** breakdown plus
  season totals. A **year selector** (e.g. "2026") replaces the week navigator. Live-confirmed
  empty totals: **Total present 0 · Total missed 0 · % "-".** (Resolves the Season-granularity
  TODO.)

### 6.3 Copy plan (from Attendance) dialog
- Triggered by the top-right **Copy plan** button. `TODO(verify)` whether the dialog
  matches the Plan module's Copy plan dialog (destination athletes/group/week, source-day
  selection, weekly-goal checkbox, athlete selection) or is a reduced attendance-specific
  variant. Key behavioural difference is confirmed: it fills Reality **only for athletes
  marked present**, **whole day only**.

### 6.4 Export
- Top-right **export** control (download icon + chevron, magenta/indigo pill). Clicking it
  opens a **dropdown menu**. Live-confirmed: export = **PDF + monthly XLSX (Excel)**:
  - the button carries an accessible label **"Export to PDF"**;
  - one menu item is **"Monthly export to XLSX — Download monthly attendance as an Excel
    file"** (the XLSX export is described as a *monthly* export).
- `TODO(verify)` exactly what each format contains (week vs season, raw marks vs percentages)
  and any further menu items — likely participation totals for schools/agencies.

## 7. Actions & interactions
- **Switch view:** Week ⇄ Season.
- **Navigate dates:** step the date-range navigator across weeks/periods.
- **Mark attendance:** click a **day-column's "Edit"** link → the column enters edit mode
  (header → "Close") and each athlete's cell shows the 4 inline buttons → set each to
  **Present / Free / Excused / Not excused** (single daily mark; no AM/PM in this instance) →
  click **Close** to exit. Totals and % recompute. `TODO(verify)` auto-save behaviour and
  whether any Activity-log entry is written.
- **Bulk "all present":** in a day-column's edit mode, press the **Entire Group row's**
  **Present** button to set the whole group present for that day. Scope is **per-day**.
- **Copy plan (attendance-based):** publishes the week's plan into **Reality** for **only
  the athletes marked present** that day, **whole day only**. Side effect: writes into
  those athletes' diaries — overwrites for that whole day. Intended only for groups that
  don't self-log.
- **Export:** download the participation data. `TODO(verify)` format + scope.
- `TODO(verify)` whether Attendance writes to any Activity log (the medical/goals modules
  do; not confirmed here).

## 8. User journeys / flows (per role)
**Coach — take attendance for the week (happy path):** open **Attendance** → confirm
**Week** view and the right date range → for each training day, click that day-column's
**Edit** to enter inline edit mode and mark each athlete as **Present / Free / Excused /
Not excused** (single daily mark; or set the **Entire Group row** to **Present** for a
bulk all-present, then adjust exceptions), then **Close** → the right-hand **Total present /
Total missed / %** update per athlete and on the **Entire Group** row.

**Coach — report participation:** switch to **Season** view to read each athlete's
per-season % → use **export** (top-right) to hand participation numbers to the school /
national agency. `TODO(verify)` export format.

**Coach — fill Reality from who showed up:** after marking attendance for the day, press
**Copy plan** (top-right) → the planned week is written into **Reality** for **only the
athletes marked present**, for the **whole day** → those athletes' diaries now reflect the
session without anyone self-logging.

**Athlete:** no flow — these groups don't self-log. `TODO(verify)` any read-only athlete view.

## 9. Use cases / scenarios
- **Sport school daily register:** a youth coach marks daily attendance for the squad each
  day; nobody keeps a diary, but the school still has a participation record.
- **Reporting to a national agency:** at period/season end, the coach reads per-season %
  and exports it to satisfy a funding or schooling participation requirement.
- **One coach logging Reality for a young group:** after marking who turned up, the coach
  uses attendance-based **Copy plan** to push the planned session into the diaries of just
  the present kids — fast, and no child is asked to log.
- **Excused vs not-excused tracking:** a coach distinguishes a notified absence (**Excused**)
  from a no-show (**Not excused**), so the participation record reflects discipline as well as
  totals.

## 10. Configuration & variants
- `[CONFIG]` **Module enabled per instance/group** — Attendance is an opt-in module, aimed
  at non-self-logging groups (sport schools, youth squads).
- `[CONFIG]` **UI language** (e.g. Czech **Docházka**).
- `[CONFIG]` **morning/afternoon (AM/PM) split** — **not present in this instance** (single
  daily mark observed live); the master reference describes it, so it may be enabled in other
  instances. `TODO(verify)` the AM/PM layout where enabled.
- Universal mechanics: the **Present / Free / Excused / Not excused** state set, **Week/Season**
  views, the **present/missed/%** totals, and the **present-only, whole-day** behaviour of
  attendance-based Copy plan.
- `TODO(verify)` whether the state labels or % calculation rules vary by instance.

## 11. Edge cases, limits, gotchas
- **Copy plan overwrites whole days:** attendance-based Copy plan writes into athletes'
  diaries for the **whole day**. **Do not use it for athletes who keep their own Reality** —
  it would overwrite their entries. This is the module's biggest gotcha and warrants a
  `<Warning>` on the docs page.
- **Single daily mark (this instance):** attendance is marked once per day, so the day-granular
  copy matches the mark granularity. (If an instance has the `[CONFIG]` AM/PM split, the copy
  remains whole-day — verify partial-day handling there; `TODO(verify)`.)
- **Coaches-only editing:** athletes in these groups don't maintain their own attendance.
- `TODO(verify)` % attendance handling of a partial day where the `[CONFIG]` AM/PM split is enabled.
- `TODO(verify)` mobile behaviour for the Attendance grid.
- `TODO(verify)` empty/loading/error states.

## 12. Cross-module integration & data flow
- **→ Reality / Training Log:** attendance-based **Copy plan** writes the planned week into
  Reality **only for present athletes, whole day** — the primary data flow out of this
  module. See [Training Log](/en/reality/training-log).
- **← Plan:** the week being copied originates in Plan (the coach's group plan).
- **→ External reporting:** per-period and per-season **% attendance** export feeds
  schools / national agencies (participation reporting). `TODO(verify)` export format.
- `TODO(verify)` whether attendance percentages surface in Analytics anywhere.

## 13. Shot list (executable visual-todos)

**Render now? NO** — all Attendance images are render-later (classic UI).

| # | Shot | Live nav (URL/clicks) | State to set up | Crop type | Caption (draft) | Callouts | Post-process | Priority |
|---|------|-----------------------|-----------------|-----------|-----------------|----------|--------------|----------|
| 1 | Attendance grid — Week view | `/attendance/week?group=…&week=…&athlete=…` (top-nav **ATTENDANCE**) | Week view active; a week range visible; **Entire Group row + all athletes** shown. **Ideally** a populated week (Present/Excused/Not excused mix). | full-window | "Attendance: an Entire Group row plus one row per athlete, a cell per day, and present / missed / % on the right." | Week\|Season toggle · date-range navigator · Entire Group row (grid icon) · per-day **Edit** link · Total present / Total missed / % | full-window; classic UI; traffic lights; no fade | high |
| 2 | Day-column edit mode (inline buttons) | `/attendance/week`, click a day-column's **Edit** link | Column in edit mode (header → **Close**); every athlete cell + Entire Group row shows the **4 state buttons**. | corner-zoom+callouts | "Click a day's Edit to mark inline: Present, Free, Excused, or Not excused." | "Edit"→"Close" toggle · the 4 buttons (Present ✓ · Free cup · Excused ⊖ · Not excused ✕) · Entire Group row = bulk set | corner-zoom; bleed left+bottom; fade; horizontal callout pills | high |
| 3 | Bulk set via Entire Group row | `/attendance/week`, a day-column in **Edit** mode, focus the Entire Group row | Entire Group row's 4 buttons visible; **Present** highlighted (sets whole group for that day). | corner-zoom+callouts | "Set the Entire Group row to Present to mark everyone present for that day." | Entire Group row (grid icon) · **Present** button · "per-day, whole group" | corner-zoom; fade; horizontal callout pills | medium |
| 4 | Season view | `/attendance/season` (Week\|Season → Season) | Season view; year selector at 2026; Jan–Dec columns + totals. **Ideally** a season with marks (else totals 0/0/-). | full-window | "Switch to Season for the month-by-month, long-run participation picture." | Week\|Season toggle · year selector · Jan–Dec columns · Total present / Total missed / % | full-window; classic UI; traffic lights; no fade | medium |
| 5 | Export menu | `/attendance/week`, click the export pill (download icon + chevron) | Export dropdown open, showing "Monthly export to XLSX" item; button labelled "Export to PDF". | modal/popover | "Export attendance as a PDF or a monthly Excel (XLSX) file." | "Export to PDF" · "Monthly export to XLSX" | corner-zoom or modal/popover; fade; horizontal callout pills | medium |
| 6 | Copy plan (from Attendance) | `/attendance/week`, **Copy plan** button (top-right, magenta — confirmed present) | Copy plan dialog with present-only athletes selected. **blocked: needs populated plan** | modal/popover | "Copy plan fills Reality only for athletes marked present that day." | "present athletes only" · "whole day" | modal/popover; dark overlay; self-contained | low |

## 14. Open questions / TODO(verify)
**Resolved this pass / clean re-verification** (moved into the body): routes
(`/attendance/week`, `/attendance/season`); top-bar layout for both views; Week (Mon–Sun)
and Season (Jan–Dec, month-by-month) column sets; the **Entire Group row + all athletes**
(7 for National Team); the **4 states with exact labels + icons** — **Present** (✓) ·
**Free** (coffee-cup, default/rest) · **Excused** (⊖) · **Not excused** (✕); the **per-day
"Edit" → inline buttons → "Close"** marking model (inline in the grid, not a popover); the
**bulk all-present = Entire Group row's Present button, per-day**; that this instance uses a
**single daily mark (no AM/PM)**; the **Copy plan (magenta) button is present**; empty-state
totals ("-" Week; 0/0/"-" Season); export formats (**PDF + monthly XLSX**).

Still open:
- Whether the **morning/afternoon (AM/PM) split** exists in other instances (`[CONFIG]`); not
  present here. Its layout where enabled, and partial-day (% attendance) handling.
- Whether attendance state **auto-saves** on click (vs an explicit save).
- **% attendance** rules: do **Excused** and **Not excused** both count as "missed"?
- Exactly what the **Entire Group** summary row totals.
- **Export** scope/contents per format (week vs season, marks vs %); any further menu items.
- Whether the **Copy plan** dialog mirrors Plan's or is a reduced attendance-specific variant.
- Any **athlete-side** read-only view of their own attendance.
- Does Attendance write to any **Activity log**? **Mobile** behaviour? Loading/error states.

## 15. Source log
- **Master reference (§5.5 Attendance / Docházka):** the morning/afternoon split; the four
  states; bulk "all present"; per-period and per-season %; **Week | Season** views; per-day
  **Edit**; columns **Total present / Total missed / %**; the present-only, whole-day
  behaviour of attendance-based Copy plan; the "young kids / sport schools, don't self-log,
  not for self-loggers" positioning; reporting to agencies/schools. Reference §5.4 confirms
  the overwrite risk for self-loggers. **Confidence: high** on these mechanics.
- **Observed live (2026-06-15, classic UI, group National Team):** routes
  **`/attendance/week`** and **`/attendance/season`** (plain `/attendance` empty); the
  **Week | Season** segmented toggle; the Week-view **date-range navigator** (◀ / calendar
  chip "15/06 - 21/06/2026" / ▶); the Season-view **year selector**; the **export** pill
  (download icon + chevron) with menu item "Monthly export to XLSX" and accessible label
  "Export to PDF"; the grid (**Mon–Sun** day-over-date headers in Week, **Jan–Dec** in
  Season; right-hand **Total present / Total missed / %**); empty totals ("-" Week;
  0/0/"-" Season). **Confidence: high.**
- **Clean-coach re-verification (2026-06-15, we.yarmill.com, coach *Bart Simpson*, group
  National Team, classic top-nav):** authoritative correction of an earlier pass that had been
  contaminated by a **colliding athlete session** (an athlete session leaked into the coach
  view). Corrected/confirmed in the clean coach view: the **Entire Group row (grid icon) +
  all 7 athletes** (Cihlář Adam, Em Krystof, Ká Ani, Kožnar Fanoušek, Kroczek Tomiš,
  Pé Tomáš, Simpson Lisa) — the earlier "only Lisa / no Entire Group row" finding was a
  session-collision artifact and is **wrong**; the left sidebar group selector
  "National Team / 7 athletes"; the **per-day "Edit" link** beneath each day header that
  toggles that column into inline **edit mode** (header → **"Close"**) exposing **4 state
  buttons** per cell and on the Entire Group row; the **4 states + icons via tooltips** —
  **Present** (circle-check ✓) · **Free** (coffee-cup, default/rest) · **Excused**
  (circle-minus ⊖) · **Not excused** (circle-x ✕); the **bulk all-present = Entire Group
  row's Present button (per-day)**; a **single daily mark with no AM/PM split** in this
  instance; and the **Copy plan (magenta)** button present top-right. **Confidence: high.**
- **AM/PM unconfirmed for this instance:** the master reference describes a morning/afternoon
  split, but the live National Team attendance shows a **single daily mark**. AM/PM is treated
  as `[CONFIG]` / `TODO(verify)` — present in some instances, not here.
- **Still not verified:** auto-save, % rules (Excused vs Not excused as "missed"), exactly
  what the Entire Group row totals, export contents per format, whether the Copy plan dialog
  mirrors Plan's, and athlete-side visibility. Flagged `TODO(verify)` in §14. No image
  rendered — classic UI, shot list only.

## 16. Docs page plan
- **Audience line:** `**For:** coaches · **Where:** Web app`
- **Proposed page outline** (H2s → which spec sections feed them):
  | Page section (H2) | Fed by |
  |-------------------|--------|
  | intro + audience line + `<Info>` "configured per team / for non-self-logging groups" | §1, §0, §10 |
  | Take attendance (Week view; per-day Edit → mark Present/Free/Excused/Not excused; Season for %) + `<Warning>`-free body | §6.1, §6.2, §4, §7 |
  | Fill Reality from attendance (`<Warning>` on overwrite) | §6.3, §7, §11, §12 |
  | (optional) Report participation / export | §6.4, §8, §12 |
- **Cross-links:** [Training Log](/en/reality/training-log) (where attendance-based Copy
  plan writes). `TODO(verify)` whether to also link Plan once that page exists.
- **UI label → doc term:**
  | UI label | Doc term |
  |----------|----------|
  | Docházka | Attendance |
  | Edit / Close (per day-column) | enter / exit attendance edit mode |
  | Present (✓) | present |
  | Free (coffee-cup) | off / rest day (default) |
  | Excused (⊖) | excused absence |
  | Not excused (✕) | unexcused absence |
  | Entire Group row | bulk set (mark whole group for a day) |
  | Total present / Total missed / % | present / missed / attendance % |
  | Monthly export to XLSX / Export to PDF | export (Excel / PDF) |
  | Copy plan | Copy plan (fills Reality for present athletes) |
