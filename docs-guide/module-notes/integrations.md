# Module Spec: Devices & integrations — internal

> Internal specification. NOT published (excluded via `.mintignore`). Source for the
> user-facing docs page + image plan. Fill every section; leave `TODO(verify)` where unsure.

## 0. Meta
- **Module:** Devices & integrations (athlete-facing: connect a watch/sensor; the connect screen is **Applications & devices**). Plus the **HR-zone engine** that turns raw watch data into time-in-zone.
- **Route(s):** **`/settings/personal`** (confirmed live, athlete session 2026-06-15). The athlete's **Settings → Personal** page carries both the **Applications & devices** section (the device-connect list) and the **Heart Rate Zones** section — they are sections on one page, not separate tabs.
- **Nav path:** classic top-nav → **SETTINGS → Personal** → **Applications & devices** (and **Heart Rate Zones** on the same page). Apple Health is the exception: iOS app → **avatar → Connected Devices & Apps** (web cannot grant the permission).
- **UI shell:** **classic light top-nav (Settings).** Not GUI 2.0 / totem panel.
- **Coach vs athlete Settings (confirmed 2026-06-15):** the **Applications & devices** and **Heart Rate Zones** sections are **athlete-only** — they live on the **athlete's** Settings → Personal page. A **coach's** Settings has only **Personal** + **Groups** with **no devices/HR-zone section**. Device self-connect and HR-zone setup are athlete-side.
- **Surfaces:** web (PWA) for most providers; **iOS app** required for Apple Health/Apple Watch. `TODO(verify)` whether other providers can also be connected from the iOS/Android apps or web only.
- **Primary roles:** **athlete** (self-connects their own wearables, default). Admin/staff for the custom team/results integrations (set up by Yarmill, not self-serve). Coach reads the resulting data everywhere downstream.
- **Config-dependence:** **medium** — the *wearable self-connect* set is universal; which **team/performance systems** and **results databases** are wired up is `[CONFIG]` per instance (and several require a signed license with the data provider). HR-zone sets are per-athlete configuration.
- **Explored:** 2026-06-15 · group *National Team* (biathlon demo) · athlete *Pe Tomáš* (has Garmin / Apple / Oura / WHOOP data) · by main agent. **Clean-coach live pass 2026-06-15** (we.yarmill.com, coach *Bart Simpson*, group *National Team*, classic top-nav): confirmed the coach **Settings nav has NO Integrations tab** (only **Personal** + **Groups**), and that **device integrations are live** — the Analytics "Trend of training indicators" report surfaces **SPORTTESTER DATA (Apple/Garmin/Polar/Suunto)** and **WHOOP DATA** sections. **Clean-athlete live pass 2026-06-15** (we.yarmill.com, athlete *Simpson Lisa*, role Athlete, classic top-nav, own session): confirmed the athlete-side device-connection UI — **Settings → Personal → "Applications & devices"** (`/settings/personal`), an OAuth-style **"Connect"** list with **8** connectors (Apple Health, Dexcom, Garmin, Oura, Polar, Suunto, AC BALUO, WHOOP), and the **"Heart Rate Zones"** section on the same page. Results-DB admin screens (IBU/FIS) remain admin-side / `TODO(verify)`. The rest is grounded in the master reference (§5.11) + the existing page `en/platform/integrations.mdx` + provided observed facts.
- **Render images now?** **NO** — classic light shell, shot list only (no rendered images this pass).

## 1. Purpose & why it exists
Connect a device once and Yarmill takes it from there. Recorded activities land under the
right day in the **Training Log**, and sleep + recovery data feed the **readiness
analytics** — so the athlete logs once at the source and the numbers flow everywhere without
re-entry. The integration layer also ingests data from team performance systems and pulls
competition results from federation databases, so Yarmill is the single place the whole
picture lives.

The quiet differentiator is the **HR-zone engine**: time-in-zone is computed by Yarmill's
*own* algorithm from the raw watch data, so it's brand-independent and the athlete's history
stays consistent even across a watch change — and it supports per-activity zone sets and
zone validity periods that the watches themselves can't.

## 2. Jobs to be done (per role)
- **Athlete:**
  - When I record a session on my watch, I want it to appear in Yarmill automatically under
    the right day, so I don't re-enter what the watch already captured.
  - When I sleep with my device, I want sleep and recovery to flow in, so my readiness picture
    is complete without extra work.
  - When I switch watch brands, I want my time-in-zone history to stay consistent, so trends
    don't break.
  - When I get a new lactate/spiro test, I want the new zones to apply going forward without
    rewriting old activities, so my history stays honest.
