# Module Spec: Plan — internal

> Internal specification. NOT published (excluded via `.mintignore`). Source for the
> user-facing docs page + image plan. Fill every section; leave `TODO(verify)` where unsure.

## 0. Meta
- **Module:** Plan (Czech UI term **Plán**)
- **Route(s):** **Week view = `/plan/week`** (default landing) · **Annual plan view = `/plan/season`** (verified live 2026-06-15) · **Goals** and **Top-down** are in-page tab toggles (exact slugs not separately captured — minor; not a blocking TODO)
- **Nav path:** classic top-nav → **PLAN**; left sidebar lists the **group + athletes** (group dropdown → Entire Group + athlete list)
- **UI shell:** **classic light top-nav** (top nav: REALITY · PLAN · ANALYTICS · ATTENDANCE · FILES · OTHER · SETTINGS; left sidebar = group + athletes; primary action buttons are **magenta**)
- **Surfaces:** web (PWA); iOS has a **home-screen widget** for the training plan (athletes read the plan; planning is web/coach)
- **Primary roles:** **coach** (owns the Plan); athlete reads it (can't edit); admin sets up fields/groups
- **Config-dependence:** **medium–high** — training phases (left side), data rows (right side), and terminology are configured per instance; the *mechanics* (four views, left/right sides, Copy plan, sandbox, calendar events) are universal
- **Explored:** 2026-06-15 · instance/group *National Team* (biathlon demo, 7 athletes) · coach *Bart* · athlete *Simpson Lisa* · live pass folded in below (routes, week nav, all four views, Copy plan dialog, roster all observed live 2026-06-15)
- **Render images now?** **NO** (classic light top-nav UI — shot list only; render later)

## 1. Purpose & why it exists
The Plan is where the coach decides what training should happen — from the shape of the
whole season down to a single Tuesday-morning session — and publishes it to athletes when
it's ready. Coaches own the Plan; athletes own Reality. It is built **top-down**: the same
season is available at four zoom levels, so a coach can set season-level intentions and then
descend to day-by-day detail without leaving the module. Planning happens privately on the
group first (a sandbox), then publishes in one action — so coaches can sketch freely and
release only finished weeks.

## 2. Jobs to be done (per role)
- **Coach:**
  - When I start a season, I want to lay out its structure top-down (mesocycles, weeks,
    days, themes), so the year has a shape before I plan any single session.
  - When I plan the upcoming week, I want to write each day's text and numbers in detail,
    so athletes know exactly what to do and the weekly totals add up.
  - When a week is ready, I want to publish it to the right athletes in one action, so my
    private draft becomes their plan without exposing unfinished days.
  - When an athlete needs something different, I want to individualize their week, so I can
    tailor load or activities without touching everyone else's plan.
- **Athlete:**
  - When I open my plan, I want to see what my coach intends for each day (with any camp or
    race in context), so I know what to train — even from my phone.
- **Admin / staff:**
  - When we onboard, I want to configure the left-side phases and right-side data rows, so
    the Plan matches how this team actually trains and reports.

## 3. Personas & permissions
- **Coach:** full access — sees assigned **groups**; plans and edits training at group and
  individual level; publishes via **Copy plan**; switches all four views. Planning on
  **Entire Group** is private to the coach until published.
- **Athlete:** **read-only** on the plan — sees but can't edit it; sees **only their own**
  data (no group selector / athlete list / group overview). Reads on web/PWA and via the iOS
  home-screen widget. An athlete copies a planned day into their diary via **Import plan** in
  Reality (a Reality-side action; `[CONFIG]` on/off) — not an edit to the Plan itself.
- **Admin:** configures the left-side fields (phases) and right-side rows, groups, and
  permissions during setup; does not plan training day-to-day.
- **Self-coached athlete:** holds a **coach account**, so they write their own plan and
  reality.
- `[CONFIG]` Which coaches can plan which groups/athletes is permission- and group-driven;
  multiple coaches can share an athlete (e.g. shooting + conditioning coach).
- **Verified roster (National Team, coach Bart, 7 athletes; live 2026-06-15):** Cihlář Adam ·
  Em Krystof · Ká Ani · Kožnar Fanoušek · Kroczek Tomiš · Pé Tomáš · Simpson Lisa.

## 4. Key concepts & vocabulary
- **The four views** (verified EN labels): **Week · Goals · Top-down · Annual plan** —
  the same season at four zoom levels, switched at the top of the page.
- **Left side / right side** — the central concept across Plan and Reality:
  - **Left (text) side** = structured description in the coach's own words (methodology,
    notes, internal codes). Supports formatting: bullets, colours/highlight, emojis,
    links. In Week view the left side is split into **training phases** (e.g. *daily goal*,
    *morning*, *afternoon*; or early-morning/morning/afternoon; or sport + S&C) — `[CONFIG]`
    phase labels are configured per team.
  - **Right (data) side** = numeric values (minutes, km, reps, load, intensity zones,
    shots…). Some rows are **auto-calculated and locked/greyed** (sums); a weekly **Total**
    column sums the week.
