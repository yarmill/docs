# Module Spec: Training Log (Reality / Skutečnost) — internal

> Internal specification. NOT published (excluded via `.mintignore`). Source for the
> user-facing docs page + image plan. Fill every section; leave `TODO(verify)` where unsure.

## 0. Meta
- **Module:** Reality — "Training Log" (Czech UI: **Skutečnost**). The daily training diary.
- **Route(s):** `/reality/week` (Week view). Tabs: **Week | Goals**.
- **Nav path:** classic top-nav → **REALITY**; left sidebar = group selector + athlete list (pick an athlete first).
- **UI shell:** **classic light top-nav** (top nav REALITY · PLAN · ANALYTICS · ATTENDANCE · FILES · OTHER · SETTINGS; left sidebar = group + athletes). Not GUI 2.0.
- **Surfaces:** web (incl. PWA) + mobile app (iOS / Android).
- **Primary roles:** **athlete** (fills their own diary); **coach** (reads any accessible athlete; writes with permissions).
- **Config-dependence:** **high** — the text-side phases and data-side rows, the extra athlete-only fields (RPE, mental condition, etc.), the ⋯-menu contents, Import-plan on/off, and the backfill window are all configured per team. The left/right diary mechanics and auto-save are universal.
- **Explored:** 2026-06-15 · **live-verified** in-app · coach *Bart* viewing *Simpson Lisa* · group *National Team* · by main agent (live findings folded into the body; see §15)
- **Render images now?** **NO** — classic UI; shot list only (render later).

## 1. Purpose & why it exists
Reality is the daily diary: what actually happened, recorded the same day while it's fresh.
It mirrors the [Plan](/en/plan/plan) — a text side in the athlete's own words and a data side
of numbers — plus the personal details only the athlete can supply (effort, mood, sleep,
how a session felt). Reality is the raw material the whole platform reads: it is one of the
three comparable data versions (annual plan / plan / reality) and the source for almost
every [Analytics](/en/analytics/analytics) trend, so logging it honestly and on time is
what makes the rest of Yarmill answer back.

## 2. Jobs to be done (per role)
- **Athlete:**
  - When I finish a training day, I want to write down what I actually did — in words and
    numbers — so my coach sees the truth and my analytics stay real.
  - When I'm too tired to type much, I want to import the planned day and tweak it, so
    logging is quick (where my team allows it).
  - When I wore my watch, I want my run/sleep to show up by itself, so I don't re-enter
    what the device already measured.
- **Coach:**
  - When I review an athlete, I want to read their diary day by day and see how the week
    really went versus what I planned.
  - When I have something to add, I want to comment on a note, attach video, or log on the
    athlete's behalf (with permission), so the record is complete.
- **Admin / staff:**
  - When I onboard a team, I want to configure which fields belong to Reality (and which
    are hidden "extras"), so athletes record exactly what this sport needs. (See §10.)

