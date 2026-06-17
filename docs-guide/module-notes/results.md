# Module Spec: Results (Competition Results & Testing) — internal

> Internal specification. NOT published (excluded via `.mintignore`). Source for the
> user-facing docs page + image plan. Fill every section; leave `TODO(verify)` where unsure.

## 0. Meta
- **Module:** Results — observed title **"Races results"** (label is configured per team/sport).
  Canonical area 3.0 *Results* covers two sibling "tabular modules": **Competition Results**
  and **Testing & Diagnostics**.
- **Route(s):** `/evidence/results?group={id}&athlete={id}&week=…` (per-athlete results table,
  confirmed live). Testing & Diagnostics forms, when configured, sit alongside under the same
  Other/Evidence area — `TODO(verify)` exact route(s).
- **Nav path:** classic top-nav → **OTHER → Results**, with the standard left **group panel**
  (group name "National Team / 7 athletes" → **Entire Group** + athlete list) for selection.
  (Per the reference, the new left-rail shell lists Results under *Journal*; this spec documents
  the **classic** shell as observed.)
- **UI shell:** **classic light top-nav** (REALITY · PLAN · ANALYTICS · ATTENDANCE · FILES ·
  OTHER · SETTINGS, Yollanda icon in header). Results renders **light**.
- **Surfaces:** web (PWA). `TODO(verify)` mobile-app parity.
- **Primary roles:** coach, athlete.
- **Config-dependence:** **high** — the module label, which columns exist, the form fields,
  their types and code-list values, and whether results are entered manually or imported from
  a federation database are **all configured per team/sport**. Whether Testing & Diagnostics
  forms exist at all is also per instance.
- **Explored:** 2026-06-15 · clean coach session (coach *Bart Simpson*) · group *National Team* ·
  athletes *Simpson Lisa* (empty) and *Kroczek Tomiš* (filled) · classic top-nav UI · by main
  agent. Competition Results observed live — screen, row actions, New-result form, and column
  filter popover all confirmed. Testing & Diagnostics not configured in this instance
  (documented from the master reference + marked `TODO(verify)`).
- **Render images now?** **NO** — shot list only.

## 1. Purpose & why it exists
Results answers the closing question of the training loop: *did the work produce the effect?*
It keeps the outcomes — races, matches, and structured tests — in **configurable tables per
athlete**, so performance over time is **data, not memory**. Two kinds of outcome live here:

- **Competition Results** — the race/match record (date, place, discipline, rank, etc.),
  entered by hand **or** imported automatically from a federation results database.
- **Testing & Diagnostics** — structured test results (strength, lactate, body composition,
  sport-specific protocols) captured in the same kind of configurable form.

Both feed **Analytics**: race analyses and Test & Diagnostics reports are built on this data,
so the team reads progress against the field and against its own benchmarks.

## 2. Jobs to be done (per role)
> Format: "When I <situation>, I want to <motivation>, so that <outcome>."
- **Coach:**
  - When an athlete races, I want to record the result with its key facts (place, discipline,
    rank), so the season's outcomes are in one structured table I can scan and filter.
  - When I run a fitness or sport-specific test, I want to log the numbers in a consistent
    form, so I can compare them over time and against benchmarks in Analytics.
  - When my federation's results are already in a public database (IBU, FIS), I want them to
    flow in automatically, so I don't re-key races by hand.
- **Athlete:**
  - When I want to see how I've performed, I want my own results table over the season, so my
    progress is concrete rather than remembered.
  - `TODO(verify)` whether athletes can **add/edit** their own results, or only view them —
    not confirmed live for this module.

## 3. Personas & permissions
- **Coach:** records, edits, and deletes results for athletes in the group (each row carries
  inline edit/delete icons — confirmed live); selects the athlete via the left group panel,
  opens the table, adds a new result via the form, and uses column filters to find entries.
- **Athlete:** can view their own results table. `TODO(verify)` whether athletes have
  create/edit rights on results, and whether visibility is permission-gated per instance.
