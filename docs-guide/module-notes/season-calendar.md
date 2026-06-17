# Module Spec: Season Calendar (Planner) — internal

> Internal specification. NOT published (excluded via `.mintignore`). Source for the
> user-facing docs page + image plan. Fill every section; leave `TODO(verify)` where unsure.

## 0. Meta
- **Module:** Season Calendar — a.k.a. the **Planner** (Czech UI: **Termínovka**). The
  full-season events scaffold that feeds the [Plan](/en/plan/plan).
- **Route(s):** `/planner`. The year-wall only renders with the **full param set**
  `?group={id}&athlete={id}&week={yyyy-mm-dd}`. With only `?group=` it renders a **blank
  canvas** (just the MENU sidebar, no wall) — the wall needs group + athlete + week context.
- **Nav path:** main **MENU** sidebar → **Planner**. In the new left-rail shell this sits
  in the *Planning* group (Plan · Goals · Planner); in the older top-menu UI it lives under
  **OTHER → Planner**. (Per the master reference, never describe navigation by shell — name
  the module "Planner".)
- **UI shell:** **Planner year-wall (light).** This is the Planner's **own** light shell —
  not the classic top-nav and not the Medical GUI 2.0 dark overview. A full-year wall:
  **months as columns, days as rows**. Header: Yarmill logo + instance name (demo:
  *"Yarmillovníci"*) + user avatar. Left **MENU** sidebar lists **Reality · Plan · Goals
  · Planner** (active, light-blue highlight) **· Settings**. **In the refreshed UI there is a
  GROUP section below MENU** (confirmed clean-coach pass 2026-06-15): a **group dropdown** ("National
  Team") → an **Entire Group** entry + the athlete list — the coach scopes the wall here.
  (Add-event and pickers render as **dark** panels;
  see §6.)
- **Surfaces:** web (incl. PWA). `TODO(verify)` native iOS/Android Planner parity — apps are
  athlete-only and limited; not confirmed for the Planner.
- **Primary roles:** **coach** and **athlete** (athletes can add their own events); **admin**
  (can lock events — affordance not seen in refreshed UI, see §6.3).
- **Config-dependence:** **medium** — the *mechanics* (the create flow, the flow into Plan,
  locking) are universal; what varies per instance is the **event type list + default
  colours** `[CONFIG]`, **group / sub-group structure** (e.g. national vs development squad),
  terminology/language, and which roles can do what.
- **Explored:** spec drafted 2026-06-15 from the **master reference §5.2** + existing page
  `en/plan/season-calendar.mdx`, then **live-verified 2026-06-15** in the running app
  (we.yarmill.com, group *National Team*, athlete *Simpson Lisa*) against the **refreshed
  Planner** by main agent. Several reference-based assumptions were corrected by the live
  pass (see §15). Genuinely-untested items remain `TODO(verify)`.
- **Render images now?** **NO** — shot list only. The Planner is mid-refresh; render once the
  new design lands.

## 1. Purpose & why it exists
The Season Calendar holds the season's **fixed points** — training camps, competitions,
testing days, vacations — on one year-long wall, so the whole season is legible at a glance.
Events added here **flow automatically into every Plan view on their dates**, so each week
and day always carries its context (you don't re-enter "we're at altitude camp" into the
weekly plan — it's already there, and locked).

Because **athletes can add their own events** too (a family holiday, an exam, a wedding), the
calendar doubles as a **coach↔athlete communication channel**: the coach sees what's coming
in an athlete's life before planning load against it.

## 2. Jobs to be done (per role)
- **Coach:**
  - When I set up a season, I want to lay down the camps, competitions, testing, and
    time-off in one place, so the whole plan is built around the real fixed points.
  - When I plan a week, I want camp/competition context to already be present in the Plan,
    so I never lose it or re-type it.
  - When different squads have different schedules, I want to target an event at a sub-group
    (e.g. national vs development), so each athlete only sees what applies to them.
- **Athlete:**
  - When I have a personal commitment (family holiday, exam), I want to put it on the
    calendar, so my coach plans around it instead of scheduling load I can't do.
  - When I look at the season, I want to see the camps and races coming, so I know what I'm
    building toward.
- **Admin:**
  - When an event is fixed and must not drift, I want to lock it, so it can't be changed by
    accident.

## 3. Personas & permissions
- **Coach:** full access — create / edit / delete events. The coach **scopes the wall via the
  GROUP panel** in the left sidebar (confirmed clean-coach pass 2026-06-15): a **group
  dropdown** ("National Team") → an **Entire Group** entry + the athlete list (Cihlář Adam, Em
  Krystof, Ká Ani, Kožnar Fanoušek, Kroczek Tomiš, Pé Tomáš, Simpson Lisa). Selecting **Entire
  Group** loads `/planner?group={id}`; selecting an athlete loads
  `/planner?group={id}&athlete={id}`.
- **Athlete:** can **add their own events** (e.g. a holiday). `TODO(verify)` exact athlete
  scope — whether an athlete can edit/delete coach-created events, and whether they see the
  whole group's events or only their own + team events. Master reference confirms athletes
  *add* their own events; edit/visibility scope not specified.
- **Admin:** the reference describes an admin **lock** to fix an event. **No lock toggle was
  observed** in the refreshed event popover or edit panel. `TODO(verify)` the lock affordance
  in the refreshed UI (possibly admin-only or changed in the refresh); and whether non-admin
  coaches can lock.
- `[CONFIG]` Which roles can create/target which groups depends on the instance's group
  structure and permission setup.

## 4. Key concepts & vocabulary
- **Event** — a dated block on the wall with a **type**, **title**, **start/end dates**,
  **location**, **attributes** (tags), and a **note**. (Note: the refreshed Add-event panel
  has **no participants field** — see below.)
- **Event types (7, per-instance `[CONFIG]`):** the live type picker (a **dark** list with a
  radio + colour dot) shows **7 types, each with a default colour**:
  | Type (label) | Internal key | Default colour |
  |--------------|--------------|----------------|
  | Competition event | `competitionEvent` | pink |
  | Competition | `competition` | red |
  | Training camp | `trainingCamp` | amber / yellow |
  | Training | `training` | purple |
  | Vacation | `vacation` | green |
  | Test | `test` | blue |
  | Other | `other` | cyan |
  Type drives the block's default colour so the wall reads at a glance. **The type list AND
  the colours are per-instance `[CONFIG]`** — the reference's generic "6 types" is wrong for
  this instance. The Add-event panel also has a **7-swatch colour palette** to recolour an
  event **independent of its type**, so colour is per-type default *and* recolourable.
- **Date range** — every event spans a start→end; on the wall it renders as a coloured block
  spanning those days, with a small **kicker** (the date range, e.g. "SAT 14 - TUE 17") above
  the **title**. Both date fields default to **today**, so the default is a single-day event.
- **Participants — not a field in the refreshed Add-event panel.** The reference's
  "participants: whole group / selected athletes / sub-group" is **not present** in the
  current UI. Instead, an event's scope follows the **current GROUP-panel selection** (Entire
  Group vs a specific athlete) at the time of creation — there is no in-panel participants
  control. `[CONFIG]` sub-group structure remains per instance.
- **Attributes (tags)** — an **ADD ATTRIBUTES** control (tag icon) opens a panel with a
  "Search attributes…" field listing per-instance configured tags (EMPTY in this demo). This
  is a **tag system, not participants**. `[CONFIG]` the attribute list is per instance.
- **Location** — an **ADD LOCATION** control (map-pin icon). `TODO(verify)` internals (map
  search vs free text); the reference mentions Google Maps search but the picker was not
  opened.
- **Locked event** — an event that can't be changed in place. Two senses: (1) events are
  **locked in the Plan** — they appear there read-only and are edited *only* back in the
  Season Calendar; (2) an **admin lock** can fix an event so it can't be changed at all (lock
  affordance not observed in the refreshed UI — see §3/§6.3).