- **Three versions of data** (all comparable; the **Season review / RTC** shows them side
  by side):
  1. **Annual plan** — the season-start intention; totals entered by **mesocycle/month**.
  2. **Plan** — the operational plan, built week-to-week/day-to-day.
  3. **Reality** — what the athlete actually did (a separate module).
- **Mesocycle / Microcycle (Week) / Day** — the three nested columns of the Top-down view,
  each holding a **theme / main goal** (Czech *motiv*).
- **Entire Group (sandbox)** — planning on the whole group is the coach's **private**
  workspace; athletes see nothing until **Copy plan** publishes it.
- **Copy plan / Copy goals** — the publish/copy action (magenta button, top right): copies a
  week from the group sandbox to athletes (or to another group / another week). **The label
  varies by view** (verified live 2026-06-15): **"Copy plan"** in **Week** and **Annual plan**
  views; **"Copy goals"** in **Goals** and **Top-down** views. Same publish mechanism either way.
- **Events** — camps, races, testing days etc. from the **Season Calendar**; they
  **auto-appear** on their dates in Plan views and are **locked** (edited only in the
  calendar).
- **Czech UI note:** the demo instance's configured field/row labels are often Czech
  (e.g. *Plán*, *motiv*, right-side rows like *DZ / JZ / Volno*) — `[CONFIG]`, flag when
  documenting a specific instance.

## 5. Information architecture
- **Classic top-nav shell:** top nav **REALITY · PLAN · ANALYTICS · ATTENDANCE · FILES ·
  OTHER · SETTINGS**; **PLAN** active. Left sidebar lists the **group** (group dropdown →
  **Entire Group** + the athlete list) — coach only; athletes have no sidebar group/athlete
  switcher.
- **Default route:** `/plan/week` — opens on the Week view. **Annual plan view = `/plan/season`**
  (verified). **Goals** and **Top-down** are in-page tab toggles (exact slugs not captured).
- **Four in-page views** switched at the top of the page: **Week · Goals · Top-down ·
  Annual plan**.
- **Top-right action area:** **Copy plan** (magenta) + an **export/print** control next to it.
- **Related modules around it:** **Season Calendar** (events feed in — `/en/plan/season-calendar`),
  **Goals** (objectives module — `/en/plan/goals`; distinct from the *Goals* plan view),
  **Reality** (`/en/reality/training-log`; athletes log against the plan, Import plan),
  **Season review / RTC** (compares annual plan / plan / reality), **Analytics**
  (`/en/analytics/analytics`; plan-vs-reality and load forecasts).

## 6. Screen & UI inventory
> Per field: **label · type · default · validation · who-can-edit · auto-save?**
> Per screen: states — **empty / loading / filled / error**, plus overlays/modals/menus.

### 6.1 Week view (default; `/plan/week`)
- **Layout:** the working view. **Left column** = stacked **day cards**; each card's **text
  side** is divided into the configured **training phases** (e.g. *daily goal*, *morning*,
  *afternoon*). **Right column** = a **weekly data grid** for the whole week: rows are the
  configured data fields (e.g. load days, sessions, recovery, gym, running intensity zones
  **I1/I2/I3**, distance), columns **Mon–Sun + Total**.
- **Controls:** **week navigation = prev/next chevrons + a date-range pill** (e.g.
  "15/06 – 21/06/2026") — verified live · the four-view switcher (top) · **Copy plan**
  (magenta, top right) · **export/print** (next to Copy plan) · group/athlete selection in the
  left sidebar.
- **Fields:**
  - **Phase text fields (left)** — `type: rich text · default empty · who-can-edit: coach
    (group sandbox or individual) · auto-save: yes`. Labels per `[CONFIG]`.
  - **Data grid cells (right)** — `type: numeric · default empty · who-can-edit: coach ·
    auto-save: yes`. Units per row `[CONFIG]`.
  - **Auto-calculated rows / Total column** — `type: derived · locked/greyed · not editable`
    (sums computed by Yarmill).