- **Selection model:** the table is **per-athlete** — an athlete must be selected before the
  table is shown (same selection model as the other per-athlete journal modules).
- `TODO(verify)` exact create/edit/delete permission gates and how they are configured.

## 4. Key concepts & vocabulary
- **Result (record):** one row in the results table = one competition (or one test, in a
  Testing & Diagnostics form). Created via the **New result** form.
- **Configured columns / fields:** the table columns and the form fields are the **same
  configured set**, defined per team/sport. They map 1:1 (each column is a field on the form).
- **Tabular module:** the reference's term for these configurable forms-plus-tables. One
  template is duplicated per use case (one for races, one per test type). [CONFIG]
- **Field types (per reference):** **text · date · code list (dropdown) with defined values ·
  file · calculated**, plus a **mandatory** flag. `TODO(verify)` which of these appear in the
  Results form UI and how (e.g. calculated/file fields not observed live).
- **Demo (biathlon) columns** — observed: **Date · Location · Weather · Discipline · Rank ·
  Note**. These are this team's configuration, **not universal**. [CONFIG]
- **Reference field examples (other sports):** competition type code list, discipline,
  performance, rank, # participants, # countries, note, attached official-results file —
  illustrative of what a different sport's config might include. [CONFIG]
- **Empty state:** the table shows **"No records"** when the selected athlete has none.
- **Import vs manual entry:** some sports **import results automatically** from a federation
  database (IBU SIWIDATA for biathlon, FIS for skiing/snowboard, others — see §12). Those
  teams may not enter races manually at all. [CONFIG]
- **Testing & Diagnostics:** the sibling tabular module — same mechanics, different content
  (test protocols). Not configured in this demo instance.

## 5. Information architecture
- **Where it lives:** classic top-nav → **OTHER → Results**. Route `/evidence/results`.
- **Selection:** choose an athlete (per-athlete module) → the athlete's results table loads.
- **Layout (observed):** a single screen titled **"Races results"** with a **New result**
  button top-right and the results **table** below, each column carrying a **filter (funnel)**
  control. `TODO(verify)` whether multiple results tables (e.g. separate test forms) are
  selectable from a sub-nav/tab list when more than one is configured.
- **Related modules around it:**
  - **Analytics** — consumes this data (race analyses, Test & Diagnostics reports).
  - **Reality / Training Log** — what happened in training; Results is the *outcome* sibling.
  - **Athlete Profile** — holds external IDs (e.g. **IBU ID**) that link an athlete to the
    results database for automatic import.

## 6. Screen & UI inventory
> Per field: **label · type · default · validation · who-can-edit · auto-save?**
> Per screen: states — **empty / loading / filled / error**, plus overlays/modals/menus.

### 6.1 Results table — "Races results" (per athlete)
- **Layout:** page heading **"Races results"** (configured label) top-left; **New result**
  button (magenta/blush) top-right; a **table** filling the page; each column header carries a
  **filter (funnel) icon**.
- **Controls:**
  - **New result** — opens the new-result form (§6.2).
  - **Column filters (funnel)** — every column header carries a **funnel** icon. Clicking it
    opens a popover that combines **sort + a type-specific filter** (observed live):
    - **Sort** at the top — **Ascending (0→1) / Descending (1→0)**.
    - **Filters** below, appropriate to the column type. For the **Date** column (enumerated
      live): radio options **This week · Last week · This month · Last month · Exact date ·
      Range**.
    - **Clear** + **Apply** buttons at the bottom.
    The sort + Clear/Apply pattern is general across columns; only the **Date** column's specific
    filter options were enumerated — other columns' options remain `TODO(verify)`.
- **Columns (demo biathlon, configured) [CONFIG]:** **Date · Location · Weather · Discipline ·
  Rank · Note**, each header carrying a funnel filter icon. Other teams have different columns.
