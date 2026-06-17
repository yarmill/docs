# Docs build — progress & resume anchor

> Read this first on resume. Everything is on disk; this file says where we are and what's next.

## ⚠️ STACK: the docs are the React site under `site/` — NOT Mintlify
The published docs are the **Next.js app under `site/`** (content `site/content/docs/**.mdx`, components
`site/components/mdx/**`, run `cd site && npm run dev`, validate `npx tsc --noEmit` + `npm run lint`).
The old Mintlify setup (`en/**`, `docs.json`, root `snippets/`, `mint dev`) was **removed** — never edit it.
See memory `docs-stack-is-react-not-mintlify` and `react-docs-site`. Much of this file below is Mintlify-era
history; treat paths like `en/**`/`docs.json` as their `site/content/docs/**` equivalents.

## Round two — Linear-style refinement (implemented in the React site)
Model = **linear.app/docs** (memory `linear-docs-style`): one-line lead → hero visual → short scannable
sections; flat feature-named IA. **All shipped in `site/content/docs/`:**
- ✅ **PageMeta** — `site/components/mdx/PageMeta.tsx` (global MDX component): two-pill `For`/`Where` row,
  brand-indigo icon, themed from `--ym-*` tokens. On all 18 module + get-started pages. Replaced the old
  `**For:** … · **Where:** …` line.
- ✅ **Page-pattern rewrite** — every content page = one lead line → PageMeta → hero (`{/* TODO hero */}`
  placeholder where no real image yet) → tight sections with bold lead-ins.
- ✅ **IA / landing card-grid** — `site/content/docs/index.mdx`: Choose your path → Start with a tutorial →
  Explore by module (Plan/Reality/Review/Platform).
- ✅ **Tutorials** — `site/content/docs/tutorials/` = gallery `index.mdx` + 5 grounded tutorials using
  `site/components/mdx/TutorialMeta.tsx` (For / time / module-chip pills) with visual TODO placeholders:
  plan-first-week · set-season-goals · log-a-session · read-readiness · connect-a-watch. Tutorials appear as
  a sidebar "space". Validated: `tsc` + `eslint` clean.
- 📄 **Tutorials + Use-cases proposal** — (folded into `docs-guide/writing-instructions.md` §5); **Visuals-skill
  brief** — `docs-guide/visuals/yarmill-visuals-brief.md` (what the yarmill-visuals skill must produce for tutorials).
- ⬜ NEXT (deferred by design): **Use cases** (role stories) — hold until tutorials get visuals & prove the
  template. Then the screenshot/visuals skill session → render the queued tutorial + module visuals (TODO
  placeholders mark every slot). One open `TODO(yarmill): verify` in log-a-session (Import-plan entry point).
- NOTE 2026-06-17: a session re-did this round on the dead Mintlify mirror before realizing the React site
  already had it at parity — no content lost; lesson saved to memory `docs-stack-is-react-not-mintlify`.

## Current phase
**Live-verify the 13 module specs** against the running Yarmill app, and **build the
`_VISUAL-TODOS.md` queue** (executable instructions for the *later, polished* screenshot skill).
Pages get refined from verified specs afterward. Visuals are rendered later (skill polish is a
separate focused session — see its TODO in `~/.claude/skills/yarmill-screenshot/SKILL.md`).

## The verification loop (per module)
1. Explore live in the browser — **tab 1 = coach "Bart"**, **tab 2 = athlete "Simpson Lisa"**
   (National Team / biathlon demo). Click through the spec's §14 `TODO(verify)` items.
2. Spawn a `general-purpose` subagent to edit `docs-guide/module-notes/<module>.md` in place: move resolved items
   from §14 into the body as confirmed, upgrade §15 confidence, and rewrite §13 "Shot list" into
   an **executable visual-todo** (cols: Live nav · State · Crop type · Caption · Callouts ·
   Post-process · Priority).
3. Keep `docs-guide/visuals/_VISUAL-TODOS.md` as the master index of shots.

## Status
- ✅ **Medical** — verified; page rewritten (`en/medical/medical-module.mdx`); images DONE
  (`images/medical/overview.png` full-window, `record.png` corner-zoom+callouts).