- **States:** empty (blank phases + empty grid) · filled · `TODO(verify)` loading and error
  states · events from the Season Calendar render on their day and are **locked**.

### 6.2 Goals view (plan view — 4 weeks side by side)
- **Layout (verified live 2026-06-15):** **four consecutive weeks side by side**. Left **row
  labels** = **Cycle goal**, **Weekly goal**, then **Monday … Sunday** (each day row carries its
  day-of-month number). Each cell is a **text field**.
- **Events:** **Season Calendar events appear as colored chips on their day and are LOCKED here**
  (observed: a green **"Adr"** event and a pink/purple **"New event"**).
- **Publish button:** in this view the publish button is labelled **"Copy goals"** (not "Copy plan").
- **Purpose:** mesocycle-level comparison; not a separate data set — a different lens on the
  same plan.
- `TODO(verify)` exactly how the four-week window moves (which four weeks, prev/next stepping).
- **Note:** this is the **Goals plan view**, distinct from the **Goals module** (`/en/plan/goals`).

### 6.3 Top-down view (whole season)
- **Layout (verified live 2026-06-15):** the whole season in **three columns**:
  - **Mesocycles** — numbered **I.–XIII.**, each with a **start date**.
  - **Microcycles (Weeks)** — numbered **1 … N**, each **dated**.
  - **Days** — **Mon … Sun**, each **dated**.
  Each cell is a **free-text theme / main-goal field**.
- **Controls:** a **⚙ settings button** (configure the cycle structure) · a **year selector** ·
  publish button labelled **"Copy goals"**.
- **Use:** start here at season start; give each meso/week/day a theme. Coaches use free
  text, colours, emojis.
- **Events:** Season Calendar events **auto-appear** here and are **locked** (edited only in
  the calendar).
- `TODO(verify)` exact per-cell controls (colour/emoji pickers, expand/collapse) beyond the
  free-text field.

### 6.4 Annual plan view (`/plan/season`)
- **Layout (verified live 2026-06-15):** a **grid**. **Rows = the team's configured data fields**
  (observed, Czech demo: *Dny zatížení, Jednotky zatížení, Soucet pater test, Patra, Dny nemoci,
  Dny ZO, Volno, Regenerace [aktivní / pasivní], Závody, Hod. zatížení [Posilovna/síla, Váha],
  Běh [I1/I2/I3/KM], Kolo […]*). **Columns = January … December + Total.** Has a **year selector**.
  `[CONFIG]` the row set is per instance.
- **Publish button:** labelled **"Copy plan"** (same as Week view).
- **Use:** the season-start intention; the figures the **Season review / RTC** later compares
  plan and reality against.
- `TODO(verify)` which figures are derived vs manually entered (the **Total** column is presumed
  derived).

### 6.5 Copy plan dialog (publish/copy)
- **Trigger:** **Copy plan** (magenta, top right). Modal overlay.
- **Heading (verified live 2026-06-15):** **"Copy plan &lt;Group&gt; to [destination ▾]"** with a
  **Close (X)**.
- **Fields (verified live 2026-06-15):**
  - **Destination** — `dropdown`; **default "athletes in group"**; reference also lists
    **"other group"** / **"another week"**. `TODO(verify)` full destination option list.
  - **Select source days** — a **per-day toggle row** (Mon … Sun, each a **dot**; **all on by
    default**) — choose which days to copy (e.g. hold back unfinished Fri–Sun).
  - **copy the weekly goal** — `checkbox`, **on by default**.
  - **Select athletes** — **per-athlete checkbox list** + a **"Clear selection"** link.
  - **Confirm** — a confirm button **below the fold** of the dialog.
- **States:** open · selection made · confirmed (athletes now see the week).
- `TODO(verify)` validation (minimum one day / one athlete?), confirmation/success message,
  whether overwriting an athlete's existing day warns.

### 6.6 Export / print control
- **Trigger:** the export/print control **next to Copy plan**.
- **Behaviour (from reference, not yet re-observed):** print/export to PDF; **left side and
  right side separately**; layout (columns vs vertical), font size, include/exclude week
  goal; remembers settings. Left side commonly printed for noticeboards.
- `TODO(verify)` the exact menu options live (left/right toggle, layout, PDF settings).

## 7. Actions & interactions
- **Edit a day (left text / right numbers):** type into a phase field or grid cell; **auto-saves**
  (no Save button) — same auto-save behaviour as Reality (green "data saved" indicator
  expected) `TODO(verify)` the indicator in Plan specifically.