- **States:**
  - **Empty:** **"No records"** for an athlete with no results (observed for *Simpson Lisa*).
  - **Filled:** one row per result. Observed example (*Kroczek Tomiš*): **24/06/2025 · Zermatt ·
    ☀️ sunny · Slopestyle · 1. · Top** — note the **Weather** code-list value renders **with an
    emoji** (☀️ sunny).
  - **Loading / error:** `TODO(verify)` — not observed.
- **Per-row actions (confirmed live):** each row carries, at its right end, an inline **edit
  (pencil)** icon and a **delete (trash)** icon. There is **no separate detail view** — editing
  opens the same New-result form populated with the row's values (§6.2). The **delete-confirmation
  dialog** was not tested — `TODO(verify)`.

### 6.2 New result form
- **Trigger:** **New result** button (top-right), or a row's **edit (pencil)** icon (opens the
  same form populated).
- **Surface (confirmed live):** a **full-screen LIGHT modal** titled **"New result"**, with a
  **Close** (X) control top-right.
- **Form fields (demo biathlon, configured — match the table columns) [CONFIG], top→bottom:**
  - **Date** — `field: date` · **REQUIRED** (no "Optional" tag) · **defaults to today** (e.g.
    15/06/2026).
  - **Location** — `field: text (free)` · *Optional*.
  - **Weather** — `field: code list (dropdown)` ("Select …") · *Optional*. (Code-list values
    render with an emoji in the table, e.g. ☀️ sunny.)
  - **Discipline** — `field: text (free)` · *Optional*. **Not a dropdown in this instance** —
    a different sport's config may make this a code list. [CONFIG]
  - **Rank** — `field: text` · *Optional* · helper sub-label **"Final ranking"**.
  - **Note** — `field: text (free, textarea)` · *Optional*.
  Only **Date** is required; every other field is **Optional**.
- **Save behaviour (confirmed live):** **explicit Save/Cancel** — bottom of the form has
  **Cancel** + **Save result** (magenta) buttons. It is **NOT auto-save** and **NOT
  create-on-open**: opening the form creates nothing; a row is written only when you press
  **Save result**.
- **States:** `TODO(verify)` validation/error state when the required **Date** is cleared
  (required flag confirmed; the error presentation was not exercised).

### 6.3 Testing & Diagnostics form(s) — `TODO(verify)` (not configured in this instance)
- Same tabular mechanics as §6.1/§6.2 with test-specific fields (e.g. lactate values, body
  composition metrics, strength numbers). Per the reference these may use **calculated** and
  **file** field types. **Not present in this demo instance**, so the exact module name,
  route, selection UI, and field layout are `TODO(verify)` on an instance that has them.

## 7. Actions & interactions
- **Create a result:** **New result** → full-screen modal → fill fields (only **Date** is
  required; it defaults to today) → **Save result** → row appears in the table. The flow is
  **explicit Save/Cancel** (no auto-save, nothing created on open). No Activity/change log for
  results was observed — **do not assert one** (do not assume the Medical-style log applies).
- **Filter / sort:** click a column **funnel** → popover with **Sort (Asc/Desc)** + a
  type-specific filter (Date: This week / Last week / This month / Last month / Exact date /
  Range) → **Apply** (or **Clear**).
- **Edit a result:** click a row's **edit (pencil)** icon → the same New-result form opens
  populated → **Save result**. No separate detail view.
- **Delete a result:** click a row's **delete (trash)** icon. The confirmation dialog (if any)
  is `TODO(verify)`.
- **Automatic import:** for import-enabled sports, results appear without manual entry;
  imported rows' editability is `TODO(verify)` (note: integration-imported *training* data is
  read-only inside Yarmill per §5.11 of the reference — whether the same rule applies to
  imported results is unconfirmed).

## 8. User journeys / flows (per role)
**Coach — record a race (observed shape):** OTHER → Results → select athlete (e.g.
*Simpson Lisa*) → **New result** → enter **Date**, **Location**, **Weather**, **Discipline**,
**Rank**, **Note** → save → the race appears as a new row in **Races results**. Later, use the
**Discipline** funnel to see only sprint results, or the **Date** funnel to scope a season.

