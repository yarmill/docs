# Yarmill — Master Reference

> **Purpose.** This is an internal knowledge base about Yarmill: its concept, information architecture, modules, mechanics, configuration model, integrations, analytics, AI layer, roles, commercials, and sport-specific logging. It is the source of truth for later conversations.
>
> **How to read it.** Yarmill is configured per customer, so almost nothing is "fixed." Throughout, content is tagged:
> - **[CORE]** — true for essentially every instance (the product's spine and mechanics).
> - **[CONFIG]** — exists but is tailored per federation/team (fields, activities, test forms, analytics, terminology, which modules are on).
> - **[SPORT]** — sport-specific; the heaviest examples are quarantined in the Appendices.
> - **[ROADMAP]** — mentioned as in-progress/planned in source material; treat as time-sensitive and verify before relying on it.
>
> Sources synthesized: Capabilities Overview deck, Web one-pager, module overviews, support guidelines template, product screenshots, and six call/webinar transcripts (Harvard XC ski, Biathlon Alberta/BATC, Ski Austria freestyle, RSC Agitos para/deaf multi-sport, Latvian Biathlon, Czech Wrestling).

---

## 1. What Yarmill is

[CORE] Yarmill is a **sports data platform / athlete-management system** — positioned as "not just another training log." Its tagline is *"The sports data toolkit that answers back."* The product began as a training log and grew into a **unified data hub (a "data warehouse for sport")** that collects as much performance-relevant data as possible in one place so coaches and athletes can make better-informed decisions.

The mental model used in pitches:
- **Sources** (training entries, watches, sleep, tests, results, video, wellness, medical, menstrual cycle, body composition, etc.) →
- **A central "tub" / warehouse** where data is cleaned, standardized, and historized →
- **Outputs** (analytics, dashboards, and the Yollanda AI layer) that surface insight and "answer your coaching questions in plain language."

[CORE] **Philosophy / what it deliberately is and isn't:**
- It **supports** coach decisions; it does **not** replace the coach's intuition ("art") or auto-generate training plans. Success = "a little art, a little science."
- Success is framed broadly — not only medals, but athletes who enjoy sport, stay in it, and become coaches/bring their own kids (well-being/welfare matter too).
- **Not** a hobby/social network (no Strava-style sharing); built for serious/professional sport.
- **Not** plug-and-play: every customer gets a **configured instance** before use (initial setup, typically days to ~a week).
- **Continuous deployment** — new versions ship frequently (multiple times per day).
- **Multilingual** — UI and data can be in different languages; the AI answers in the language asked.

Scale (2026): **50+ federations and clubs worldwide** — including Canada, Great Britain, Austria, Latvia, and Poland, among others — across many sports, from sailing to football.

## 2. Access & platform facts

- **Surfaces:** Web app (any device, primary for coaches) + native **iOS/Android** apps (athletes only, limited) + **PWA** ("add to home screen" from the web app — recommended for phone use, works for coaches and athletes). iOS has a **home-screen widget** for the training plan.
- **Instances = subdomains.** Each customer has its own configured instance at `<slug>.yarmill.com`. Seen in sources: `we.yarmill.com` (multi-sport demo "Yarmillaci"), `csb.yarmill.com` (Czech Biathlon), `biathlon-latvia.yarmill.com`, `rscagitos.yarmill.com`, plus references to `biathlonalberta.yarmill.com` etc.
- **Team URL.** Login = email + password; the **team URL / workspace slug** (e.g. `biathlon-latvia`) is needed especially for the mobile app (the `.yarmill.com` part is pre-filled). The slug is usually the federation/club abbreviation and is in the confirmation email.
- **Languages / accessibility.** [CONFIG] Available languages vary per instance (switch via avatar menu or mobile settings). [ROADMAP/CORE] Active work on accessibility — screen-reader support, zoom, captions, sign-language interpretation (demonstrated in the para/deaf multi-sport onboarding).
- **Docs.** [CORE] Public user docs publish to `docs.yarmill.com`. The docs site is a custom **React/Next.js** app (statically exported, hosted on Netlify) — **not** Mintlify (that was removed). Authoring lives in the repo under `site/` (content) and `docs-guide/` (the writing guide + this reference).
- **Dual UI (transition).** [ROADMAP/CORE] Two UI generations coexist while the new design rolls out: the **new left-rail shell** (menu groups *Planning*: Plan, Goals, Planner; *Journal*: Reality, Attendance, Athlete profiles, Results, Wellness questionnaire; left-rail icons for modules / Analytics / Medical; gear = Settings) and the **old top-menu UI** (REALITY · PLAN · ANALYTICS · ATTENDANCE · FILES · OTHER (Season review, Goals, Planner, Athlete profiles, Results, Wellness questionnaire, Medical module) · SETTINGS, with the Yollanda icon in the header). New-design modules so far: Goals, Medical, Wellness questionnaire; Planner has an interim design. Never describe navigation by shell — name the module.

## 3. The customization principle (instances)

[CORE] There is a base setup, but **every instance is tailored** to the sport **and** the specific federation/team: activities tracked, plan/log fields, test/result forms, analytics, terminology, and which modules are enabled. The same sport differs by federation — e.g. Czech, Latvian, Polish, and Canadian biathlon all have different setups.

[CONFIG] **Multi-sport instances.** A single instance can serve many sports/disciplines (e.g. a national resort sport centre covering ~20 para/deaf sports). These are deliberately kept **generic and simple** to satisfy the employer's reporting needs; if a sport needs specifics, either the shared setup is adjusted or a **separate instance** is created for that sport.

[CORE] **Cross-instance data piping.** An athlete who already has Yarmill at their own federation keeps that instance; their data can be **automatically piped** to an umbrella/multi-sport instance as aggregated analyses (e.g. a results service + overview) so there is **no double entry**.

[CORE] **Data ownership & portability.** The customer owns its data, can export and leave at any time, and can let third parties (e.g. university researchers) analyze the data on the federation's behalf. Historical data can be imported on request (from Excel/old logs) to consolidate history and feed the AI.

---

## 4. Information architecture (canonical model)

[CORE] Different source docs slice the modules differently. The cleanest, most recent framing (Capabilities Overview) is treated here as **canonical**: six areas. Other framings (by `#trainingManagement / #testingAndDiagnostics / #healthAndWellness / #ai` tags, or an older flat list) are alternate lenses on the **same module set**, not contradictions.

| # | Area | "Question it answers" | Modules |
|---|------|----------------------|---------|
| 1.0 | **Plan** | Season planning & structure | Plan; Season Calendar; Goals |
| 2.0 | **Reality** | What actually happened | Training Log; Attendance; Wellness/ASMR |
| 3.0 | **Results** | Did it produce the effect? | Testing & Diagnostics; Competition Results |
| 4.0 | **Analytics** | Insights that close the loop | Training data; Load & Readiness; Shooting; Race; Test & Diagnostics reports |
| 5.0 | **Medical** | Health records & injury history | Medical Module |
| 6.0 | **Platform Foundation** | The substrate | Integrations; Yollanda (AI); Athlete Profile |

### Module name map (terminology varies by instance language)

| Canonical (EN) | Czech UI term | Notes |
|---|---|---|
| Training Log / Reality | **Skutečnost** | the daily diary |
| Plan | **Plán** | planning module |
| Season Calendar | **Termínovka** / "Planner" | events calendar; Plan + Planner are slated to merge [ROADMAP] |
| Goals | **Cíle** | objectives + key results |
| Attendance | **Docházka** | participation tracking |
| Analytics | **Analytika** | dashboards/reports |
| Files | **Soubory** | all attachments |
| Season review / Annual Training Cycle | **Hodnocení RTC** | RTC = Roční tréninkový cyklus |
| Athlete Profile | **Kartotéka** / "Evidence" | athlete card |
| Settings | **Nastavení** | incl. integrations + HR zones |
| Other | **Ostatní** | overflow menu (Planner, Evidence, tabular modules) |
| AI layer | **Yollanda** | also spelled "Jolanda/Yolanda" |

[ROADMAP] A new UI is rolling out that moves the top menu to the **left** side; layout otherwise similar.

---

## 5. Modules in detail

### 5.1 Plan [CORE mechanics, CONFIG fields]

Coaches own the Plan; athletes own Reality. The plan is built **top-down** in nested views:
1. **Season Calendar (Termínovka)** — the events scaffold (see 5.2).
2. **Top-down** — whole season at once (verified EN view names: **Week | Goals | Top-down | Annual plan**): columns for **Mesocycles**, **Microcycles (Weeks)**, and **Days**, each holding a **theme/main goal** (*motiv*). Coaches use free text, colors, emojis. Events from the calendar **auto-appear** here and are locked (edited only in the calendar).
3. **Goals (Motivy)** — a zoom to **4 weeks side-by-side** (same data, different view) for comparing Mondays/Tuesdays across a mesocycle.
4. **Week view** — full detail per day, broken into **training phases** (e.g. morning/afternoon, or early-morning/morning/afternoon, or sport + S&C — [CONFIG] phase labels are configurable). This is the daily/weekly working view; coaches typically plan the next 1–2 weeks Fri–Sun.

**Left side / right side** [CORE] — the central concept across Plan and Reality:
- **Left (text) side** = structured description in the coach's/athlete's own words (methodology, notes, tags, internal codes). Supports formatting: bullets (`- `), colors/highlight, emojis (keyboard shortcuts on Mac/Windows), links.
- **Right (data) side** = numeric values (minutes, km, reps, load, zones, shots…). Some rows are **auto-calculated and locked/greyed** (sums). A weekly **total** column sums the week.

**Three versions of data** [CORE]:
1. **Annual plan** — the season-start intention; totals entered by **mesocycle/month** (a dedicated "annual plan" view). Produces season totals.
2. **Plan** — the operational plan, built week-to-week/day-to-day; changes as reality intervenes.
3. **Reality** — what the athlete actually did.
All three are comparable; the **Season review / RTC** table shows annual-plan / plan / reality side-by-side with season totals (exportable to XLS/PDF).

**Publishing — "Copy plan" vs individual edits** [CORE]:
- Planning on **"entire group"** is the **coach's sandbox** — athletes can't see it.
- The **"Copy plan"** button (top-right) publishes the whole week to selected athletes. Verified dialog (06/2026): destination **athletes in group / other group / another week**; **select source days** (exclude unfinished, e.g. Fri–Sun); **copy the weekly goal** checkbox; **select athletes** (with Clear selection). Athletes only see plan changes after Copy plan.
- Selecting an **individual athlete** and editing changes only **their** plan, visible to them immediately — used to individualize a copied group plan. From an individual you can also copy up to a group or to specific other athletes.
- **Print/export to PDF**: left side and right side separately; layout (columns vs vertical), font size, include/exclude week goal; remembers settings. Left side is commonly printed for noticeboards.

### 5.2 Season Calendar / Termínovka (Planner) [CORE]

Full-season event scaffold. **Event types:** training camp, competition/race, training, vacation/holiday, testing, other. Per event: title, start/end, **location** (Google Maps search), participants (whole group or chosen athletes), notes, and an admin **lock**. Coaches plan team events; **athletes can add their own events** (e.g. family holidays). Can target sub-groups (e.g. national / B / C cadre). Events flow into every Plan view per day/week so context isn't lost. Often used as a coach↔athlete communication channel.

### 5.3 Goals / Cíle [CORE]

EN UI label: **Goals** (distinct from "Goals (Motivy)", the 4-week plan view in 5.1). In the main menu (under **Planning** in the new left-side UI; **Other** in the older top-menu UI). **Web only** (incl. PWA). Athletes manage their own goals and **see only their own** (no group selector, athlete list, or group overview); coaches choose a group → athlete to manage their athletes' goals, **and can create goals for themselves**. Goals are bucketed by season (**Current season** / **Last season** / **Other**). Strong fit for pre-season and post-season conversations and retrospectives (valued by mental coaches).

- **Goal anatomy:** title, description, **state**, **season**, **priority** (Low / Medium / High), **supervisors** (the coaches following the goal), **category** (two-level: top category → subcategory), **key results**, **final evaluations**, and an **Activity** log.
- **States (6):** Not started, On track, Off track, Completed, Canceled, Failed.
- **Key results (KRs):** name, **start / current / target value** (free text — numeric like `140kg` or a phrase like "trying"; updated **manually**), **target date**, and own state (the **same six states** as the goal). **No sub-steps/milestones** — key results are the only breakdown. The goal-card progress fraction (e.g. `1/1`) counts **achieved ÷ total key results**.
- **Categories** [CONFIG]: seen in one instance as Performance, Fitness, Personal, Technical, Health, Conditions (each with subcategories, e.g. Fitness → Strength / Endurance). Treat the specific list as per-instance.
- **Final evaluations** — closing written assessments; athlete and/or coach can each add one. Distinct from **Activity** comments (plain, timestamped text) and the automatic change-log.
- **Document check** — a panel (check icon, top right; Yollanda persona) that marks each field **required (red)** or **recommended (amber)**, with **green checks** for completed ones (title, description, supervisor, category, key results), and links to **Open methodology** — the team's own methodology document (an external, per-team configured URL, e.g. a Notion page). Completeness thresholds (e.g. a minimum number of key results) are methodology/instance-specific [CONFIG].
- **Entire Group** view — a grid of every athlete's goals for at-a-glance review (hover for a summary, click to open).

Screenshot example: a biathlon "shooting test" goal with KR "reach ≥330 points" (initial 295 → current 309 → target 330).

### 5.4 Reality / Training Log / Skutečnost [CORE mechanics, CONFIG fields]

The daily diary — same left/right structure as Plan, with **extra fields the coach doesn't plan but the athlete should record** [CONFIG], e.g.: RPE/sRPE (simplified **Borg CR10**, 0–10, often per morning/afternoon phase), weight before/after, subjective mental rating, fatigue feeling, meals, feelings, physio notes, "what I learned today / will work on next," and sport-specific logs (e.g. shooting — see Appendix A).
- **Auto-save** — entries save instantly (a green "data saved" indicator appears); no Save button.
- **Three-dots menu** per day — attachments + any "extra/hidden" fields. Verified example set (we.yarmill.com): training shooting, notes, feeling scale, heart rate, mental condition, attachment, import plan, wellness questionnaire [CONFIG].
- **Sport-watch records** appear automatically below the entry (activities + sleep/recovery if the athlete sleeps with the device). Watch data **does not replace** filling in the left/right sides.
- **Import plan** [CONFIG on/off] — a one-click athlete action that copies the planned day (text + numbers) into Reality for that day, then editable. Configurable days-back limit (e.g. 3). Some federations **disable** it (they want athletes to think and write in their own words — e.g. Czech Biathlon); others rely on it (e.g. swimming, where workouts are complex to log).
- **Coaches can also write in Reality** (comment on notes, add videos, log shooting for an athlete) depending on permissions.
- **Backfill** [CONFIG] — web: configurable floating window (commonly **7 days**); coach accounts often unlimited; **mobile app = current day only** (no retroactive logging yet [ROADMAP]). Philosophy: "it's a training *diary*, not a weekly/monthly" — beyond a week, entries become invented and degrade analysis.

### 5.5 Attendance / Docházka [CONFIG]

Participation tracking, **morning/afternoon** per athlete: present / day-off / excused / unexcused; bulk "all present"; per-period and per-season % attendance. Verified UI (06/2026): **Week | Season** views; per-day **Edit**; columns **Total present / Total missed / %**. **Attendance-based plan→reality copy:** "Copy plan" from Attendance fills Reality only for athletes marked **present** that day (whole day only, because the right-side numbers aren't split AM/PM). Designed for **young kids / sport schools** who don't keep their own diary and train once daily — **not** for athletes who self-log (it would overwrite their diary). Also useful for reporting attendance to national agencies/schools.

### 5.6 Wellness / ASMR questionnaire [CONFIG]

A short **daily morning self-report** the athlete adds per day (ASMR = *Athlete Self-Monitoring Report*; "wellness/well-being questionnaire"): ~5–6 items such as sleep quality, fatigue, stress, soreness, mood, readiness to train, injury/illness feeling, and an optional message to the coach. Verified module records (we.yarmill.com): **Date, Sleep, Stress, Mood, Soreness, Fatigue, Notes**, each on a short labeled scale (e.g. `1 - Excellent` … `4 - Bad sleep`); **New record** button; per-row edit/delete. Feeds the **Wellness** analysis and **Team Daily Readiness** (5.13).

### 5.7 Testing & Diagnostics + Competition Results — "tabular modules" [CONFIG]

[CORE] Under **Other**, these are **configurable forms + tables** ("tabular modules") for any data Yarmill can't auto-integrate. One template is duplicated per use case. **Field types:** text, date, **code list (dropdown)** with defined values, file, calculated, plus a mandatory flag. Used as **input** that then feeds Analytics.
- **Testing & Diagnostics** — strength/conditioning, motor tests, body composition (InBody), lactate, spiroergometry, Wingate, biochemistry (e.g. ASTRUP), kinesiology/movement screens, and sport-specific protocols. [SPORT] Biathlon examples: NTT/precision shooting tests, "Norwegian/French/German" tests, uphill-run (Suchánek) twice/season, SkiErg, SCM shooting tests. [SPORT] Freestyle examples: power testing, performance review, SCAT6 (concussion), injury documentation.
- **Competition Results** — race/match result tables: **manual entry** and/or **automatic import** from results databases (IBU SIWIDATA, FIS, others — see 5.11). Fields per the sport (e.g. competition type code list, discipline, performance, rank, # participants, # countries, note, attached official results file).

### 5.8 Medical Module / Zdravotní modul [CONFIG]

Centralized clinical records: injuries, illnesses, treatments, rehab status, return-to-training/-performance, medical history, clearances. Verified new UI (06/2026): module label **Injuries & Illnesses**; group overview columns **Status / Athlete / Open health problems / Expected return to full training** (overdue returns flagged, e.g. "61 days overdue"); records split **Open / Closed**. Per record: title + type (injury/illness icons), **Properties** (Open/closed; training limitation e.g. **No training**; **Set Responsible Staff**), **Key Dates** (start; expected return), **Note**, **Diagnosis (OSIICS standard, linked code list)**, **Files**, and an **Activity** log with timestamped comments; **New quick entry** (keyboard shortcut `N`). A record's training-limitation flag (full / partial / none) feeds **Team Daily Readiness**. Access is permission-gated. Purpose: not just "who's available" but injury-pattern analysis (recurring injuries, by age) for prevention.

### 5.9 Athlete Profile / Evidence / Kartotéka [CONFIG]

The central athlete card. **Configurable sections** (Personal info is always present): personal documents, sports info, equipment, body measurements, emergency/parent contacts, administrative records. **Field types** as in tabular modules (text, date, code list, file). Examples: phone/address, sport club, sport **classification** (code lists; para sports prefixed e.g. `para-…`), anti-doping (ADEL) certificate, passport number/validity, shirt/short/shoe sizes (athlete-editable), ski/pole length, ski brand, and external IDs to link databases (e.g. **IBU ID**, biochemistry DB ID). Coaches can edit fields (e.g. correct a name) from here. Replaces scattered spreadsheets.

### 5.10 Files / Soubory [CORE]

All attachments from Plan and Reality in one place (verified overview: counts of videos/images/others; columns **Type / File name / Tags / Location / Date**, all filterable; **Add file** button). **Deliberately no folders** (folders force a hierarchy); instead **text tags/labels** for filtering (e.g. "technique," "prone shooting," "race"). Per file: rename, download, delete, and click the date to jump to its location in the log. From the **Files "Add file"** form you can attach to Plan or Reality, set date + tags, and **attach one file (e.g. a video) to multiple athletes at once**. [CONFIG] A federation **video database** (e.g. an exercise/technique library) can be embedded so coaches insert videos into plans and athletes play them from the plan.

### 5.11 Integrations [CORE + CONFIG]

[CORE] **Ingest API.** Yarmill exposes an API for accepting data from third parties. Not yet documented in detail.

**Connect workflow** [CORE]: Web app → **Settings → Applications & devices / Integrations → Connect** → confirm in the provider's account. Imported data appears in **Reality** on the relevant day and **cannot be edited/deleted inside Yarmill** (delete in the provider's app). **Apple Health/Apple Watch must be connected from the iPhone** (web can't grant the permission).

- **Wearables (athlete self-connect, default):** Polar, Garmin, Suunto, Apple Watch, WHOOP, Oura Ring, Dexcom (continuous glucose). Typical data: activities, HR, HRV, sleep, recovery score, resting HR, body temperature, glucose. **Garmin** needs **both** activity **and** sleep enabled in Garmin Connect for both to flow; **historical pull** is on request via email (Garmin default backfill ≈ **1 year**, more on request). **WHOOP is live** (verified 06/2026: connect option + WHOOP Recovery column in Team daily readiness). **Apple Health** must be connected in the iOS app: avatar → **Connected Devices & Apps**.
- **Team / performance systems (custom setup):** InBody (body composition), Catapult (GPS, common in football/soccer), VALD (NordBord, ForceDecks, ForceFrame, DynaMo), AC BALUO (Czechia only — Palacký Univ. Olomouc), CASRI (Czechia only — Czech Army Science & Research Institute).
- **Competition / results databases:** IBU **SIWIDATA** (biathlon — full IBU race database), FIS (skiing/snowboarding incl. FIS points), Resultina (tennis), CZ Tennis, Roger (Czech tennis club booking), Swimming IS (Czech swimming), Slalom World (canoe slalom). Results-DB connections require a signed license/permission agreement with the data provider.

**The HR-zone engine** [CORE] — a notable differentiator:
- Time-in-zone is computed by Yarmill's **own algorithm** from granular Garmin/Polar/Suunto data — **brand-independent** and stable across watch changes; handles auto-pause/stop and excludes post-activity HR from averages.
- Zones are set **in Yarmill** (Settings → athlete profile), not (only) in the watch, because most brands don't expose their zones via API (Polar does → "use Polar HR zones" option). Two extra capabilities: (1) **different zone sets per activity** (e.g. roller-ski vs ski vs run), and (2) **zone validity periods** — a new set (e.g. after a lactate/spiro test) applies from its start date while historical activities keep the zones valid at the time (no retroactive rewrite). This solves the TrainingPeaks/Strava zone-mismatch problem.
- Right-side numbers are entered **manually**; sums/totals/analytics are still computed from watch data regardless of manual entry. (Coaches historically wanted manual numbers: planning needs them; "round" intuitive numbers — e.g. 20 min Z2 vs the watch's 4×4:48; and coach philosophy.) [ROADMAP] Pre-filling right-side cells from watch data (editable) is planned.

### 5.12 Yollanda — the AI layer [CORE + ROADMAP]

The AI layer, branded **Yollanda** (a playful "fortune-teller/storyteller" persona — a wink at LLMs). Two entry points:
1. **Chat** (Yollanda icon in the header; **BETA** badge; full-screen overlay; persona line "I am one big ear." with disclaimer "Even Yollanda sometimes gropes in the fog. Verify important information.") — natural-language Q&A over the athlete's training log + plan data and Yarmill how-to guidance. Examples: "summary of last season," "compare April–May this season vs last three," "when did X last complain about the left shoulder," "bench-press kg last gym session," "how did she feel before successful races," "recommend next week given how he responds to load." **Answers in the language asked** (Latvian, German, Polish, etc.). **Athletes get only their own data; coaches get any accessible athlete.** Unlike generic chatbots, it has the individual athlete's data.
2. **Graph "Insight" icon** (small Yollanda icon on some charts) — zooms the chart and generates a **description** (axes/values) plus an **interpretation**. Computed overnight, so it appears the day after a chart is enabled. Helps non-analytical users read charts.

What it can do (per support guidelines): find info from training; explain where to click / how workflows work; in beta it may search mainly the **left (text) side**. **Limits / escalate:** "pass anonymous messages to developers," "log it automatically for me," or instance changes → route to admin / `hello@yarmill.com`. [ROADMAP] Teaching it sport-specific code meanings (e.g. trick/shooting notation) and access to watch/sleep data and federation methodology docs.

### 5.13 Analytics catalog [CONFIG — availability varies]

[CORE] Standard reports + highly customized, sport-specific analyses. Missing analytics usually means: module not enabled, missing permissions, or missing input data. Core families seen:

- **Training data analysis** — trends by week/mesocycle/month/season: training days, units, illness/health-restriction days, total time **plan vs reality** (and vs prior year), breakdown by **activity** (absolute + %) and **intensity zone**; sport-watch activity time and **time-in-zones**.
- **Weekly Dashboard** (coaches) — operational view of who filled the diary, for a week/microcycle. Symbol legend: ✔ completed per plan, red dot = athlete note (to address), red pencil = unfilled diary, coffee = day off, ambulance = illness/injury. **Email toggle** → report every **Monday ~07:00**.
- **Load & Readiness:**
  - **Training Load** — load trend + **ACWR (Acute:Chronic Workload Ratio)** = mean load last 7 days ÷ mean load last 28 days. Zones: **<0.8** undertraining, **0.8–1.3** safe, **>1.3** elevated overtraining/injury risk. Dashed line = plan, solid = reality, plus a **forecast** from the planned week. The load metric is **configurable** — built-ins: total training time, **sRPE**, **TRIMP** (intensity × time-in-zone).
  - **Recovery Indicators** — sleep duration (+7-day rolling avg, illness periods highlighted), resting HR, HRV, skin-temperature deviation, Oura readiness score / Garmin body battery. Only available with a sleep-tracking device. Early-warning pattern: resting HR rising + HRV dropping (sometimes a "fake improvement then crash") days before illness.
  - **Wellness** — trends from the ASMR questionnaire (individual/group).
  - **Team Daily Readiness** ("medical check") — morning team overview; verified columns (06/2026): **Health status** (from Medical), **WHOOP Recovery**, **Garmin Battery**, **Wellness**, plus athlete note indicators.
- **Annual Cycle Report / RTC (Hodnocení RTC)** — season evaluation: volume, intensities, consistency, goals, results, coach's written evaluation; plan/reality (and annual plan) per month + season totals; exportable XLS/PDF. A "trend" view sums reality by season across years.
- **Shooting analyses** — [SPORT] biathlon; see Appendix A.
- **Race analyses** — [SPORT] biathlon/skiing via IBU/FIS; see Appendix A.
- **Test & Diagnostics reports** — built on configured test forms: individual trends over time, team overview, evaluation vs **federation limits** or **age-category benchmarks** (e.g. % of athletes meeting a shooting limit by age; club/centre comparisons; youth-head-coach overviews).
- **Youth/development comparison (federation)** — e.g. by year-of-birth: last year's hours, this year's annual plan, the difference, the federation's recommended hours, and % fulfillment after each mesocycle (supports coach discussions; ~10%/yr increase heuristic).

---

## 6. Roles & permissions [CORE]

- **Athlete** — sees but can't edit the plan; logs Reality; sees own analysis; adds notes/attachments; **sees only their own data**. Mobile app or PWA.
- **Coach** — sees assigned **groups**; plans and edits training (group/individual); publishes via **Copy plan**; logs training and (if enabled) Attendance; sees Analytics and Evidence per setup; can access any athlete they're responsible for. Multiple coaches can share one athlete (e.g. shooting + conditioning coach; map + conditioning coach in orienteering; physio/biochemist on the team). Mostly web.
- **Administrator** — full instance editor; adds users, creates groups, grants read/write permissions (**Settings → Groups**; verified members table: role pills **Athlete / Coach / Admin**, **Permissions** column (e.g. `write`), **Member since/until**, historical members, **+ New group**); sends invitations; handles access issues.
- **Self-coached athletes** get a **coach account** (so they can write their own plan + reality). Coach accounts are typically requested via the federation/employer, not directly from Yarmill.
- **Sensitive data** (health, menstruation, etc.) visibility depends on instance setup and roles. Coaches can be hidden from athletes by moving athletes to a separate group/view (used in one NCAA-compliance case).
- **Groups** are the coach's organizing unit; athletes don't see groups.

---

## 7. Configuration model (how an instance is built) [CORE process, CONFIG content]

Onboarding centers on a shared **Google Sheet template**. Key sheets:

1. **Left-side config** — the text-side fields per day/phase (morning/afternoon/…); each field flagged for **Plan and/or Reality**, and whether it's **"extra"** (hidden under the three-dots). E.g. RPE/resting-HR may be Reality-only.
2. **Right-side config** — the data-side rows. Per row: **name**; **intensity/sub-activity** (its own column, or indented under the parent, e.g. I1/I2/I3…); **description → tooltip** (the hover bubble explaining the field to athletes); **units** (e.g. minutes); **color**; and a **calculate** flag (calculated rows render greyed/locked, e.g. sums). Recommended order: start with **general** rows (training days, sessions/units, illness, injury, health restriction, competition, days off, recovery active/passive, total hours by component) → then **sport-specific** + **S&C**. Tip: copy from the team's existing Excel.
3. **Module / tabular template** — duplicate once per results/test module; define fields and types (date, code list + values, mandatory, etc.).
4. **Evidence config** — duplicate-style sheet defining athlete-card sections and fields (text/date/code-list/file; athlete-editable where wanted).

[CONFIG] **Example of a generic multi-sport right side** (from the para/deaf instance), useful as a baseline:
- **DZ** dny zatížení (training/loading days, 1/0), **JZ** jednotky zatížení (sessions that day), **Volno** (day off), **Nemoc/zranění** (illness/injury), **Zdravotní omezení** (health restriction), **Soutěž** (competition), **Fyziokompenzace** (physio/compensation, minutes), **Regenerace** = aktivní + pasivní (recovery active/passive), **Hodiny zatížení** = Primární sport + Kondice + Síla + Ostatní (total hours from 4 components).

**Setup timeline:** typically days to ~a week; covered by a one-time setup fee that also includes ongoing customization changes.

---

## 8. Onboarding & operational mechanics [CORE]

- **Registration (athlete):** email invite → "Join/Add" button (check spam) → accept license + privacy terms → name pre-filled, add DOB + gender + set password → pick avatar → done. Confirmation email contains the **team URL**.
- **First steps for athletes:** (1) fill the **Athlete Profile/Evidence card**; (2) **connect devices** (Settings → Applications & devices; Apple from iPhone); (3) **set HR zones** in Yarmill (per-activity sets + validity periods).
- **Plan ↔ Reality:** coach **Copy plan** = publish to athletes; athlete **Import plan** = copy plan→reality for a day (config on/off, days-back).
- **Exports:** plan to PDF (left/right separately); Season review/RTC to **XLS/PDF**; bulk/special exports via `hello@yarmill.com`.
- **Stay logged in** on a personal browser; one device at a time; secure.

---

## 9. Roadmap items mentioned [ROADMAP — time-sensitive]

~~WHOOP integration~~ (shipped — see 5.11); pre-filling right-side cells from watch data; teaching Yollanda sport-specific notations + methodology docs + watch/sleep data; dedicated **training-shooting module**; special **trick-logging keyboard**; **voice-memo logging** with background transcription; attaching files at **season/goal level** (not just per day); merging **Plan + Planner**; new **left-side UI**; mobile **retroactive logging**; FIS/WSPL results integration expansion; file labels/tags expansion. Verify current status before relying on any of these.

---

# Appendices — Sport-specific mechanics

> Quarantined here per scope: these are the heavily sport-specific logging/analytics that don't generalize. Smaller sport notes are inline above.

## Appendix A — Biathlon

### A.1 Training-shooting log notation [SPORT]

Biathlon shooting is logged as **free-text "grammar"** in a dedicated left-side field, then **parsed by the LLM into structured data** for analysis. Athletes should verify the parse in the table at the bottom of the Shooting analysis (it shows what was written → how it was understood). The notation is flexible — log as much or as little as known.

**Per-line grammar (order):** intensity → position (P/S) → misses → first-shot time / total time → miss positions (clock) → optional shot-order mask. Everything after misses is optional; intensity and position carry down to following lines until changed.

- **Intensity** (required; applies to all following lines until a new intensity): `i0` or `z0` = static shooting; intensity name, usually `i1`–`i5`; `competition` or `race` = race shooting. Put it on its own line to set context, or inline at the start of a line (e.g. `i1 P 0320`).
- **Position** (required; applies until changed): `P` = prone, `S` = standing.
- **Misses** (required): integer `0`–`5` per stage. **Batch entry** logs several stages at once as a digit string — `P 0320` = four prone stages with 0, 3, 2, 0 misses. **Relay**: `X+Y`, where X = missed shots and Y = spare rounds used (e.g. `0+2`).
- **First-shot / total time** (optional): seconds separated by `/` — `14/29` = first shot 14 s, stage 29 s. Use `-` for an unknown value (`-/25`, `13/-`).
- **Miss positions / shot-order mask** (optional): clock numbers `1`–`12` for where misses went, separated by `'`, `` ` ``, or `,` (e.g. `3' 11' 12'`). To record the full sequence, log all five shots with `x` = hit and a clock number = miss at that position (e.g. `x9xxx` = 2nd shot missed at 9 o'clock; `4x5xx` = 1st missed at 4, 3rd missed at 5).

Examples:
```
i0        // static shooting
P 0320    // four static prone stages – 0, 3, 2, 0 misses
S 0210    // four static standing stages – 0, 2, 1, 0 misses

i3              // i3 intensity
P 1 14/29 6     // prone, 1 miss, first shot 14 s / stage 29 s, miss at 6 o'clock

competition       // race shooting
P 0 13/25         // prone, clean, first shot 13 s / stage 25 s
S 2 14/28 3xxx11  // standing, 2 misses – 1st missed @3, 5th missed @11
```

Verify the parse in **Analytics → Shooting analysis** (table at the bottom shows what was written → how it was understood).

Logging workflow varies [CONFIG]: a coach with a few athletes logs directly on the range; otherwise athletes log from a photo of the range paper. A dedicated training-shooting module is on the roadmap.

### A.2 Shooting analysis [SPORT]

From parsed training and competition shooting: overall hit rate; prone/standing split; first-shot time; total/stage shooting time; shooting by intensity; trends across mesocycles/seasons; athlete comparison. **Miss detail:** "missed shots on the clock" target visualization (prone/standing), misses by target position, misses by shot order. (Insight: a *picture* of the target made the data usable for coaches where a table didn't.)

### A.3 Race analyses (IBU / SIWIDATA) [SPORT]

Automatic from the full IBU database (results appear ~minutes after a race), so **any athlete in the world** can be analyzed without manual entry:
- **Race overview** — team skiing/shooting stats and deviations across the season; per discipline: winner, best national athlete + rank, average of top-N nationals vs average of top-5 in race, in **course time / shooting time / "in-out"** (range time minus shooting time = time skiing on the range).
- **Race detail / deviation** — single race: our athletes vs the field; every split/intermediate; course times, range times, shootings, in-outs.
- **Athlete results** — full IBU race history; behind the average of top-5/top-10; prone/standing accuracy; trend **by age** (compare to anyone by age, not season).
- **Race progress** — head-to-head vs any specific competitor (e.g. vs the winner) split-by-split, with the same section highlighted across laps; pacing.
- **Competition shooting vs reference group** — e.g. vs **top-10 World Cup** average (red) and worst-of-top-10 (orange); first-shot and average shooting time; multi-season trend (e.g. top-10 average shooting time fell ~28.3 s → ~25.4 s over five seasons).
- **Service-team analysis** — ski-prep patterns; top-N nations ski comparison.

### A.4 Biathlon test forms [SPORT/CONFIG]
NTT shooting tests, precision shooting tests, "Norwegian/French/German" tests, SCM shooting tests, uphill-run (Suchánek, twice/season), SkiErg, spiroergometry, strength tests (arms/legs), biochemistry/blood (e.g. ASTRUP) — evaluated vs federation limits and age categories.

## Appendix B — Freestyle Ski / Snowboard [SPORT]

- **Separate instances** for freestyle snowboard and freestyle ski (differences warrant it).
- **Trick logging** in the left side using **FIS-style notation** plus an **A–E quality rating** (A = excellent, B = above average, C = average, D = below average, **E = crash**). The mask captures rotation/axis (e.g. double cork, flat 7), grip, and switch/backside/frontside; a logged trick "represents, not attempts." Methodology is documented per federation. The free-ski side uses a related **"stomping rate."** Built for jump/airbag training (not slopestyle runs).
- **Right side** logs surfaces/contexts (snow, jumps, rails, airbag) and times (time on snow, time on rails) → e.g. "not enough rail time" insights.
- **Analytics:** top-5 tricks, top tricks with rotation >1080, by rotation/axis, count + A–E landing breakdown, trend over season; Yollanda can query tricks once taught the codes.
- **FIS analytics** (customizable per federation): athlete results trend by age vs anyone; junior→senior association (e.g. top-5 as junior → ~60% chance of top-5 senior World Cup ≥twice; not top-15 junior → ~17%); alpine first-run vs second-run; filter by country.
- Fitness/medical tabulars set up by the team: power testing, performance review, **SCAT6** (concussion), injury documentation.

---

## Quick glossary
**ACWR** Acute:Chronic Workload Ratio · **ASMR** Athlete Self-Monitoring Report (wellness questionnaire) · **RPE/sRPE** (session) Rating of Perceived Exertion (Borg CR10) · **TRIMP** Training Impulse (intensity × time-in-zone) · **RTC** Roční tréninkový cyklus (Annual Training Cycle / season review) · **SIWIDATA** IBU's biathlon results data provider · **OSIICS** sports-injury diagnosis coding standard · **PWA** progressive web app (add-to-home-screen).
