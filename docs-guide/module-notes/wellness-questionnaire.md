# Module Spec: Wellness questionnaire (ASMR) — internal

> Internal specification. NOT published (excluded via `.mintignore`). Source for the
> user-facing docs page + image plan. Fill every section; leave `TODO(verify)` where unsure.

## 0. Meta
- **Module:** Wellness questionnaire — daily self-report (a.k.a. **ASMR**, *Athlete Self-Monitoring Report*; "well-being questionnaire")
- **Route(s):** coach view (verified): `/evidence/wellness?group={id}&athlete={id}&week=…`
  (the record table). The fill-in **wizard** is reached from **New record** on that screen;
  `TODO(verify)` the wizard's own URL, if any.
- **Nav path:** two entry points —
  1. classic top-nav → **OTHER → Wellness questionnaire** (the module record table; per-athlete
     selection via the standard left **group panel** — group → Entire Group + athletes) (verified);
  2. from a **day's ⋯ (three-dots) menu in the Training Log** (open the day, choose *Wellness
     questionnaire*) — `[CONFIG]` the day's ⋯ menu entries are configured per instance (per the
     Training Log spec; `TODO(verify)` the athlete-side path this pass).
- **UI shell:** **mixed.** The module table is reached via the **classic light top-nav** (OTHER)
  and **renders light**, but the **fill-in form itself is a new-GUI screen** (GUI 2.0 — a clean
  full-screen wizard, one of the new-design modules alongside Goals and Medical). Note both in the
  docs: *access via classic top-nav; the input form is GUI 2.0.*
- **Surfaces:** **web + mobile** (athletes typically fill it in on the phone each morning;
  `TODO(verify)` mobile behaviour of the wizard).