**Coach — rely on automatic import (import-enabled sport):** with the athlete's federation ID
set in **Athlete Profile**, races flow in automatically from the federation database (e.g. IBU
SIWIDATA); the coach reviews the table rather than entering races by hand. [CONFIG]

**Coach — log a test (Testing & Diagnostics, where configured):** select the athlete → open the
relevant test form → enter the test's fields → save → the result feeds the **Test & Diagnostics
report** in Analytics. `TODO(verify)` exact navigation to the test form.

**Athlete — review own results:** select self → read the results table for the season.
`TODO(verify)` whether athletes can add/edit.

## 9. Use cases / scenarios
- **Season race log (biathlon, manual or imported):** every race kept as a structured row —
  date, location, discipline, rank — so the season's competitive record is one filterable table
  rather than a spreadsheet.
- **Find a subset fast:** a coach filters the table by **Discipline** to compare an athlete's
  sprint results, or by **Date** to look only at the championship block.
- **Federation auto-import:** a biathlon team whose results come from **IBU SIWIDATA** never
  types a race — results appear automatically and feed race analyses in Analytics. [CONFIG]
- **Structured testing over time (where configured):** a team logs twice-yearly fitness tests
  (e.g. an uphill-run protocol) or lab tests (lactate, body composition) in test forms, then
  reads individual trends and benchmark comparisons in Analytics. [CONFIG]
- **Athlete self-review:** an athlete opens their own results table to see how the season has
  gone in concrete numbers.

## 10. Configuration & variants
- `[CONFIG]` **Module label** — observed "Races results"; the canonical name is *Results*.
- `[CONFIG]` **Columns / form fields** — which fields exist, their order, types, and code-list
  values are configured per team/sport. The demo's *Date · Location · Weather · Discipline ·
  Rank · Note* is one biathlon team's setup, not universal.
- `[CONFIG]` **Manual entry vs automatic import** — import-enabled sports (IBU SIWIDATA, FIS,
  and others; see §12) may not enter races manually; results-DB connections require a signed
  license/permission agreement with the data provider.
- `[CONFIG]` **Testing & Diagnostics forms** — whether any exist, how many, and their fields
  are per instance. The demo instance has **none** configured.
- `[CONFIG]` **Field types in use** — text / date / code list / file / calculated + mandatory
  flag are available per the reference; which appear in a given form is configured.
- **Universal mechanics:** per-athlete tables, the **New result** form mirrors the table
  columns, **column filters**, and the **"No records"** empty state.

## 11. Edge cases, limits, gotchas
- **Per-athlete only:** no table is shown until an athlete is selected.
- **Empty state:** **"No records"** rather than an empty grid.
- **Imported-results editability:** `TODO(verify)` — may be read-only inside Yarmill (as with
  imported training data), meaning manual edits happen in the source database.
- **Column variability:** documentation must not assert specific columns as universal — they
  are configured. Always frame the demo columns as an example.
- `TODO(verify)` mandatory-field validation, duplicate-row handling, and mobile layout.

## 12. Cross-module integration & data flow
- **→ Analytics / Race analyses:** for biathlon/skiing, race data (imported from **IBU
  SIWIDATA** / **FIS**) drives race overview, race detail/deviation, athlete results history,
  race progress, and competition-shooting comparisons (reference Appendix A.3). [SPORT]
- **→ Analytics / Test & Diagnostics reports:** configured test forms feed individual trends,
  team overviews, and evaluation vs **federation limits** or **age-category benchmarks**.
- **← Athlete Profile:** external IDs (e.g. **IBU ID**, biochemistry DB ID) link an athlete to
  results/test databases for automatic import.
- **← Integrations (Settings):** results-database connections (IBU SIWIDATA, FIS, Resultina,
  CZ Tennis, Swimming IS, Slalom World, etc.) are set up under Integrations and require a
  provider license agreement.
