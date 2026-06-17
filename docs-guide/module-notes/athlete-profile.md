# Module Spec: Athlete profile (Evidence / Kartotéka) — internal

> Internal specification. NOT published (excluded via `.mintignore`). Source for the
> user-facing docs page + image plan. Fill every section; leave `TODO(verify)` where unsure.

## 0. Meta
- **Module:** Athlete profile — UI label **Athlete profiles**; instance terms **Evidence** / **Kartotéka** (the athlete card)
- **Route(s):** `/evidence/basicGlobalEvidence?group={id}&athlete={id}&week=…` (confirmed live, 2026-06-15). Group + athlete are query params; selecting an athlete in the left panel loads their card at this same route. (`/athletes` was wrong.)
- **Nav path:** classic top-nav → **OTHER → Athlete profiles**. The **OTHER** menu groups several modules; observed routes: Season review → `/seasonEvaluation`; Goals → `/okr`; Planner → `/planner`; **Athlete profiles → `/evidence/basicGlobalEvidence`**; Results → `/evidence/results`; Wellness questionnaire → `/evidence/wellness`; Medical module → `/medical`. (In the new left-rail shell the same module sits under *Journal* → Athlete profiles — name the module, not the shell.)
- **UI shell:** **classic light top-nav** (light surface; top menu REALITY · PLAN · ANALYTICS · ATTENDANCE · FILES · OTHER · SETTINGS)
- **Surfaces:** web (PWA); mobile app `TODO(verify)` whether the card is fully editable on the iOS/Android app or web/PWA only
- **Primary roles:** coach (all athletes' cards, edit); athlete (own card, edit only the fields the team marks athlete-editable)
- **Config-dependence:** **high** — beyond the always-present **Personal info** section, every section and field is configured per team (which sections exist, their fields, field types, labels, and which fields athletes may edit)
- **Explored:** **Live-verified 2026-06-15** with a clean coach session (we.yarmill.com, coach "Bart Simpson", group "National Team", athlete "Kroczek Tomiš", classic top-nav UI). Route, the sidebar-as-picker model, and the Personal-info field set with edit affordances are now confirmed. Additional configured sections were NOT present in this instance, so additional-section UI remains reference-only / `TODO(verify)`. **Plus a clean ATHLETE session 2026-06-15** (we.yarmill.com, athlete "Simpson Lisa", role Athlete, classic top-nav, own session): confirmed the athlete sees **only their own card** (no group panel / athlete switcher) at the same route, and the **athlete-editable field set** on Personal info (First name, Last name, DOB, Gender, Notes editable via pencil; **Email + Status read-only**). Athlete **Settings = Personal only** (no Groups), carrying the Applications & devices + Heart Rate Zones sections. Remaining `TODO(verify)` items below mark what still wasn't confirmed in-app.
- **Render images now?** **NO** — shot list only (§13). Card UI not captured live; render after a live pass.

## 1. Purpose & why it exists
The central card for each person on the team — one place that replaces the scattered
spreadsheets of contacts, equipment sizes, IDs, and administrative records. Instead of a
coach hunting through email threads and shared sheets for someone's shoe size, passport
number, or emergency contact, every detail lives on the athlete's card and stays current
because both coach and athlete can keep it up to date.

For federations it also does a second job: external IDs on the card (e.g. an IBU ID, a
biochemistry-database ID) **link the athlete to outside databases**, so Yarmill records
join up with the federation systems already in use.

## 2. Jobs to be done (per role)
> Format: "When I <situation>, I want to <motivation>, so that <outcome>."
- **Coach:**
  - When a new athlete joins, I want one place to capture their contacts, sizes, and IDs,
    so I'm not chasing details across spreadsheets and emails.
  - When a detail is wrong (a mis-spelled name, an old club), I want to fix it directly on
    the card, so the record is correct everywhere.
  - When I order kit or fill a federation entry, I want sizes, classifications, and external
    IDs to hand, so I can act without asking the athlete.
- **Athlete:**
  - When my details change (new shoe size, renewed passport), I want to update my own card,
    so my coach always has the current information.
  - When I set up my account, I want a clear card to fill in, so I'm ready to train and my
    devices are connected.
- **Admin / staff:**
  - When I configure the instance, I want to define which sections and fields the card holds
    and who can edit them, so the card matches how this team actually works. `[CONFIG]`

## 3. Personas & permissions
- **Coach:** sees and edits **every athlete's** card across the group; can correct any field
  (e.g. fix a name) from the card. Selects an athlete, then edits fields in place.
- **Athlete:** sees and edits **their own** card only (**confirmed live 2026-06-15, athlete
  *Simpson Lisa***: no group panel and no athlete switcher — the card is scoped to the
  logged-in athlete at `/evidence/basicGlobalEvidence`). Within their card, an athlete can edit
  **only the fields the team has marked athlete-editable**. **On Personal info (confirmed on
  Lisa's own card, this instance):** the athlete **CAN** edit **First name · Last name · Date of
  birth · Gender · Notes** (in-place pencil); **Email and Status are read-only** to the athlete
  (no pencil; Status shows "Active"). This matches the coach view's editable set in this
  instance. Configured (additional) sections likewise expose only the fields marked
  athlete-editable (e.g. shirt/short/shoe sizes, passport). **Note:** athlete-editability is a
  **per-field configuration** — the name/DOB/gender/notes-editable, email/status-locked set
  above is **this instance shown**, not a universal default. `TODO(verify)` exactly how a
  non-editable field renders to an athlete (hidden vs greyed/locked) — Lisa's read-only fields
  simply lacked a pencil.
- **Admin / staff:** `[CONFIG]` defines the section/field structure, field types, labels, and
  per-field edit permissions. `TODO(verify)` whether this is self-serve in Settings or set up
  by Yarmill.
- **Permission model:** which fields are athlete-editable is a per-field configuration, not a
  blanket role switch — "keeping the card current is a shared job."

## 4. Key concepts & vocabulary
- **Athlete card / profile:** the per-person record. UI label **Athlete profiles**; instance
  terms **Evidence** / **Kartotéka**.
- **Personal info:** the one **always-present** section. Fields: **First name**, **Last name**,
  **Email**, **Date of birth**, **Gender**, **Status**, **Notes**.
- **Card header:** above the sections, a header band with a round **avatar + full name + email
  + a role pill** (e.g. "Athlete").
- **Status:** a field on Personal info — a **code list** (status code-list); observed value
  **"Active"** (confirmed live). Read-only in this instance (no pencil). `TODO(verify)` the full
  value set and what the other values mean (e.g. inactive / archived) and whether Status is ever
  athlete- or coach-editable elsewhere.
- **Additional sections:** `[CONFIG]` everything beyond Personal info. Reference examples of
  section groupings: **personal documents · sports info · equipment · body measurements ·
  emergency / parent contacts · administrative records**.
- **Field types:** the same set as the tabular modules — **text · date · code list (dropdown
  with defined values) · file** (and, in tabular modules, calculated + a mandatory flag).
  `TODO(verify)` which of these field types are actually offered on the athlete card vs only
  in Testing/Results tabular modules.
- **In-place edit (pencil):** most fields are edited in place via a **pencil** affordance — click
  pencil → edit → save (confirmed live for First name, Last name, DOB, Gender, Notes). **Not
  every field has a pencil:** in this instance **Email** and **Status** are read-only (no pencil).
- **External IDs:** fields whose value links an outside database — e.g. **IBU ID**,
  biochemistry-DB ID. `TODO(verify)` whether an external ID is just a stored text value or an
  active link/integration.
- **Sport classification:** a code-list field; para-sport values are prefixed (e.g. `para-…`).
- **Athlete-editable field:** a per-field flag making a field editable by the athlete (e.g.
  sizes, passport).
- **Reference field examples** (all `[CONFIG]`): phone, address, sport club, sport
  classification, anti-doping (ADEL) certificate, passport number + validity, shirt / short /
  shoe sizes (athlete-editable), ski/pole length, ski brand, external IDs.

## 5. Information architecture
- **Reach it:** classic top-nav → **OTHER → Athlete profiles** (`/evidence/basicGlobalEvidence`).
- **Picker = the standard left group panel** (confirmed live — there is **no** separate roster
  table/search screen in this instance). The left sidebar shows the **group dropdown** (e.g.
  "National Team / 7 athletes") → **Entire Group** + the athlete list; **selecting an athlete
  loads their card** in the main pane. The sidebar IS the picker.
- **Card layout:** a header band (**avatar + full name + email + role pill**) above the section
  panels. The first/only section is **Personal info** (person icon). When an instance configures
  additional sections they would follow Personal info — but none were present here, so whether
  additional sections render as stacked panels, tabs, or an accordion, and their on-card order,
  could **not** be verified live and remains `TODO(verify)`.
- **Athlete entry point (confirmed live 2026-06-15, athlete *Simpson Lisa*):** an athlete reaches
  **their own** card via the same **OTHER → Athlete profiles** menu item (`/evidence/basicGlobalEvidence`),
  scoped to themselves — **no group panel and no athlete switcher** (the left group picker coaches
  have is absent). Same menu item, not a separate "My profile" variant.
- **Athlete Settings (confirmed live 2026-06-15):** the athlete's Settings is **Personal only**
  (no **Groups** tab — coaches have Personal + Groups). That **Settings → Personal** page also
  carries the **Applications & devices** (device connections) and **Heart Rate Zones** sections —
  confirming HR zones live under **Settings**, not on the card (see §12; cross-ref the
  integrations spec).
- **Related modules:** Settings (HR zones live under **Settings → Personal → Heart Rate Zones**,
  *not* on the card — see §12); Integrations (device connection — Settings → Personal →
  Applications & devices — is the sibling first-run step); identity/avatar set at registration.

## 6. Screen & UI inventory
> Per field: **label · type · default · validation · who-can-edit · auto-save?**
> Per screen: states — **empty / loading / filled / error**, plus overlays/modals/menus.

### 6.1 Athlete picker (the left group panel)
- Layout: the **standard left group sidebar** (confirmed live) — **not** a dedicated roster
  screen. Group dropdown at the top (e.g. "National Team / 7 athletes") → **Entire Group** entry
  + the athlete list below. Selecting an athlete loads their card in the main pane.
- Controls: pick the group from the dropdown; select an athlete from the list. `TODO(verify)`
  whether a search/sort or add-athlete action exists in instances with larger groups (none
  needed/observed in this 7-athlete group).
- States: filled (athletes listed) · empty (no athletes / outside your group) `TODO(verify)`.
- Coach uses this sidebar to switch athletes. **Athletes do NOT get this picker (confirmed live
  2026-06-15, athlete *Simpson Lisa*):** the left group panel is **absent** for an athlete — they
  load straight into their **own** card at `/evidence/basicGlobalEvidence` with no group dropdown
  and no athlete switcher.

### 6.2 Athlete card — Personal info (always present)
- Layout: above the section, a **header band** with a round avatar + full name + email + a role
  pill (e.g. "Athlete"). Below it, the **Personal info** panel (person icon) of labelled fields;
  most fields edited **in place** via a **pencil**, but **Email and Status have no pencil**
  (read-only here). Confirmed live on Kroczek Tomiš's card (light UI).
- Fields (values observed live in this instance):
  - **First name** — `text · in-place pencil` — value "Tomiš"
  - **Last name** — `text · in-place pencil` — value "Kroczek"
  - **Email** — `text/email · READ-ONLY (no pencil)` — value e.g. tomis@yarmill.com; likely
    locked as the login identity. `TODO(verify)` whether Email is always locked and whether
    changing it would affect login.
  - **Date of birth** — `date · in-place pencil` — value "22/04/1994"; set during registration,
    correctable here
  - **Gender** — `code list · in-place pencil` — value "Man". `TODO(verify)` full value set
  - **Status** — `code list · READ-ONLY (no pencil)` — value "Active" (a status code-list value).
    `TODO(verify)` full value set
  - **Notes** — `text (multi-line TODO(verify)) · in-place pencil` — value "-"
- Who-can-edit: coach edits the pencil-bearing fields. **Athlete-side (confirmed live 2026-06-15
  on *Simpson Lisa*'s own card):** the athlete CAN edit **First name · Last name · Date of birth ·
  Gender · Notes** (pencil); **Email and Status are read-only** (no pencil; Status "Active") —
  matching the coach-editable set in this instance. This is **per-field config** (this instance
  shown), not a universal default.
- Validation: `TODO(verify)` required fields, formats, length limits.
- Auto-save: a pencil was **not** opened (to avoid editing live data), so the exact in-place
  editor and whether it auto-saves on blur or has an explicit Save/Cancel remain `TODO(verify)`.
- States: filled (registered athlete) · partially filled (new account) · error on save
  `TODO(verify)`.

### 6.3 Athlete card — configured sections `[CONFIG]`
> **Not verified live (2026-06-15):** the demo instance (National Team / Kroczek Tomiš)
> configures **only Personal info** — no equipment / sports-info / body-measurement / contacts /
> external-ID (IBU ID) sections were present. Everything below is **reference-only**; the
> additional-section UI (panels vs tabs vs accordion), external-ID behaviour, and non-text field
> types could NOT be observed and remain `[CONFIG]` / `TODO(verify)`. Do not assert as observed.
- Layout (reference): each configured section is expected to be a panel of fields, same
  **in-place pencil** edit pattern as Personal info. Sections, fields, labels, and types are all
  per-instance.
- Reference example sections and fields (illustrative, per instance):
  - **Sports info:** sport club; sport classification (code list; `para-…` prefix); ski/pole
    length; ski brand.
  - **Equipment / sizes:** shirt / short / shoe sizes — typically **athlete-editable**.
  - **Body measurements:** `TODO(verify)` field set (e.g. height/weight) and whether these
    feed Analytics.
  - **Emergency / parent contacts:** phone, address, contact name. `TODO(verify)` multiple
    contacts per athlete.
  - **Personal / administrative documents:** passport number + validity (date); anti-doping
    (ADEL) certificate; attached files.
  - **External IDs:** IBU ID; biochemistry-DB ID — link to outside databases.
- Field controls by type: text input · date picker · code-list dropdown · file attach
  (`TODO(verify)` accepted file types / size, and whether file fields reuse the Files module).
- Who-can-edit: per field — coach always; athlete only where marked athlete-editable.
- States: empty field (not yet filled) · filled · file present · error `TODO(verify)`.

### 6.4 In-place field editor (pencil)
- Trigger: the **pencil** next to a field.
- Behaviour: opens the field for editing inline; enter value; save. `TODO(verify)`
  save/cancel vs auto-save, keyboard handling, and whether code-list fields open a searchable
  dropdown.
- `TODO(verify)` whether any change is written to an Activity/change log (Medical has one; the
  card's logging behaviour is unconfirmed).

## 7. Actions & interactions
- **Select athlete** (coach): open a card from the list.
- **Edit a field:** pencil → edit → save; affects that field everywhere it's surfaced.
  `TODO(verify)` save mechanics + any confirmation.
- **Attach a file** to a file-type field (e.g. passport scan, ADEL certificate).
  `TODO(verify)` upload flow, accepted types, and link to the Files module.
- **Athlete self-update:** athlete edits an athlete-editable field (e.g. shoe size, passport)
  on their own card.
- **Correct data** (coach): fix a name or club directly from the card.
- `TODO(verify)` whether there is an add-athlete / invite action on this screen or whether
  athletes are created only via registration/invite (§8 onboarding).
- `TODO(verify)` Activity/change-log behaviour for edits.

## 8. User journeys / flows (per role)
- **Athlete — first-run setup (reference §8 onboarding):**
  accept invite → name pre-filled, add DOB + gender + password → pick avatar → then
  **first steps: (1) fill the Athlete profile / Evidence card; (2) connect devices
  (Settings → Applications & devices); (3) set HR zones.** Filling the card is step one.
- **Athlete — keep the card current:** open own card → pencil an athlete-editable field
  (e.g. new shoe size, renewed passport + validity date) → save.
- **Coach — set up a new athlete's record:** open the athlete's card → fill Personal info →
  fill configured sections (club, classification, sizes, contacts, external IDs) → attach
  documents. `TODO(verify)` entry point for creating the athlete record itself.
- **Coach — correct a detail:** open card → pencil the field (e.g. fix a mis-spelled surname)
  → save; correction propagates to wherever the name is shown.
- **Coach — pull a detail on demand:** open card → read sizes / classification / external ID
  for kit ordering or a federation entry.

## 9. Use cases / scenarios
- **Kit order:** the coach reads every athlete's shirt/short/shoe sizes off their cards to
  place a team order — no separate sizing sheet.
- **Federation entry / external linkage:** the coach copies an athlete's IBU ID from the card
  to enter them in a federation system, or relies on the stored external ID to link databases.
- **Anti-doping readiness:** staff check ADEL-certificate and passport-validity fields before
  travel, catching anything about to expire.
- **Emergency contact at a camp:** at a training camp, a coach opens the card to reach an
  athlete's emergency / parent contact.
- **Athlete self-service:** an athlete who's changed shoe size updates it themselves, so the
  next kit order is right without a coach chasing them.
- **New-account onboarding:** a newly invited athlete fills their card as the first task,
  then connects devices and sets HR zones.

## 10. Configuration & variants
- `[CONFIG]` **Which sections exist** and their order (sports info, equipment, body
  measurements, emergency/parent contacts, personal/administrative documents, external IDs …).
- `[CONFIG]` **Which fields** each section holds, their **labels**, and their **field types**
  (text / date / code list / file).
- `[CONFIG]` **Per-field athlete-editable flag** (e.g. sizes + passport editable; name perhaps
  not).
- `[CONFIG]` **Code-list values** (e.g. sport classification, gender) — instance/sport/para
  specific (`para-…` prefix).
- `[CONFIG]` **Terminology** — module called **Evidence** / **Kartotéka**; field labels are in
  the instance language (the demo's labels may be Czech).
- **Universal (not configurable):** the **Personal info** section is always present with its
  seven fields; the **in-place pencil** edit pattern; coaches can edit any field; athletes see
  only their own card.

## 11. Edge cases, limits, gotchas
- **Athlete-editable is per field, not per section** — within one section some fields may be
  athlete-editable and others read-only. `TODO(verify)` how a read-only field appears to the
  athlete.
- **HR zones are NOT on the card** — they live under **Settings → Personal → Heart Rate Zones**
  (confirmed live 2026-06-15, athlete session), a separate surface. Don't conflate the two
  (see §12).
- **Personal info cannot be removed** even when an instance keeps almost nothing else.
- `TODO(verify)` validation/limits: email format, date ranges (DOB), file size/type, Notes
  length.
- `TODO(verify)` mobile-app differences (full edit vs read-only on iOS/Android).
- `TODO(verify)` empty-state copy when a card or section has no data yet.
- `TODO(verify)` whether deleting/deactivating an athlete is done here (vs Settings) and what
  the **Status** field does in that respect.

## 12. Cross-module integration & data flow
- **Identity everywhere:** name, avatar, and DOB/gender from the card identify the athlete
  across every module (Plan, Reality, Analytics, Medical, etc.). `TODO(verify)` whether the
  avatar is edited on the card or only at registration.
- **External IDs → outside databases:** IBU ID, biochemistry-DB ID link Yarmill records to
  federation/third-party systems.
- **Onboarding chain:** card is **first-run step 1**, paired with **device connection**
  (Integrations) and **HR-zone setup** as steps 2–3.
- **Files:** file-type fields hold documents (passport, ADEL certificate, etc.).
  `TODO(verify)` whether these surface in the Files module.
- **NOT on the card:** HR zones (**Settings → Personal → Heart Rate Zones**, confirmed live
  2026-06-15) and device connections (**Settings → Personal → Applications & devices**) — both on
  the athlete's Settings page, not the card. See §11 and the integrations spec.
- `TODO(verify)` whether body-measurement fields feed any Analytics view.

## 13. Shot list (images for the docs page)
| # | Screen / state | Sample data | Caption (draft) | Callouts | Supports doc section | Role | Render now? |
|---|----------------|-------------|-----------------|----------|----------------------|------|-------------|
| 1 | Athlete card — Personal info filled (light) | National Team · **Simpson Lisa**: First/Last name, email, DOB, Gender, Status, Notes | "Every person has one card. Personal info is always there — each field edited in place with the pencil." | Personal-info fields · the pencil (in-place edit) | The card / Personal info | coach | **shot list only — NO** (capture live first) |
| 2 | Athlete card — a configured section (light) | Simpson Lisa: equipment/sizes (shirt/short/shoe) marked athlete-editable + sports info (club, classification) | "Beyond Personal info, your team's sections — sizes, sports info, contacts, IDs — follow the same edit-in-place pattern." | a section panel · an athlete-editable field · a code-list field | Your team's sections `[CONFIG]` | coach | **shot list only — NO** |
| 3 | In-place pencil editor on one field | editing shoe size | "Click the pencil to edit a field in place." | pencil → edit → save | How editing works | coach/athlete | **shot list only — NO** |
| 4 | Athlete view of own card | Lisa's own card, no athlete switcher; an athlete-editable field active vs a read-only field | "As an athlete you see and edit your own card — the fields your team lets you keep current." | "your own card" · editable vs locked field | What athletes see | athlete | **shot list only — NO** |
| 5 | External IDs section | IBU ID + biochemistry-DB ID fields | "External IDs link the athlete to outside databases." | external ID field | External IDs `[CONFIG]` | coach | **shot list only — NO** (optional) |

## 14. Open questions / TODO(verify)
- ~~**Routes:** exact slug + per-athlete detail route~~ — **RESOLVED 2026-06-15:**
  `/evidence/basicGlobalEvidence?group={id}&athlete={id}&week=…`; group + athlete are query
  params (no separate per-athlete URL). ~~athlete's own-card path~~ — **RESOLVED (athlete
  session 2026-06-15):** the athlete reaches their own card via the **same** OTHER → Athlete
  profiles route, scoped to themselves with **no group panel / switcher**.
- ~~**List view:**~~ — **RESOLVED:** no separate roster screen — the standard **left group
  panel** is the picker. Still `TODO(verify)`: search/sort/add-athlete in larger-group instances.
- **Card layout:** panels vs tabs vs accordion; on-card section order — **not verifiable here**
  (only Personal info configured in this instance).
- **Personal info fields:** **Status** — RESOLVED partially (a status code-list; value "Active"
  observed, read-only to both coach and athlete here); full value set still open. **Gender** value
  set (value "Man" observed). ~~Which Personal-info fields are athlete-editable~~ — **RESOLVED
  (athlete session 2026-06-15):** athlete can edit **First/Last name · DOB · Gender · Notes**;
  **Email + Status read-only** to the athlete (per-field config, this instance). Whether **Email**
  is always read-only and email-change → login effect still open.
- **Edit mechanics:** the in-place editor was **not opened** (avoided editing live data) —
  save/cancel vs auto-save-on-blur; confirmation; whether edits hit an Activity/change log; how
  code-list fields render in the pencil editor.
- **Athlete read-only fields:** rendered hidden vs greyed/locked.
- **Field types on the card:** which of text/date/code-list/file (and calculated/mandatory)
  actually apply to the card vs only tabular modules.
- **File fields:** upload flow, accepted types/size, relationship to the Files module.
- **External IDs:** stored value only vs active link/integration.
- **Avatar:** edited on the card or only at registration.
- **Athlete creation/deletion:** done on this screen or via Settings/onboarding; role of
  **Status**.
- **Mobile:** edit parity vs read-only on iOS/Android.
- **Body measurements:** whether they feed Analytics.

## 15. Source log
**Live-verified 2026-06-15 (clean coach session).** we.yarmill.com · coach "Bart Simpson" ·
group "National Team" (7 athletes) · athlete "Kroczek Tomiš" · classic top-nav UI. Confirmed:
- **Route** is `/evidence/basicGlobalEvidence?group={id}&athlete={id}&week=…` (the earlier
  `/athletes` was wrong), reached via OTHER → Athlete profiles.
- **Picker = the standard left group panel** (group dropdown → Entire Group + athlete list);
  there is no dedicated roster table/search screen in this instance.
- **Card** = header band (avatar + full name + email + role pill "Athlete") then the
  **Personal info** section. Fields: First name (pencil), Last name (pencil), **Email
  (read-only, no pencil)**, DOB (pencil), Gender (pencil, value "Man"), **Status (read-only,
  no pencil; code-list value "Active")**, Notes (pencil). The in-place pencil pattern is
  confirmed; the editor itself was not opened.
- **Only Personal info is configured** in this instance — no additional sections, so
  additional-section UI, external-ID behaviour, and non-text field types are unverified.

**Clean-athlete live verification — 2026-06-15** (we.yarmill.com · athlete *Simpson Lisa* ·
role Athlete · classic top-nav · own/clean session). Confirmed:
- **Own card only** — the athlete loads straight into their **own** card at
  `/evidence/basicGlobalEvidence` (OTHER → Athlete profiles). The coach's **left group panel /
  athlete switcher is absent**; the card is scoped to the logged-in athlete.
- **Athlete-editable field set (Personal info, this instance)** — the athlete CAN edit **First
  name · Last name · Date of birth · Gender · Notes** via the in-place pencil; **Email and Status
  are read-only** to the athlete (no pencil; Status "Active"). Matches the coach-editable set
  here. Athlete-editability is **per-field config**, not a universal default.
- **Athlete Settings = Personal only** (no **Groups** tab — coaches have Personal + Groups). The
  Settings → Personal page also carries the **Applications & devices** (device connections) and
  **Heart Rate Zones** sections — confirming HR zones live under **Settings**, not on the card
  (§12; cross-ref the integrations spec).

Earlier grounding still applies: **master reference** §5.9 (Athlete Profile / Evidence /
Kartotéka), §8 onboarding (fill the card = first step), §6 module map (**Kartotéka** /
"Evidence"), §4 dual-UI nav (Athlete profiles under **OTHER**). **Confidence: high** on route,
picker model, Personal-info field set + read-only Email/Status, the in-place edit pattern, and
config-dependence; **now also confirmed via the athlete session** (own-card-only, athlete-editable
field set, athlete Settings = Personal + devices + HR zones). **Still unverified**
(`TODO(verify)`): in-place editor + save mechanics, additional-section rendering and field types,
whether Email is always locked / changing it affects login, and mobile parity. A second pass on
an **instance that configures additional sections** is needed before rendering those images.
**Render now? NO.**

## 16. Docs page plan
- **Audience line:** `**For:** coaches; athletes (own card) · **Where:** Web app`
- **Proposed page outline** (H2s → which spec sections feed them):
  | Page section (H2) | Fed by |
  |-------------------|--------|
  | intro + audience line + `<Info>` "sections configured per team" | §1, §0, §10 |
  | The card (Personal info, in-place pencil) | §4, §6.2 |
  | Your team's sections `[CONFIG]` (sizes, sports info, contacts, documents, external IDs) | §6.3, §10 |
  | Who can edit what (shared job; athlete-editable fields) | §3 |
  | First steps in a new account (fill card → connect devices) | §8 |
  | (later) Why keep it here / what it links to | §12 |
- **Cross-links** (exact paths to link from this page):
  - `/en/platform/integrations` — "connecting your devices" (first-run step 2).
  - `TODO(verify)` a Settings/HR-zones page for the "HR zones live in Settings, not the card"
    note, if/when one exists.
- **UI label → doc term** (pin wording where the UI label and the doc word differ):
  | UI label | Doc term |
  |----------|----------|
  | Athlete profiles | Athlete profile / the card |
  | Evidence / Kartotéka | (instance terms — note once, don't lead with them) |
  | Personal info | Personal info (keep verbatim) |
  | pencil (icon) | "edit in place" / "the pencil" |