- **Year selector** — a **combobox/dropdown** in the top bar showing the active year (e.g.
  **2026**); the wall shows that year's months. (Confirmed live: it is a dropdown, not a
  pill/arrows.)
- **Filter** — a **combobox/dropdown** in the top bar. `TODO(verify)` filter dimensions (by
  type? by athlete/sub-group? by status?) — the dropdown was not opened.
- **Events box / event sets** — a top-bar **clipboard-icon** button opening a **dark** panel
  with an **EVENTS SET** list of reusable, predefined **event collections** (demo: "Events
  calendar 2024"). A library of event sets you can pull onto the wall (e.g. an official
  competition calendar). (Resolves the old "clipboard button" mystery.)

## 5. Information architecture
- **Planner shell (light):**
  - **Header:** Yarmill logo + instance name (demo: *"Yarmillovníci"*) + user avatar.
  - **MENU sidebar (left):** Reality · Plan · Goals · **Planner** (active, light-blue
    highlight) · Settings.
  - **GROUP section (below MENU) — confirmed (clean-coach pass 2026-06-15):** a **group
    dropdown** ("National Team") → an **Entire Group** entry + the athlete list (Cihlář Adam,
    Em Krystof, Ká Ani, Kožnar Fanoušek, Kroczek Tomiš, Pé Tomáš, Simpson Lisa). **Entire
    Group** → `/planner?group={id}`; an athlete → `/planner?group={id}&athlete={id}`. This is
    how a coach scopes the wall. (The earlier "no GROUP panel" finding was a session-collision
    artifact — see §15.)
  - **Top bar (left → right):**
    - **Hide left panel** — collapses the MENU sidebar.
    - **New event (+)** — opens the dark Add-event panel (§6.2).
    - **Events box** — the clipboard-icon button; opens the dark "Events box" / event-sets
      panel (§4, §6.1).
    - centered title **"Planner"**.
    - **Year selector** — a combobox/dropdown showing the year (e.g. 2026).
    - **Filter** — a combobox/dropdown. `TODO(verify)` dimensions (not opened).
  - **Footer bar:** **Zoom out / Zoom in** (wall density) and **Scroll left / Scroll right**
    (move horizontally across months).
  - **Main canvas — the year wall:** **months as columns** (header e.g. "JANUARY 26" …
    "DECEMBER"), each column a **vertical list of day numbers** (rows, 1–31), some day numbers
    highlighted (weekends/today); events are **coloured blocks** spanning their day range,
    each with a **kicker** (date range) above the title.