- **Switch view:** Week / Goals / Top-down / Annual plan — top-of-page switcher; same season,
  different zoom.
- **Plan on Entire Group (sandbox):** select **Entire Group**, edit the week — changes are
  **private to the coach** (athletes see nothing) until published.
- **Copy plan (publish):** **Copy plan** → dialog (destination · source days · copy weekly
  goal · athletes) → confirm. Athletes then see the week. Also copies group→other group and
  →another week.
- **Individualize:** select a single athlete, edit their week — changes **only their** plan
  and are **visible to them immediately** (no publish needed). From an individual you can also
  **Copy plan** *up* to the group or to specific other athletes.
- **Export / print:** export control next to Copy plan (left/right side, PDF).
- **Events are read-only here:** calendar events appear on their dates and are locked; edit
  them in the **Season Calendar**.
- **No Activity log:** verified live 2026-06-15 — **Plan shows no per-change Activity log**
  (unlike Medical / Goals); cells simply **auto-save**. (The exact auto-save indicator in Plan
  is still `TODO(verify)`.)

## 8. User journeys / flows (per role)
- **Coach — shape the season (Top-down):** PLAN → **Top-down** → set themes/main goals on
  mesocycles, then weeks, then days; calendar events are already in place and locked.
- **Coach — plan and publish a week (observed pattern):** select **Entire Group** → **Week**
  view → write each day (left text per phase, right numbers) → totals auto-calc → **Copy plan**
  → destination *athletes in group* → pick **source days** (exclude unfinished Fri–Sun) →
  decide **copy the weekly goal** → **select athletes** → confirm. Athletes now see the week.
- **Coach — individualize after publishing:** select **Simpson Lisa** → edit her week (adjust
  load/activities/days) → changes are hers only and visible to her immediately; optionally
  **Copy plan** her week up to the group or to teammates.
- **Coach — compare across a mesocycle:** **Goals** view → four weeks side by side → compare
  the same weekdays.
- **Athlete — read the plan:** open Plan (web/PWA) or the iOS widget → read each day with any
  camp/race shown in context → optionally **Import plan** in Reality to start the day's diary
  from the plan.

## 9. Use cases / scenarios
- **Season kickoff:** at season start the coach lays out the year in **Top-down** — meso
  themes, weekly motives, key days — before planning a single session.
- **Weekly planning cadence:** the coach plans the next 1–2 weeks (commonly Fri–Sun) on the
  group, then publishes the finished days with **Copy plan**, holding back days still in flux.
- **Individualizing for an athlete:** after publishing, the coach reduces load for *Simpson
  Lisa* coming back from illness — editing only her week; she sees it immediately.
- **Cross-group reuse:** a base week built for the National Team is copied to a B-cadre group
  via **Copy plan → other group**.
- **Noticeboard print:** the coach exports the **left side** of the week to PDF for the camp
  noticeboard.
- **Plan vs reality at season end:** the **Annual plan** entered in autumn feeds the **Season
  review / RTC**, which lays annual plan / plan / reality side by side with season totals.

## 10. Configuration & variants
- `[CONFIG]` **Left-side phases** — the training-phase labels per day (e.g. *daily goal /
  morning / afternoon*, or early-morning/morning/afternoon, or sport + S&C).
- `[CONFIG]` **Right-side rows** — which data fields exist, their units, colour, intensity
  sub-rows (e.g. I1/I2/I3), and which rows are **calculated/locked** (sums). A generic
  multi-sport baseline includes loading days, sessions, day off, illness/injury, health
  restriction, competition, recovery (active/passive), and total hours by component.
- `[CONFIG]` **Terminology / language** — labels are per-instance and often Czech in the demo.
- `[CONFIG]` **Import plan** (on the Reality side) on/off + days-back limit — affects how
  athletes consume the plan.
- **Universal mechanics (not configurable):** the four views; left/right sides; the
  group sandbox + **Copy plan** publish model; immediate visibility of individual edits;
  calendar events auto-appearing and locked; the three data versions (annual plan / plan /
  reality).

## 11. Edge cases, limits, gotchas
- **Sandbox invisibility:** group-level planning is invisible to athletes until **Copy plan** —
  easy to assume athletes can already see a week that hasn't been published.
- **Individual edits are instant:** editing one athlete's plan needs no publish and is visible
  to them immediately — the opposite of the group sandbox.