## 3. Personas & permissions
- **Athlete:** owns their own Reality. Fills the text + data sides, the extra fields, and the
  ⋯-menu extras; sees **only their own** data (no group selector or athlete list of their
  own). Logs on web/PWA or the mobile app. Cannot edit the Plan, and cannot edit/delete
  imported connected-device data (delete in the provider's app — see §12).
- **Coach:** opens a group → athlete from the **left list** to read that athlete's diary, and
  — **with write permission** — comment on notes, attach videos, or log entries (e.g. log
  shooting) on the athlete's behalf. Coach accounts often have an unlimited backfill window.
  Reality is **per athlete**: a coach selects a person, not the whole group. `[CONFIG]` write
  vs read-only is permission-gated per instance.
- **Admin / staff:** not a Reality user per se; configures the field set (§10) via the
  onboarding Google Sheet (left-side / right-side config).
- **Self-coached athlete:** given a **coach account** so they can write both their own Plan
  and their own Reality.

## 4. Key concepts & vocabulary
- **Reality / Training Log / Skutečnost:** the daily diary. The demo's configured field
  labels may be Czech — flag instance-specific labels rather than asserting English ones.
- **Left (text) side:** structured description in the athlete's own words per **training
  phase** (e.g. *daily goal*, *morning*, *afternoon* — `[CONFIG]` phase labels). Supports
  formatting: bullets (`- `), colours/highlight, emojis, links.
- **Right (data) side:** numeric values per row (minutes, km, reps, load, zones, shots…),
  laid out **Mon–Sun + a Total column**. Some rows are **auto-calculated and locked/greyed**
  (sums); the Total column sums the week. Numbers are entered **manually**. **Live-verified
  (2026-06-15):** the Reality data grid **mirrors the Plan grid** — same configured rows seen
  on Simpson Lisa: *Dny zatížení, Jednotky zatížení, Soucet pater test, Patra, Dny nemoci,
  Dny ZO, Volno, Regenerace [aktivní / pasivní], Závody, Hod. zatížení [Posilovna/síla, Váha],
  Běh [I1 / I2 / I3 / KM], Kolo…*; columns **Mon–Sun + Total** `[CONFIG]` row set per team.
- **Extra athlete fields** `[CONFIG]`: fields the coach doesn't plan but the athlete should
  record — **live-verified (2026-06-15):** **RPE** (Borg CR10, **0–10**) shows on the day card
  with **separate AM and PM inputs**. **Mental condition** lives in the ⋯ menu but can also
  appear **inline on the day card when configured** (seen on another athlete). Reference also
  lists weight before/after, fatigue feeling, meals, feelings, physio notes, "what I learned /
  will work on," sport-specific logs.
- **⋯ (three-dots) menu:** per-day overflow holding extras + attachments. **Live-verified set
  (2026-06-15, National Team):** **training shooting** (a sport-specific log), **notes**,
  **feeling scale**, **heart rate**, **mental condition**, **attachment**, **import plan**,
  **wellness questionnaire**. The exact set is `[CONFIG]` per team — this is the National Team set.
- **Import plan:** one-click copy of the planned day (text + numbers) into Reality, then
  editable. `[CONFIG]` on/off + days-back limit.
- **Connected-device records:** activities (+ sleep/recovery if worn at night) imported from
  a wearable, shown automatically under the day. **Read-only inside Yarmill.**
- **"Sleep & recovery" block** `[device]`: on a day card, **beneath the RPE (0–10) AM/PM
  controls**, a **"sleep & recovery"** block appears for athletes with a **connected wearable**,
  populated from the device. **Confirmed in BOTH a coach view and the athlete's OWN view, and
  across two device brands:**
  - **Athlete's OWN Reality (2026-06-15, *Pé Tomáš*, Device = Oura):** **Sleep** *06:58 H*
    (↓ bedtime 01:02, ↑ wake 08:37, ϟ 75, 92 %); **Resting HR** ↓ *50 BPM* (↑ 66, ⌀ 56 BPM);
    **Readiness score** *75 – GOOD*; **HRV** ⌀ *62 ms* (↑ 137 ms); **Device** *Oura*. So an
    **athlete sees their own block** on their own day card (not just a coach reading them).
  - **Coach view (2026-06-15, *Em Krystof*, Device = WHOOP):** **Sleep** *07:13 H* (↓ bedtime
    23:23, ↑ wake 06:48, ϟ 87, 98 %); **Recovery** *90 %*; **Resting HR** ↓ *48 BPM*; **HRV**
    ⌀ *53 ms*; **Device** *WHOOP*.
  - **KEY POINT — the metric set varies by device brand:** **Oura** surfaces a **"Readiness
    score"** (e.g. 75 – GOOD), whereas **WHOOP** surfaces a **"Recovery %"** (e.g. 90 %). The
    block is **device-sourced** and its exact metrics depend on the connected brand.
- **Backfill window:** how far back you can still log. `[CONFIG]` web ≈ 7 days (coach often
  unlimited); **mobile = current day only**.
- **Auto-save:** every entry saves instantly with a green "data saved" indicator; no Save button.
- **Three data versions:** annual plan / plan / **reality** — comparable side-by-side in the
  Season review / RTC table (see §12).

## 5. Information architecture
- **Classic shell:** top nav **REALITY** · PLAN · ANALYTICS · ATTENDANCE · FILES · OTHER ·
  SETTINGS; **left sidebar** = group selector + athlete list.
- **Entry:** REALITY → (coach) pick group → **select an athlete from the left sidebar list** →
  Week view (per permissions); (athlete) lands on own Week view directly — **no sidebar list,
  own data only**. Route `/reality/week`. *(Live-verified 2026-06-15: coach Bart selected
  Simpson Lisa from the left list to view/edit her Reality.)*
- **Tabs:** **Week** (the working diary, default) and **Goals** (live-verified). {/* TODO(yarmill): verify what the Goals tab inside Reality shows vs the standalone Goals module */}
- **Week layout:** one **day card per day**, each card split **left (text) | right (data)**;
  the data grid runs **Mon–Sun + Total**; a per-day **⋯** menu; connected-device records
  appear beneath the day.
- **Related modules around it:** [Plan](/en/plan/plan) (same structure, coach-owned),
  [Attendance](/en/reality/attendance), [Wellness questionnaire](/en/reality/wellness-questionnaire)
  (reachable from the ⋯ menu), [Files](/en/platform/files) (all Reality attachments collected),
  [Integrations](/en/platform/integrations) (device data), [Analytics](/en/analytics/analytics)
  (reads Reality).

## 6. Screen & UI inventory

### 6.1 Week view (the diary) — classic light
- **Layout:** week of **day cards**. Each card = **left (text) side** stacked by phase +
  **right (data) side** as the week's number grid. **Live-verified (2026-06-15):** top of view
  has **Week** and **Goals** tabs; week navigation = **prev/next chevrons + a date-range pill**.
- **Controls:** week back/forward navigation · **Week | Goals** tabs · per-day **⋯** menu ·
  inline text fields (left) · numeric cells (right) · group + athlete selectors (coach, left sidebar).
- **Fields (left / text side):** one rich-text box **per phase** `[CONFIG]` (e.g. daily goal /
  morning / afternoon). `type: rich text · default empty · who-can-edit: athlete (coach w/ permission) · auto-save: yes`.
- **Fields (right / data side):** one row per configured metric, columns **Mon–Sun + Total**.
  `type: number (units per row) · default empty · validation: numeric · who-can-edit: athlete (coach w/ permission) · auto-save: yes`. **Calculated rows render greyed/locked** (e.g. weekly sums, Total column).
- **Fields (extra, on the day card) `[CONFIG]`:** **RPE** `0–10, separate AM and PM inputs`
  (live-verified on the day card) · **mental condition** (in the ⋯ menu; appears inline on the
  day card when configured). {/* TODO(yarmill): confirm exact widget/scale for the "mental condition" value */}
- **States:** **empty** (a day not yet logged — blank fields; in the coach Weekly Dashboard
  it reads as a red-pencil "unfilled diary"); **filled** (text + numbers, green save indicator);
  **locked** (calculated rows greyed); **outside-window** (older days not editable per backfill `[CONFIG]`). {/* TODO(yarmill): confirm exact empty-day and out-of-window visual states */}
- **Overlays/menus:** the per-day **⋯** menu (§6.3); connected-device records block (§6.4).

### 6.2 Goals tab
- A tab alongside Week within Reality. {/* TODO(yarmill): verify contents — likely the per-day theme/goal echo, parallel to the Plan's Goals (Motivy) 4-week view; not confirmed live */}

### 6.3 Day ⋯ (three-dots) menu
- Per-day overflow. **Live-verified set (2026-06-15, National Team) `[CONFIG]`:** **training
  shooting** (sport-specific log), **notes**, **feeling scale**, **heart rate**, **mental
  condition**, **attachment** (photos / videos / files), **import plan**, **wellness
  questionnaire**.
- Each item opens that field/log inline on the day or as a small editor. `who-can-edit: athlete (coach w/ permission) · auto-save: yes`.
- The exact menu contents vary per instance; do not assert this list as universal.

### 6.4 Connected-device records (under the day)
- Imported activities appear automatically beneath the day card (e.g. a Garmin run with
  distance / time / avg HR); **sleep/recovery** appears if the device is worn at night.
- **"Sleep & recovery" block — live-verified (2026-06-15):** on the day card, **beneath the RPE
  (0–10) AM/PM controls**, a **"sleep & recovery"** block appears for athletes with a connected
  wearable, populated from the device. **Confirmed in the athlete's OWN view AND across two
  brands** — and the **metric set varies by device brand**:
  - **Oura example — *Pé Tomáš*, in his OWN Reality (athlete session):**
    - **Sleep** — *06:58 H* (sub-stats: *↓ bedtime 01:02*, *↑ wake 08:37*, *ϟ 75*, *92 %*)
    - **Resting HR** — *↓ 50 BPM* (sub-stats: *↑ 66*, *⌀ 56 BPM*)
    - **Readiness score** — *75 – GOOD*  ← Oura-specific metric
    - **HRV** — *⌀ 62 ms* (sub-stat: *↑ 137 ms*)
    - **Device** — *Oura* (the source label)
  - **WHOOP example — *Em Krystof*, Monday (coach view):**
    - **Sleep** — *07:13 H* (sub-stats: *↓ bedtime 23:23*, *↑ wake 06:48*, *ϟ 87*, *98 %*)
    - **Recovery** — *90 %*  ← WHOOP-specific metric
    - **Resting HR** — *↓ 48 BPM*
    - **HRV** — *⌀ 53 ms*
    - **Device** — *WHOOP* (the source label)

  **The block is device-sourced and its exact metrics depend on the connected brand** —
  **Oura → "Readiness score"**, **WHOOP → "Recovery %"**. An **athlete sees their own block** on
  their own day card (confirmed on Pé Tomáš), not only a coach reading them.
- `who-can-edit: NO ONE inside Yarmill` — read-only; delete only in the provider's app.
- Complements the diary; does **not** replace filling the left/right sides. Time-in-zone is
  computed by Yarmill's own HR-zone engine regardless of the manual numbers.
- States: **none connected** (block absent) · **connected, data present** · **connected, no
  data that day**.

## 7. Actions & interactions
- **Type a note (left side):** edit any phase text box → **auto-saves** (green "data saved").
- **Enter numbers (right side):** type into a cell → auto-saves; **calculated rows recompute**
  and the **Total column** updates; locked rows can't be edited.
- **Open an extra field:** **⋯** → pick an item (notes / feeling scale / heart rate / mental
  condition / wellness questionnaire / sport-specific log) → fill inline → auto-saves.
- **Attach a file:** **⋯ → attachment** → add photo / video / file; it also surfaces in
  [Files](/en/platform/files) (Type / File name / Tags / Location / Date).
- **Import plan:** **⋯ → import plan** → copies the planned day (text + numbers) into Reality
  → edit freely. `[CONFIG]` available only if enabled and within the days-back limit.
- **Add a wellness entry:** **⋯ → wellness questionnaire** → daily self-report (Sleep /
  Stress / Mood / Soreness / Fatigue / Notes). See [Wellness questionnaire](/en/reality/wellness-questionnaire).
- **Coach writes for an athlete (permission-gated):** select athlete → comment on a note,
  attach video, or log entries on their behalf.
- **Activity log:** {/* TODO(yarmill): Reality does not surface a per-record Activity log like the Medical module; confirm whether diary edits are tracked/attributed anywhere visible */}
- All edits **auto-save**; there is no Save button anywhere in the diary.

## 8. User journeys / flows (per role)
**Athlete — log today (web):** open **REALITY** → today's card → write the **morning** /
**afternoon** phases (left) → enter session **minutes / km / load** per row (right; sums fill
in) → set **RPE** for AM and PM → optionally **⋯ → wellness questionnaire** and **⋯ →
attachment** (a clip) → done; everything auto-saved. The Garmin run logged earlier appears
beneath the day on its own.

**Athlete — quick log via Import plan (where enabled):** open the day → **⋯ → import plan**
→ planned text + numbers drop in → adjust the few things that differed → add RPE → done.

**Athlete — log on mobile:** open the app → **current day only** → fill text + numbers + RPE;
yesterday must be backfilled on the web within the window.

**Coach — review an athlete's week:** REALITY → group → **Cihlář Adam** → read each day's
notes and numbers; compare against the plan; **⋯/note** comment where needed; attach video.

**Coach — log for a young/absent athlete:** select athlete → enter the session numbers and a
short note on their behalf (permission-dependent). (For squads that don't self-log, see the
Attendance-driven copy in §12.)

## 9. Use cases / scenarios
- **Same-day diary:** Simpson Lisa logs her morning swim and afternoon gym the evening she
  trains — words, numbers, RPE — so the week reflects reality, not a Sunday guess.
- **Watch-backed endurance day:** Adam's long run flows in from Garmin (distance/time/avg HR);
  he still writes how it felt and fills the planned-row numbers his coach analyses.
- **Complex sport, Import plan on:** a swimmer imports the planned set (hard to type out) and
  edits the deltas, instead of re-keying a 3,000 m session.
- **Federation that disables Import plan:** athletes describe training in their own words by
  policy (e.g. Czech Biathlon) — there is no import shortcut on the day.
- **Coach completes a junior's log:** a sport-school coach logs present athletes' single daily
  session for kids who don't keep their own diary (via Attendance copy, §12) — never for
  self-logging athletes (it would overwrite their diary).
- **Sport-specific log:** **⋯ → training shooting** captures a biathlon shooting session that
  later feeds the shooting analyses.

## 10. Configuration & variants
- `[CONFIG]` **Left-side phases** — which phases exist and their labels (daily goal / morning /
  afternoon / sport + S&C …).
- `[CONFIG]` **Right-side rows** — which metrics, their units, colours, tooltips, and which are
  **calculated** (greyed/locked). Each field is flagged Plan and/or Reality at onboarding.
- `[CONFIG]` **Extra (hidden) fields** — RPE, resting HR, mental condition, etc. may be
  Reality-only and live under the **⋯** menu.
- `[CONFIG]` **⋯-menu contents** — the set of extras/logs shown per day.
- `[CONFIG]` **Import plan** — on/off and the days-back limit (e.g. 3).
- `[CONFIG]` **Backfill window** — web floating window (commonly 7 days); coach often
  unlimited; mobile = current day only.
- `[CONFIG]` **Coach write rights** in Reality (permission-gated).
- **Universal (not configurable):** the **left/right diary structure**, **auto-save**, the
  **Mon–Sun + Total** grid, calculated-row locking, and connected-device data being read-only.

## 11. Edge cases, limits, gotchas
- **Logging window:** beyond the backfill window the day is no longer editable on web;
  **mobile logs the current day only** (no retroactive logging yet). Philosophy: a *diary*,
  not a weekly/monthly — late entries are invented and degrade analysis.
- **Calculated/derived rows** are greyed and locked; you can't type into a sum.
- **Connected-device data is read-only** in Yarmill — edit/delete in the provider's app.
- **Watch data complements, never replaces** the diary — the right-side numbers are still
  entered manually; sums/analytics compute from watch data regardless.
- **Mobile vs web:** mobile is current-day; richer backfill and some extras live on web. {/* TODO(yarmill): confirm which ⋯-menu extras exist on mobile vs web */}
- **Athlete scope:** athletes see only their own diary; no group/athlete switcher.
- **Empty day** in the coach Weekly Dashboard reads as a red-pencil "unfilled diary."

## 12. Cross-module integration & data flow
- **← Plan:** **Import plan** copies the planned day into Reality; the two share left/right
  structure for direct comparison.
- **← Attendance:** Attendance "Copy plan" fills Reality only for athletes marked **present**
  that day (whole-day only) — built for young squads, not self-loggers. See
  [Attendance](/en/reality/attendance).
- **← Integrations / wearables:** activities + sleep/recovery import into Reality on the day
  (read-only). See [Integrations](/en/platform/integrations).
- **→ Files:** every Reality attachment is collected in [Files](/en/platform/files) with tags
  and a clickable date that jumps back to its place in the log.
- **→ Analytics:** Reality is the primary input — training-data trends (plan vs reality, by
  activity/zone), **Training Load + ACWR** (solid line = reality), **Recovery indicators**
  (from device sleep), **Wellness** (from the questionnaire), the coach **Weekly Dashboard**
  (who filled the diary), and the **RTC / Season review** (annual plan / plan / reality
  side-by-side). See [Analytics](/en/analytics/analytics).
- **→ Wellness questionnaire:** the daily self-report is added from the day's ⋯ menu and feeds
  Wellness + Team Daily Readiness. See [Wellness questionnaire](/en/reality/wellness-questionnaire).
- **→ Yollanda:** the AI reads the athlete's training log + plan (in beta, mainly the left text side).

## 13. Shot list — executable visual-todo

> Reality is **CLASSIC light top-nav** → the week view is captured **full-window**; detail
> shots (watch-data block) are a **corner-zoom + callouts** crop. All priority **later —
> classic UI** (don't render now). "Live nav" is the literal click path to reach the state.

| Live nav | State | Crop type | Caption draft | Callouts | Post-process | Priority |
|----------|-------|-----------|---------------|----------|--------------|----------|
| tab coach → REALITY → select Simpson Lisa → land on current Week (a week with text + numbers + RPE filled) | Week view, a filled day card — text side, data grid, RPE AM/PM | full-window | "A day in the diary: text on the left in your words, numbers on the right, with weekly totals." | Left (text) side · Right (data) side · Total column · RPE (AM / PM) | crop to week view; clean brand backdrop; indigo callout labels | later — classic UI |
| tab coach → REALITY → select Simpson Lisa → open a day's **⋯** menu | Day **⋯** menu open (National Team set) | full-window (menu in frame) | "The ⋯ menu holds the extras your team configures — notes, feeling scale, heart rate, attachments, the wellness questionnaire, and more." | the open ⋯ menu items (training shooting · notes · feeling scale · heart rate · mental condition · attachment · import plan · wellness questionnaire) | crop to the day card + open menu; indigo callouts | later — classic UI |
| tab coach → REALITY → select **Em Krystof** (WHOOP-connected) → page to a week with device data (e.g. `week=2026-06-15`) | Connected-device (watch) / "sleep & recovery" data block on a day | detail "corner-zoom + callouts" | "Recorded activities — and sleep & recovery — appear automatically under the day." | the device record block · sleep & recovery metrics (Sleep + bedtime/wake, brand-specific recovery metric, Resting HR, HRV, Device label) | corner-zoom on the device block; indigo callouts; mark `{/* NOTE(yarmill): … */}` if mocked. **Sample data: Em Krystof, WHOOP → "Recovery %" (confirmed 2026-06-15); or Pé Tomáš, Oura → "Readiness score" (athlete-own view, confirmed 2026-06-15).** | later — classic UI |

## 14. Open questions / TODO(verify)
*Still open after the 2026-06-15 live pass:*
- **"Mental condition"** — exact **widget / scale** (placement now confirmed: ⋯ menu + inline
  on the day card when configured) (§6.1).
- **Goals tab** inside Reality — exact **contents** (tab presence confirmed; contents not) (§6.2).
- Whether **diary edits are attributed / logged** anywhere visible — *likely no per-record
  Activity log like Medical; phrase cautiously* (§7).
- **Empty / loading / error** visual states on web (incl. out-of-window day) (§6.1).
- **Mobile vs web** ⋯-menu differences — which extras exist where (§11).

*Resolved this session (now in the body, no longer TODO):* ⋯-menu set (National Team), RPE
0–10 with separate AM/PM inputs, Week + Goals tabs and chevron + date-range navigation, the
Reality grid mirroring the Plan grid (configured rows), coach-selects-athlete-from-sidebar vs
athlete-own-data-only, mental-condition placement (menu + inline), and the **connected-device
"sleep & recovery" block** layout/labels on the day card — **confirmed 2026-06-15 across two
brands and in the athlete's own view**: on **Em Krystof's WHOOP** data (coach view) and on **Pé
Tomáš's Oura** data in **his OWN Reality** (athlete session). Block contents: Sleep (+ bedtime/
wake/sub-metrics), Resting HR, HRV, Device label, plus a **brand-specific recovery metric** —
**Oura → "Readiness score"** (Pé Tomáš: 75 – GOOD), **WHOOP → "Recovery %"** (Em Krystof: 90 %).
The exact metric set depends on the connected device brand, and an athlete sees their own block (§6.4).

*Grounded from master ref (not live this session):* left/right structure, Import plan,
backfill window, read-only device data, auto-save.

## 15. Source log
**Master reference** §5.4 (Reality / Training Log), §5.5 (Attendance copy), §5.6 (Wellness),
§5.10 (Files), §5.11 (Integrations / HR-zone engine), §5.13 (Analytics, Weekly Dashboard,
ACWR), §6 (roles), §7 (config model) — **high confidence** on mechanics. **Live-verified
in-app (2026-06-15, coach *Bart* viewing *Simpson Lisa*, National Team) — confirmed:** the
Reality grid mirroring the Plan grid (configured rows: Dny zatížení, Jednotky zatížení, Soucet
pater test, Patra, Dny nemoci, Dny ZO, Volno, Regenerace, Závody, Hod. zatížení, Běh, Kolo…;
Mon–Sun + Total), **RPE 0–10 with separate AM and PM inputs** on the day card, the **Week** and
**Goals** tabs with chevron + date-range-pill navigation, the **⋯** menu set (training shooting,
notes, feeling scale, heart rate, mental condition, attachment, import plan, wellness
questionnaire), **mental condition** in the ⋯ menu and inline on the day card when configured,
and **coaches selecting an athlete from the left sidebar list** (athletes have no sidebar) —
**high confidence**. §13 images still marked **later (classic UI)** — not yet rendered.

**Clean-coach live confirmation (2026-06-15, athlete *Em Krystof* — WHOOP-connected, Reality
week view `/reality/week?group=12&athlete=4&week=2026-06-15`):** the connected-device **"sleep &
recovery" block** beneath the RPE AM/PM controls on the day card — Em Krystof's Monday (Device =
WHOOP) showed **Sleep 07:13 H** (↓ bedtime 23:23, ↑ wake 06:48, ϟ 87, 98 %), **Recovery 90 %**,
**Resting HR ↓ 48 BPM**, **HRV ⌀ 53 ms**, **Device WHOOP**.