- **Coach / medical staff:**
  - When I read load, recovery, and readiness, I want them backed by the athletes' device data,
    so I'm planning against reality, not guesses.
- **Admin / Yarmill setup:**
  - When a team uses InBody/Catapult/VALD or a federation results DB, I want those wired in,
    so that data appears in Yarmill alongside everything else. `[CONFIG]`

## 3. Personas & permissions
- **Athlete (self-connect, default):** opens **Settings → Personal → Applications & devices**
  (`/settings/personal`, confirmed live 2026-06-15), connects their **own** wearables via a
  **Connect** button per connector, and confirms in the provider's account. Connects/disconnects
  only their own devices. The same Personal page also holds the athlete's **Heart Rate Zones**
  table. `TODO(verify)` whether a coach/admin can see or trigger an athlete's device connections
  on their behalf.
- **Coach / medical staff:** do not connect athlete wearables; they *consume* the imported
  data (Training Log activities, recovery/readiness analytics). **Confirmed 2026-06-15
  (clean coach):** the coach's own **Settings nav has no Integrations tab** — only **Personal**
  (`/settings/personal`) and **Groups** (`/settings/groups/{id}`). A coach therefore does **not**
  manage integrations from their own Settings; integration setup is athlete-side (device
  connect) and/or admin/Yarmill-configured (results DBs). **Confirmed 2026-06-15 (clean
  athlete):** the **Applications & devices** and **Heart Rate Zones** sections appear on the
  **athlete's** Settings → Personal page but **not** in a coach's Settings — coaches have **no
  device-management view** of their own; they only consume the imported data downstream.
- **Admin / Yarmill onboarding:** set up the **team/performance systems** and **results
  databases** — these are not athlete self-serve. Results-DB connections require a signed
  license/permission agreement with the data provider. **Role/permission model confirmed
  2026-06-15** via **Settings → Groups**: each group has a **Members** table with columns
  **Name · Role · Permissions · Member since · Member until**, a **+** add-member control, a
  per-row ⋯ menu, and group edit/delete. Roles seen: **Athlete**, **Coach** (with "write"
  permission), **Admin** (with "write" permission); permissions like "write" are assigned
  per member. Multiple groups exist (National Team + others). This confirms the role set
  (Athlete/Coach/Admin) that scopes who can configure/consume integrations, but the
  results-DB admin config itself is **not visible to a coach** → `TODO(verify)`.

## 4. Key concepts & vocabulary
- **Applications & devices** — the Settings screen where an athlete connects providers (also
  referred to as **Integrations**; same place). The user-facing doc term is **Devices &
  integrations**.
- **Provider** — a connectable source: a **wearable** (watch/ring/sensor), a **team/performance
  system**, or a **results database**.
- **Connect / Confirm** — the two-step handshake: choose the provider → **Connect** in Yarmill
  → **confirm in the provider's own account** (OAuth-style grant). `TODO(verify)` exact button
  labels and whether it opens a popup vs redirect.
- **Sync** — the recurring background import. "From the next sync" new activities (and sleep,
  if worn at night) appear automatically. `TODO(verify)` sync cadence / interval.
- **Historical pull (backfill)** — bringing in *past* data on connect. For **Garmin** the
  default backfill is **≈ 1 year**; more is available **on request via email**. `TODO(verify)`
  the support email/process and whether other providers backfill.
- **Imported record** — a watch activity (and sleep/recovery) that appears under the day in the
  Training Log. **Read-only inside Yarmill** — can't be edited or deleted here; manage in the
  provider's app. It **complements, not replaces** the diary (athletes still write the left
  side and fill the right side; analytics use both).
- **HR zones** — heart-rate intensity bands set **in Yarmill** (Settings → Personal → **Heart
  Rate Zones**; confirmed 2026-06-15), used to compute **time-in-zone**.
- **Time-in-zone** — minutes spent in each HR zone, computed by **Yarmill's own algorithm**
  from the raw device data; brand-independent; handles auto-pause/stop and excludes
  post-activity HR from averages.
- **Zone set** — a named set of zone boundaries. Yarmill supports **different zone sets per
  activity** (e.g. running vs cycling vs roller-ski vs ski).