- ✅ **Plan** — live-verified (HIGH); §13 executable.
- ✅ **Training Log (Reality)** — live-verified; §13 executable. (Watch-data shot still to
  capture on Pé Tomáš's populated week.)
- ✅ **Attendance** — live-verified; §13 executable. Routes `/attendance/week` + `/attendance/season`;
  Week|Season toggle; Week=Mon–Sun, Season=Jan–Dec month-by-month + Total present/missed/%; year
  selector in Season; default cell = "Free" (coffee cup); marking appears to need a planned day
  (present/excused/unexcused + AM/PM not reachable on empty plan); export = PDF + monthly XLSX;
  only Lisa row, no Entire Group row with one athlete; Copy-plan button NOT seen (only export).
- ✅ **Goals** — live-verified (GUI 2.0). Detail `/okr/{uuid}`; Entire Group `/okr?group=` (no
  athlete, DARK, year selector, state pills + KR circles); buckets = Current season / Past season;
  list row = state dot+season+fraction+category; Priority & Category pickers DARK, Supervisors
  LIGHT; KR inline add-row "Name the key result"; Final evaluations section; Activity log+comment;
  Document check DARK Yollanda popover (red/amber/green + Open methodology); trash = delete; auto-save.
  Images already DONE. GUI 2.0 sidebar = Planning {Plan·Goals·Planner} / Journal {Reality·Attendance·
  Athlete profiles·Results·Wellness questionnaire}.
- ✅ **Season Calendar (Planner)** — live-verified (REFRESHED light year-wall). Route `/planner`
  needs full params (`?group&athlete&week`). MENU sidebar (no GROUP panel anymore). Top bar:
  Hide left panel · New event(+) · **Events box** (event-set library, e.g. "Events calendar 2024") ·
  year dropdown · filter dropdown. Footer: zoom ± / scroll ◀▶. 7 per-instance types+colours
  (Competition event=pink·Competition=red·Training camp=amber·Training=purple·Vacation=green·
  Test=blue·Other=cyan) + recolor palette. Add-event = DARK right panel (Title·Type·Starts·Ends
  default today·Location·Attributes(tags)·Note·CREATE EVENT); **NO participants field** anymore.
  GOTCHA: opening "+" auto-creates+autosaves a draft "New event". Event → popover → pencil →
  Edit panel (trash=delete with BLOCKING confirm; Save). No lock toggle seen.
  ⚠️ CLEANUP: a stray "New event" on 15/06/2026 on Lisa's Planner needs a manual 1-click delete
  (delete-confirm dialog hangs automation — can't remove programmatically).
- ✅ **Results** — `/evidence/results` (OTHER→Results); "Races results" table (Date·Location·Weather·
  Discipline·Rank·Note + funnels), row edit/delete, full-screen New-result modal (explicit Save/Cancel,
  Date req+today), funnel = sort+type filter. Kroczek Tomiš has a row.
- ✅ **Athlete profiles** — `/evidence/basicGlobalEvidence` (OTHER→Athlete profiles); card = Personal info
  (in-place pencil; Email+Status read-only; Status=Active); only Personal info configured in this instance;
  picker = the left group panel.
- ✅ **Files** — `/filesOverview` (own FILES tab); "Files • N" + breakdown; table Type·File name·Tags·
  Location·Date; "Adding file" modal (Date·Module(def Plan)·Tags·Athletes·Files; Save gated on a file).
- ✅ **Analytics** — ANALYTICS dropdown → 4 reports (`/reporting/`: medicalCheckTeam, groupWeeklyDashboard,
  trainingAnalyzeTrend, endOfSeasonReview); report-picker sidebar + filters; sampled group weekly dashboard
  + training trend (KPI cards + SPORTTESTER/WHOOP/HR-zone charts).
- ✅ **Wellness questionnaire** — `/evidence/wellness`; table Sleep/Stress/Mood/Soreness/Fatigue scales +
  Notes, row edit/delete; INPUT FORM = 7-step wizard (Date→Sleep→Stress→Mood→Soreness→Fatigue→Notes), green
  bar, Back/Continue, not auto-save. **New-GUI image target queued in _VISUAL-TODOS.** Em Krystof data-rich.
- ✅ **Integrations** — coach Settings = Personal+Groups only (NO Integrations tab); device integrations
  (Apple/Garmin/Polar/Suunto/WHOOP) confirmed via Analytics; Settings→Groups = membership/roles
  (Athlete/Coach/Admin + write perms). Athlete device-connect UI still TODO (athlete pass).
- ✅ **Yollanda** — header blush icon → full-screen BETA panel; "I am one big ear." + verify-info disclaimer;
  "Just ask Yollanda" chat input. Did not send a query.
- ✅ **Training Log watch-data** — confirmed "sleep & recovery" block on Em Krystof (WHOOP): Sleep/Recovery%/
  RHR/HRV/Device under the RPE controls.

## ⚠️ Session-collision corrections (clean coach re-verify 2026-06-15)
Two simultaneous logins in one browser share a session, so an athlete login had contaminated earlier coach
findings. Corrected this pass: **Attendance** (Entire Group row + all 7 athletes + per-day Edit→inline 4-state
buttons Present/Free/Excused/Not excused; bulk via Entire Group row; single daily mark, no AM/PM here);
**Goals** (Entire Group overview lists ALL athletes, not just Lisa); **Planner** (GROUP panel IS present).
Rule going forward: only ONE login per browser at a time.

## ✅ ATHLETE pass (Simpson Lisa) — COMPLETE 2026-06-15
Verified live as athlete Lisa (clean session). Key athlete-side facts:
- **Nav:** full classic top-nav (Reality·Plan·Analytics·Attendance·Files·Other·Settings) BUT **no group/athlete
  switcher** — everything scoped to self. (GUI 2.0 Goals/Medical: totem panel + sidebar, no group dropdown.)
- **Reality:** athlete edits own grid + day cards; day ⋯ menu = training shooting·notes·feeling scale·heart
  rate·mental condition·attachment·import plan·**wellness questionnaire** (self-fill entry → 7-step wizard).
- **Settings = "Personal" only** (no Groups). Contains **Applications & devices** (Connect: Apple Health·
  Dexcom·Garmin·Oura·Polar·Suunto·AC BALUO·WHOOP) + **Heart Rate Zones** table (Discipline·Valid from/to·Z0–Z5).
  → RESOLVES the athlete device-connection (Integrations) UI.
- **Athlete profile:** own card only; edits First/Last/DOB/Gender + Notes in-place; Email + Status read-only.
- **Goals:** own goals only, no Entire Group/group switcher; can edit own incl. coach-created.
- **Medical:** FULL own-record access in this instance (Open/Closed lists, full detail, New quick entry) —
  confirms the permission-dependent model (can be fully enabled OR hidden).
- Spec updates dispatched (background): integrations+athlete-profile; goals+medical+wellness.

## ✅ Data-rich athlete pass (Pé Tomáš) — 2026-06-15 (read-only)
- **Device connect state:** connected = "Disconnect" button, unconnected = "Connect". Pé has Apple Health,
  Dexcom, Garmin, Oura, Suunto CONNECTED; Polar/AC BALUO/WHOOP not.
- **Reality watch block (athlete's own, Oura):** Sleep 06:58 (bed/wake/ϟ/%), Resting HR, **Readiness score
  75-GOOD**, HRV, Device Oura. Metric set varies by brand (Oura→Readiness score; WHOOP→Recovery %).
- **Athlete Analytics = reduced/self-scoped:** dropdown shows only Load and readiness (`/reporting/loadAthlete`),
  Training data analysis, Report ATP — NO group "Weekly dashboard of group". Own trend report renders with
  device-data charts, Filters scoped to self. (Coach "Load and readiness" = team `/reporting/medicalCheckTeam`.)
- Still only lightly inferred athlete-side: Attendance/Results/Files (own-only pattern; not individually clicked).

## STATUS: all 13 module specs live-verified (coach + athlete). Next phase = refine published en/** pages
from verified specs (Linear-style, like Medical), then the focused screenshot-skill session + render the
queued visuals (Goals/Medical done; Wellness input-form wizard is the next new-GUI target in _VISUAL-TODOS).
Cleanup still pending: stray "New event" 15/06/2026 on Lisa's Planner (manual 1-click delete).

## Key facts / decisions (carry forward)
- **UI shells:** classic light top-nav for most modules; **GUI 2.0 (totem panel — not "icon
  rail")** for **Goals + Medical** (normal screens light; **overviews + modals/dropdowns DARK**);
  **Planner** = its own light year-wall.
- **Visuals:** only **new-GUI** screens get rendered images now — Goals (DONE), Medical (DONE),
  **Wellness input form (pending)**. Classic-UI shots = queued in `_VISUAL-TODOS.md` for later.
- **Data caveat:** demo Plan/Reality are empty. Use **Pé Tomáš** (Garmin/Apple/Oura), **Cihlář
  Adam** (reality log), **Em Krystof** (wellness) for data-dependent checks + shots.
- **Skill:** `yarmill-screenshot` needs a focused polish pass before rendering more visuals
  (rules + TODO already in its SKILL.md: full-window vs corner-zoom; horizontal non-overlapping
  callouts; real-icon preview; design-token rounding; neighbour bleed; no over-zoom).

## Inputs / sources
- Template: `docs-guide/module-notes/_TEMPLATE.md` · Gold standard: `docs-guide/module-notes/medical-module.md` · Review gate:
  `docs-guide/module-notes/_REVIEW-CHECKLIST.md` · Master reference: `docs-guide/master-reference.md`
  · Project rules: `CLAUDE.md`.

## After verification
1. Refine each published `en/**` page from its verified spec (conservative, Linear-style,
   like the Medical page). 2. Focused skill-polish session. 3. Render the queued visuals.