- **Sibling to Reality:** Reality records *what happened in training*; Results records the
  *outcome* (races/tests). Together with Plan they close the loop Plan → Reality → Results →
  Analytics.

## 13. Shot list (images for the docs page)
> One row per planned image. Render now? = NO for all (shot list only).
| # | Screen / state | Sample data | Caption (draft) | Callouts | Supports doc section | Role | Render now? |
|---|----------------|-------------|-----------------|----------|----------------------|------|-------------|
| 1 | Results table — "Races results", filled (light) | National Team / Kroczek Tomiš; row: 24/06/2025 · Zermatt · ☀️ sunny · Slopestyle · 1. · Top | "Results keeps each athlete's competitions in one structured, filterable table — columns are configured for your sport." | New result button (magenta) · column funnels · a row's edit/delete icons | Record a result / The results table | coach | shot-list only (no) |
| 2 | New result form (full-screen light modal) | "New result" modal: Date (today, required) · Location · Weather (dropdown) · Discipline · Rank ("Final ranking") · Note; Cancel + Save result | "Add a result by filling the configured fields — only Date is required; press Save result to record it." | required Date · Optional fields · Save result button | Record a result | coach | shot-list only (no) |
| 3 | Empty state | Simpson Lisa, no results → "No records" | "Before any results are entered, the table reads No records." | "No records" | The results table (empty) | coach/athlete | shot-list only (no) |
| 4 | Column filter open | Date funnel popover: Sort Asc/Desc + This week / Last week / This month / Last month / Exact date / Range + Clear/Apply | "Each column's funnel combines sort and a filter — for dates, scope to a week, month, exact date, or range." | the open popover (sort + filter + Apply) | Find results fast | coach | shot-list only (no) |
| 5 | Testing & Diagnostics form (optional, later) | A configured test form on an instance that has one | "Teams that run structured testing log it in the same kind of form, which feeds reports in Analytics." | a test field · link to Analytics | Testing & Diagnostics | coach | shot-list only — needs an instance that has it (no) |

## 14. Open questions / TODO(verify)
> Resolved 2026-06-15 (clean coach session) and moved into the body: form mechanics
> (full-screen modal, explicit Save/Cancel, not create-on-open), field types/defaults/required
> (Date required + defaults to today; Location/Discipline/Rank/Note free text; Weather code-list
> dropdown), row actions (inline edit/delete, edit reuses the populated form, no detail view),
> column filter UI (funnel = sort Asc/Desc + type-specific filter + Clear/Apply; Date options
> enumerated), and the route. Still open:
- **Athlete permissions:** can athletes create/edit/delete their own results, or only view? Is
  visibility permission-gated per instance? (Only the **coach** view was tested.)
- **Delete confirmation:** whether the trash icon shows a confirmation dialog before deleting.
- **Required-field error state:** how a cleared, required **Date** is presented on Save.
- **Column filters (non-Date columns):** the specific filter options for Location / Weather /
  Discipline / Rank / Note (the sort + Clear/Apply pattern is general; only **Date**'s options
  were enumerated).
- **Activity/change log:** none observed for results — confirm one truly does not exist before
  documenting either way (do not assert).
- **Multiple tables:** when more than one results/test table is configured, how are they
  selected (tabs / sub-nav)?
- **Imported results:** editability of auto-imported rows inside Yarmill.
- **Testing & Diagnostics (whole module):** name, route, selection UI, and field layout on an
  instance that actually has test forms configured — none in this demo.
- **Mobile-app parity** for the table and form.
- **Testing & Diagnostics route(s):** confirm the sibling test-form route(s) (the Competition
  Results route `/evidence/results?group=…&athlete=…&week=…` is confirmed).