- **Calendar events are locked in Plan:** they can only be changed in the Season Calendar.
- **Auto-calculated rows are locked/greyed** and can't be typed into.
- **Right-side numbers are manual:** even with watch integrations, plan numbers are entered by
  the coach (analytics still compute time-in-zone etc. from watch data on the Reality side).
- **Mobile:** athletes read the plan (PWA / iOS widget); planning is a web/coach activity.
- `TODO(verify)` empty/loading/error states; backfill or future-week limits on planning, if any.

## 12. Cross-module integration & data flow
- **← Season Calendar:** events (camps, races, testing, holidays) flow into every Plan view on
  their dates and are locked here (edit in the calendar). See `/en/plan/season-calendar`.
- **→ Reality:** the plan is the reference athletes log against; **Import plan** copies a
  planned day into the diary (`[CONFIG]`). See `/en/reality/training-log`.
- **→ Season review / RTC:** annual plan / plan / reality are laid side by side with season
  totals (exportable XLS/PDF).
- **→ Analytics:** plan-vs-reality trends and the **Training Load** forecast use the planned
  week (dashed line = plan, solid = reality). See `/en/analytics/analytics`.
- **Goals module** (`/en/plan/goals`) is adjacent (season objectives) but distinct from the
  *Goals* plan view.

## 13. Shot list (executable visual-todo — for the screenshot skill)
> Classic light top-nav UI → **Plan is CLASSIC**, so use **full-window** crops for the four
> views and **modal** for the Copy plan dialog. All shots are **lower priority — render after the
> screenshot skill is polished**. Cast: biathlon *National Team* (coach **Bart**, 7 athletes),
> athlete *Simpson Lisa*. Each row is self-contained: navigate live → set the State → crop → caption
> → callouts → post-process.

| # | Shot | Live nav | State | Crop type | Caption draft | Callouts (label → element) | Post-process | Priority |
|---|------|----------|-------|-----------|---------------|----------------------------|--------------|----------|
| 1 | Week view | tab coach **Bart** → **PLAN** → **Week** (`/plan/week`); **Entire Group**; step to a **week with data** | A filled National Team week: left day cards with phase text (morning/afternoon); right grid with load days, sessions, I1/I2/I3, distance + Total; date-range pill set | full-window | "The Week view: each day's text on the left, the week's numbers on the right, totals auto-calculated." | Text side → a left day card · Data grid → right grid · Total → Total column · Publish → Copy plan button · Week nav → date-range pill | clean brand backdrop; even framing; fade only on cut edges | later — classic UI, lower priority; render after skill polish |
| 2 | Goals view (4 weeks) | PLAN → **Goals** tab; Entire Group; a mesocycle with goals filled | Four consecutive weeks side by side; left labels Cycle goal / Weekly goal / Mon–Sun; a green "Adr" + a "New event" chip locked on their days | full-window | "The Goals view lines up four weeks so you can compare the same days across a mesocycle." | Row labels → Cycle/Weekly goal rows · Locked event → an event chip · Publish → Copy goals button | clean backdrop; framing; fade only on cut edges | later — classic UI, lower priority; render after skill polish |
| 3 | Top-down view | PLAN → **Top-down** tab; year selected | Three columns: Mesocycles I.–XIII. (dated), Microcycles/Weeks (dated), Days Mon–Sun (dated); themes typed in cells; a locked camp/race | full-window | "Top-down: the whole season in three columns — Mesocycles, Weeks, Days — each with a theme." | Three columns → the column headers · Cycle structure → ⚙ settings button · Publish → Copy goals button | clean backdrop; framing; fade only on cut edges | later — classic UI, lower priority; render after skill polish |
| 4 | Annual plan view | PLAN → **Annual plan** (`/plan/season`); year selected | Grid: rows = configured data fields (Dny zatížení, Běh I1/I2/I3/KM, …); columns Jan–Dec + Total; values entered | full-window | "The Annual plan: the season-start intention the Season review later checks against." | Data-field rows → left row labels · Months → column headers · Total → Total column | clean backdrop; framing; fade only on cut edges | later — classic UI, lower priority; render after skill polish |
| 5 | Copy plan dialog | PLAN → Week → Entire Group → click **Copy plan** | Modal open; heading "Copy plan National Team to [athletes in group ▾]"; source-day dots all on (or Fri–Sun off); copy weekly goal checked; a few athletes ticked | modal | "Copy plan publishes a week: choose the destination, which days, the weekly goal, and which athletes." | Destination → dropdown · Source days → per-day dot row · Weekly goal → checkbox · Recipients → athlete checkbox list | crop to modal; soft drop shadow on the modal; clean backdrop behind | later — classic UI, lower priority; render after skill polish |
| 6 | Individual athlete week | PLAN → select **Simpson Lisa** → Week view | Her individualized week (reduced load vs the group week) | full-window | "Edit one athlete's week and only their plan changes — visible to them immediately." | Individual → athlete name in sidebar · Changed cells → an adjusted row | clean backdrop; framing; fade only on cut edges | later — classic UI, lower priority; render after skill polish |