- **Validity period** — the date range a zone set applies to. A new set (e.g. after a
  lactate/spiroergometry test) applies **from its start date**; older activities **keep the
  zones that were valid then** — no retroactive rewrite.

## 5. Information architecture
- **Shell:** classic light top-nav. **SETTINGS** → **Personal** → **Applications & devices**.
- **Athlete Settings nav (confirmed 2026-06-15, clean athlete):** the athlete's Settings is a
  single **Personal** page (`/settings/personal`) — **no Groups tab** (coaches have Personal +
  Groups). The **Applications & devices** connector list and the **Heart Rate Zones** table are
  both **sections on this one Personal page**.
- **Coach Settings nav (confirmed 2026-06-15, clean coach):** for a **coach**, Settings shows
  only **Personal** + **Groups** — **no Integrations tab and no devices/HR-zone section**. The
  Applications & devices and Heart Rate Zones sections are **athlete-only**.
- **Two configuration homes (both on the athlete's Settings → Personal page):**
  1. **Applications & devices** — connect/manage providers (per-connector **Connect** button).
  2. **Heart Rate Zones** — where **HR zones** (per-discipline zone sets + validity periods) are
     defined, as a table on the same page.
- **Apple Health exception:** not on the web Settings screen — connect from the **iOS app**
  via **avatar → Connected Devices & Apps**.
- **Where the data surfaces (downstream, not in Settings):**
  - **Reality → Training Log** — activities appear under the day, below the entry.
  - **Analytics** — time-in-zone (Training data analysis), Recovery Indicators, Team Daily
    Readiness.
- **Related modules:** Training Log (Reality), Analytics, Athlete Profile.

## 6. Screen & UI inventory
> The connect screen was not re-opened live for this draft; per-field UI is flagged
> `TODO(verify)`. Mechanics (workflow, what flows, read-only) are grounded in the reference
> and observed facts.

### 6.1 Applications & devices (Settings → Personal) — connector list
- **Where (confirmed live 2026-06-15, athlete *Simpson Lisa*):** **Settings → Personal**, a
  section titled **"Applications & devices"** (route `/settings/personal`).
- **Layout:** a list of connectors, each with a short description and a per-connector
  connect/disconnect button (OAuth-style: each reads "Connect your *X* account and data … will be
  automatically uploaded to Yarmill after each training/automatically"). **Connected-state
  affordance CONFIRMED 2026-06-15 (athlete *Pé Tomáš*, has device data):** a connector that is
  **already connected shows a "Disconnect" button**; an **unconnected** one shows **"Connect"**.
  So athletes **self-manage** each integration's connect/disconnect state in-app. On Pé Tomáš:
  **Apple Health, Dexcom, Garmin, Oura, Suunto = connected (Disconnect shown)**; **Polar,
  AC BALUO, WHOOP = not connected (Connect shown)**. (On the earlier clean athlete *Simpson Lisa*
  every connector was unconnected, all showing **Connect**.)
- **Connectors shown (athlete self-connect — 8, confirmed live 2026-06-15):**
  - **Apple Health** — "Connect your Apple Health and training data from your Apple Watch will be
    automatically uploaded…" Pairing is **done via the iOS app**: *Yarmill iOS app → tap your
    avatar → Connected Devices & Apps* (the web row points the athlete to the app; web cannot
    grant the HealthKit permission). See §6.2.
  - **Dexcom** — continuous glucose data.
  - **Garmin** — Garmin sports-watch training data.
  - **Oura** — Oura ring data.
  - **Polar** — Polar sports-watch training data.
  - **Suunto** — Suunto sports-watch training data.
  - **AC BALUO** — testing-lab results; "you will see the testing results here in the Analytics
    module." (Team/performance system, `[CONFIG]` CZ — but **present in this athlete's connector
    list**.)
  - **WHOOP** — WHOOP band data.
  These are the self-service device connectors. **Team/performance** systems beyond AC BALUO and
  the **results databases** (IBU/FIS) did **not** appear in the athlete connector list →
  admin/back-office, see §14.
- **Controls per provider:** **Connect** when unconnected (→ provider OAuth confirm; Apple Health
  routes to the iOS app) / **Disconnect** when already connected (confirmed 2026-06-15, Pé Tomáš) —
  athletes self-manage the connect/disconnect state per connector. `TODO(verify)` what Disconnect
  does to already-imported data, and per-provider options (e.g. Polar's **"use Polar HR zones"**
  toggle — reference says Polar exposes zones via API; not seen on the connect row this pass;
  confirm where this option lives).
- **Fields:** none editable on Yarmill's side beyond connect/disconnect (the grant happens in
  the provider account). `who-can-edit:` athlete, own devices. `auto-save:` connection state
  persists on confirm. `TODO(verify)`.
