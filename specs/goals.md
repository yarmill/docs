# Module Spec: Goals (OKR) — internal

> Internal specification. NOT published (excluded via `.mintignore`). Source for the
> user-facing docs page + image plan. Fill every section; leave `TODO(verify)` where unsure.

## 0. Meta
- **Module:** Goals (objectives + key results — the OKR module). Czech UI label: **Cíle**.
- **Route(s):** per-athlete goals list = `/okr?group={id}&athlete={id}`; goal **detail** =
  `/okr/{goalUuid}?group=&athlete=&week=` (selecting a goal pushes the uuid route, e.g.
  `/okr/1c5042dd-…?group=12&athlete=3`); the **Entire Group** overview = `/okr?group={id}`
  with **no athlete param** — there is **no separate `/okr/group` sub-route**.
- **Nav path:** main menu → **Goals** (under **Planning** in the new left-side UI; under
  **OTHER** in the older top-menu UI). Always name the module, not the shell.
- **UI shell:** **GUI 2.0** (totem panel + module sidebar). The **detail screens render
  LIGHT**; the **Entire Group overview renders DARK**; **most dropdowns / popovers render
  DARK** (Priority picker, Category two-level picker, Document check popover) — but the
  **Supervisors picker renders LIGHT**. So not *all* goal dropdowns are dark.
- **Surfaces:** **web only** (incl. PWA). No native iOS / Android.
- **Primary roles:** **coach** and **athlete** (no separate admin/staff role in this module).
- **Config-dependence:** **medium** — the **goal categories** (two-level codelist) and the
  **methodology completeness rules** (what Document check flags required vs recommended,
  e.g. a minimum number of key results) are configured per team. The mechanics, the six
  states, and the key-result fields are universal.
- **Explored:** 2026-06-14 · group *National Team* · athlete *Simpson Lisa* · by main agent.
  **Live-verified 2026-06-15** on we.yarmill.com (GUI 2.0, group *National Team*, athlete
  *Simpson Lisa*, coach login *Bart Simpson*): routes, shell grouping, list/detail layout,
  attribute pickers, key-results table, Document check, and the Entire Group overview all
  confirmed; remaining write-path / role-rights items still `TODO(verify)`.
- **Render images now?** **YES (DONE)** — the six images already exist and are approved
  (see §13). New GUI; the overview is dark.

## 1. Purpose & why it exists
Goals turn season ambitions into something trackable. Each goal carries a set of
**key results** — measurable outcomes with a start, current, and target value — so progress
stays visible all season rather than being judged only at the end. The module is the home
for objective-setting and the structured retrospective that closes a season.

It is a strong fit for **pre-season and post-season conversations**: set goals together at
the start of the season, evaluate them together at the end. Mental coaches in particular
value it for retrospectives.

## 2. Jobs to be done (per role)
- **Coach:**
  - When I sit down with an athlete before the season, I want to agree objectives and the
    measurable outcomes that define them, so we both know what success looks like.
  - When I check in mid-season, I want to see whether each goal is on track or off track
    against its key-result numbers, so I can adjust support and load.
  - When the season ends, I want to evaluate how each goal turned out, so the review is
    grounded in what we actually set out to do.
  - When I plan my own coaching/development, I want to set goals for myself, so I'm held to
    the same structure as my athletes.
- **Athlete:**
  - When I want to own my season, I want to set my own goals and key results, so my targets
    are explicit and mine.
  - When I make progress, I want to update my current values, so my coach and I see the real
    picture in our conversations.
  - When a goal wraps up, I want to add my own reflection on how it went.