- **Related modules:** the [Plan](/en/plan/plan) (events surface there per day/week, locked);
  [Goals](/en/plan/goals) and [Reality](/en/reality/training-log) share the *Planning* /
  daily structure. Plan and Planner are **slated to merge** (see §11).

## 6. Screen & UI inventory
> Per field: **label · type · default · validation · who-can-edit · auto-save?**

### 6.1 Year wall (main view)
- **Layout:** a horizontal year of **month columns** (header e.g. "JANUARY 26" … "DECEMBER");
  each column is a vertical list of **day numbers** (rows, 1–31), with some day numbers
  highlighted (weekends/today). Events render as **coloured blocks** spanning their date
  range, each with a small **kicker** (date range, e.g. "SAT 14 - TUE 17") above the **event
  title**. Block colour = event type default (recolourable).
- **Top bar controls (left → right):**
  - **Hide left panel** — collapses the MENU sidebar.
  - **New event (+)** — opens the **Add event** panel (§6.2).
  - **Events box** (clipboard icon) — opens the dark "Events box" / event-sets panel (§4).
  - centered title **"Planner"**.
  - **Year selector** — a combobox/dropdown showing the year (e.g. 2026). (Confirmed: a
    dropdown.)
  - **Filter** — a combobox/dropdown. `TODO(verify)` dimensions (not opened).