- **States:**
  - **empty / not connected:** connector shows **Connect** (confirmed: Pé Tomáš's Polar, AC BALUO,
    WHOOP).
  - **connecting:** redirect/popup to the provider to confirm. `TODO(verify)`.
  - **connected:** connector shows a **Disconnect** button; data flows from the next sync
    (confirmed 2026-06-15: Pé Tomáš's Apple Health, Dexcom, Garmin, Oura, Suunto).
  - **error:** grant declined / revoked in the provider app → not connected, no sync.
    `TODO(verify)` how an error or revoked grant surfaces in Yarmill.

### 6.2 Apple Health (iOS app) — Connected Devices & Apps
- **Where:** iOS app → tap **avatar** → **Connected Devices & Apps**.
- **Why here:** the web app **cannot grant** the Apple Health permission; it must be granted
  on the iPhone.
- **States / controls:** connect Apple Health / Apple Watch; grant HealthKit permissions on
  device. `TODO(verify)` exact iOS screen labels and which data categories are requested.

### 6.3 Heart Rate Zones (Settings → Personal)
- **Where (confirmed live 2026-06-15, athlete *Simpson Lisa*):** a **"Heart Rate Zones"** section
  on the **same Settings → Personal page** as Applications & devices (`/settings/personal`) — not
  on the athlete card.
- **Layout (confirmed):** a **table** with columns **Discipline · Valid from · Valid to · Zones
  (Z0–Z5)**, a **+** control to add a zone set, and per-row **edit / copy / delete** icons. A
  default row reads **"All / - / -"** (discipline "All", no validity dates) — i.e. zones can be
  scoped **per discipline** with **validity-date ranges**.
- **What it holds:** one or more **zone sets** (table rows), each optionally scoped to a
  **discipline** and a **validity period** (Valid from / Valid to). Default applies to **All**
  disciplines with no dates.
- **Zones:** **Z0–Z5** (six bands, confirmed by the column set).
- **Fields (per row):** discipline · valid-from date · valid-to date · the Z0–Z5 boundaries.
  `field types / defaults / validation:` `TODO(verify)` — whether boundaries are bpm or %HRmax,
  defaults, validation; exact editor opened via the row edit icon.
- **Polar option:** "**use Polar HR zones**" — pull zones from Polar (the one brand that
  exposes them via API) instead of Yarmill-defined ones. `TODO(verify)` where this toggle lives
  and its exact label.
- **States:** no zones yet (athlete onboarding step) · zones defined · a new set added with a
  later validity start (old activities unaffected).
- **Auto-save / Activity log:** `TODO(verify)` whether zone edits auto-save and whether
  changes are logged anywhere.

## 7. Actions & interactions
- **Connect a wearable:** Settings → Applications & devices → choose provider → **Connect** →
  **confirm in the provider's account**. From the **next sync**, activities (and sleep, if worn
  at night) appear automatically under the day in the Training Log.
- **Connect Apple Health:** iOS app → avatar → **Connected Devices & Apps** → grant HealthKit
  permission on the iPhone.
- **Garmin specifics:** enable **both activity *and* sleep** in **Garmin Connect** so both
  flow. Request **historical pull** via email (default backfill ≈ 1 year, more on request).
- **Disconnect / revoke:** manage/revoke in the provider's own app; `TODO(verify)` whether
  there's also an in-Yarmill disconnect and what it does to already-imported data.
- **View imported data:** open the day in the Training Log — activities (and sleep/recovery)
  appear below the entry. **Cannot edit/delete imported records in Yarmill** — manage in the
  provider app.
- **Define / change HR zones:** Settings → athlete profile → add or edit a **zone set** (per
  activity) with a **validity start date**. New sets apply forward; history is preserved.
- **Activity log:** `TODO(verify)` whether connect/disconnect and zone changes are written to
  any Activity/audit log.

## 8. User journeys / flows (per role)
**Athlete — connect a Garmin (happy path):** Settings → **Applications & devices** → **Garmin**
→ **Connect** → confirm in Garmin's account → (in Garmin Connect) ensure **both activity and
sleep** are enabled → done. From the next sync, Pe Tomáš's runs appear under the right day in
the Training Log, and overnight sleep/recovery feed his readiness analytics. For older data, he
emails support to request a historical pull (≈1 year by default).

