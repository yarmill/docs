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
- **Diagnosis:** **OSIICS-coded** — a code + label (e.g. `AL1 Sprain lateral collateral ligament ankle`), a **Side** (Left / Right / Bilateral / Unknown), and auto-applied **tags** (body region / structure, e.g. *Right · Ankle · Ligament · Ligament/joint capsule*). The codelist is **filtered by record type** — injuries show OSIICS **injury** codes, illnesses show OSIICS **illness** codes.
- **Circumstances:** categorised attributes — **Activity · Injury mechanism · Location · Severity · Surface** (each a submenu of values). These are **Yarmill codelists configured per instance — not OSIICS** and unrelated to the diagnosis.
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
- **Diagnosis:** `+` → searchable **OSIICS** picker (results show code, e.g. `ALJ / AL1 / AL2 / ALM`) + **Side** select + **Add** (⌘↵). Added diagnosis shows code + label + auto-tags. **The codelist is filtered by record type** — injuries search injury codes, illnesses search illness codes.
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
- **Close:** Treatment Status → **Closed** (moves to Closed section, gets check).
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
  training-limitation statuses.

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

## 13. Shot list (images for the docs page)
| # | Screen / state | Sample data | Caption (draft) | Callouts | Supports doc section | Role | Render now? |
|---|----------------|-------------|-----------------|----------|----------------------|------|-------------|
| 1 | Entire Group overview (DARK) | Lisa: ankle sprain (in 14 days) + COVID-19 overdue + lower-back stiffness; other athletes' rows | "Injuries & Illnesses opens on the group: each athlete's status, open problems, and expected return — overdue flagged." | Status pill · open problems · expected return / overdue | The team overview | coach | **new GUI — render now** ✅ done → `images/medical/overview.png` |
| 2 | Record detail (light) | Right ankle sprain (lateral): properties, dates, note, OSIICS diagnosis | "A health record: type and properties, key dates, an OSIICS diagnosis, note, files, and the activity log." | Properties row · Key dates · Diagnosis (OSIICS) | A health record | coach | **new GUI — render now** ✅ done → `images/medical/record.png` |
| 3 | Create picker | `+` → Injury / Illness | "Start a record by choosing Injury or Illness." | the two record types | Record a new problem | coach | new GUI — render later (small) |
| 4 | Athlete record list | Lisa's own Open/Closed, no group switcher | "As an athlete you see only your own records." | "you see your own records" | What athletes see | athlete | shot-list (optional render) |

## 14. Open questions / TODO(verify)
- Full **Circumstances** value lists — configured per instance, so they vary; capture a
  representative set when documenting a specific instance.
- **Files** upload: accepted file types / size limits.
- *Resolved:* quick-entry fields → §6.4 · illness vs injury = diagnosis codelist filtered by
  type → §4 · athlete permissions = genuinely instance-dependent → §3 · Closure date → §6.3.

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
- **Audience line:** `**For:** coaches and medical staff; athletes where permitted · **Where:** Web app`
- **Proposed page outline** (used for the published page):
  | Page section (H2) | Fed by |
  |-------------------|--------|
  | intro + audience line + `<Info>` permission note | §1, §0, §3, §10 |
  | The team overview (+ overview image) | §6.1 |
  | A health record — `<ParamField>` per field (+ record image) | §4, §6.3 |
  | Record a new problem — `<Steps>` | §6.4, §7, §8 |
  | Closing and history | §4 (Closure date), §7 |
  | What athletes see | §3 |
  | Why keep it here | §12 |
- **Cross-links:** `/en/analytics/analytics` (Team daily readiness, recovery & training-load charts).
- **UI label → doc term:**
  | UI label | Doc term |
  |----------|----------|
  | Injury Status | training limitation |
  | Treatment Status | treatment status (Open/Closed) |
  | Totem panel | (internal only — not surfaced in user docs) |