- **Footer bar:** **Zoom out / Zoom in** (wall density) · **Scroll left / Scroll right**
  (move across months).
- **States:**
  - **Empty:** a year with no events — bare month columns of day numbers. `TODO(verify)`
    whether an empty-state prompt is shown.
  - **Blank canvas:** with only `?group=` (no athlete/week) the route renders just the MENU
    sidebar and **no wall** — the wall requires the full param set (§0).
  - **Filled:** coloured blocks across months.
  - **Loading / error:** `TODO(verify)` — not observed.

### 6.2 Add event flow
Triggered by **New event (+)** in the top bar (coach) or by an athlete adding their own event.
The surface is a **DARK right-side panel titled "New event"** (NOT a modal). Fields,
top → bottom:
1. **TITLE** — `field: text (required)`. `TODO(verify)` max length.
2. **event type** — shows the current type (e.g. "COMPETITION EVENT") with a **▶ expander**
   to the **dark type list** (7 types with radio + colour dot, §4), plus the **7-swatch
   colour palette** to recolour the event independent of type. `field: select`.
3. **STARTS** — `field: date · default: today`.
4. **ENDS** — `field: date · default: today` → so the default is a **single-day** event.
   `validation: end ≥ start` `TODO(verify)`.
5. **LOCATION** — **"ADD LOCATION"** + a map-pin icon. `optional`. `TODO(verify)` picker
   internals (map search vs free text).
6. **ATTRIBUTES** — **"ADD ATTRIBUTES"** + tag icon → opens a panel with a "Search
   attributes…" field listing per-instance configured tags (EMPTY in this demo). A **tag
   system, NOT participants**. `optional · [CONFIG]`.
7. **NOTE** — **"Add note"**, `field: free text · optional` — logistics, agenda, links.
- bottom **CREATE EVENT** button.
- **There is NO participants field** in the refreshed Add-event panel (the reference's
  whole-group / selected-athletes / sub-group targeting is absent). Instead the event's scope
  follows the **current GROUP-panel selection** (Entire Group vs a specific athlete) at
  creation time — scope is set via the GROUP selection, not an in-panel participants control.
- **GOTCHA — create-on-open + auto-save:** simply **opening the New-event (+) panel
  auto-creates a draft event** on today's date (a block titled "New event") that
  **auto-saves** (a "✓ Saved" toast appears) **even without pressing CREATE EVENT** — the
  same create-on-open pattern as Medical/Goals. So merely opening the add flow and abandoning
  it **leaves a stray event** on the wall. The panel both has a CREATE EVENT button *and*
  auto-persists a draft on open. (Corrects the old guess of an explicit-Save-only modal.)
- **States:** empty form (with the stray draft already created) · partly filled · validation
  error (end before start) — exact copy `TODO(verify)`.