- **Primary roles:** **athlete** (fills it in), **coach** (reviews — and **can fill on an
  athlete's behalf** via New record, verified). Medical/staff review via Analytics where permitted.
- **Config-dependence:** **high** — the **dimension set, scale labels, and number of items are
  configured per instance/team** (ASMR is `[CONFIG]` in the master reference). Mechanics (one
  record per day; edit/delete; feeds Wellness + Team daily readiness) are universal.
- **Explored:** 2026-06-15 · **clean coach session** (coach *Bart Simpson*) · group *National
  Team* · athlete *Em Krystof* (rich wellness data) · **coach table + 7-step input wizard opened
  live** this pass (see §15); Analytics linkage of wellness not re-confirmed this pass.
- **Render images now?** **Mixed.** The coach record table is classic UI — **render later**. The
  **input-form wizard is a priority new-GUI render target** (the clean new-design form the team
  wants imaged) — see §13.

## 1. Purpose & why it exists
A one-minute morning check-in from each athlete — sleep, stress, mood, soreness, fatigue,
and a note to the coach — that turns subjective state into trended data. On its own each
record is small; across a squad and across weeks it becomes the **team readiness picture**:
who slept badly, who's carrying fatigue, who's flagging before the numbers from devices catch
up. It is the athlete's *own voice* in the readiness story, alongside device recovery and
medical status.

The value is **timing**: readiness data is only useful **before** the session. Filled in each
morning, it lets a coach adjust today's load before the athlete trains; filled in after, it's
just history.

## 2. Jobs to be done (per role)
- **Athlete:**
  - When I wake up, I want to log how I slept and feel in under a minute, so my coach has
    today's picture before I train.
  - When something's off (poor sleep, a niggle, life stress), I want to flag it with a note,
    so my coach can adjust today's plan instead of finding out afterwards.
- **Coach:**
  - When I plan the morning, I want to see each athlete's self-report alongside device recovery
    and medical status, so I can decide who trains full, who's modified, who rests — before the
    session, not after.
  - When I review an athlete, I want to see their wellness metrics trended over weeks, so I can
    separate a one-off bad night from a downward trend.
- **Medical / staff** (where permitted): When I assess an athlete, I want their self-reported
  fatigue/soreness over time as context for load and recovery.

## 3. Personas & permissions
- **Athlete:** fills in their **own** daily record, reached from the **Reality day card ⋯ (more)
  menu → "wellness questionnaire"** (opening the same 7-step wizard); can **edit or delete** their
  own records from the list. Sees their own history. (Confirmed athlete session 2026-06-15: the
  athlete's Reality day ⋯ menu contains *training shooting · notes · feeling scale · heart rate ·
  mental condition · attachment · import plan · wellness questionnaire*; the athlete's top nav is
  the full classic top-nav with **no group/athlete switcher**, scoped to themselves, Settings =
  "Personal".)
- **Coach:** **reviews** — selects an athlete via the left group panel to see that athlete's
  records, and uses **Analytics** for the group view (Wellness trends + Team daily readiness).
  A coach **can also create/edit an athlete's record on the athlete's behalf** — **New record**
  opens the same fill-in wizard, and each table row has per-row **edit/delete** (verified live).
- **Medical / staff:** review via Analytics where their account has access. `TODO(verify)` exact
  gating.
- `[CONFIG]` Visibility and whether the module appears at all is instance-configured (it lives
  under OTHER / the Journal group only where enabled).

## 4. Key concepts & vocabulary
- **Record / entry:** **one per day** per athlete (the day's self-report). Keyed by **Date**.
- **Item / dimension:** a single rated question (Sleep, Stress, Mood, Soreness, Fatigue, …).
  **The set is `[CONFIG]` per instance/team** — typically ~5–6 items. Other instances may include
  *readiness to train*, *injury/illness feeling*, etc. (master reference §5.6).
- **Scale:** each dimension is a **numbered scaled code-list** (a number badge + a plain-language
  label). `[CONFIG]` scale length and label wording vary per team and per dimension. **Lower
  number = better** in this instance (`1 Excellent`); `TODO(verify)` whether scale direction is
  consistent across all configured items or can be reversed per item.
- **Verified dimension set & scales (this biathlon instance, `[CONFIG]` — document as the
  example, not as universal):**
  - **Sleep:** `1 Excellent · 2 Good sleep · 3 Neutral · 4 Bad sleep · 5 Very bad sleep`
  - **Stress:** `1 No stress · 2 Low stress · 3 Mild stress · 4 Moderate stress · 5 High stress`
  - **Mood:** `1 Very happy · 2 Happy · 3 Neutral · 4 Sad · 5 Bad mood`
  - **Soreness:** `1 No soreness · 2 Mild soreness · 3 Moderate soreness · 4 High soreness`
  - **Fatigue:** `1 No fatigue · 2 Mild fatigue · 3 Moderate fatigue · 4 High fatigue`
  - **Notes:** free text (emojis allowed).
  Note Sleep/Stress/Mood run 1–5 while Soreness/Fatigue run 1–4 in this instance — scale length
  varies per dimension. `TODO(verify)` whether the dimension set/scales are self-serve
  configurable (vs. set by Yarmill).
- **Note / message to the coach:** optional free-text field on the record.
- **ASMR:** *Athlete Self-Monitoring Report* — the internal/clinical name; user-facing label is
  **Wellness questionnaire**.
- **Wellness (analysis):** the Analytics view that trends each metric over time (§12).
- **Team daily readiness:** the Analytics morning overview that combines this self-report with
  device recovery and medical status (§12).
- Demo note: the National Team demo is biathlon; **Em Krystof** carries rich wellness history
  for screenshots/trends. Verified field labels on we.yarmill.com: **Date, Sleep, Stress, Mood,
  Soreness, Fatigue, Notes**.

## 5. Information architecture
- **Two halves to the experience:**
  - **The module (list of records)** — reached via classic top-nav **OTHER → Wellness
    questionnaire**. Shows the athlete's records, with **New record** and per-row **edit /
    delete** (verified module UI, we.yarmill.com).
  - **The fill-in form (new GUI)** — the input screen where an athlete rates each item and adds
    a note. The **athlete self-fills via the Reality day card ⋯ (more) menu → "wellness
    questionnaire"** (the day's ⋯ menu in the Training Log / Reality), which opens the same 7-step
    wizard (confirmed athlete session 2026-06-15, §3, §15).
- **Coach review path:** select an athlete → see their records; or go to **Analytics → Wellness**
  (trends) and **Analytics → Team daily readiness** (morning overview).
- **Related modules:** [Training Log](/en/reality/training-log) (alternate entry point + the
  diary it complements), [Analytics](/en/analytics/analytics) (Wellness + Team daily readiness),
  [Medical module](/en/medical/medical-module) (its status also feeds Team daily readiness),
  [Integrations](/en/platform/integrations) (device recovery that sits beside wellness in
  readiness).

## 6. Screen & UI inventory
> The coach record table and the new-GUI fill-in wizard were both opened live this pass
> (clean coach session, 2026-06-15). Remaining `TODO(verify)` items are noted inline.

### 6.1 Record table (the module under OTHER) — verified live
- Route: `/evidence/wellness?group={id}&athlete={id}&week=…`; **renders light** (classic shell).
- Title: **"Wellness questionnaire"**. Top-right: a **share-link icon** (a chain/link icon —
  likely a shareable fill link; `TODO(verify)` exact behavior) and a magenta **New record** button.
- Layout: a **table of the athlete's records**, one row per day.
- Verified columns: **Date · Sleep · Stress · Mood · Soreness · Fatigue · Notes**
  (`[CONFIG]` — these are the configured dimensions for the verified instance). Each header is
  **funnel-filterable**.
- Controls: **New record** button (opens the wizard, §6.2); per-row **edit (pencil)** and
  **delete (trash)** icons at the right of each row.
- Each dimension cell shows the chosen scale value/label for that day.
- Athlete selection: via the standard left **group panel** (group → Entire Group + athletes).
- States: **filled** (rows of past records, e.g. Em Krystof's history) · **empty** (no records
  yet — `TODO(verify)` exact empty-state copy) · `TODO(verify)` loading/error states.
- `TODO(verify)` whether the table is per-athlete only or has any group/roll-up view here (group
  view is via Analytics, §12).

### 6.2 Fill-in form (new GUI) — a 7-step wizard, verified live
- Shape: a **full-screen, light, GUI 2.0 wizard** with a **green progress bar** and a breadcrumb
  **"Wellness questionnaire > {athlete}"**. **One question per step** — saves as the day's one
  record on final submit.
- Reached from the coach's **New record** button (coach fills on an athlete's behalf); **athletes
  fill the same wizard** themselves.
- **The 7 steps (verified):**
  1. **Date** — the day the record is for, **defaults to today**. `TODO(verify)` filling for a
     past day / date editability range.
  2. **Sleep** — dimension name + plain-language question (e.g. "How did you sleep today?").
  3. **Stress**
  4. **Mood**
  5. **Soreness**
  6. **Fatigue**
  7. **Notes** — free text (emojis allowed).
- Scale steps (2–6): show the **dimension name + a plain-language question** and **large tappable
  option rows**, each = a **number badge + the label** (e.g. "1 Excellent" … "5 Very bad sleep").
- Bottom nav bar: **Back** / **Continue** (Continue advances; supports the **↵ Enter** key).
  `TODO(verify)` whether the final step's button is labeled **Save / Finish** rather than Continue.
- **NOT auto-save:** closing mid-way pops a **"Close Wellness questionnaire without saving?"**
  confirm (**"Yes, close"** / **"No, back to questionnaire"**); the record is **created only on
  final submit**.
- States: **empty** (new record) · **edit** (re-opening today's or a past record) ·
  `TODO(verify)` validation (are all dimensions required, or can a step be left blank?).
- **Priority new-GUI render target** — capture the **Sleep step** for §13 (question + 5 option
  rows + green progress bar). This is the clean new-design form the team wants imaged.

## 7. Actions & interactions
- **New record / fill in:** coach **New record** on the table, or — for the athlete self-filling —
  the **Reality day card ⋯ (more) menu → "wellness questionnaire"** (confirmed athlete session
  2026-06-15) → the same 7-step wizard → **Date → Sleep → Stress → Mood → Soreness → Fatigue →
  Notes**, **Continue** through each step (↵ Enter advances) → final submit. Result: **one record
  for that day**. Closing mid-way discards (confirm dialog; not auto-save).
- **Edit a record:** from the table, the per-row **pencil** edits a past day's values/note.
- **Delete a record:** from the table, the per-row **trash** deletes a day's record.
- **One-per-day rule:** there is a single record per day; re-opening the same day edits that
  record rather than creating a second. `TODO(verify)` exact behaviour if a second fill is
  attempted (overwrite vs blocked vs merge).
- **Coach review:** select an athlete (left group panel) to read their records; the coach **can
  also** create (New record) / edit / delete on the athlete's behalf (verified).
- `TODO(verify)` whether wellness records write to any Activity/audit log (Medical-style),
  and whether an unfilled/late wellness record surfaces in the coach's **Weekly Dashboard**
  alongside diary-completion flags.

## 8. User journeys / flows (per role)
**Athlete — morning self-report (happy path):** wake up → open **Wellness questionnaire** on
the phone (or the day's **⋯** menu in the Training Log) → rate **Sleep / Stress / Mood /
Soreness / Fatigue** on each labeled scale → add a **note** if something's off ("slept badly,
travel") → **save**. The day now has one record; it's visible to the coach and flows into
readiness — before today's session.

**Athlete — fix yesterday:** open the list → find the day → **edit** the values or note (or
**delete** a mistaken record).

**Coach — morning readiness check:** open **Analytics → Team daily readiness** → scan each
athlete's **Wellness** column next to **device recovery** (WHOOP/Garmin) and **Health status**
(Medical) → spot anyone flagging → adjust today's plan **before** the session.

**Coach — review an athlete's trend:** select the athlete (or **Analytics → Wellness**) → read
each metric trended over ~4 weeks → distinguish a one-off bad night from a downward slide.

## 9. Use cases / scenarios
- **Catch fatigue before it shows in the data:** Em Krystof logs rising fatigue and poor sleep
  for several mornings; the coach sees the Wellness trend turn before device recovery confirms
  it, and pulls back load early.
- **Adjust today's session:** an athlete notes "shoulder sore, slept 4h" on the morning form;
  the coach modifies the session that morning rather than discovering it in the evening diary.
- **Travel / illness flag:** the note field carries context (travel, family stress, a cold
  starting) that numbers alone miss, feeding the coach's read alongside Medical status.
- **Squad readiness at a glance:** before a hard team session, the coach uses Team daily
  readiness to see who self-reports well vs poorly, combined with recovery and health status.
- **Longitudinal pattern:** across a block, an athlete's soreness/fatigue trend is read against
  the training-load chart to check the body is absorbing the work.

## 10. Configuration & variants
- `[CONFIG]` **Dimension set** — which items appear (Sleep, Stress, Mood, Soreness, Fatigue,
  readiness to train, injury/illness feeling, …) is configured per instance/team; ~5–6 typical.
- `[CONFIG]` **Scales** — length (e.g. 1–4 vs 1–5, which varies per dimension even within one
  instance) and **label wording** per dimension (`1 Excellent` … `5 Very bad sleep`).
  `TODO(verify)` whether the dimension set/scales are self-serve configurable or set by Yarmill.
- `[CONFIG]` **Training Log ⋯ menu entry** — whether "Wellness questionnaire" appears in a day's
  three-dots menu is part of the per-instance field/menu setup.
- `[CONFIG]` **Visibility** — whether the module is enabled and where it surfaces.
- Universal (not configurable): **one record per day**, **edit/delete per record**, and the
  feeds into **Wellness analysis** + **Team daily readiness**.

## 11. Edge cases, limits, gotchas
- **One record per day** — re-opening a day edits, doesn't duplicate (`TODO(verify)` exact
  enforcement).
- **Timing matters** — value is *before* the session; a record filled in late still saves but
  loses its readiness purpose.
- **Scale direction** — verified example is "lower = better" (`1 – Excellent`); don't assume
  every configured item reads the same way (`TODO(verify)`).
- **Mobile-first** — athletes mostly fill in on the phone; the wizard must work well on mobile
  (`TODO(verify)` mobile behaviour of the new-GUI wizard).
- **Mixed shell** — the record table is classic top-nav, but the fill-in wizard is GUI 2.0; don't
  describe navigation by shell, name the module.
- **Not auto-save** — abandoning the wizard mid-way discards the record (confirm dialog); only the
  final submit creates it.
- `TODO(verify)` empty state copy; required vs optional items; behaviour for a missing day in
  the trend.

## 12. Cross-module integration & data flow
- **→ Analytics / Wellness:** every record feeds the **Wellness** analysis, which **trends each
  metric over four weeks** (individual and group).
- **→ Analytics / Team daily readiness:** the day's self-report is one column of the morning
  **Team daily readiness** overview, **combined with device recovery** (e.g. WHOOP Recovery,
  Garmin Battery) and **medical status** (Health status from the Medical module) — the single
  morning "who's ready" view.
- **← Training Log:** an alternate entry point to fill in (the day's ⋯ menu); the wellness
  self-report complements the training diary for the same day.
- **Adjacent inputs to readiness:** [Integrations](/en/platform/integrations) (devices) and
  [Medical](/en/medical/medical-module) (training-limitation status) sit beside wellness in the
  same readiness picture.

## 13. Shot list (images for the docs page)
| # | Screen / state | Sample data | Caption (draft) | Callouts | Supports doc section | Role | Render now? |
|---|----------------|-------------|-----------------|----------|----------------------|------|-------------|
| 1 | **Input-form wizard (new GUI) — Sleep step** | Em Krystof; New record → Continue to **Sleep**: "How did you sleep today?" + 5 option rows (1 Excellent … 5 Very bad sleep) + green progress bar + breadcrumb | "A minute a day: one question at a time — rate how you slept and feel, add a note." | Green progress bar · the question · 5 option rows (number badge + label) · Back/Continue bar | Fill it in | athlete | **new GUI — PRIORITY render target** |
| 2 | Coach record table (module under OTHER) | Em Krystof: several days of records — Date · Sleep · Stress · Mood · Soreness · Fatigue · Notes; per-row edit/delete; share-link + New record | "Each day is one record — review, edit, or delete from the table." | New record · share-link icon · a row's values · edit/delete · funnel filters | Fill it in / coach review | coach | classic UI — **render later** |
| 3 | Analytics — Wellness trend | Em Krystof: each metric trended ~4 weeks | "In Analytics, the Wellness analysis trends each metric over four weeks." | metric trend lines | For coaches | coach | reuse Analytics shot — render later |
| 4 | Analytics — Team daily readiness | National Team morning: Wellness column beside WHOOP/Garmin recovery + Health status | "Team daily readiness combines wellness with device recovery and medical status." | Wellness column · recovery columns · health status | For coaches | coach | reuse Analytics shot — render later |

## 14. Open questions / TODO(verify)
> Resolved this pass (now in the body): coach route `/evidence/wellness?…`; the 7-step wizard
> shape, steps, option rows, Back/Continue + ↵ Enter, close-without-saving confirm (not
> auto-save); coach can create/edit on an athlete's behalf; the verified dimension set + scales.
> Resolved athlete session 2026-06-15 (now in the body): the **athlete self-fills via the Reality
> day card ⋯ (more) menu → "wellness questionnaire"**, opening the same 7-step wizard (§3, §5, §7).
- **Share-link icon** function on the coach table (a shareable questionnaire/fill link?).
- Whether the **dimension set / scales are self-serve configurable** (vs. set by Yarmill).
- Whether the wizard's **final step button** is labeled **Save / Finish** (vs Continue).
- **Wizard URL**, if any (it opens from New record).
- **One-per-day enforcement** when a second fill is attempted (overwrite / blocked / edit).
- **Scale direction** consistency across configured items (always "lower = better"?).
- Whether all dimensions are **required** or a step can be left blank (validation).
- Whether wellness writes to any **Activity/audit log** and whether unfilled wellness surfaces
  in the **Weekly Dashboard**.
- **Empty state** copy and **loading/error** states for the table and wizard.
- **Mobile** behaviour of the wizard.
- **Analytics linkage** of wellness data — the Analytics trend report exists but wellness-specific
  surfacing was not confirmed this pass.

## 15. Source log
**Live verification — clean coach session (2026-06-15):** coach *Bart Simpson*, group *National
Team*, athlete *Em Krystof* (rich daily log), classic top-nav UI. Confirmed live:
- **Coach route & nav:** `/evidence/wellness?group={id}&athlete={id}&week=…`; OTHER → Wellness
  questionnaire; per-athlete via the left group panel (group → Entire Group + athletes). Light.
- **Coach table:** title "Wellness questionnaire"; top-right **share-link icon** + magenta
  **New record**; columns **Date · Sleep · Stress · Mood · Soreness · Fatigue · Notes** (funnel-
  filterable headers); per-row **edit (pencil) / delete (trash)**.
- **Dimension scales (this instance, `[CONFIG]`):** Sleep 1–5 (Excellent → Very bad sleep) ·
  Stress 1–5 (No stress → High stress) · Mood 1–5 (Very happy → Bad mood) · Soreness 1–4 (No →
  High soreness) · Fatigue 1–4 (No → High fatigue) · Notes free text (emojis allowed).
- **Input wizard:** 7-step full-screen GUI 2.0 form (green progress bar, breadcrumb "Wellness
  questionnaire > {athlete}"), one question per step — Date (defaults to today) → Sleep → Stress
  → Mood → Soreness → Fatigue → Notes; scale steps show a plain-language question + large tappable
  option rows (number badge + label); Back/Continue bottom bar (↵ Enter advances); **not
  auto-save** — closing pops "Close Wellness questionnaire without saving?" (Yes, close / No, back
  to questionnaire); record created only on final submit. Coach reaches it from New record (fills
  on the athlete's behalf); athletes fill the same wizard.

Earlier facts grounded in the **master reference §5.6** (Wellness / ASMR; one record per day;
feeds Wellness analysis + Team daily readiness), **§5.13/Analytics** (Wellness trends; Team daily
readiness columns: Health status, WHOOP Recovery, Garmin Battery, Wellness), the **dual-UI note**,
and the **existing docs page** `en/reality/wellness-questionnaire.mdx`.

**Athlete-session verification (2026-06-15):** a clean athlete session (role "Athlete",
*Simpson Lisa* logged in, one login per browser) confirmed the **athlete-side entry path**: the
athlete self-fills via the **Reality day card ⋯ (more) menu → "wellness questionnaire"**, which
opens the same 7-step wizard (Date → Sleep → Stress → Mood → Soreness → Fatigue → Notes). The
athlete's Reality day ⋯ menu contained: **training shooting · notes · feeling scale · heart rate
· mental condition · attachment · import plan · wellness questionnaire**. Her top nav is the full
classic top-nav (Reality · Plan · Analytics · Attendance · Files · Other · Settings) but **with
no group/athlete switcher** (everything scoped to herself); athlete Settings = "Personal" only.
This resolves the prior athlete-side-entry-path `TODO(verify)` (§3, §5, §7, §14).

**Not confirmed this pass:** the share-link icon's exact function, self-serve config of
dimensions/scales, the final step's button label, mobile behaviour, and Analytics
wellness-specific surfacing — see §14. **Confidence:** high on
coach table/scales/edit-delete/one-per-day/the wizard (live-verified this pass); the listed
items remain `TODO(verify)`. Demo cast for images: **National Team**, athlete **Em Krystof**
(rich wellness data); **Simpson Lisa** available as the recurring athlete.

## 16. Docs page plan
- **Audience line:** `**For:** athletes (fill in), coaches (review) · **Where:** Web app and mobile`
- **Proposed page outline** (H2s → which spec sections feed them):
  | Page section (H2) | Fed by |
  |-------------------|--------|
  | intro + audience line + `<Info>` "questions configured per team" | §1, §0, §4, §10 |
  | Fill it in — `<Steps>` (open → step through dimensions → note → submit) + wizard image (new GUI, priority) | §6.2, §7, §8 |
  | One record per day — edit/delete from the table | §4, §6.1, §7, §11 |
  | `<Tip>` fill it in each morning — before the session | §1, §11 |
  | For coaches — select an athlete; Analytics Wellness + Team daily readiness | §3, §8, §12 |
  | Why it matters / where it goes | §1, §12 |
- **Cross-links:** `/en/analytics/analytics` (Wellness trend + Team daily readiness),
  `/en/reality/training-log` (the ⋯ menu entry point + the diary it complements),
  `/en/medical/medical-module` and `/en/platform/integrations` (the other readiness inputs).
- **UI label → doc term:**
  | UI label | Doc term |
  |----------|----------|
  | Wellness questionnaire | wellness questionnaire (the daily self-report) |
  | ASMR / Athlete Self-Monitoring Report | (internal only — don't surface in user docs) |
  | Notes | note to the coach |
  | New record | (action: fill in / add today's record) |
  | Totem panel / GUI 2.0 | (internal only — name the module, not the shell) |