## 3. Personas & permissions
- **Coach:** chooses a **group** then an **athlete** to view/manage that athlete's goals — via
  the Goals sidebar's **Group dropdown** ("National Team") → **Entire Group** entry + the full
  athlete list (members; can include coaches as selectable, e.g. "Simpson Bart", "Yarmill
  Hello") (confirmed clean-coach pass 2026-06-15). Can also open **their own** Goals and set
  objectives for themselves. Sees the **Entire Group** overview (every athlete's goals at a
  glance). Can create, edit, and evaluate goals for the athletes they coach.
- **Athlete:** sees and manages **only their own** goals. **No Group dropdown, no athlete
  list, and no Entire Group entry/overview** (the coach-only group/athlete switcher is absent);
  the sidebar shows only the athlete's own season buckets (Current season / Past season).
  Athletes can **view AND edit their own goals — including a goal a coach created for them** —
  editing key results and attributes, adding comments, and adding their own final evaluation
  (confirmed athlete session 2026-06-15: Lisa edited "Improve start technique", a goal created
  by coach *Bart Simpson* per its Activity log).
- Both coach and athlete can add a **final evaluation** to a goal (one each).

## 4. Key concepts & vocabulary
- **Goal:** a single objective — a **title** + free-text **description** + a row of
  **attributes** + a **key results** table. Example: "Lift 150 kg on bench press," "Reach
  the World Championship final."
- **Attributes** (a goal's properties):
  - **State** — the goal's status. One of the **six states** (see below). Default **Not
    started**.
  - **Season** — the season the goal belongs to. Default **Current season**; drives the
    list buckets (**Current season / Past season**).
  - **Priority** — **Low | Medium | High** (default Low). Set via the **"!" icon button**,
    which opens a **DARK dropdown** with a search field; each level shows a small bar-count
    icon.
  - **Supervisors** — the coaches who follow the goal. Set via an **"Add supervisors"**
    button opening a **LIGHT searchable multi-select** (avatars + checkboxes).
  - **Category** — a **two-level label**: a top **category** → a **subcategory**
    (e.g. *Fitness → Strength*). Configured per team; picked via a **DARK two-level
    dropdown** with a search field. `[CONFIG]`
- **Six states** (apply to both a goal and each key result):
  **Not started · On track · Off track · Completed · Canceled · Failed.**
- **Key result (KR):** a measurable outcome row in the key results table —
  **State · Name · Start value · Current value · Target value · Target date.**
  - **Start / Current / Target value** are **free text/number** (numeric like `140kg` or a
    phrase like `unknown` / "trying"), updated **manually**.
  - **No sub-steps or milestones** — key results are the only breakdown of a goal.
  - The goal-card **progress fraction** (e.g. `1/1`) counts **achieved ÷ total key results**.
- **Activity log:** automatic change log — every change (new value, state change, moved
  target date, rename) recorded with **who** and **when**.
- **Comments:** plain, timestamped text left in **Activity**; a way for athlete and coach to
  talk through progress in context. Distinct from the automatic change-log.
- **Final evaluation:** a short closing written reflection added when a goal wraps up, in its
  **own "Final evaluations" section** below the key-results table (a text box with placeholder
  "Final evaluation", an avatar dot on the left, and a submit/▲ arrow to post). The athlete
  and a coach can each add their own. Distinct from Activity comments. `TODO(verify)`: whether
  it locks after submission and whether each role can post only one.
- **Document check:** a panel (checklist icon, top-right, with a red dot badge when a
  required item is missing; **Yollanda** persona, **DARK popover**) that scores the goal
  against the team's methodology — **required (red)**,
  **recommended (amber)**, **done (green check)** — and links to **Open methodology**.
- **Entire Group:** the coach-only grid of every athlete's goals as colored progress.
- Czech UI note: the module label is **Cíle**; the demo runs the English UI.

## 5. Information architecture
- **GUI 2.0 shell:** left **totem panel** (narrow rail), top→bottom: **Yarmill logo** ·
  **grid icon = Training Management** (active) · **bar-chart icon = Analytics** ·
  **target/face icon = Medical** · (bottom) **gear = Settings** · **user avatar**. Goals is
  reached *inside* Training Management, not from the totem rail itself.
- **Module sidebar header = "Training Management"**, organized into TWO groups:
  - **Planning:** Plan · **Goals** · Planner
  - **Journal:** Reality · Attendance · Athlete profiles · Results · Wellness questionnaire

  Goals sits under **Planning** (the GUI 2.0 grouping — not "OTHER", which is the older shell).
- **Detail top bar:** a **breadcrumb** (grid icon › Goals › *Athlete* › *goal title*) plus a
  left **collapse-sidebar** icon. Minor: breadcrumb segments did not navigate on click in
  testing.
- **Sidebar (coach) — confirmed (clean-coach pass 2026-06-15):** a **Group dropdown** (e.g.
  "National Team") → an **Entire Group** entry + the full athlete list (the group's members).
  The member list can include coaches as selectable entries (observed: "Simpson Bart",
  "Yarmill Hello" appear alongside athletes). Plus the coach's **own** Goals.
  **Sidebar (athlete):** their own goals only — no group/athlete switcher.
- **Goals list:** bucketed by season — **Current season · Past season** (each with a count) —
  so older objectives stay out of the way without being lost.
- **Two views:** the **per-athlete goals list + goal detail** (light) and the coach-only
  **Entire Group** overview (dark).
- **Related modules:** Plan / Season Calendar (the season the goals sit in); Analytics
  (where goal progress can inform season review conversations).

## 6. Screen & UI inventory

### 6.1 Goals list (per athlete / self) — LIGHT
- Layout: module sidebar + a list of the person's goals, **grouped by season**
  (Current season / Past season, each with a count).
- Each goal row shows (confirmed): **title**, a **state dot**, a **season chip** (e.g.
  "2026"), a **progress fraction** (achieved ÷ total key results, e.g. `0/2`), and a
  **category chip** (e.g. "Strength"). **Priority is NOT shown** in the list row; **category
  IS**.
- Controls: at the **top of the goals list**, a blue **+** (create a new goal) and a
  **download/export icon** beside it; for a coach, the **group** + **athlete** selectors
  above/within the sidebar; **Entire Group** entry.
- States:
  - **empty** — no goals yet for this person/season (`TODO(verify)`: exact empty copy).
  - **filled** — goals under their season headings.

### 6.2 Goal detail — LIGHT
- **Layout (confirmed, top→bottom):** large **title** → a **description** line under it → an
  **attributes row** → the **key results table** → a **Final evaluations** section → an
  **Activity** section.
- **Title** — inline-editable; placeholder on a new goal. `field: text · required · who:
  coach/athlete · auto-save`.
- **Description** — free-text context ("Describe it…" placeholder). `field: textarea ·
  optional · auto-save`.
- **Auto-save (confirmed):** there is **no explicit Save button** — changes apply immediately
  and appear in the **Activity** log with who + when (e.g. "Bart Simpson changed goal's state
  from Not started to On track"). The Activity entry *is* the save confirmation.
- **Attributes row** (left→right, each a control/dropdown):
  - **State pill** — `select · Not started | On track | Off track | Completed | Canceled |
    Failed · default Not started`. Shown as a colored pill (e.g. "On track", teal).
  - **Season** — `chip/select · default Current season` (e.g. "2026").
  - **Priority** — `"!" icon button → DARK dropdown (search) · Low | Medium | High · default
    Low`.
  - **Add supervisors** — `button → LIGHT searchable multi-select of coaches (avatars +
    checkboxes) · who follow the goal`.
  - **Category** — `chip → DARK two-level dropdown (search) · category → subcategory ·
    per-team codelist` `[CONFIG]`.
- **Top-right controls (confirmed):** a **trash icon** (delete the goal) and the **Document
  check icon** (a checklist icon) which shows a **red dot badge** when something required is
  missing.
- **Key results table** — one row per outcome; columns **STATE · KEY RESULT · START VALUE ·
  CURRENT VALUE · TARGET VALUE · TARGET DATE** (see §6.3). Add as many rows as needed.
- **Document check** — **checklist icon, top-right** → opens the **DARK Yollanda popover** (§6.4).
- **Final evaluations** — its **own section** below the KR table (a text box, placeholder
  "Final evaluation", avatar dot + submit/▲ arrow); athlete and coach can each add one.
  `TODO(verify)`: whether it locks after submission and whether each role posts only one.
- **Activity** — chronological automatic change-log (who + when) + a **"Leave a comment"** box
  at the bottom (plain timestamped text).
- States: **empty** (new goal — placeholder title, "Describe it…", empty attributes,
  empty KR table) · **filled** · **wrapped up** (final evaluation present).

### 6.3 Key results table — LIGHT
- Columns (confirmed, exact): **STATE · KEY RESULT · START VALUE · CURRENT VALUE · TARGET
  VALUE · TARGET DATE**.
- One **row = one measurable outcome**:
  - **State** — `colored dot per row · same six states as the goal` (teal = on track).
  - **Key result (name)** — `text · required · placeholder "Name the key result"`. E.g.
    "Sprint starts 3× per week."
  - **Start value** — `free text/number · where the athlete began (0 / "unknown")`.
  - **Current value** — `free text/number · updated MANUALLY as progress is made`.
  - **Target value** — `free text/number · what counts as success (140 kg / 3)`.
  - **Target date** — `date · "Set date" button → calendar`.
- **Add a key result (confirmed):** the table has an **inline empty bottom row** with the
  placeholder **"Name the key result"** — type into it to add a row, then fill values and
  **Set date**. `TODO(verify)`: per-row delete affordance.
- Observed samples (free-text/numeric values confirmed): "Squat at least 140 kg" 110 kg →
  125 kg → 140 kg; "Sprint starts 3× per week" 0 → 2 → 3.
- Note: **no sub-steps/milestones** — KRs are the only breakdown.

### 6.4 Document check popover (Yollanda) — DARK
- Opened from the **checklist icon, top-right** of the goal detail (red dot badge when a
  required item is missing). **DARK popover** with a **Yollanda blush illustration** and a
  persona quip ("I see big bad."); heading **DOCUMENT CHECK**.
- Lists each methodology item with a status: **required (red)** · **recommended (amber)** ·
  **done (green check)**. Items observed (exact set, this goal):
  - ✅ Fill the title (done)
  - 🔴 **Add supervisor** (required — the missing item here)
  - ✅ Choose category of the goal
  - ✅ Add key results
  - 🟠 **Add at least 3 key results** (recommended — goal had 2 KRs; a per-team methodology rule)
  - ✅ Add description
- Bottom: an **Open methodology ↗** button → the team's external methodology document
  (per-team configured URL, e.g. a Notion page). `[CONFIG]`
- What counts as required vs recommended (e.g. "at least 3 key results") is
  **methodology/instance-specific**. `[CONFIG]`

### 6.5 Attribute pickers (Priority / Category / Supervisors)
- **Priority picker — DARK.** Opened from the **"!" icon button**. A **DARK dropdown** with a
  **search field** and **Low ✓ / Medium / High**, each with a small bar-count icon (currently
  Low).
- **Category two-level picker — DARK.** Opened from the **Category** chip. A **DARK two-level
  dropdown** with a **search field**: top categories **Performance · Fitness ✓ · Personal ·
  Technical · Health · Conditions**, each with a **submenu arrow (▸)** to its subcategories
  (e.g. Fitness → Strength). `[CONFIG]` (the top-category list is per-team).
- **Supervisors picker — LIGHT.** Opened from **Add supervisors**. A **LIGHT searchable
  multi-select** (search box labelled "Supervisors") listing coaches with **avatars +
  checkboxes** (observed: Čermák Ondra, Kříž Dušan, Liška Adam, Marysko soukromej Krystof,
  Nehněvajsa Josef, Simpson Bart, Yarmill Hello), with keyboard hints "select ↵" and
  "select & close ⌘↵". **Note:** this picker is **LIGHT**, unlike the dark Priority/Category
  pickers.

### 6.6 Entire Group overview (coach) — DARK
- **Coach-only.** Athletes have **no Entire Group entry** and no group/athlete switcher in their
  sidebar — they see only their own goals (confirmed athlete session 2026-06-15, §3, §15).
- Route `/okr?group={id}` (group selected, **no athlete param**). **DARK** background, with a
  **year selector ("2026") at top-right**.
- Layout: **one row per athlete** (avatar + name) — the overview lists **EVERY group athlete**
  as a row (confirmed clean-coach pass 2026-06-15). Each athlete's goals are drawn as **colored
  progress** — each goal a **rounded pill colored by state**, followed by **small circles per
  key result** (also state-colored).
- Interaction: **hover** a goal for a quick summary; **select** it to open the full goal.
- Use: scan a squad before a planning meeting or review.
- States: **filled** — all athletes appear; athletes **with no goals** still show as a labeled
  row with **no pills** (observed empty rows: Cihlář Adam, Kožnar Fanoušek). So the overview
  always lists all athletes; empty ones simply have no pills. (Resolved this pass; the earlier
  "only Simpson Lisa appeared" was a session-collision artifact — see §15.)
- **Pillar/pill colors observed** (caption accuracy): grey/white ≈ not started · teal/blue ≈
  on track · green ≈ completed · amber ≈ off track · red ≈ failed/canceled.

## 7. Actions & interactions
- **Create a goal:** **+** at top of the goals list → a **New goal** opens **ready to edit**
  (placeholder title, "Describe it…"). `TODO(verify)`: whether the goal is persisted
  immediately on open or only after the first edit (Medical creates on open; confirm Goals).
- **Edit title / description:** inline, **auto-saved** — no Save button; the change lands in
  the Activity log with who + when.
- **Set attributes:** State (pill) / Season / Priority ("!" → DARK dropdown) / Supervisors
  ("Add supervisors" → LIGHT multi-select) / Category (chip → DARK two-level dropdown).
- **Add / edit key results:** type into the **inline empty bottom row** ("Name the key
  result"), enter start/current/target values, **Set date** for target date, set KR state.
- **Track progress:** update **current value** manually; move the goal/KR **state** as the
  picture changes.
- **Document check:** click the check icon → review required/recommended/done → optionally
  **Open methodology**.
- **Comment:** leave plain timestamped text under **Activity**.
- **Final evaluation:** add a closing written reflection when the goal wraps up (athlete
  and/or coach).
- **Entire Group (coach):** open the overview, hover/select goals.
- **Activity log:** every meaningful change (new value, state change, moved target date,
  rename, etc.) is written automatically with **who** + **when**.
- **Delete a goal:** a **trash icon at the top-right** of the goal detail. `TODO(verify)`:
  confirmation flow (not tested). `TODO(verify)`: delete-key-result affordance.

## 8. User journeys / flows (per role)
**Coach — set a goal for an athlete (pre-season):** open Goals → pick **group** → pick
**athlete** → **+** (top of list) → New goal opens → title ("Reach the World Championship
final") → description (what success looks like, by when) → State *Not started* → Season
*Current season* → Priority *High* → add **Supervisors** → Category *Performance → …* (DARK
picker) → add key results (e.g. "Final-round qualification" with start/current/target +
target date) → click **Document check** to confirm nothing required is missing.

**Coach — mid-season check-in:** open the athlete's goal → read key-result current vs target
values → move goal **state** to *On track* / *Off track* → leave an Activity comment for the
athlete.

**Coach — scan the squad:** open **Entire Group** → read each athlete's row of state-colored
pills + KR circles → hover for a summary → open any goal that needs attention.

**Coach — close out the season:** open each wrapped-up goal → set final **state**
(*Completed / Failed / Canceled*) → add a **final evaluation**.

**Athlete — own a goal:** open Goals (own, no group/athlete switcher) → **+** → fill title,
description, attributes, key results → update **current value** as the season progresses →
add a **final evaluation** at the end.

## 9. Use cases / scenarios
- **Pre-season goal-setting meeting:** coach and athlete agree 2–3 goals with measurable key
  results; Document check confirms each goal meets the team's methodology before they move on.
- **Self-coaching / development goals:** a coach sets goals for themselves (own Goals) — for
  their coaching practice or personal development — held to the same structure.
- **Mental-coaching retrospective:** at season end, athlete and coach each add a final
  evaluation, turning the goals into the spine of the review conversation.
- **Squad review before planning:** the coach opens Entire Group and scans which athletes are
  on/off track across their goals at a glance.
- **Manual progress tracking:** an athlete updates the **current value** of "bench press"
  from 120kg → 135kg through the block; the goal-card fraction and state reflect it.
- **Biathlon "shooting test" goal** (reference example): one KR "reach ≥330 points"
  (start 295 → current 309 → target 330) — shows free-text numeric KR values in practice.

## 10. Configuration & variants
- `[CONFIG]` **Goal categories** — the two-level category → subcategory codelist is
  configured per team (one instance: Performance, Fitness, Personal, Technical, Health,
  Conditions, each with subcategories). Treat the specific list as per-instance.
- `[CONFIG]` **Methodology completeness rules** — what Document check flags as required vs
  recommended (e.g. a minimum number of key results) comes from the team's methodology.
- `[CONFIG]` **Methodology document URL** — the "Open methodology" link is a per-team
  external URL (e.g. a Notion page).
- **Universal (not configurable):** the **six states**, the **key-result fields**
  (start/current/target/date), the **manual** value updates, the season buckets (Current
  season / Past season), and the coach-vs-athlete visibility model.
- **Role variant:** athletes have **no** group selector / athlete list / Entire Group view.

## 11. Edge cases, limits, gotchas
- **Web only** — no native mobile app for Goals (PWA in a browser only).
- Values are **free text** — there's no enforced unit or numeric type, so `0`, `140kg`,
  and `unknown` are all valid; comparison/progress is by the **achieved ÷ total KR** count,
  not by computed value math.
- Progress is **manual** — analytics and conversations are only as good as the latest
  values; stale current values mislead.
- **No sub-steps/milestones** — if a goal needs finer breakdown, it must be expressed as
  more key results.
- Athletes see **only their own** goals; no cross-athlete visibility.
- `TODO(verify)`: maximum number of key results per goal (if any); whether a goal can have
  zero key results and still pass Document check (methodology-dependent).
- `TODO(verify)`: what happens to a goal's bucket when its season passes (auto-moves to
  "Past season"?).

## 12. Cross-module integration & data flow
- **← Plan / Season Calendar:** goals are scoped to a **season**; the season structure is
  the context the goals live in.
- **→ Season review / retrospective:** goals + their final evaluations feed pre/post-season
  conversations and reviews (valued by mental coaches).
- **Yollanda:** the **Document check** panel is a Yollanda persona surface (methodology
  guidance). `TODO(verify)`: whether goal content is otherwise surfaced to Yollanda search.
- `TODO(verify)`: whether goal/KR progress is pulled into any Analytics view, or whether the
  link is conversational only (the reference does not assert an Analytics graph for Goals).

## 13. Shot list (images for the docs page)
| # | Screen / state | Sample data | Caption (draft) | Callouts | Supports doc section | Role | Render now? |
|---|----------------|-------------|-----------------|----------|----------------------|------|-------------|
| 1 | Goal detail — anatomy (LIGHT) | A goal: title + description, attributes row (State pill · Season · Priority · Add supervisors · Category), key results table (STATE · KEY RESULT · START/CURRENT/TARGET VALUE · TARGET DATE) | "The parts of a goal: a title and description, its attributes, and a table of key results." | Title+description · attributes row · key results table | What a goal is | coach/athlete | **DONE → /images/goals/goal-anatomy.png** |
| 2 | New goal — empty (LIGHT) | New goal: placeholder title, "Describe it…", empty attribute buttons | "A new goal opens ready to edit: a placeholder title, a Describe it field, and buttons for its attributes." | placeholder title · Describe it · attribute buttons | Create a goal | coach/athlete | **DONE → /images/goals/new-goal.png** |
| 3 | Category picker — two-level (DARK) | Category menu with search: Performance / Fitness ✓ / Personal / Technical / Health / Conditions, each with a submenu arrow | "The category menu: a top-level category and its subcategory." | search field · top category · subcategory submenu (▸) | Goal fields (Category) | coach/athlete | **DONE → /images/goals/category-picker.png** |
| 4 | Document check popover (DARK, Yollanda) | DOCUMENT CHECK with Yollanda illustration; items: Fill the title ✅ / Add supervisor 🔴 / Choose category ✅ / Add key results ✅ / Add at least 3 key results 🟠 / Add description ✅; Open methodology ↗ | "Document check flags what's required (red) or recommended (amber), with green checks for what's done." | required (red) · recommended (amber) · done (green) · Open methodology | Check against methodology | coach/athlete | **DONE → /images/goals/document-check.png** |
| 5 | Entire Group overview (DARK) | National Team, year 2026: one row per athlete (ALL group athletes shown; **Em Krystof is the most goal-rich athlete** — best subject for the image; Simpson Lisa has one goal; empty rows e.g. Cihlář Adam / Kožnar Fanoušek), goals as state-colored rounded pills + small KR circles | "The Entire Group overview — every athlete on one row, each goal a colored pill with its key results beside it." | state-colored pill · key-result circles · one row per athlete | See a whole group's goals | coach | **DONE → /images/goals/group-overview.png** |
| 6 | Goal hero (LIGHT) | A filled goal — hero/lead image for the page top | "A goal at a glance." `TODO(verify)`: confirm intended use as page hero vs alt anatomy | (lead image — minimal callouts) | intro / page hero | coach/athlete | **DONE → /images/goals/goal-hero.png** |

## 14. Open questions / TODO(verify)
Still open (would need write actions or an athlete login to confirm):
- **Persistence on create:** is a New goal saved on open, or only after first edit? (not
  tested — would write.)
- **Final evaluation:** does it lock after submission; can each role edit only their own.
- **Per-key-result delete:** affordance not confirmed.
- **Delete-goal confirmation:** the trash icon is confirmed; the confirmation dialog is not.
- **KR limits:** max key results; zero-KR goal vs Document check pass.
- **Season roll-over:** does a goal auto-move buckets when its season ends.
- **Analytics link:** is goal/KR progress pulled into any Analytics view, or conversational
  only.

*Resolved — athlete session 2026-06-15 (clean athlete session, role "Athlete", Simpson Lisa):*
- **Athlete edit rights on coach-created goals** — athletes CAN view AND edit **their own**
  goals, **including goals a coach created for them** (Lisa edited the key results/attributes,
  added comments, and could add a final evaluation on "Improve start technique", created by
  coach Bart Simpson per its Activity log). Athletes have **no Group dropdown, no Entire Group
  entry, and no athlete switcher** — sidebar scoped to their own season buckets only (§3, §6.6).

*Resolved — clean-coach re-verification 2026-06-15 (corrected a session-collision artifact):*
- **Entire Group lists ALL athletes** — every group athlete is a row; athletes with no goals
  appear as a labeled row with no pills (observed empties: Cihlář Adam, Kožnar Fanoušek). The
  earlier "only Simpson Lisa appeared" was a browser-session collision (an athlete session had
  contaminated the coach view) and is now corrected (§6.6).
- **Coach Goals sidebar structure** — a **Group dropdown** ("National Team") → **Entire Group**
  entry + the full athlete list (members can include coaches as selectable, e.g. "Simpson
  Bart", "Yarmill Hello") (§3, §5).

*Resolved — live-verified 2026-06-15, now stated as fact in the body:*
- **Routes** — detail `/okr/{goalUuid}?group=&athlete=&week=`; per-athlete list
  `/okr?group=&athlete=`; **Entire Group = `/okr?group={id}` with no athlete param** (no
  `/okr/group` sub-route) (§0, §6.6).
- **Season buckets = Current season / Past season** (not Current/Last/Other) (§4, §5, §6.1, §10).
- **Auto-save** — no Save button; changes land in the Activity log with who+when (§6.2, §7).
- **List row chrome** — title · state dot · season chip · progress fraction · category chip;
  **priority not shown, category is** (§6.1).
- **Attribute pickers** — Priority ("!" → DARK dropdown), Category (DARK two-level dropdown),
  **Supervisors (LIGHT searchable multi-select)** — not all dropdowns are dark (§6.2, §6.5).
- **KR table** — exact columns + inline bottom "Name the key result" add-row (§6.3).
- **Final evaluations** — its own section below the KR table (text box + ▲ submit) (§6.2, §4).
- **Delete goal** — trash icon top-right (§6.2, §7).
- **Document check** — exact item set + required/recommended/done semantics + Open
  methodology (§6.4).
- *(from prior pass, unchanged)* six states · KR fields + manual updates · category two-level
  per-team codelist · Entire Group = state pills + KR circles · coach picks group→athlete,
  athletes see own only.

## 15. Source log
Grounded in the **master reference §5.3 (Goals / Cíle)**, the **existing published page**
`en/plan/goals.mdx`, and a **live verification pass on 2026-06-15** (we.yarmill.com, GUI 2.0,
group *National Team*, athlete *Simpson Lisa*, coach login *Bart Simpson*). The six images
already exist, were rendered from the live Goals UI, and are approved. **Confidence: high**
on goal/KR anatomy, the six states, manual value updates, Document check semantics, the
two-level category model, the coach-vs-athlete visibility split — **and now also (live-confirmed
this pass)** the routes (incl. no `/okr/group` sub-route), the shell module grouping
(Goals under Planning in Training Management), the detail layout, the season buckets
(Current/Past), auto-save via the Activity log, the list-row chrome, the three attribute
pickers (Priority/Category dark, Supervisors light), the KR-table columns + inline add-row,
the Final evaluations section, the delete trash icon, and the Document-check item set.
**Lower confidence / still flagged** only on items that need write actions or an athlete
login: create-persistence, final-evaluation locking/one-per-role, per-KR delete,
delete-goal confirmation, KR limits, season roll-over,
athlete edit rights, and any Analytics linkage — all carried as `TODO(verify)` in §14.

**Clean-coach re-verification (2026-06-15)** on we.yarmill.com (coach login *Bart Simpson*,
group *National Team*) corrected a **session-collision artifact** from the earlier pass: an
athlete session had contaminated the coach view, producing the wrong "only Simpson Lisa
appears in Entire Group" finding. In a clean coach session the **Entire Group overview lists
EVERY group athlete** (athletes with no goals show as labeled rows with no pills — observed
empties Cihlář Adam, Kožnar Fanoušek), and the **coach Goals sidebar** has a confirmed **Group
dropdown → Entire Group + full athlete list** (members can include coaches as selectable).
Pill colors observed for caption accuracy: grey/white ≈ not started, teal/blue ≈ on track,
green ≈ completed, amber ≈ off track, red ≈ failed/canceled. (Data note: **Em Krystof** is the
most goal-rich athlete — best subject for the Entire Group image; Simpson Lisa has one goal.)

**Athlete-session verification (2026-06-15)** on we.yarmill.com (clean athlete session, role
"Athlete", *Simpson Lisa* logged in — one login per browser) confirmed the **athlete view** of
Goals (GUI 2.0, totem panel + Training Management sidebar): the module is scoped to **Lisa's own
goals only** — her sidebar shows her season buckets (Current season / Past season) with **no
Group dropdown and no Entire Group entry** (the coach-only group/athlete switcher is absent). She
can **view AND edit her own goals, including the coach-created "Improve start technique"** (created
by coach Bart Simpson per its Activity log) — editing its key results/attributes, adding comments,
and adding a final evaluation. Her top navigation is the full classic top-nav (Reality · Plan ·
Analytics · Attendance · Files · Other · Settings) but **with no group/athlete switcher**
(everything scoped to herself); athlete Settings = "Personal" only. This resolves the prior
"athlete edit rights on coach-created goals" `TODO(verify)` (§3, §6.6, §14).

## 16. Docs page plan
- **Audience line:** `**For:** coaches, athletes · **Where:** Web app`
- **Proposed page outline** (H2s → which spec sections feed them):
  | Page section (H2) | Fed by |
  |-------------------|--------|
  | intro + audience line + `<Info>` config note + anatomy image | §1, §0, §4, §10 |
  | Where to find Goals | §3, §5 |
  | Create a goal — `<Steps>` (+ new-goal image) | §6.1, §6.2, §7, §8 |
  | Goal fields — `<ParamField>` each (+ category-picker image) | §4, §6.2, §6.5 |
  | Add key results — `<Steps>` + `<ParamField>` each | §6.3, §7 |
  | Track progress | §4, §7, §11 |
  | Comments and final evaluations | §4, §7 |
  | Check a goal against your methodology (+ document-check image) | §6.4, §7, §10 |
  | See a whole group's goals (+ group-overview image) | §6.6, §3 |
  | (optional) What athletes see | §3 |
  | Why it matters / cross-links | §1, §12 |
- **Cross-links (exact paths):** `/en/plan/plan`, `/en/plan/season-calendar` (the season a
  goal belongs to); `/en/platform/yollanda` (Document check is a Yollanda surface);
  `/en/analytics/analytics` only if an Analytics linkage is confirmed (§14 — else omit).
- **UI label → doc term:**
  | UI label | Doc term |
  |----------|----------|
  | Goals (Cíle) | Goals |
  | Supervisors | supervisors (the coaches who follow the goal) |
  | Document check | Document check (methodology check) |
  | Entire Group | Entire Group overview / a whole group's goals |
  | Totem panel | (internal only — not surfaced in user docs) |
