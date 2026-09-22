# Module Spec: Medical module (Injuries & Illnesses) — internal

> Internal specification. NOT published. Source for the user-facing docs page + image plan.

## 0. Meta
- **Module:** Medical module — "Injuries & Illnesses"
- **Route(s):** `/medical` (Entire Group overview) · `/medical/<recordId>` (record detail)
- **Nav path:** classic top-nav → **OTHER → Medical module**; also reachable from the GUI 2.0 icon rail (medical/scan icon)
- **UI shell:** **GUI 2.0** (totem panel + module sidebar). The **Entire Group overview renders DARK**; the per-record list + detail render light.
- **Surfaces:** web (PWA)
- **Primary roles:** coach, medical/staff; athlete (own records)
- **Config-dependence:** **high** — visibility/edit rights are permission-controlled and depend on each instance setup: sometimes athletes can see *and* edit their own records, other times athletes **can't see the Medical module at all** (coaches/medical staff only). The **Circumstances codelists** are also configured per instance.
- **Explored:** 2026-06-14 · group *National Team* · athlete *Simpson Lisa* · coach acct *Bart Simpson* + athlete acct *Lisa* · by main agent (live)
- **Re-cast:** 2026-09-20 to **AFC Richmond** (Ted Lasso coach · Jamie Tartt athlete) for the
  figure rebuild — see §13.