## 15. Source log
- **Observed live — clean coach session** (2026-06-15; we.yarmill.com; coach *Bart Simpson*;
  group *National Team*; classic top-nav UI; athletes *Simpson Lisa* (empty) and *Kroczek Tomiš*
  (filled)). Confirmed and folded in without TODO:
  - **Route & nav:** `/evidence/results?group={id}&athlete={id}&week=…`; OTHER → Results;
    per-athlete via the left **group panel** ("National Team / 7 athletes" → Entire Group +
    athlete list). Renders **light**.
  - **Screen:** title **"Races results"** (configured label); magenta **New result** button
    top-right; table columns **Date · Location · Weather · Discipline · Rank · Note**, each
    header with a **funnel** icon; **"No records"** empty state; filled-row example *24/06/2025 ·
    Zermatt · ☀️ sunny · Slopestyle · 1. · Top* — **Weather code-list value renders with an
    emoji**.
  - **Row actions:** inline **edit (pencil)** + **delete (trash)** per row; **no detail view** —
    edit reuses the same populated form.
  - **New-result form:** **full-screen LIGHT modal** ("New result", Close X); **explicit
    Save/Cancel** (Cancel + **Save result** magenta) — **not auto-save, not create-on-open**.
    **Date** required + **defaults to today**; **Location/Discipline/Rank/Note** free text
    (Optional); **Weather** code-list dropdown (Optional); **Rank** has helper sub-label
    "Final ranking".
  - **Column filter popover** (Date column observed): **Sort Asc (0→1) / Desc (1→0)** + filter
    radios **This week · Last week · This month · Last month · Exact date · Range** + **Clear /
    Apply**. Sort + Clear/Apply pattern is general; other columns' filter options still TODO.
  - **Confidence: high** on the above; **note** the columns/fields/label are this instance's
    configuration, not universal.
- **From the master reference** (§5.7 tabular modules, §5.11 integrations, §A.3 race analyses,
  §4.0 Analytics reports): the Competition Results / Testing & Diagnostics framing, field-type
  list, manual-vs-import behaviour, federation databases (IBU SIWIDATA, FIS, …), and the
  Analytics data flow. **Confidence: high** for the model; **medium/low** for exact in-UI
  field types and form mechanics, which are marked `TODO(verify)`.
- **Not configured in this instance:** Testing & Diagnostics forms — documented from the
  reference only and flagged `TODO(verify)` for UI specifics.
- **Not observed (still `TODO(verify)`, not asserted):** athlete create/edit/delete rights (only
  the coach view was tested), the delete-confirmation dialog, required-field error presentation,
  non-Date column filter options, any activity/change log (none seen — do not assert),
  loading/error states, and mobile parity.

## 16. Docs page plan
> The bridge from spec → published page. The existing `en/results/results.mdx` is a short stub;
> this plan expands it to medical-level depth once the TODO(verify) items are confirmed.
- **Audience line:** `**For:** coaches and athletes · **Where:** Web app`
- **Proposed page outline** (H2s → which spec sections feed them):
  | Page section (H2) | Fed by |
  |-------------------|--------|
  | intro + audience line + `<Info>` "configured per team/sport" note | §1, §0, §10 |
  | The results table (+ table image) | §6.1, §4 |
  | Record a result — `<Steps>` (+ form image) | §6.2, §7, §8 |
  | Find results fast — column filters | §6.1 (filters), §9 |
  | Automatic import (federation databases) | §10, §12, §0 |
  | Testing & Diagnostics | §6.3, §1, §12 |
  | Where results go (Analytics) | §12 |
  | What athletes see | §3 (pending `TODO(verify)`) |
- **Cross-links** (exact paths to link from this page):
  - `/en/analytics/analytics` (race analyses, Test & Diagnostics reports)
  - `/en/platform/integrations` (federation results-database connections)
  - `/en/platform/athlete-profile` (external IDs / IBU ID for import)
  - `/en/reality/training-log` (Reality as the outcome's sibling)
- **UI label → doc term** (pin wording where UI label and doc word differ):
  | UI label | Doc term |
  |----------|----------|
  | "Races results" (page title) | the results table / Results (call it Results; note the team's label varies) |
  | New result | add a result |
  | "No records" | empty results table |
  | column funnel | column filter |