## 14. Open questions / TODO(verify)
> Resolved live 2026-06-15 and moved into the body: per-view routes (Week `/plan/week`,
> Annual plan `/plan/season`; Goals/Top-down are in-page tabs), Week nav (chevrons + date-range
> pill), Goals-view layout, Top-down columns + ⚙/year selector, Annual-plan grid, Copy plan
> dialog details, publish-label variance, the roster, and **no Activity log** in Plan.

- Exact **auto-save indicator** in Plan (green "data saved" confirmed in Reality; not re-observed here).
- **Export/print** menu options live (left/right toggle, columns vs vertical, font size, PDF) — not opened.
- Empty / loading / error **states**; any future-week or backfill limits on planning.
- **Copy plan** **destination-dropdown** full option list confirmation; validation (min one day /
  one athlete?), success/confirmation message, and overwrite-warning behaviour.
- **Goals view** — exactly how the four-week window steps.
- **Top-down** per-cell controls beyond free text (colour/emoji, expand/collapse).
- **Annual plan** — which figures are derived vs entered (Total presumed derived).
- Goals / Top-down per-view **route slugs** (minor; tabs, not separate URLs — non-blocking).

## 15. Source log
A **live classic-UI pass on 2026-06-15** (coach **Bart**, *National Team*, 7 athletes) confirmed:
routes (`/plan/week`, `/plan/season`), week navigation (chevrons + date-range pill), the full
internals of **all four views** (Week layout, Goals four-week grid with locked event chips,
Top-down three columns + ⚙/year selector, Annual-plan data-field × month grid), the **Copy plan
dialog** (heading, destination dropdown, per-day source toggles, weekly-goal checkbox, athlete
checkbox list + Clear selection), the **publish-label variance** (Copy plan vs Copy goals), the
**roster**, and that **Plan keeps no Activity log**. The earlier live observation (four views,
sandbox vs individual-edit visibility, locked calendar events, export control position) still holds.
Product framing (left/right sides, three data versions, top-down model, phase/row configuration,
export details) is from the **master reference §4–5.1, §5.2, §7** (`[CORE]` mechanics, `[CONFIG]`
fields). The existing docs page (`/en/plan/plan.mdx`) was mined for structure and wording.
**Confidence: HIGH** on routes, all four view layouts, week nav, sandbox model, Copy plan dialog,
publish labels, roster, and no-Activity-log. **Medium/open** only on: the auto-save indicator,
the export/print menu, empty/loading/error states, the destination-dropdown full option list, and
minor per-cell controls — see §14.

## 16. Docs page plan
- **Audience line:** `**For:** coaches · **Where:** Web app`
- **Proposed page outline** (H2s → which spec sections feed them):
  | Page section (H2) | Fed by |
  |-------------------|--------|
  | intro + audience line + `<Info>` (configured per team) | §1, §0, §10 |
  | The four views | §4, §6.1–§6.4 |
  | Your sandbox, and publishing — `<Steps>` | §6.5, §7, §8 |
  | Individualize after publishing | §7, §8 |
  | Events from the Season Calendar | §4, §12 |
  | Print and export | §6.6 |
- **Cross-links** (exact paths): `/en/plan/season-calendar` (events), `/en/plan/goals`
  (Goals module — note it's distinct from the Goals view), `/en/reality/training-log`
  (Reality / Import plan), `/en/analytics/analytics` (plan-vs-reality & load forecast).
- **UI label → doc term** (pin wording where UI label and doc word differ):
  | UI label | Doc term |
  |----------|----------|
  | Entire Group | the group sandbox (private until published) |
  | Copy plan | publish (the Copy plan button) |
  | Goals (plan view) | the Goals view (≠ the Goals module) |
  | Top-down | the Top-down view |
  | Annual plan | the Annual plan view |
  | Left side / right side | text side / data (numbers) side |
  | motiv / theme | theme / main goal |