**Clean-athlete live confirmation (2026-06-15, athlete *Pé Tomáš* — Oura-connected, own/clean
session, role Athlete):** the **same "sleep & recovery" block** beneath the RPE AM/PM controls on
**his OWN Reality** day card (Device = **Oura**) showed **Sleep 06:58 H** (↓ bedtime 01:02,
↑ wake 08:37, ϟ 75, 92 %), **Resting HR ↓ 50 BPM** (↑ 66, ⌀ 56 BPM), **Readiness score 75 –
GOOD**, **HRV ⌀ 62 ms** (↑ 137 ms), **Device Oura**. Two takeaways: (1) an **athlete sees their
own block** (not only coaches), and (2) the **metric set varies by device brand** — **Oura →
"Readiness score"**, **WHOOP → "Recovery %"**. Together these resolve the §14 watch-data
TODO(verify) (originally noted for Pé Tomáš) — **high confidence**.

## 16. Docs page plan
- **Audience line:** `**For:** athletes, coaches · **Where:** Web app and mobile`
- **Proposed page outline** (H2s → which spec sections feed them):
  | Page section (H2) | Fed by |
  |-------------------|--------|
  | intro + audience line + `<Info>` config note | §1, §0, §3, §10 |
  | A day in the diary (left/right, totals, RPE) (+ image 1) | §4, §6.1 |
  | The day's ⋯ menu (+ image 2) | §6.3, §7 |
  | Import plan (+ image 3) | §6.3, §7, §12 |
  | Watch data (+ image 4) | §6.4, §11, §12 |
  | Coaches in Reality (+ image 5) | §3, §7, §8 |
  | `<Tip>` log the same day / logging window | §11 |
- **Cross-links:** `/en/plan/plan`, `/en/platform/integrations`, `/en/analytics/analytics`,
  `/en/reality/wellness-questionnaire` (and optionally `/en/platform/files`, `/en/reality/attendance`).
- **UI label → doc term** (pin wording where UI label and doc word differ):
  | UI label | Doc term |
  |----------|----------|
  | Reality / Skutečnost | Reality (the training diary) |
  | Left side / Right side | text side / data side |
  | RPE | RPE (effort, 0–10) |
  | Import plan | import plan |
  | Three-dots / ⋯ | the day's ⋯ menu |
  | Total (column) | weekly total |