**Athlete — connect Apple Health (iOS):** open the **iOS app** → tap **avatar** → **Connected
Devices & Apps** → connect **Apple Health** → grant HealthKit permission on the iPhone. Apple
Watch activities then flow in.

**Athlete — connect an Oura ring:** Settings → Applications & devices → **Oura** → **Connect** →
confirm in Oura → sleep, readiness, resting HR, HRV flow into Recovery Indicators. (Pe Tomáš has
Garmin + Apple + Oura connected — overlapping sources.) `TODO(verify)` how Yarmill resolves
overlapping data when an athlete has several devices feeding the same metric.

**Athlete — set HR zones after a lactate test:** Settings → athlete profile → add a **new zone
set** for the activity with a **validity start = test date**. New activities use the new
thresholds; everything before the test keeps the zones valid then — no retroactive rewrite.

**Athlete — switch watch brand:** connect the new brand, (optionally) disconnect the old one;
**time-in-zone history stays consistent** because Yarmill computed it from raw data with its own
algorithm, not the watch's zones.

**Admin — wire a results database (setup, not self-serve):** Yarmill connects the federation DB
(e.g. SIWIDATA / FIS) after a signed license with the data provider; results then appear in the
Results module. `[CONFIG]`

## 9. Use cases / scenarios
- **Log once at the source:** an endurance athlete records every session on a Garmin; sessions
  appear in Yarmill under the day automatically, so the diary's right side is corroborated
  without re-entry.
- **Complete readiness picture:** an athlete who sleeps with an Oura/WHOOP/Garmin gets sleep,
  resting HR, HRV, and a recovery/readiness score feeding the Recovery Indicators and Team
  Daily Readiness — the coach's morning check is data-backed.
- **Continuous glucose:** an athlete on **Dexcom** streams glucose into Yarmill. `TODO(verify)`
  exactly where glucose surfaces in the UI.
- **Brand switch without losing history:** an athlete moves from Polar to Garmin; their
  time-in-zone trend is unbroken because Yarmill owns the zone computation.
- **Post-test zone update:** after spiroergometry, new zones apply from the test date forward
  while old activities keep their original zones — trends stay comparable, not silently
  rewritten.
- **Per-discipline zones:** a biathlete keeps separate zone sets for running vs roller-ski vs
  ski, so time-in-zone is meaningful per activity rather than one-size-fits-all.
- **Team performance systems (configured):** a team using InBody/Catapult/VALD has that data
  ingested into Yarmill alongside the diary. `[CONFIG]`

## 10. Configuration & variants
- **Universal (CORE):** the **wearable self-connect** set (Garmin, Polar, Suunto, Apple Health,
  WHOOP, Oura, Dexcom); the **connect workflow**; **imported records are read-only** in Yarmill;
  the **HR-zone engine** (own algorithm, per-activity sets, validity periods).
- `[CONFIG]` **Team / performance systems** (InBody, Catapult, VALD family, AC BALUO [CZ only],
  CASRI [CZ only]) — set up per instance by Yarmill, not athlete self-serve.
- `[CONFIG]` **Results / competition databases** (SIWIDATA [biathlon], FIS, Resultina, CZ
  Tennis, Roger, Swimming IS, Slalom World) — per instance; require a signed license/permission
  with the data provider.
- `[CONFIG]` Which providers appear / are enabled for a given instance. `TODO(verify)` whether
  the wearable list is ever trimmed per instance or always the full set.
- Per-athlete configuration: **HR zone sets and validity periods**.

## 11. Edge cases, limits, gotchas
- **Apple Health is iOS-only** to connect — the web cannot grant the permission.
- **Garmin needs both toggles:** if only activity (or only sleep) is enabled in Garmin Connect,
  the other won't flow.
- **Imported records can't be edited/deleted in Yarmill** — manage in the provider app. Deleting
  in the provider app is the way to remove an imported record. `TODO(verify)` whether a
  provider-side delete propagates back to Yarmill.
- **Historical data isn't automatic** — backfill (esp. Garmin) is a request, default ≈1 year.
- **Sleep only flows if the device is worn at night** and the provider tracks sleep.
- **Recovery analytics need a sleep-tracking device** — Recovery Indicators are unavailable
  without one.