### 6.3 Event block / detail
- A placed event shows **kicker (date range) + title**, coloured by type.
- **Click an event block → a small popover:** title + date range (e.g. "📅 Mon,
  15/06/2026") + an **edit pencil**.
- **Edit pencil → the Edit event panel** — the **same DARK layout as New event** — with a
  **"Delete event" trash icon top-right** and a **SAVE** button.
- **Delete = confirm-required:** deleting an event triggers a **blocking confirmation prompt**
  (observed: the delete action blocks the page like a native confirm dialog).
- **Lock:** **no lock toggle was observed** in the refreshed popover or edit panel. The admin
  lock from the reference is kept as reference-described, but its UI affordance is
  `TODO(verify)` (possibly admin-only or changed in the refresh).

## 7. Actions & interactions
- **Add event:** **+** → (a draft is auto-created + auto-saved on open, see §6.2) → TITLE →
  type + colour → STARTS/ENDS → location → attributes → note → **CREATE EVENT**. Creates a
  block on the wall **and** a locked entry in the Plan on those dates.
- **Edit event:** click the block → popover → **edit pencil** → Edit event panel → change any
  field → **SAVE**. Edits propagate to the Plan (where the event stays read-only).
- **Scope an event:** **not a field in the panel** — the event's scope follows the **current
  GROUP-panel selection** (Entire Group vs a specific athlete) at creation time, not an
  in-panel participants control.
- **Athlete adds own event:** athlete creates an event (e.g. family holiday) visible to their
  coach. `TODO(verify)` whether it's visible to the whole group or only the coach.
- **Lock event (admin):** lock an event so it can't be changed. `TODO(verify)` the lock
  affordance — not observed in the refreshed UI (possibly admin-only or changed).
- **Delete event:** in the Edit event panel, the **trash icon top-right** → a **blocking
  confirmation prompt** → deletes (confirm-required).
- **Pull an event set:** **Events box** (clipboard) → pick an **EVENTS SET** (e.g. "Events
  calendar 2024") to pull a predefined collection onto the wall. `TODO(verify)` exact pull
  behaviour.
- **Filter / change year:** **Filter** dropdown narrows the wall; **Year selector** dropdown
  switches the displayed year. `TODO(verify)` filter dimensions.
- **Zoom / scroll:** footer **Zoom out / in** (wall density) and **Scroll left / right** (move
  across months).
- **Activity log:** `TODO(verify)` — unknown whether the Planner keeps a per-event change log
  like Medical/Goals. Do not assert.

## 8. User journeys / flows (per role)
**Coach — lay down a training camp (happy path):**
Open **Planner** → top-bar **+** (a draft is auto-created on open) → TITLE "Altitude camp —
Font Romeu" → type **Training camp** (amber) → STARTS/ENDS (e.g. 2026-07-06 → 2026-07-20) →
LOCATION (map-pin "Font-Romeu") → (optional ATTRIBUTES tags) → NOTE (travel + rooming) →
**CREATE EVENT**. The camp appears as an amber block across those July days, and shows up
**locked** in the Plan for that fortnight. (`TODO(verify)` how it's scoped to the national
squad now that participants is not a field.)

**Coach — set the season's competitions:**
Add a **Competition** (or **Competition event**) per race with its date range and location;
each surfaces in the Plan on its day, so the week's plan is read in race context.

**Athlete — add a personal event (happy path):**
*Simpson Lisa* opens **Planner** → **+** → TITLE "Family holiday" → type **Vacation** (green)
→ dates → (optional location) → **CREATE EVENT**. Her coach sees it on the same wall and
plans load around it.

**Admin — fix a key date:**
Open the event → **lock** it so the camp/competition can't be moved by accident.
`TODO(verify)` exact steps.

## 9. Use cases / scenarios
- **Season scaffolding:** a coach blocks out the year's camps, competitions, and testing days
  first, then builds weekly Plan detail around those fixed points.
- **Two squads, one calendar:** a national squad and a development squad share an instance;
  the coach targets each camp/competition at the right **sub-group**, so each athlete sees
  only relevant events.
- **Context that travels:** during a camp fortnight, the Plan's weekly view already carries
  the "Altitude camp" block — no re-entry, no lost context.
- **Athlete-driven communication:** an athlete logs a wedding / exam / holiday; the coach
  spots it ahead of planning and avoids scheduling a hard block on those days.
- **Protecting fixed points:** an admin locks the national championships event so it can't be
  edited as the plan churns week to week.

## 10. Configuration & variants
- `[CONFIG]` **Event types + default colours** — the live list is **7 typed** (Competition
  event · Competition · Training camp · Training · Vacation · Test · Other) with per-type
  default colours; both the list and colours are **per instance** (this instance ≠ the
  reference's generic 6).
- `[CONFIG]` **Attributes (tags)** — the per-event attribute list is per instance.
- `[CONFIG]` **Group / sub-group structure** (e.g. national vs development squad) — per
  instance. (How it drives event scoping now is `TODO(verify)` — no participants field.)
- `[CONFIG]` **Terminology / language** — module shows as "Planner" / **Termínovka**; event
  type labels follow the instance language.
- `[CONFIG]` **Role permissions** — who can create and lock.
- **Universal (not configurable):** the **create flow shape** (title → type/colour → dates →
  location → attributes → note), events **flowing into the Plan locked**, and the **admin
  lock** concept. (The event-type *list* is NOT universal — see `[CONFIG]` above.)

## 11. Edge cases, limits, gotchas
- **Events are read-only in the Plan** — a common gotcha: you can't edit an event from the
  Plan; you must go back to the Season Calendar. (This is the "locked in Plan" sense, distinct
  from the admin lock.)
- **Admin-locked events** can't be changed at all until unlocked. (Lock affordance not
  observed in the refreshed UI — see §3/§6.3.)
- **GOTCHA — opening + abandoning the add flow leaves a stray event:** opening the New-event
  (+) panel **auto-creates and auto-saves** a draft event on today's date, even if you never
  press CREATE EVENT (same create-on-open pattern as Medical/Goals). See §6.2.
- **Stability caveat — design refresh + merge [ROADMAP]:** the Planner is on Yarmill's
  **newer design and is being actively refreshed**, and **Plan and Planner are slated to
  merge** over time. Even though this spec was live-verified against the refreshed UI on
  2026-06-15, exact controls, chrome, and screens are still likely to change — treat all UI
  specifics here as **provisional** and re-verify before publishing imagery. The *core
  mechanics* (create flow, flow-into-Plan, the locking concept) are stable; the **event-type
  list/colours are per-instance `[CONFIG]`**, not universal.
- `TODO(verify)` mobile/app behaviour (apps are athlete-only and limited).
- `TODO(verify)` overlapping events on the same days — stacking/rendering behaviour.
- `TODO(verify)` empty / loading / error states.

## 12. Cross-module integration & data flow
- **→ Plan (primary):** every event flows into **all Plan views** (Top-down, Goals/4-week,
  Week, Annual) on its dates and is **locked** there — the Season Calendar is the single
  source of truth for events. (Master reference §5.1 confirms calendar events auto-appear in
  the Plan and are edited only in the calendar.)
- **↔ Group / athlete model:** participant targeting uses the instance's groups/sub-groups.
- **(coach↔athlete comms):** athlete-added events feed the coach's planning view.
- `TODO(verify)` whether events surface in **Reality**, **Attendance**, or **Analytics** (no
  reference confirmation — do not assert a link).

## 13. Shot list (images for the docs page)
> **All shots: render later (Planner mid-refresh).** Live nav uses
> `/planner?group={id}&athlete={id}&week={yyyy-mm-dd}` (the wall needs the full param set).
> Add-event panel, type picker, and Events box are **DARK** surfaces.

| # | Shot | Live nav (`/planner?group=&athlete=&week=`) | State | Crop type | Caption (draft) | Callouts | Post-process | Priority |
|---|------|---------------------------------------------|-------|-----------|-----------------|----------|--------------|----------|
| 1 | Year wall — filled | full param set; National Team / Simpson Lisa | Season with a July **Training camp** (amber) block, autumn **Competition** (red) blocks, a **Test** (blue) day, a **Vacation** (green) block incl. Lisa's "Family holiday" | full-window (year wall) | "The Planner lays the whole season on one wall — months across, days down. Each coloured block is an event, with its dates and title." | "month columns" → headers · "day rows" → numbers · "event block (date kicker + title)" → a block · "year selector" → dropdown · "filter" → dropdown · "zoom / scroll" → footer | full-window; light Planner shell; no fade | high |
| 2 | Add event panel (dark) | full param set; **+** open | New event panel: TITLE "Altitude camp — Font Romeu" · type Training camp (amber) · STARTS/ENDS 06–20 Jul · ADD LOCATION · ADD ATTRIBUTES · NOTE · CREATE EVENT | modal/popover (dark panel) | "Add an event: title, type and colour, the dates, a location, tags and a note — then create." | "type + colour" → type row · "date range" → STARTS/ENDS · "location" → ADD LOCATION · "attributes (tags)" → ADD ATTRIBUTES · "✓ Saved on open" → toast | modal/popover; DARK panel; self-contained; note the create-on-open auto-save | high |
| 3 | Type picker + colour palette (dark) | full param set; **+** → type ▶ expander | Dark type list (7 types: radio + colour dot) + the 7-swatch colour palette | modal/popover (dark) | "Seven event types, each with a default colour — and you can recolour any event." | "7 types (per-team)" → list · "default colour" → a dot · "recolour palette" → swatches | modal/popover; DARK; self-contained | medium |
| 4 | Events box / event sets (dark) | full param set; **Events box** (clipboard) open | Events box panel: EVENTS SET list (e.g. "Events calendar 2024") | modal/popover (dark) | "Pull a ready-made event set — like an official competition calendar — straight onto the wall." | "event sets" → EVENTS SET list | modal/popover; DARK; self-contained | medium |
| 5 | Event surfacing in the Plan (locked) | Plan week view on the camp dates | The camp block read-only in the Plan's week view | full-window | "Events flow into the Plan on their dates — and are locked there. Edit them back in the Planner." | "locked event in the Plan" → the block | full-window; Plan shell; no fade | medium |
| 6 | Athlete adds own event | full param set; athlete role, Simpson Lisa | Lisa's New event panel: "Family holiday", type Vacation (green) | modal/popover (dark) | "Athletes can add their own events, so the calendar is also how you tell your coach what's coming." | "your own event" → TITLE/type | modal/popover; DARK; self-contained | low |

## 14. Open questions / TODO(verify)
> Resolved by the 2026-06-15 live pass and moved into the body: clipboard button (= Events
> box / event sets), year selector (= dropdown), Add-event surface (dark right panel),
> create-on-open + auto-save, type → colour mapping (7 types, per-type defaults +
> recolourable palette), edit/delete surface (popover → edit pencil → dark panel; trash +
> blocking confirm). Genuinely-untested items remain below.

- **Filter dimensions** (the dropdown was not opened).
- **Admin lock affordance** in the refreshed UI — not observed; possibly admin-only or
  changed. Whether non-admin coaches can lock.
- **Location picker internals** — map search vs free text (ADD LOCATION not opened).
- **Participant/sub-group scoping** — an event's scope follows the GROUP-panel selection
  (Entire Group vs a specific athlete) at creation; finer sub-group targeting within a group
  is `TODO(verify)`.
- **Athlete scope** — can athletes edit/delete coach events; do they see whole-group events or
  only own + team; visibility of athlete-added events to the group vs coach only.
- **Native app parity; mobile rendering of the wall.**
- **Overlapping events** on the same days — stacking/rendering behaviour.
- **Empty / loading / error states.**
- **Events-into-Plan-locked flow** — not re-tested live this pass (reference-asserted only).
- **Activity log** — whether the Planner keeps a per-event change log like Medical/Goals.
- **Cross-module:** any link beyond Plan (Reality/Attendance/Analytics) — unconfirmed.

## 15. Source log
- **Clean-coach re-verification 2026-06-15** (we.yarmill.com, coach login *Bart Simpson*,
  group *National Team*) — **corrected a session-collision artifact** from the earlier pass:
  an athlete session had contaminated the coach view, producing the wrong "there is NO GROUP
  section / coach scoping is TODO" finding. In a clean coach session the **Planner's left
  sidebar has a GROUP section below MENU** — a group dropdown ("National Team") → an **Entire
  Group** entry + the athlete list (Cihlář Adam, Em Krystof, Ká Ani, Kožnar Fanoušek, Kroczek
  Tomiš, Pé Tomáš, Simpson Lisa). Selecting **Entire Group** → `/planner?group={id}`; an
  athlete → `/planner?group={id}&athlete={id}`. The **GROUP-panel finding is restored** (§3,
  §5, §6.1) and the coach-scoping TODO is resolved. An event's **scope follows the GROUP-panel
  selection** (no in-panel participants control). All other refreshed-Planner findings stand
  unchanged: year wall, 7 types + colours, dark Add-event panel, Events box, create-on-open
  gotcha, delete-with-blocking-confirm, and **no lock toggle seen**.
- **Live verification 2026-06-15** (we.yarmill.com, group *National Team*, athlete *Simpson
  Lisa*, **refreshed Planner**) — **high confidence (observed live):** route `/planner` + the
  full-param-set requirement; light Planner shell (header, MENU sidebar, **and a GROUP panel
  below MENU** — group dropdown → Entire Group + athlete list, restored this pass; see the
  clean-coach note below);
  top bar (Hide left panel · New event · Events box · year selector dropdown · filter
  dropdown); footer (zoom / scroll); year-wall layout (months as columns, day rows, kicker +
  title blocks); **7 event types with per-type default colours + recolour palette** (internal
  keys competitionEvent/competition/trainingCamp/training/vacation/test/other); the **dark
  New-event panel** fields (TITLE, type/colour, STARTS, ENDS default-today, LOCATION,
  ATTRIBUTES tags, NOTE, CREATE EVENT) with **no participants field**; **create-on-open +
  auto-save** ("✓ Saved" toast); event popover → edit pencil → dark Edit panel with trash +
  **blocking delete confirm**; **Events box / EVENTS SET** library. **No lock toggle
  observed.**
- **Master reference §5.2** (Season Calendar / Termínovka / Planner): per-event fields,
  athletes add own events, flow into Plan, communication channel — **high confidence
  (reference-backed)**, but **corrected by the live pass:** the generic "6 event types" is
  wrong for this instance (it's 7, `[CONFIG]`), and the "participants whole-group/chosen"
  field is **absent** in the refreshed UI.
- **Master reference §5.1 + §4 + §2**: events auto-appear in Plan and are locked there; Plan +
  Planner slated to merge; "Planner" naming, route framing, dual-UI caveat — **high
  confidence** (events-into-Plan-locked not re-tested live this pass).
- **Not observed (→ §14):** filter dimensions, lock affordance, location picker internals,
  finer sub-group scoping within a group, athlete scope, app parity, overlapping-event
  stacking, empty/loading/error states.
- **Existing page** `en/plan/season-calendar.mdx` corroborates the create flow and
  flow-into-Plan, and already carries the design-refresh `<Info>` caveat — **update its event
  types (7, recolourable) and drop any participants-field claim** when the page is revised.

## 16. Docs page plan
- **Audience line:** `**For:** coaches and athletes · **Where:** Web app`
- **Proposed page outline** (H2s → spec sections):
  | Page section (H2) | Fed by | Image (render later) |
  |-------------------|--------|----------------------|
  | intro + audience line + `<Info>` design-refresh/merge caveat | §1, §0, §11 | — |
  | Event types (7, per-team, recolourable) | §4 | shot 3 |
  | The year wall | §5, §6.1 | shot 1 |
  | Add an event — `<Steps>` (note create-on-open auto-save) | §6.2, §7, §8 | shot 2 |
  | Event sets (Events box) | §4, §6.1, §7 | shot 4 |
  | How events reach the Plan (locked) | §11, §12 | shot 5 |
  | What athletes can do | §3, §8 | shot 6 |
  | Locking an event (caveat: affordance unverified in refresh) | §4, §7 | — |
- **Cross-links:** `/en/plan/plan` (events surface/locked there) · `/en/plan/goals` ·
  `/en/reality/training-log` (Planning/Journal neighbours).
- **UI label → doc term:**
  | UI label | Doc term |
  |----------|----------|
  | Planner | Season Calendar (a.k.a. Planner) |
  | Termínovka | (Czech UI label — not surfaced in EN docs) |
  | Vacation | time off |
  | Competition event / Competition | competition |
  | Events box / EVENTS SET | event set |
  | (admin) lock | locked event |
