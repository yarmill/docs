# Module Spec: Analytics (Analytika) — internal

> Internal specification. NOT published (excluded via `.mintignore`). Source for the
> user-facing docs page + image plan. Fill every section; leave `TODO(verify)` where unsure.

## 0. Meta
- **Module:** Analytics — Czech UI term **Analytika**. The instance surfaces it as a
  **dropdown** in the top nav listing the available analyses.
- **Route(s):** under the ANALYTICS top-nav dropdown; each dropdown item is its own `/reporting/…`
  route. **Confirmed live (this biathlon instance, `[CONFIG]`):**
  - **Load and readiness** → `/reporting/medicalCheckTeam`
  - **Weekly dashboard of group** → `/reporting/groupWeeklyDashboard`
  - **Training data analysis** → `/reporting/trainingAnalyzeTrend` (page title "Trend of training indicators")
  - **Report ATP** → `/reporting/endOfSeasonReview`
- **Nav path:** classic top-nav → **ANALYTICS ▾** → pick an analysis. The live dropdown lists
  (this instance's labels): **Load and readiness · Weekly dashboard of group · Training data
  analysis · Report ATP**. The exact report set is per-instance `[CONFIG]`; these four are this
  biathlon instance's configuration.
- **UI shell:** **classic light top-nav** (ANALYTICS is one of the top-menu items, with the
  Yollanda icon in the header). Not GUI 2.0.
- **Surfaces:** web (PWA). Charts are a coach/web experience; athletes see their own on web.
- **Primary roles:** **coaches** (see assigned groups/athletes); **athletes see their own data only**.
- **Config-dependence:** **high** — *which* analyses appear depends on the instance (module
  enabled · permission · whether the input data is even collected). The **load metric** is
  configurable; many sport-specific analyses exist beyond the core families.
- **Explored:** 2026-06-15 · clean coach session (coach *Bart Simpson*) · group *National Team* ·
  biathlon demo · by main agent. ANALYTICS dropdown + the four routes observed live; the **report
  shell** (report-picker + filters + period navigator + email/export) and **two report
  compositions** (Weekly dashboard of group; Training data analysis / "Trend of training
  indicators") confirmed live. Other report bodies + remaining reference-catalog reports documented
  from the **master reference** — see §15.
- **Render images now?** **NO** — shot list only (§13).

### Label mapping (live dropdown → master-reference / doc term)
The live instance labels differ slightly from the master-reference family names. Pin them:

| Live dropdown label (this instance) | Master-reference name | Doc term used in this spec |
|---|---|---|
| **Load and readiness** | Team Daily Readiness ("medical check") | Team daily readiness (§6.1) |
| **Weekly dashboard of group** | Weekly Dashboard | Weekly dashboard (§6.2) |
| **Training data analysis** | Training data analysis | Training data analysis (§6.6) |
| **Report ATP** | Annual Cycle Report / RTC (*Hodnocení RTC*) | Season review (§6.7) |

> "ATP" = Annual Training Plan / Annual Training Cycle (RTC = *Roční tréninkový cyklus*).
> Three further analyses from the reference — **Training load (ACWR)**, **Recovery
> indicators**, and **Wellness** — sit inside the **Load & Readiness** family in the reference
> but were **not separately observed** as their own dropdown items in this instance. Documented
> as §6.3–6.5 with a `TODO(verify)` on how each is reached here. `[CONFIG]` the exact dropdown
> contents vary per instance.

## 1. Purpose & why it exists
Analytics is where the diary pays off. The data captured across **Plan**, **Reality**,
connected **devices**, the **Wellness** questionnaire, and the **Medical** module flows back as
answers to coaching questions: is the load right, is the athlete recovering, is anyone at risk
today, did the season go to plan. It closes the loop — collection becomes insight — and (via
the Yollanda chart icon) explains itself in plain language so non-analytical coaches can read
the charts.

## 2. Jobs to be done (per role)
- **Coach:**
  - When I arrive in the morning, I want one overview of every athlete's health, recovery, and
    wellness, so I know who needs a conversation before training.
  - When I run a microcycle, I want to see who actually filled their diary, so I can chase the
    gaps instead of guessing.
  - When I prescribe load, I want the acute:chronic trend per athlete, so I keep them in the
    safe zone and off the injury cliff.
  - When an athlete feels flat, I want their recovery metrics over time (with illness/injury
    shaded in), so I can tell a genuine dip from noise.
  - At season's end, I want plan vs reality month by month, so "did we train what we intended?"
    gets a factual answer I can export and discuss.
- **Athlete:**
  - When I want to understand my own load, recovery, or wellness trend, I want to see my own
    charts, so I can have an informed conversation with my coach.

## 3. Personas & permissions
- **Coach:** sees Analytics for their **assigned groups and athletes**; picks group → athlete →
  period. Full read access to the analyses enabled for the team. Coaches are the primary audience.
- **Athlete:** sees **their own data only** — no group selector, no athlete switcher, no team
  overview. The athlete Analytics surface is a **REDUCED, SELF-SCOPED subset** of the coach set.
  **Confirmed live 2026-06-15 (athlete *Pé Tomáš*, role Athlete, own session):**
  - The **ANALYTICS dropdown shows only 3 reports** — **Load and readiness · Training data
    analysis · Report ATP**. The group-only **"Weekly dashboard of group" is ABSENT** (no group
    dashboards for athletes).
  - The athlete's **"Load and readiness"** maps to a **different, athlete-scoped route**
    **`/reporting/loadAthlete`** (vs the coach/team **`/reporting/medicalCheckTeam`**).
  - The athlete can open their own **Training data analysis** ("Trend of training indicators")
    with the **same KPI cards + monthly trend charts** (incl. device/sporttester data), but the
    **Filters are scoped to themselves** — **Athlete = self**, **Season**, **Trend detail** (no
    athlete switcher).
  So athletes get a **self-scoped subset** (no group dashboards; athlete-scoped report routes);
  coaches keep the full group reports + team variants. Which charts appear still also depends on
  team setup `[CONFIG]`.
- **Access gating** `[CONFIG]`: an analysis appears only when **(a)** its module is enabled,
  **(b)** the role has permission, and **(c)** the input data is being collected (e.g. Recovery
  indicators need a sleep-tracking device; Wellness needs the questionnaire in use). A missing
  analysis is almost always one of those three — route to the administrator.

## 4. Key concepts & vocabulary
- **Analysis / report:** one chart-or-table view chosen from the ANALYTICS dropdown, scoped to a
  **group or athlete** over a **period**.
- **Plan vs reality (line convention):** **dashed line = plan**, **solid line = reality**. Used
  across load/training-data charts. A short **forecast** extends from the planned week.
- **Load metric** `[CONFIG]`: the unit the load charts use. Built-ins: **total training time**,
  **sRPE** (session RPE — simplified Borg CR10, 0–10 × duration), **TRIMP** (Training Impulse =
  intensity × time-in-zone). Set per team.
- **ACWR (Acute:Chronic Workload Ratio):** mean load over the **last 7 days** ÷ mean load over
  the **last 28 days**. **Safe zone 0.8–1.3.** **< 0.8 = undertraining**; **> 1.3 = elevated
  overtraining / injury risk**. The centrepiece of training-load analysis.
- **Recovery indicators:** device-sourced metrics over a period — e.g. **resting HR**, **HRV**,
  **sleep duration**, **skin-temperature deviation**, **Oura readiness** / **Garmin Body
  Battery** — typically shown with a **7-day rolling average** against the **period average**.
- **Wellness metrics (ASMR):** the daily questionnaire items — verified set **Sleep · Stress ·
  Mood · Soreness · Fatigue** (+ Notes), each on a short labelled scale (e.g. `1 - Excellent` …
  `4 - Bad sleep`). `[CONFIG]` exact items vary.
- **Weekly-dashboard symbols** (reference legend): **✔ completed per plan** · **red dot = athlete
  note to address** · **red pencil = unfilled diary** · **coffee = day off** · **ambulance =
  illness/injury**. `TODO(verify)` exact glyphs in the current UI.
- **Health status:** the training-limitation flag from the **Medical** module (Full / Modified /
  No training) surfaced in readiness.
- **Annual plan / Plan / Reality:** the three comparable data versions; the season review puts
  all three side by side per month with **season totals**.
- **Trend view:** a multi-season roll-up that sums **reality by season across years**.
- **Yollanda chart "Insight" icon:** a small Yollanda icon on charts/cards → plain-language
  **description** + **interpretation**; computed **overnight** (a newly enabled chart explains
  itself the next day).
- **Terminology** `[CONFIG]`: instance labels are localised (Czech *Analytika*, *Hodnocení
  RTC*). The demo's dropdown labels are this instance's wording.

## 5. Information architecture
- **Shell:** classic light top-nav (REALITY · PLAN · **ANALYTICS** · ATTENDANCE · FILES · OTHER
  · SETTINGS; Yollanda icon in the header).
- **Entry:** **ANALYTICS ▾** dropdown → choose an analysis. Live items here: **Load and
  readiness · Weekly dashboard of group · Training data analysis · Report ATP**.
- **Within an analysis — report shell (confirmed live):** every report opens into a common layout:
  - a **left report-picker sidebar** listing the report and its **variants** (e.g. "Weekly
    dashboard of group" + "Weekly dashboard of group - sporttesters"; "Trend of training
    indicators"), each with a one-line description;
  - below it a **Filters** block — **Group** (group dropdown) on group reports; **Athlete**,
    **Season** (year), and **Trend detail** (e.g. "Months") on the per-athlete trend report;
  - a **top bar** with a **week/period navigator** (e.g. ◀ 15/06 - 21/06/2026 ▶) on weekly
    reports, and top-right an **email/share** icon + an **export/download** dropdown;
  - then the **report body** — stat/KPI cards + charts/grids + tables. Reports render **LIGHT**.
  `[CONFIG]` the report list, variants, KPIs, and chart set vary per instance/sport.
- **Related modules feeding it:** Plan (planned load), Reality + sport-watch (actual load,
  HR zones, sleep/recovery), Wellness questionnaire, Medical (health status + illness/injury
  shading), Integrations (devices), Yollanda (chart insights, NL Q&A).

## 6. Screen & UI inventory

> Each distinct analysis is treated as its own screen entry. Live-observed = the ANALYTICS
> dropdown and its four labels; the per-analysis internals are from the master reference and
> carry `TODO(verify)` on exact controls/layout until captured live.

### 6.1 Team daily readiness — dropdown label "Load and readiness" — **route `/reporting/medicalCheckTeam`** (confirmed live; body not opened this pass)
- **Purpose:** the morning team overview ("medical check") — open it before training to see who
  needs a conversation.
- **Route confirmed:** `/reporting/medicalCheckTeam` for the **coach/team** view. **Athlete-scoped
  variant CONFIRMED 2026-06-15 (athlete *Pé Tomáš*):** the **athlete's** "Load and readiness" maps
  to a **different route, `/reporting/loadAthlete`** (self-scoped, no team grid). `TODO(verify)`
  the report **body** (columns/layout) live for both — not opened in the 2026-06-15 pass; columns
  below are from the reference.
- **Layout:** one **row per athlete** combining several signals into a single glance.
- **Columns (verified 06/2026 in reference):** **Health status** (from Medical — the
  training-limitation flag) · **WHOOP Recovery** · **Garmin Battery** (Body Battery) · **Wellness**
  · plus **athlete-note indicators** surfacing notes from athletes.
- **Device columns are setup-dependent** `[CONFIG]`: WHOOP Recovery / Garmin Body Battery appear
  only for athletes with that device connected; other devices (Oura readiness, etc.) may stand in.
- **States:** empty (no athletes / no data for the day) · filled (rows populated) · per-athlete
  partial (some signals blank where a device or questionnaire is missing). `TODO(verify)` exact
  empty/loading visuals.

### 6.2 Weekly dashboard — dropdown label "Weekly dashboard of group" — **route `/reporting/groupWeeklyDashboard`** — ✅ seen live
- **Purpose:** coach's operational view of the group's week — who's at risk, who logged, who didn't.
- **Route:** `/reporting/groupWeeklyDashboard`. Has a **variant** in the report-picker:
  **"Weekly dashboard of group - sporttesters"**. `TODO(verify)` the "- sporttesters" variant's
  differences.
- **Filters/scope (confirmed):** **Group** dropdown filter; top-bar **week navigator**
  (◀ 15/06 - 21/06/2026 ▶).
- **Composition (confirmed live):**
  - **Group status** — a row of **3 stat cards**: **"N sick"** (athletes who logged ≥1 day of
    illness/injury) · **"N comments"** (notes athletes wrote during the week) · **"N skippers"**
    (athletes who didn't fill in Reality). Demo showed **0 sick / 0 comments / 0 skippers**.
  - **"Weekly overview of athletes"** — a grid of **athletes (rows) × Mon–Sun** showing each day's
    **training content** (with a **"(the legend)"** link), plus a parallel **RPE** Mon–Sun grid.
  - **Comments table** — columns **Day · Athlete · Note · Edited**; **"No records"** when empty.
- **Symbol legend (reference, behind "(the legend)" link):** **✔** completed as planned · **red dot**
  athlete note to address · **red pencil** unfilled diary · **coffee** day off · **ambulance**
  illness/injury. `TODO(verify)` exact glyphs/colours behind the current "(the legend)" link.
- **Weekly email** `[CONFIG] on/off`: an **email/share** icon sits top-right of the report (reference:
  the dashboard can be emailed every **Monday ~07:00**). `TODO(verify)` the on/off toggle's exact
  location/label and the email schedule in the current UI.
- **States:** empty (0/0/0, "No records") confirmed · filled (mixed content/RPE).

### 6.3 Training load analysis (ACWR) — Load & Readiness family
> `TODO(verify)` how this is reached in this instance — likely under "Load and readiness" or a
> separate item; not observed as its own dropdown label here.
- **Purpose:** is the load right for this athlete — trend, plan vs reality, and injury-risk ratio.
- **Load trend chart:** load per period per athlete; **dashed = plan**, **solid = reality**,
  plus a short **forecast** projected from the planned week.
- **Load metric** `[CONFIG]`: sRPE / TRIMP / total training time (team setting; §4).
- **Centrepiece — ACWR chart:** acute:chronic ratio (avg last 7 d ÷ avg last 28 d) plotted over
  time against the **0.8–1.3 safe zone** band — below = undertraining, above = elevated injury
  risk.
- **Summary cards:** **current ACWR** · **time in safe zone** · **last week's load total** ·
  **last week's recovery total**. `TODO(verify)` exact card set/wording.
- **Illness/injury shading:** illness and injury periods (from Medical) shaded into the chart
  background so trends are read in health context.
- **States:** empty (no load data) · filled · forecast-only tail (future weeks).

### 6.4 Recovery indicators analysis — Load & Readiness family
> `TODO(verify)` exact entry point in this instance; not separately observed.
- **Purpose:** recovery metrics from connected devices over a period, to spot genuine dips and
  early-warning patterns.
- **Requires** `[CONFIG]`: a **device the athlete sleeps with** (sleep-tracking). Absent that,
  the analysis is unavailable / empty.
- **Metrics (reference):** **resting HR**, **HRV**, **sleep duration**, **skin-temperature
  deviation**, **Oura readiness / Garmin Body Battery** — each typically with a **7-day rolling
  average** against the **period average**.
- **Health shading:** **illness and injury periods highlighted in the background** (from Medical).
- **Read pattern (domain note):** rising resting HR + dropping HRV can precede illness by days
  (sometimes a "fake improvement then crash"). Documentary context, not a UI element.
- **States:** empty / no-device (most common gotcha) · filled.

### 6.5 Wellness analysis — Load & Readiness family
> `TODO(verify)` exact entry point in this instance; not separately observed.
- **Purpose:** the wellness (ASMR) questionnaire, trended.
- **Metrics:** **Sleep · Stress · Mood · Soreness · Fatigue** (the verified item set;
  `[CONFIG]` varies) — shown for the **selected day** and across a **4-week trend**.
- **Scope:** per **athlete** or for the **group**.
- **Notes alongside:** athletes' questionnaire notes shown next to the trend.
- **States:** empty (questionnaire not filled / not in use) · filled.

### 6.6 Training data analysis — dropdown label "Training data analysis" — **route `/reporting/trainingAnalyzeTrend`**, page title "Trend of training indicators" — ✅ seen live
- **Purpose:** per-athlete training-volume trends, plan vs reality, by activity and intensity,
  including device/integration data.
- **Route:** `/reporting/trainingAnalyzeTrend`; report-picker entry **"Trend of training
  indicators"**.
- **Filters/scope (confirmed):** **Athlete**, **Season** (year), and **Trend detail**
  (e.g. **"Months"**). Per-athlete report (sampled with *Pé Tomáš*, who has device data). **In an
  athlete's own session (confirmed 2026-06-15, Pé Tomáš)** the **same report is available with the
  Filters scoped to themselves** — **Athlete = self** (no athlete switcher), Season, Trend detail —
  and the **same KPI cards + monthly trend charts** (incl. device/sporttester data) render.
- **Composition (confirmed live):**
  - **KPI cards row** — **training days** (96) · **sessions** (171) · **days of illness & health
    restrictions** (1) · **exercise hours** (192:21) · **run in total** (77.821 km).
  - **Monthly trend charts** — "Training days, days of illness and health restrictions" (bar) ·
    "Exercise hours – trend" (evidence vs plan) · "Exercise hours – decomposition"
    (strength/run/bike/ski/other) · "Other activities" breakdown.
  - **"SPORTTESTER DATA — Data from Apple, Garmin, Polar, Suunto devices"** section — *Time by
    activities*; *Time by zones of heart rate* (currently a 🚧 **"we're refining zone time
    calculations…"** placeholder note).
  - **"WHOOP DATA"** section — *Time by activities*; *Time by HR zones* (zones **0–5 + unassigned**).
  - **"Climbing analysis"** section — bouldering / indoor / outdoor.
- **Confirms:** **integration/device data (sporttesters + WHOOP) surfaces inside Analytics trend
  reports**, and **Trend detail** can be set to **Months**.
- **Content (reference, broader):** also trends vs the **prior year**; breakdown **by intensity
  zone**. `[CONFIG]` exact KPI/chart set per instance/sport.
- **States:** empty · filled (confirmed) · year-over-year comparison · device sections empty when
  no device connected · zone-time placeholder while calculations are refined.

### 6.7 Season review (Report ATP / RTC) — dropdown label "Report ATP" — **route `/reporting/endOfSeasonReview`** (confirmed live; body not opened this pass)
- **Purpose:** the annual-cycle evaluation — "did we train what we intended?"
- **Route confirmed:** `/reporting/endOfSeasonReview`. `TODO(verify)` the report **body** live —
  not opened in the 2026-06-15 pass; layout below is from the reference.
- **Layout (reference):** a table with **Annual plan · Plan · Reality side by side, month by
  month**, with **season totals**.
- **Trend view:** switch to a **multi-season Trend** that sums reality by season across years.
- **Also captured in the RTC** (reference): volume, intensities, consistency, goals, results, and
  a coach's **written evaluation**. `TODO(verify)` which of these are inline in this instance's
  Report ATP vs separate.
- **Export:** to **XLS / PDF**.
- **States:** mid-season (partial reality) · full-season · multi-season trend.

### 6.8 Yollanda chart insight (overlay, all charts)
- **Trigger:** a small **Yollanda icon** on a chart or summary card.
- **Behaviour:** opens/zooms → a plain-language **description** (axes, values) + an
  **interpretation** of what the chart shows.
- **Timing:** insights **computed overnight** — a newly enabled chart explains itself **from the
  next day**.
- **Accent:** Yollanda accent is Blush `#FC7B9B`, never indigo (brand rule).
- See also **Yollanda Chat** (header icon) for NL Q&A over the same data — documented in the
  Platform/Yollanda page, cross-linked, not duplicated here.

## 7. Actions & interactions
- **Pick an analysis:** ANALYTICS ▾ → choose. Loads that analysis for the current group/athlete.
- **Choose group / athlete:** scopes the analysis (coach only). Athlete is auto-scoped to self.
- **Choose period / scope:** day / week-microcycle / mesocycle / month / season per analysis.
- **Toggle the weekly-dashboard email** `[CONFIG]`: on → emailed Monday ~07:00.
  `TODO(verify)` location.
- **Open a Yollanda chart insight:** Yollanda icon → description + interpretation.
- **Export the season review:** to XLS / PDF.
- **Switch season-review to Trend view:** multi-season roll-up.
- Analytics is **read/derived** — no Activity log of its own; it consumes data written by Plan,
  Reality, Wellness, Medical, and Integrations. `TODO(verify)` whether any analysis writes back
  (none expected).

## 8. User journeys / flows (per role)
**Coach — morning check (Team daily readiness):** ANALYTICS ▾ → **Load and readiness** → scan
one row per athlete: health status (Medical), WHOOP Recovery / Garmin Battery, wellness, and any
athlete notes → flag who needs a conversation before training. *Simpson Lisa* shows No-training
(ankle) + low recovery → talk to her first.

**Coach — diary compliance (Weekly dashboard):** ANALYTICS ▾ → **Weekly dashboard of group** →
read the athletes × days grid → chase red-pencil (unfilled) cells and address red-dot notes;
turn on the Monday email so the grid arrives in the inbox.

**Coach — manage load (Training load / ACWR):** open the athlete's load trend (dashed plan vs
solid reality + forecast) → watch ACWR against 0.8–1.3 → if it climbs past 1.3, ease next week;
if it sits below 0.8, the athlete is under-loaded.

**Coach — diagnose a flat athlete (Recovery indicators):** open recovery indicators over the last
weeks → resting HR rolling-avg rising and HRV dropping with an illness shade in the background →
context for the dip.

**Coach — season retrospective (Report ATP):** ANALYTICS ▾ → **Report ATP** → annual plan / plan
/ reality month by month + totals → export PDF for the season debrief; switch to Trend to compare
across years.

**Athlete — review own trends:** open **ANALYTICS ▾** (own session) → a **reduced, self-scoped**
set of **3** items (**Load and readiness · Training data analysis · Report ATP**; no group
dashboard) → open **Training data analysis** (Filters auto-scoped to self) for own KPI cards +
monthly trends, or **Load and readiness** (athlete route `/reporting/loadAthlete`) → bring
questions to the coach. (Confirmed 2026-06-15, *Pé Tomáš*; athlete report **body** layout still
`TODO(verify)`.)

## 9. Use cases / scenarios
- **Pre-session triage:** coach opens Team daily readiness and reorders the session around who's
  recovered, who's flagged in Medical, and who reported poor sleep.
- **Catching a non-logger:** the Weekly dashboard shows an athlete with red-pencil days all week;
  the coach follows up before the data gap spoils the load analysis.
- **Avoiding the injury cliff:** ACWR spikes above 1.3 after a hard camp; the coach pulls back the
  next microcycle to bring it back into the safe zone.
- **Early-warning illness:** recovery indicators show the rising-RHR / falling-HRV pattern days
  before an athlete reports feeling ill; the coach lightens load proactively.
- **Wellness conversation:** a 4-week wellness trend shows mood and soreness drifting; the coach
  reads the athlete's notes alongside and adjusts.
- **Season debrief:** at year-end the coach exports Report ATP, compares planned vs actual hours
  by month, and uses the Trend view to show multi-year progression to the federation.
- **Non-analytical coach:** taps the Yollanda icon on the ACWR chart and gets a plain-language
  read of what the line means.

## 10. Configuration & variants
- `[CONFIG]` **Which analyses appear** — per instance: module enabled · permission · input data
  collected. The live **coach** dropdown here is **Load and readiness · Weekly dashboard of group ·
  Training data analysis · Report ATP**; other instances differ.
- **Role-scoped report set (confirmed live 2026-06-15):** the dropdown is **persona-dependent**.
  An **athlete** gets a **reduced, self-scoped subset** — **3** reports (**Load and readiness ·
  Training data analysis · Report ATP**), **no group dashboards** ("Weekly dashboard of group" is
  absent), and **athlete-scoped report routes** (athlete "Load and readiness" → **`/reporting/loadAthlete`**
  vs the coach/team **`/reporting/medicalCheckTeam`**), with **Filters scoped to self** (Athlete =
  self, Season, Trend detail). A **coach** gets the **group reports + team variants**.
- `[CONFIG]` **Load metric** — sRPE / TRIMP / total training time.
- `[CONFIG]` **Device columns** in readiness & recovery — depend on each athlete's connected
  device (WHOOP, Garmin, Oura, …). **Device data also surfaces inside trend reports** — the
  Training-data report has dedicated **SPORTTESTER** (Apple/Garmin/Polar/Suunto) and **WHOOP**
  sections (time by activity, time by HR zones); these are empty for athletes without that device.
- `[CONFIG]` **Report variants** — some reports ship variants (e.g. "Weekly dashboard of group"
  vs "… - sporttesters"), selectable in the left report-picker.
- `[CONFIG]` **Wellness items** — the questionnaire's exact metrics.
- `[CONFIG]` **Weekly-dashboard email** — on/off (Monday ~07:00).
- `[CONFIG]` **Terminology/labels** — localised (Czech *Analytika*, *Hodnocení RTC*, "Report ATP").
- **Sport-specific analyses** beyond the core families — Shooting analyses, Race analyses, Test &
  Diagnostics reports, youth/development comparisons — exist per federation. Out of scope for the
  general Analytics page; documented in sport-specific specs. `[SPORT]`
- **Universal mechanics (not configurable):** the plan=dashed / reality=solid convention; the
  ACWR formula and 0.8–1.3 safe zone; the overnight Yollanda-insight model.

## 11. Edge cases, limits, gotchas
- **No device, no recovery analysis:** Recovery indicators need a device the athlete **sleeps
  with**; otherwise empty.
- **No questionnaire, no wellness trend:** Wellness analysis is empty if the team doesn't run the
  questionnaire.
- **Thin data, thin ACWR:** ACWR needs ~28 days of history to be meaningful; early-season or new
  athletes show an unstable ratio. `TODO(verify)` how the UI handles <28-day windows.
- **Forecast is from the plan:** the load forecast extends from the **planned** week — if the plan
  is empty there's no forecast.
- **Missing analysis ≠ bug:** usually module-off / no-permission / no-input-data (§3, §10).
- **Insight latency:** Yollanda chart insights appear the **day after** a chart is enabled
  (overnight compute), not instantly.
- **Athlete scope:** athletes never see group views or other athletes.
- `TODO(verify)` mobile/PWA behaviour for charts (likely web-first; not observed).

## 12. Cross-module integration & data flow
- **← Medical:** training-limitation **health status** → Team daily readiness; **illness/injury
  periods** → shaded into the background of Training-load and Recovery-indicator charts.
- **← Plan:** planned load → the **dashed** plan line and the **forecast**; annual plan/plan →
  Season review.
- **← Reality + sport-watch:** actual load (sRPE/TRIMP/time) → the **solid** reality line;
  time-in-zones → Training data analysis; sleep/recovery → Recovery indicators.
- **← Wellness questionnaire:** ASMR items → Wellness analysis + the Wellness column in readiness.
- **← Integrations (devices):** WHOOP recovery, Garmin Body Battery, Oura readiness, resting HR,
  HRV → readiness + recovery analyses.
- **→ Yollanda:** charts feed the chart-insight overlay; the same data backs Yollanda Chat.
- **Net:** Analytics is the **output layer** — it reads from every collection module and produces
  no source data of its own.

## 13. Shot list (images for the docs page)
| # | Screen / state | Sample data | Caption (draft) | Callouts | Supports doc section | Role | Render now? |
|---|----------------|-------------|-----------------|----------|----------------------|------|-------------|
| 1 | Team daily readiness (filled) | National Team rows; Lisa flagged No-training + low WHOOP recovery + poor sleep, athlete note | "Open before training: each athlete's health, device recovery, and wellness in one row — with their notes surfaced." | Health status (Medical) · WHOOP Recovery / Garmin Battery · Wellness · note indicator | Team daily readiness | coach | shot list only |
| 2 | Weekly dashboard (mixed symbols) | National Team × 7 days; ✔ / red dot / red pencil / coffee / ambulance mix | "Who actually filled their diary this microcycle — at a glance — and where to follow up." | symbol legend · an unfilled-diary cell · the weekly-email toggle | Weekly dashboard | coach | shot list only |
| 3 | Training load + ACWR (filled) | Lisa: load trend dashed plan vs solid reality + forecast; ACWR line crossing 1.3 | "Load trend (plan dashed, reality solid) and ACWR against the 0.8–1.3 safe zone." | dashed plan / solid reality · forecast tail · ACWR safe-zone band · summary cards | Training load analysis | coach | shot list only |
| 4 | Recovery indicators (filled) | Lisa: resting HR + 7-day rolling avg vs period avg; illness period shaded | "Recovery metrics over time, with illness and injury periods shaded in." | resting HR · 7-day rolling avg · period avg · illness shading | Recovery indicators | coach | shot list only |
| 5 | Wellness trend (4 weeks) | Lisa: sleep/stress/mood/soreness/fatigue over 4 weeks + notes | "The wellness questionnaire, trended — per athlete or group, with notes alongside." | the five metrics · 4-week trend · athlete notes | Wellness analysis | coach | shot list only |
| 6 | Season review / Report ATP | National Team: annual plan / plan / reality by month + totals | "Annual plan, plan, and reality side by side, month by month — exportable." | three data versions · season totals · export · Trend toggle | Season review | coach | shot list only |
| 7 | Yollanda chart insight (overlay) | The ACWR chart with the Yollanda insight open | "Tap the Yollanda icon for a plain-language read of any chart." | Yollanda icon (Blush) · description + interpretation | Yollanda on charts | coach | shot list only |

> All render-now = **no**; capture live against National Team / Simpson Lisa before rendering.

## 14. Open questions / TODO(verify)
- **"Load and readiness"** (`/reporting/medicalCheckTeam`) and **"Report ATP"**
  (`/reporting/endOfSeasonReview`) **report bodies** — routes confirmed, bodies **not opened**
  this pass.
- The **"Weekly dashboard of group - sporttesters"** variant's differences vs the base report.
- Exact **email/share** + **export/download** formats and the weekly-email on/off toggle.
- How **Training load (ACWR)**, **Recovery indicators**, and **Wellness** are reached in *this*
  instance (inside "Load and readiness" vs separate) — only the four dropdown labels exist here.
- **Weekly-dashboard symbol glyphs** behind the **"(the legend)"** link in the current UI.
- **ACWR summary-card** exact set and wording; behaviour with **< 28 days** of data.
- **Report ATP** scope — whether volume/intensities/consistency/goals/results and the coach's
  written evaluation are inline or separate from the month-by-month table.
- ~~**Athlete-side** Analytics surface (which reports, layout)~~ — **RESOLVED 2026-06-15 (athlete
  *Pé Tomáš*):** reduced, self-scoped subset — **3** reports (**Load and readiness · Training data
  analysis · Report ATP**), **no "Weekly dashboard of group"**, athlete "Load and readiness" →
  **`/reporting/loadAthlete`** (vs coach `/reporting/medicalCheckTeam`), Filters scoped to self
  (Athlete = self / Season / Trend detail). See §3, §6.1, §6.6, §10. Still open: athlete-side
  report **bodies/layout** (`loadAthlete` body not opened).
- **Mobile/PWA** chart behaviour.
- Empty/loading states for the not-yet-opened reports.
- The **broader reference report catalog** (race analyses, test & diagnostics reports) on instances
  that configure them — not present in this biathlon instance's set.

> **Resolved this pass (2026-06-15, moved into the body):** the four configured **coach** reports +
> their `/reporting/…` routes (§0, §6.1/6.2/6.6/6.7); the common **report-picker + filters + period
> navigator + email/export** shell (§5); the **Weekly dashboard of group** composition (§6.2); the
> **Training data analysis / "Trend of training indicators"** composition incl. sporttester/WHOOP/
> HR-zone sections (§6.6); device data surfacing inside trend reports (§10); and the **athlete-side
> Analytics surface** — a reduced, self-scoped subset (3 reports, no group dashboard, athlete-scoped
> `/reporting/loadAthlete` route, self-scoped filters) confirmed on *Pé Tomáš* (§3, §6.1, §6.6, §10).

## 15. Source log
**Live — clean coach session (2026-06-15, we.yarmill.com, coach *Bart Simpson*, group *National
Team*, biathlon demo):**
- **Nav & routes confirmed:** classic top-nav **ANALYTICS ▾** dropdown; the four configured items
  map to **`/reporting/medicalCheckTeam`** (Load and readiness), **`/reporting/groupWeeklyDashboard`**
  (Weekly dashboard of group), **`/reporting/trainingAnalyzeTrend`** (Training data analysis, page
  title "Trend of training indicators"), **`/reporting/endOfSeasonReview`** (Report ATP). Report set
  is per-instance `[CONFIG]`.
- **Report shell confirmed:** left **report-picker** (report + variants, each with a one-line
  description) → **Filters** block (Group on group reports; Athlete / Season / Trend detail on the
  per-athlete trend) → top-bar **week/period navigator** + top-right **email/share** + **export**
  dropdown; bodies render **LIGHT**.
- **Two report compositions sampled:** **Weekly dashboard of group** — Group-status 3 stat cards
  (N sick / N comments / N skippers; demo 0/0/0) + "Weekly overview of athletes" (athletes × Mon–Sun
  training content + "(the legend)" + parallel RPE grid) + Comments table (Day/Athlete/Note/Edited,
  "No records"). **Training data analysis** (athlete *Pé Tomáš*) — KPI cards (96 days / 171 sessions /
  1 illness day / 192:21 h / 77.821 km) + monthly trend charts + **SPORTTESTER** + **WHOOP** device
  sections (time by activity, HR zones; zone-time placeholder note) + **Climbing analysis**.
- **Confidence: high** on shell, routes, dropdown, and the two sampled compositions. **Not opened
  this pass:** medicalCheckTeam / endOfSeasonReview bodies, the "- sporttesters" variant, mobile.

**Live — clean athlete session (2026-06-15, we.yarmill.com, athlete *Pé Tomáš*, role Athlete, own
session, biathlon demo):** the **athlete Analytics surface is reduced and self-scoped.** The
ANALYTICS dropdown shows **only 3** reports — **Load and readiness · Training data analysis ·
Report ATP** — with the group-only **"Weekly dashboard of group" ABSENT**. The athlete's **"Load
and readiness"** maps to an **athlete-scoped route `/reporting/loadAthlete`** (vs the coach/team
`/reporting/medicalCheckTeam`). The athlete can open their own **Training data analysis** ("Trend
of training indicators") with the **same KPI cards + monthly trend charts** (incl. device/
sporttester data), with **Filters scoped to themselves** (Athlete = self, Season, Trend detail).
Net: athletes get a **self-scoped subset** (no group dashboards; athlete-scoped report routes);
coaches keep the group reports + team variants. **Confidence: high** on the dropdown set, the
athlete route, and the self-scoped filters; the **athlete report bodies** (`loadAthlete` layout)
were **not opened**.
- **Render now? NO** — shot list (§13) still to be captured live before rendering.

**Master reference (§5.6, §5.8, §5.11–5.13):** the remaining per-analysis internals — Team Daily Readiness
columns (Health status / WHOOP Recovery / Garmin Battery / Wellness + note indicators, verified
06/2026 in the reference); Weekly Dashboard symbol legend + Monday-email; Training Load + ACWR
formula, 0.8–1.3 zones, dashed/solid + forecast, configurable metric; Recovery Indicators (sleep,
RHR, HRV, skin-temp, Oura/Garmin) needing a sleep device; Wellness ASMR items; Training data
analysis content; Annual Cycle Report / RTC side-by-side + Trend + XLS/PDF export; the Yollanda
chart-insight (overnight). **Confidence: high on mechanics, medium on this instance's exact UI**
— hence the `TODO(verify)` markers on layout/controls. Czech terminology + label mapping from the
reference's module-name map. **Still not observed live:** the medicalCheckTeam / endOfSeasonReview
report bodies, the ACWR / Recovery / Wellness analyses, the broader reference report catalog (race /
test & diagnostics), the **athlete-side report bodies** (the athlete dropdown set + routes are now
confirmed; only the `loadAthlete` body layout is unopened), and mobile.

## 16. Docs page plan
- **Audience line:** `**For:** coaches (athletes see their own) · **Where:** Web app`
- **Proposed page outline** (H2s → spec sections):
  | Page section (H2) | Fed by |
  |-------------------|--------|
  | intro + audience line + `<Info>` "which analyses you see depends on setup" | §1, §0, §3, §10 |
  | Team daily readiness (+ image 1) | §6.1, §12 |
  | Weekly dashboard (+ image 2) | §6.2 |
  | Training load analysis (ACWR) (+ image 3) | §6.3, §4 |
  | Recovery indicators analysis (+ image 4) | §6.4, §12 |
  | Wellness (+ image 5) | §6.5 |
  | Training data analysis | §6.6 |
  | Season review (+ image 6) | §6.7 |
  | Yollanda on charts (+ image 7) | §6.8 |
- **Cross-links (exact paths):**
  - `/en/medical/medical-module` — health status + illness/injury shading source
  - `/en/reality/wellness-questionnaire` — the ASMR input behind Wellness & readiness
  - `/en/reality/training-log` and `/en/plan/plan` — the load behind plan-vs-reality
  - `/en/platform/integrations` — connecting devices for recovery metrics
  - `/en/platform/yollanda` — Yollanda chat (the chart-insight sibling)
  - `/en/plan/season-calendar`, `/en/results/results` — context where relevant
- **UI label → doc term:**
  | UI label | Doc term |
  |----------|----------|
  | Load and readiness | Team daily readiness |
  | Weekly dashboard of group | Weekly dashboard |
  | Report ATP | Season review |
  | ACWR | acute:chronic workload ratio |
  | Insight icon | Yollanda on charts |

> Note: the existing published page `en/analytics/analytics.mdx` already follows this structure
> closely — this spec backfills the depth/§13 shot list/§16 mapping behind it and pins the
> live-dropdown label mapping.