- **Zones are not pulled from most watches** — only Polar exposes zones via API; for all other
  brands the zones must be set in Yarmill (or time-in-zone uses Yarmill's defaults).
  `TODO(verify)` behaviour when no zones are set.
- **No retroactive zone rewrite:** changing zones today does not alter past time-in-zone (that's
  the validity-period design, by intent — call it out, not a bug).
- **Overlapping sources:** an athlete with several devices feeding the same metric — `TODO(verify)`
  precedence/dedup rules.

## 12. Cross-module integration & data flow
- **→ Reality / Training Log:** imported **activities** (and sleep/recovery) appear under the
  day, below the entry; complement the manually filled left/right sides.
- **→ Analytics / Training data analysis:** **time-in-zone** and sport-watch activity time feed
  the intensity-zone breakdowns.
- **→ Analytics / Trend of training indicators (`/reporting/trainingAnalyzeTrend`) — confirmed
  2026-06-15:** this report carries dedicated device-data sections proving the integrations are
  live: **"SPORTTESTER DATA — Data from Apple, Garmin, Polar, Suunto devices"** and **"WHOOP
  DATA"** (Time by activities; Time by HR zones, zones 0–5). So Apple/Garmin/Polar/Suunto and
  WHOOP device data flows into the Analytics trend reports in this instance.
- **→ Analytics / Training Load:** **TRIMP** = intensity × time-in-zone (one of the configurable
  load metrics), so the HR-zone engine directly underpins load/ACWR when TRIMP is the chosen
  metric.
- **→ Analytics / Recovery Indicators:** sleep duration, resting HR, HRV, skin-temperature
  deviation, **Oura readiness / Garmin body battery** — all device-fed.
- **→ Analytics / Team Daily Readiness:** **WHOOP Recovery** and **Garmin Battery** columns are
  populated from connected devices (verified columns 06/2026).
- **→ Results:** **results databases** (SIWIDATA/FIS/etc.) pull competition results into the
  Results module. `[CONFIG]`
- **← Athlete Profile:** HR **zone sets** are defined here and consumed by the zone engine.
- **Ingest API:** Yarmill exposes an API to accept third-party data (not yet documented in
  detail). `TODO(verify)` whether this is athlete/coach-facing at all (likely back-office).

## 13. Shot list (images for the docs page)
> UI shell is classic light top-nav → **render now? NO** this pass. Captions/callouts drafted
> so images can be added later.

| # | Screen / state | Sample data | Caption (draft) | Callouts | Supports doc section | Role | Render now? |
|---|----------------|-------------|-----------------|----------|----------------------|------|-------------|
| 1 | Applications & devices — provider list (connected + not) | Pe Tomáš: Garmin & Oura connected, Apple Health connected (badge), others showing **Connect** | "Connect a device once from Settings → Applications & devices — pick your provider and confirm in its account." | Connect button · connected state · provider tiles | Connect a device | athlete | classic shell — **no** (shot-list only) |
| 2 | Connect handshake (provider OAuth confirm) | Garmin confirm screen | "You confirm the connection in the provider's own account." | "confirm in the provider's account" | Connect a device | athlete | no (provider-side screen) |
| 3 | Apple Health on iOS — Connected Devices & Apps | iOS app, avatar menu → Connected Devices & Apps | "Apple Health connects from the iPhone, not the web." | avatar → Connected Devices & Apps | Apple Health is different | athlete | no |
| 4 | Training Log — imported activity under the day | Pe Tomáš: a Garmin run below the day's entry, + sleep/recovery | "Once connected, recorded activities appear under the right day automatically." | imported activity row · sleep/recovery | What imported data does | athlete | no |
| 5 | HR zones editor (Settings → athlete profile) | Two zone sets (run vs roller-ski) + a validity-dated set after a lactate test | "Set your zones in Yarmill — per activity, with validity periods, so history stays consistent." | per-activity set · validity start date | HR zones live in Yarmill | athlete | no |

## 14. Open questions / TODO(verify)
- ~~**Athlete-side device-connection UI**~~ — **RESOLVED 2026-06-15 (clean athlete *Simpson
  Lisa*):** it lives in **Settings → Personal → "Applications & devices"** (`/settings/personal`),
  an OAuth-style **Connect** list with **8 connectors** (Apple Health, Dexcom, Garmin, Oura,
  Polar, Suunto, AC BALUO, WHOOP). Apple Health pairs via the **iOS app**. See §6.1.
- ~~**Connected / disconnect affordance**~~ — **RESOLVED 2026-06-15 (athlete *Pé Tomáš*, has
  device data):** a **connected** connector shows a **"Disconnect"** button; an **unconnected**
  one shows **"Connect"** — athletes self-manage each integration's state. On Pé Tomáš: Apple
  Health, Dexcom, Garmin, Oura, Suunto = connected (Disconnect); Polar, AC BALUO, WHOOP = not
  connected (Connect). See §6.1. Still open: what Disconnect does to already-imported data, and
  per-provider options.
- **Results-database admin screens** (IBU SIWIDATA, FIS, etc.) — admin/Yarmill-configured,
  **not in the athlete connector list** (confirmed 2026-06-15); OAuth/connect, license gating
  still `TODO(verify)`.
- **Read-only nature of imported data inside Yarmill** — reference-asserted, not re-tested.
- ~~Exact **routes/slugs** for Applications & devices and the HR-zone editor~~ — **RESOLVED:**
  both are sections on **`/settings/personal`** (Applications & devices; Heart Rate Zones).
- **Connect screen UI:** the list-with-Connect layout **and the connected/disconnect affordance**
  are confirmed (§6.1 — connected shows **Disconnect**, unconnected shows **Connect**, per Pé
  Tomáš 2026-06-15); still open — what an in-Yarmill **Disconnect** does to imported data;
  error/revoked states.
- ~~Whether **team/performance** and **results-DB** integrations appear on the same screen~~ —
  **PARTIALLY RESOLVED:** **AC BALUO** (team/performance) **does** appear in the athlete connector
  list; the **results DBs** (IBU/FIS) do **not** → admin/back-office.
- **Sync cadence** (how often the background import runs) and "next sync" timing.
- **Historical pull** process — the support email/contact and per-provider backfill behaviour.
- **HR-zone editor specifics:** zones are **Z0–Z5** and scoped **per discipline** with
  **validity dates** (Discipline · Valid from · Valid to columns, confirmed §6.3); still open —
  bpm vs %HRmax, defaults/validation, the row-edit editor, auto-save, where the **Polar "use
  Polar HR zones"** option lives, behaviour when no zones are set.
- **Dexcom glucose** — where it surfaces in the UI.
- **Overlapping devices** — precedence/dedup when multiple sources feed one metric.
- Whether connect/disconnect/zone changes are written to any **Activity/audit log**.
- Whether **non-Apple** providers can also be connected from the iOS/Android apps (or web only).
- **Ingest API** scope/audience.

## 15. Source log
Grounded primarily in the **master reference** §5.11 (Integrations + HR-zone engine), with
supporting facts from §0/§5.7 (watch records appear below the Training Log entry, don't replace
the diary), §5.9/§7 (HR zones set in Settings → athlete profile; first-steps for athletes), and
§5.13 (Recovery Indicators, Team Daily Readiness columns — WHOOP/Garmin verified 06/2026). The
existing page `en/platform/integrations.mdx` and the provided **observed facts** (connect flow,
self-connect provider list, Apple-from-iPhone, Garmin both toggles, read-only imports, HR-zone
two-capabilities) are folded in **without TODO** as instructed. **Not re-opened live** for this
draft — therefore all **screen-level UI** (layout, labels, states, the zone editor's fields) is
flagged `TODO(verify)`. **Confidence: high** on mechanics and data flow (reference + observed
facts); **low** on per-screen UI specifics until the Settings screens are explored live with
*Pe Tomáš*.

**Clean-coach live verification — 2026-06-15** (we.yarmill.com · coach *Bart Simpson* · group
*National Team* · classic top-nav · fresh session). Confirmed:
1. **Coach Settings nav = Personal + Groups only — NO Integrations tab** (`/settings/personal`,
   `/settings/groups/{id}`). A coach does not manage integrations from their own Settings;
   integration setup is athlete-side and/or admin/Yarmill-configured.
2. **Device integrations are live** — the Analytics **"Trend of training indicators"** report
   (`/reporting/trainingAnalyzeTrend`) surfaces **"SPORTTESTER DATA — Data from Apple, Garmin,
   Polar, Suunto devices"** and **"WHOOP DATA"** (Time by activities; Time by HR zones 0–5).
   So Apple/Garmin/Polar/Suunto + WHOOP are confirmed in this instance, flowing into Analytics.
3. **Groups membership/role/permission model** — Settings → Groups: per-group **Members** table
   (**Name · Role · Permissions · Member since · Member until**), **+** add-member, per-row ⋯
   menu, group edit/delete; roles **Athlete / Coach (write) / Admin (write)**; permissions
   assigned per member; multiple groups exist.

**Clean-athlete live verification — 2026-06-15** (we.yarmill.com · athlete *Simpson Lisa* ·
role Athlete · classic top-nav · own/clean session). Confirmed:
1. **Athlete device-connection UI = Settings → Personal → "Applications & devices"**
   (`/settings/personal`) — an OAuth-style list, each connector with a description and a
   **"Connect"** button. **8 connectors:** **Apple Health · Dexcom · Garmin · Oura · Polar ·
   Suunto · AC BALUO · WHOOP**. Apple Health pairs via the **iOS app** (avatar → Connected
   Devices & Apps); AC BALUO surfaces results in the Analytics module.
2. **Heart Rate Zones** are configured on the **same** Settings → Personal page — a table
   (**Discipline · Valid from · Valid to · Zones Z0–Z5**) with a **+** to add a set and per-row
   edit/copy/delete; default row "All / - / -". Confirms HR zones live under **Settings**
   (per-discipline, with validity dates), not on the athlete card.
3. **These sections are athlete-only** — a coach's Settings (Personal + Groups) has no
   devices/HR-zone section. Athlete Settings = **Personal only** (no Groups tab).
This **resolves the big athlete device-connection TODO** (§14). The **results databases**
(IBU/FIS) are **not** in the athlete connector list and remain admin/back-office (reference/
`TODO(verify)`).

**Data-rich athlete live verification — 2026-06-15** (we.yarmill.com · athlete *Pé Tomáš* ·
role Athlete · classic top-nav · own/clean session · has connected devices + workout/sleep data).
Confirmed in **Settings → Personal → "Applications & devices"** (`/settings/personal`): the
**connect/disconnect state is athlete-self-managed per connector** — a **connected** connector
shows a **"Disconnect"** button, an **unconnected** one shows **"Connect"**. On Pé Tomáš:
**connected (Disconnect shown)** = **Apple Health · Dexcom · Garmin · Oura · Suunto**; **not
connected (Connect shown)** = **Polar · AC BALUO · WHOOP**. This resolves the connected/disconnect
affordance TODO (§14). Still open: what **Disconnect** does to already-imported data — high
confidence on the state affordance itself.

The reference-grounded **catalog of integrations** (device brands + federation results DBs in
§10/§12) is kept intact as the broader picture; the **live-confirmed device brands**
(Apple/Garmin/Polar/Suunto/WHOOP, plus Dexcom/Oura/AC BALUO now seen in the connector list) are
marked as such. Still **unverified:** per-provider
options, the **results-DB admin screens**, sync cadence, what **Disconnect** does to imported
data, and the **read-only** nature of imports (reference-asserted) — see §14. (The
**connected/disconnect** affordance is now confirmed — Pé Tomáš.)
**Render images now? NO** (classic light shell; shot list only).

## 16. Docs page plan
- **Audience line:** `**For:** athletes · **Where:** Web app; Apple Health from the iOS app`
- **Proposed page outline** (H2s → which spec sections feed them):
  | Page section (H2) | Fed by |
  |-------------------|--------|
  | intro + audience line | §1, §0 |
  | Connect a device (`<Steps>`) | §6.1, §7, §8 |
  | Which devices you can connect (provider list + `<Info>` Apple/Garmin) | §6.1, §6.2, §10 |
  | What imported data does — and doesn't | §4 (imported record), §11, §12 |
  | HR zones live in Yarmill (per-activity sets + validity periods) | §4 (zones), §6.3, §1 |
  | (optional) Team & results integrations — `<Info>` configured per team `[CONFIG]` | §10, §12 |
- **Cross-links** (exact paths to link from this page):
  - `/en/reality/training-log` (imported activities appear under the day)
  - `/en/analytics/analytics` (time-in-zone, Recovery Indicators, Team Daily Readiness)
  - `/en/platform/athlete-profile` (where HR zones are set)
  - `/en/results/results` (results databases) — only if the team/results section is kept
- **UI label → doc term:**
  | UI label | Doc term |
  |----------|----------|
  | Applications & devices / Integrations | Devices & integrations |
  | Connect | connect (a device) |
  | Connected Devices & Apps (iOS) | (keep verbatim — iOS label) |
  | Injury Status (n/a) | — |
  | "use Polar HR zones" | (keep verbatim — Polar-only option) |