- **Re-verified live on AFC Richmond, 2026-09-20** (coach session, Ted Lasso), confirming or
  correcting the 2026-06 biathlon pass:
  - The module **is enabled** for AFC Richmond, and the group started with **no records at
    all** (every athlete "No health problems").
  - Routes: `/medical?group={id}` (overview) · `/medical?group={id}&athlete={id}` (that
    athlete's Open/Closed lists) · `/medical/{uuid}?group=&athlete=` (a record). The query
    parameters are honoured, so the scripts can deep-link.
  - `data-cy` hooks (the full set is in `tooling/seed/medical-lib.mjs`): `add-health-issue`
    with `add-health-issue-injury` / `-illness`, `health-issue-list-item`,
    `health-issue-title`, `classification-button`, `treatment-status-button`,
    `health-issue-status-button`, `responsible-staff-button`, `health-issue-date-button`,
    `expected-return-date-button`, `add-circumstance-button`, `notes-editor`,
    `add-diagnosis-button`, `add-files-button`, `comment-form`, `remove-health-issue`,
    `medical-help-button`, and `datepicker-navigation` / `datepicker-day` /
    `previous-month` / `next-month` in the calendar.
  - **A new record's defaults:** Classification *New* · Treatment Status *Open* · Injury
    Status **Modified training** · date of injury = today. (The 2026-06 note didn't record a
    default limitation; there is one.)
  - Dropdown labels confirmed verbatim: *New / Recurring*, *Open / Closed*, *Full training or
    competition / Modified training or competition / No training or competition*. The
    **Activity log shortens them** — it reads "changed injury status to No training".
  - Delete confirm is **"Yes, delete"**; the floating tool bar is *+ New quick entry `N`* ·
    *?* · bin ("Delete injury").
- **Render images now?** YES (new GUI; overview is dark)

## 1. Purpose & why it exists
One place for the team's health picture — who is injured or ill, how it limits their
training, when they're expected back — plus the full history that makes injury patterns
visible. The training-limitation status flows into Analytics readiness, so "who's
available" is answered the same way everywhere.

For **individual sports** it's just as valuable per athlete: the complete medical log of a
single athlete — every injury, illness, diagnosis, and therapy note — kept in one place
across their whole career, not scattered across clinics and spreadsheets.

## 2. Jobs to be done (per role)
- **Coach / medical staff:**
  - When an athlete gets hurt or ill, I want to log the problem and its training
    limitation, so the whole team knows their availability.
  - When I plan the week, I want to see who's out and when they return, so I don't plan
    load an athlete can't do.
  - When a problem recurs, I want the history, so I can act on patterns, not just the
    current flare-up.
- **Athlete:**
  - When I have a niggle or illness, I want to see (and, where allowed, record) my own
    health record, so my coach and medical staff have the picture.

## 3. Personas & permissions
- **Coach / medical staff:** full access — Entire Group overview, every athlete's records,
  create / edit / close, diagnosis, files, responsible staff.
- **Medical staff / physiotherapist:** typically coach-type accounts with full access — log
  and manage records, therapy notes, diagnoses, files.
- **Athlete:** **permission-dependent, varies per instance.** Two confirmed ends of the model:
  - **Fully enabled** (this instance — confirmed athlete session 2026-06-15, *Simpson Lisa*):
    the athlete has **full access to their OWN records** — the Injuries & Illnesses lists
    (Open/Closed), the full record detail (Properties, Key Dates, Circumstances, Note, OSIICS
    Diagnosis, Files, Activity), **and the New quick entry affordance** (she can create entries).
    She sees **only her own** records (no Group section / athlete switcher, no group in the
    breadcrumb).
  - **Hidden entirely:** in other setups athletes **cannot see the Medical module at all** —
    coaches/medical staff only.

## 4. Key concepts & vocabulary
- **Record type:** **Injury** (flower/asterisk icon, blush) or **Illness** (triangle/warning icon). Chosen at creation.
- **Classification:** **New | Recurring**.
- **Treatment Status:** **Open | Closed**. (Closed records get a check and live under "Closed".)
- **Injury Status = training limitation:** **Full training or competition** (green) · **Modified training or competition** (amber) · **No training or competition** (red). This colour is the **status pill** shown on the overview and list.
- **Key Dates:** **start date**; **Expected return to full training** (shown on the overview; **overdue** dates render red as "X days overdue"); and a **Closure date** that appears once the problem is Closed.
- **Diagnosis:** **OSIICS-coded** — a code + label (e.g. `AL1 Sprain lateral collateral ligament ankle`), a **Side** (Left / Right / Bilateral / Unknown), and auto-applied **tags** (body region / structure, e.g. *Right · Ankle · Ligament · Ligament/joint capsule*). The codelist is **filtered by record type** — injuries show OSIICS **injury** codes, illnesses show OSIICS **illness** codes. Diagnosis labels are available in **Czech alongside English** (changelog 2025-10-13); the code is the same either way. **Yarmill ships OSIICS version 16** (product owner, 2026-09-21) — the current release, published 1 Nov 2025.

  **What OSIICS is** (external standard, researched 2026-09-20 from johnorchard.com and the
  v16 workbook — full brief in the docs session, canonical link
  <https://www.johnorchard.com/osiics.html>):
  - **Orchard Sports Injury and Illness Classification System**, maintained by John Orchard
    and colleagues; previously OSICS (Orchard Sports Injury Classification System) — the
    second "I" was added in 2020 on a recommendation of the 2019 IOC consensus meeting,
    though illness codes themselves date from v10 (2007). First published 1993.
  - **Current release: version 16, 1 November 2025.** Structural changes now go through the
    IOC consensus panel.
  - **One list, two grammars.** Injury codes: char 1 = body region (`A` ankle, `K` knee, …),
    char 2 = tissue/pathology (`L` ligament sprain, `M` muscle, `F` fracture, …), chars 3–4 =
    the specific diagnosis; mostly 3 characters. Illness codes: char 1 = `M`, char 2 = organ
    system, char 3 = etiology, chars 4–5 = specific; 4–5 characters. Because the region is the
    first character, detailed codes roll up to region-level rates without re-coding.
    (Wikipedia is wrong here: etiology is the 3rd character of *illness* codes only.)
  - Worked examples: `AL1` Sprain lateral collateral ligament ankle · `QTA` Achilles
    tendinopathy · `TM1` Hamstring strain/tear · `PFE` Fifth metacarpal fracture ·
    `MPII` Influenza virus · `MPIT` Tonsillitis.
  - **Free to use with acknowledgement** — the site asks explicitly for an acknowledgement in
    commercial projects and papers. No fee, no registration; the v16 paper and its code tables
    are CC BY 4.0. **The docs page therefore carries the acknowledgement and the link.**
    The version-16 paper, which the page cites: Orchard et al., *JSAMS Plus* 2025;6:100119,
    doi:10.1016/j.jsampl.2025.100119 (open access). The earlier BJSM paper is Orchard et al.,
    *Br J Sports Med* 2020;54(7):397–401, doi:10.1136/bjsports-2019-101921.
  - One of the **two systems recognised by the IOC consensus statement** on recording injuries
    and illnesses (the other is SMDCS); OSIICS 13 operationalised the 2020 statement jointly
    with SMDCS so rates stay comparable between them.
  - Translations shipped with v16: English, Italian, Spanish. **No Czech** — any Czech
    diagnosis label in Yarmill is Yarmill's own localisation against the English code.
  - OSIICS codes **what the diagnosis is**, not mechanism or severity — those stay in
    Circumstances and the key dates.
- **Circumstances:** categorised attributes — **Activity · Injury mechanism · Location · Severity · Surface** (each a **hover** submenu of values). These are **Yarmill codelists configured per instance — not OSIICS** and unrelated to the diagnosis. What **AFC Richmond** offers (live, 2026-09-20 — another instance will differ):

  | Category | Values |
  |---|---|
  | Activity | Warmup · Training · Gym · Competition · Not related to sport · Unknown · Other |
  | Injury mechanism | Contact · Non-contact · Indirect contact |
  | Location | Domestic training environment · Training camp · Competition · Unknown · Other |
  | Severity | Mild · Moderate · Severe |
  | Surface | Artificial turf · Grass · Gym · Indoor · Concrete · Terrain |
- **Responsible Staff:** free-text staff member or institution.
- **Note:** free text. **Files:** medical documents on the record — medical reports, X-ray and MRI images, physiotherapy plans, and similar. **Activity:** automatic change log + timestamped comments.

## 5. Information architecture
- **GUI 2.0 shell:** left **icon rail** (Training Management grid · Analytics · **Medical** [active] · Settings · user avatar) + **module sidebar**.
- **Sidebar** — header "Medical Module"; nav item **Injuries & Illnesses**; **coach only:** a **Group** section (group dropdown + **Entire Group** + athlete list). **Athlete:** sidebar stops at "Injuries & Illnesses" (no group/athletes).
- **Two views:** the **Entire Group overview** (dark table) and the **per-athlete record list + detail**.
- **Breadcrumb:** scan-icon › Injuries & Illnesses › [group ▾ | athlete] › [record].

## 6. Screen & UI inventory

### 6.1 Entire Group overview (coach) — DARK
- Columns: **Status** · **Athlete** · **Open health problems** · **Expected return to full training**.
- Row per athlete: **status pill** (the athlete's worst current training limitation — red/amber/green) · avatar + name · stacked list of **open problems** (type icon + name) · expected-return date (or `–`); **overdue** shown red ("63 days overdue").
- Empty state per athlete: greyed "No health problems" (green pill).
- Top bar: sidebar-collapse, breadcrumb, group dropdown.

### 6.2 Record list (per athlete)
- Sections **Open (n)** and **Closed (n)**.
- Card: **type icon** (injury flower / illness triangle) · **title** · **status pill** (training limitation) · **classification** bolt glyph · **date** · closed records show a **check**.
- Top of panel: **+** (create) and a sidebar-collapse toggle.

### 6.3 Record detail
- **Title** (inline-editable) + type icon.
- **Properties** row (each a dropdown):
  - **Classification** — `field: select · New | Recurring · default New`
  - **Treatment Status** — `select · Open | Closed · default Open`
  - **Injury Status** (training limitation) — `searchable select · Full / Modified / No training or competition`
  - **Responsible Staff** — `free text · "Enter medical staff or institution" · Save/Cancel`
- **Key Dates:** **start date** (auto-set to today on create; editable via calendar) · **Expected Return** (calendar picker; clearable ×) · **Closure date** (appears once the record is set to Closed).
- **Circumstances:** `+` opens a categorised picker (Activity · Injury mechanism · Location · Severity · Surface), each a submenu of per-instance configured values (**not OSIICS**).
- **Note:** free-text box (auto-save).
- **Diagnosis:** `+` → searchable **OSIICS** picker + **Side** select + **Add** (`Ctrl`/`⌘`+`↵`). Confirmed live 2026-09-20: searching "ankle sprain" returns *Ankle sprains ALJ · Sprain lateral collateral ligament ankle AL1 · Sprain medial collateral (deltoid) ligament ankle AL2 · Ankle multiple ligaments sprain ALM* — **label first, code last**. Picking a result and a Side does **not** commit; the inline row shows *Cancel* / *Add* and only Add attaches it. Added diagnosis shows code + label + auto-tags. **The codelist is filtered by record type** — injuries search injury codes, illnesses search illness codes. The section carries the line **"Diagnoses are defined using the OSIICS code list↗ to ensure consistent reporting"**, whose link opens the codelist — currently a **Google Sheets copy**, not johnorchard.com. `TODO(yarmill): worth asking whether that link should point at the source.`
- **Files:** `+` attach medical documents — reports, X-ray/MRI images, physiotherapy plans, etc.
- **Activity:** chronological log (created, status changes, renamed, dates added) + a **Leave comment** box.
- **Floating toolbar (bottom):** **+ New quick entry** (`N`) · **? help** · **delete (bin)**.
- States: empty (new record placeholder title "New Injury/Illness") · filled · overdue.

### 6.4 New quick entry
- Triggered by **+ New quick entry** (floating toolbar) or the **`N`** shortcut → opens a
  **New entry** modal: **Entry type** (Injury / Illness) · **Name of injury/illness** ·
  **Status** (training limitation) · **Date** · **Files** (Add files / drag & drop) — with
  **Open full detail** (jump to the full record) and **Save**. Nothing is created until Save.

## 7. Actions & interactions
- **Create:** `+` → **Injury / Illness**; record opens with start date = today, status Open, classification New, a default training limitation. Activity logs "created new injury/illness".
- **Edit properties:** click each pill → dropdown; selection auto-saves and logs (e.g. "changed injury status to No training").
- **Set dates:** start + expected return via calendar; expected return clearable.
- **Add diagnosis:** OSIICS search → pick → set Side → Add; auto-tags region/structure.
- **Add circumstances / note / files;** **comment** in Activity.
- **Close:** Treatment Status → **Closed** (moves to Closed section, gets check, picks up a closure date). **Closing also sets the training limitation to Full training automatically** (changelog 2025-10-13), so the athlete's availability updates without a second step.
- **Rename:** click title, edit (logs "renamed the injury").
- **Delete:** bin in floating toolbar.
- All edits **auto-save**; every meaningful change is written to **Activity** with actor + date.

## 8. User journeys / flows
**Coach — record a new injury (observed):** `+` → Injury → type title ("Right ankle
sprain (lateral)") → Injury Status = *No training* → Classification = *New* → Treatment =
*Open* → Expected Return = 28/06 → Note (mechanism + plan) → Diagnosis (search "ankle
sprain" → *AL1* → Side *Right* → Add) → Responsible Staff = "Team physiotherapist". Done;
appears in Open with a red pill and on the overview with its return date.

**Coach — check availability:** open **Entire Group** → scan status pills, open problems,
and expected-return dates; overdue returns are flagged red.

**Coach — close a resolved problem:** open record → Treatment Status → **Closed**.

**Athlete — view/record own:** OTHER → Medical module → own Open/Closed list → open a
record (same detail layout, scoped to self; edit where permitted).

## 9. Use cases / scenarios
- **Medical staff log a new problem:** a physio or doctor opens the athlete and records a new
  injury or illness in seconds (type, name, training limitation, date), adding diagnosis and
  files as they go.
- **Coach checks who's ready to train:** before a session, the coach scans the Entire Group
  overview — who's *Full / Modified / No training* — and spots any overdue returns.
- **Coach tracks return-to-training:** the coach follows an injured athlete's progress as the
  training limitation eases *No training → Modified → Full*, against the expected-return date.
- **Physiotherapist logs therapy:** the physio adds therapy notes, updates the status as rehab
  progresses, and attaches the physio plan and imaging.
- **Athlete keeps their record current** (where permitted): after a doctor's visit, an X-ray,
  or an MRI, the athlete adds the new information and files so the picture stays up to date.
- **Reviewing history:** closed records (e.g. stress fracture, influenza, contusion) stay under
  **Closed** with their closure dates, making recurring problems visible across a career.

## 10. Configuration & variants
- `[CONFIG]` Visibility + edit permissions for medical data (per role/team).
- `[CONFIG]` Whether athletes see/edit their own records — or can't see the module at all.
- `[CONFIG]` **Circumstances codelists** — the values under Activity / Injury mechanism /
  Location / Severity / Surface are configured per instance (Yarmill codelists, not OSIICS).
- Standardised, not configurable: the **OSIICS diagnosis** codelist and the
  training-limitation statuses. `[CONFIG]`-adjacent only in language: diagnosis labels render
  in **Czech as well as English**, the code itself is unchanged.

## 11. Edge cases, limits, gotchas
- Overview status pill = the athlete's **worst current** training limitation across open problems.
- Expected return overdue → red "X days overdue".
- Athlete view has **no group/athlete switcher**; only their own records.
- Closed records segregated under "Closed" with a check; still openable/readable.

## 12. Cross-module integration & data flow
- **→ Analytics / Team daily readiness:** the training-limitation status feeds the morning
  readiness overview, so "who's out" is already known.
- **→ Analytics / Recovery indicators & Training load analysis:** illness and injury periods
  are shaded into the **background of those graphs**, so load and recovery trends are read in
  the context of when the athlete was hurt or ill.
- **→ Planning:** expected-return dates inform what load an athlete can take.
- Records accumulate → recurring-problem visibility (prevention, not just availability).

## 13. Shot list (images for the docs page) — SHOT 2026-09-21

Six figures, all real captures of the live app on the seeded **AFC Richmond** data (coach
*Ted Lasso*, athlete *Jamie Tartt*). The two rendered mockups that were on the page (old
National Team / Simpson Lisa, opaque RGB rather than the pipeline's transparent-window
exports) are replaced, not retouched.

| # | Figure key | What it shows | Anchor · crop | Callouts | Placed at | Role |
|---|---|---|---|---|---|---|
| 1 | `record` | Jamie's open ankle sprain: properties, key dates, all five circumstances, note, OSIICS `AL1` with its auto-tags, and the Open/Closed list beside it | `center` · whole window · **hero**, `variant="marketing"` | none — the prose names every part | the lead figure | coach |
| 2 | `overview` | Entire Group (DARK): green/amber/red spread, Roy 22 days overdue, Jamie's two problems, two clear rows | `top` · 3200×1150 · `bleed="bottom"` | none — the pills already mean something | *Who can train today* | coach |
| 3 | `quick-entry` | The New entry modal | `bottom-right` · 2100×1300 · `bleed="left top"` | 3 — entry type, training limitation, Save | *Log an injury or illness* | coach |
| 4 | `diagnosis-picker` | The OSIICS search on "ankle sprain", results showing ALJ / AL1 / AL2 / ALM | `right` · 2000×2000 · `bleed="left"` | 3 — OSIICS code, search in plain words, side | *Code the diagnosis* | coach |
| 5 | `record-list` | Jamie's Open (2) / Closed (4) with closure dates and checks | `left` · 1400×2000 · `bleed="right"` | none | *Close a record, and the history it leaves* | coach |
| 6 | `athlete-view` | Jamie's own session — no group dropdown, no athlete list, no Entire Group | `center` · whole window | none | *What athletes see* | athlete |

**Captured but deliberately not published** (reasons in the footer of `figures/medical.mjs`):
`new-record` (an empty record — the way in here is quick entry, and the hero already shows a
filled one), `create-picker` (a two-item menu the Steps describe), `circumstances-picker`
(per-instance codelists; one team's values would read as the product's).

**Decisions worth keeping:** the hero is the *record*, not the group overview — the overview
is a six-row table in a 1600×1000 window, so a full-window hero would be two thirds empty
dark space, and it works far better as a top-cropped banner in its own section. The athlete
view is the whole window with a record open, because a left crop of "the sidebar that hasn't
got a group switcher" is a tall strip of nothing.

## 14. Open questions / TODO(verify)
- **Files** upload: accepted file types / size limits.
- *Resolved:* quick-entry fields → §6.4 · illness vs injury = diagnosis codelist filtered by
  type → §4 · athlete permissions = genuinely instance-dependent → §3 · Closure date → §6.3 ·
  **Circumstances value lists → §4 (read live off AFC Richmond 2026-09-20)**.
- *Resolved 2026-09-21, live:*
  - **The closure date is editable** — the seeder set real historical closure dates on four
    closed records and they held; the record list shows them on the closed cards.
  - **An illness record has no Side** on its diagnosis. The select simply isn't rendered, so
    a side is an injury-only concept. (Cost two diagnoses on the first seeding pass.)
  - **Athletes on AFC Richmond have the fully-enabled end of the permission model** —
    Jamie Tartt's own session shows his six records and nothing else, a sidebar that stops at
    "Injuries & Illnesses" with no Group section, and **both create affordances** (Add record
    and New quick entry). So this instance is the "athlete can see and edit their own" case.
  - **Yarmill ships OSIICS version 16**, and **there are no reports built on diagnosis codes
    yet** (product owner, 2026-09-21). The docs page therefore argues consistency and
    portability, not in-product analysis — don't let that claim drift back.
  - **"Open full detail" in quick entry creates the record** (product owner, 2026-09-21), so
    both it and Save commit the entry — only closing the dialog outright discards it. §6.4's
    "Nothing is created until Save" is therefore half the story.
  - **A closed record can be reopened** — its Treatment Status dropdown still offers *Open*
    alongside *Closed*. Verified read-only on a closed record (nothing changed).
  - **The in-app "OSIICS code list" link goes to a Google Sheets copy of the full codelist on
    purpose** (product owner, 2026-09-21). The *docs* acknowledge OSIICS and link
    johnorchard.com as the source of the standard; the app's link is the working codelist.
    Not a bug — don't "fix" it.

## 15. Source log
Observed **live** on 2026-06-14, National Team / Simpson Lisa, both coach (Bart Simpson)
and athlete (Lisa) sessions. Created the "Right ankle sprain (lateral)" record end-to-end
and tidied Lisa's other records (renamed jjhk → Lower back stiffness; zlomena noha → Left
tibia stress fracture; "to je zla nemoc todleto" → Influenza; pad do kanalu → Lower-back
contusion). OSIICS context from the master reference. **Confidence: high** on UI/controls,
quick-entry (opened live), and athlete view (opened live). Permission *defaults* are
genuinely instance-specific, not low-confidence.

**Athlete-session re-confirmation (2026-06-15):** a clean athlete session (role "Athlete",
*Simpson Lisa* logged in, one login per browser) confirmed the **fully-enabled** end of the
permission model in this instance — Lisa has full access to her OWN Medical records (Open/Closed
lists, full record detail, and the **New quick entry** affordance to create entries), seeing only
her own records (no group/athlete switcher). This confirms the permission-dependent model from
both ends: athlete medical access can be **fully enabled** or **hidden entirely** (§3). Her top
nav is the full classic top-nav with **no group/athlete switcher**; athlete Settings = "Personal".

## 16. Docs page plan
- **Audience line:** `<PageMeta audience="Coaches, medical staff & athletes" where="Web app" />`
- **Page outline as shipped 2026-09-20** (rebuilt along the Goals page's shape — lifecycle
  order, a hero, `<Steps>` for each procedure, `<ParamField>` for the fields, the
  configurability caveats marked):

  | Page section (H2) | Fed by |
  |-------------------|--------|
  | lede + `<PageMeta>` + hero figure + `<Tip>` (set the limitation the day it happens) | §1, §0, §12 |
  | Where to find Injuries & Illnesses — `<Info>` permissions + module-availability line | §3, §10 |
  | Who can train today — the group overview, worst-limitation pill, overdue flag, empty row | §6.1, §11 |
  | Log an injury or illness — `<Steps>` (quick entry first), the create defaults, auto-save | §6.4, §7 |
  | ### What a record holds — `<ParamField>` per field | §4, §6.3 |
  | Code the diagnosis — the flow, then **what OSIICS is and why the code matters** + the acknowledgement `<Info>` | §4 (OSIICS block) |
  | Track the return to training — No → Modified → Full, expected return, Activity | §4, §7 |
  | Close a record, and the history it leaves — closure date, auto Full training, Recurring | §7, §9 |
  | Delete a record — `<Warning>`-weight caveat: close, don't delete | §7 |
  | What athletes see | §3 |
  | How it connects | §12 |

- **Departures from the Goals page's order, and why:** the group overview leads (it is this
  module's landing screen and its daily job, where Goals leads with a single goal); the record
  anatomy sits as an `###` under the create procedure rather than front-loading a ten-field
  spec; the diagnosis takes the H2 slot key results hold in Goals, because it is the second
  procedure *and* the one standardised codelist in a module that is otherwise
  permission- and config-dependent; Circumstances deliberately gets no section of its own.
- **Cross-links:** `/en/analytics/analytics` (Team daily readiness, recovery & training-load
  charts) · `/en/tutorials/read-readiness` · `/en/platform/files`.
- **UI labels — use them verbatim, do not translate them into nicer words.** An earlier
  version of this table mapped "Injury Status → training limitation", the page followed it,
  and the product owner rejected it: there is no such thing as a training limitation in the
  UI, so a reader cannot find it. The rule is now in `writing-instructions.md` §9.
  | UI label | Use in the docs |
  |----------|-----------------|
  | Injury Status | **Injury status** (explain it as "how much the athlete can do right now") |
  | Treatment Status | **Treatment status** (Open / Closed) |
  | Date of injury · Expected return to full training · Closure date | each by its own name; **Key Dates** only as the group heading |
  | Name · Type | two separate fields, never merged into one entry |
  | Totem panel | (internal only — not surfaced in user docs) |
- **Field order on the record**, which the docs list must follow: Name · Type ·
  *Properties* (Classification · Treatment status · Injury status · Responsible staff) ·
  *Key Dates* (Date of injury · Expected return to full training · Closure date) ·
  Circumstances · Note · Diagnosis · Files · Activity.
- **Creating a record:** the **+** above the record list is the primary path — it opens the
  full record straight away. **New quick entry** is the shortcut, not the main route; the page
  documents it that way.
- *Resolved at the 2026-09-21 shoot:* the overview column reads **"Open health problems"**
  and the empty state **"No health problems"** — visible in `images/medical/overview.png`. The
  2025-09-24 changelog's "health issues" is the internal/API word (`data-cy=add-health-issue`),
  not the column label. The page says *health problems*; leave it.
