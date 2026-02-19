# General guidelines

{% set service_name_map = {
  "oauth-acbaluo": "AC Baluo",
  "apple-health": "Apple Health",
  "dexcom": "Dexcom",
  "garmin": "Garmin",
  "oura": "Oura",
  "polar": "Polar",
  "polar-team": "Polar Team Pro",
  "suunto": "Suunto",
  "whoop": "WHOOP"
} %}
{% set external_services_list = external_services | default([], true) %}
{% set activity_service_labels = [] %}
{% set non_garmin_labels = [] %}
{% set watches_module_labels = [] %}
{% for code in external_services_list %}
{% set label = service_name_map[code] %}
{% if code in ["garmin", "apple-health", "polar", "suunto", "polar-team", "whoop"] %}
{% set _ = activity_service_labels.append(label) %}
{% endif %}
{% if code != "garmin" %}{% set _ = non_garmin_labels.append(label) %}{% endif %}
{% if label not in watches_module_labels %}{% set _ = watches_module_labels.append(label) %}{% endif %}
{% endfor %}

## 1) Integrations & device syncing

### Shared principles
- Connecting devices is done in the web app: **Settings → (scroll down) Applications & devices / Integrations → Connect**.
- Imported data appears in **Reality** on the relevant day (depending on the integration).
- **Important:** data from watches **does not replace** filling in the **left (text) side** or **right (data) side** of the diary.
- It is not possible to edit or delete imported activities in Yarmill. You need to delete them in the provider’s app ({% if activity_service_labels %}{{ activity_service_labels | join(", ") }}.{% else %}Garmin Connect, Polar Flow, WHOOP, etc.{% endif %}).

### For Athletes
#### How to connect a device
1. Open the Yarmill web app.
2. In the top bar, click **Settings**.
3. Scroll down to **Applications & devices** and choose the device/provider.
4. Click **Connect** and confirm the connection in the provider’s account.

#### I can’t see my activity/data — what now?
- Check:
  - the connection is still active in **Settings**,
  - your phone/device has synced in the provider’s app ({% if activity_service_labels %}{{ watches_module_labels | join(" / ") }}…{% else %}Garmin Connect / Polar Flow / WHOOP…{% endif %}),
  - you’re looking at the correct day in **Reality**.

{% if "garmin" in external_services_list %}
#### Garmin — key notes
- We can also integrate Garmin data **retroactively** from before you connected, but typically you need to:
  - enable **Historical data** in the connection,
  - and write to us at **hello@yarmill.com** to request the historical pull.
- We integrate training/race data as well as **Garmin Health**. If you sleep with your watch, you’ll see sleep data too — you need to allow the connection for both data types.
- You can disconnect later in Garmin Connect if needed.
{% endif %}

{% if non_garmin_labels %}
#### {{ non_garmin_labels | join(" / ") }}
- For these providers, the workflow is the same: **Settings → Connect → confirm with the provider**.
- If data stopped syncing: verify the connection in **Settings** and sync in the provider’s app first.
{% endif %}

### For Coaches
- Coaches typically **see imported athlete data** in **Reality** (depending on permissions and instance setup).
- If an athlete reports missing data: check connection status, provider sync, and that you’re looking at the correct day in **Reality**.
{% if "garmin" in external_services_list %}
- Garmin historical data often requires support (hello@yarmill.com).
{% endif %}

### For Administrators
- Admins mainly handle:
  - which integrations are enabled/available in the instance,
  - who has access to them,
  - escalation to **hello@yarmill.com** for issues and historical imports.

---

## 2) Access, login & team URL

### Shared principles
- To log in, you must be part of a **team instance** that uses Yarmill.
- The athlete mobile app often requires the **team URL** (instance identifier): **{{ team_url }}**.
{% if available_languages %}
- Available languages in this instance: {{ available_languages | join(", ") }}. Can be changed after clicking on the avatar (top right) or in the mobile app settings.
{% endif %}

### For Athletes
#### First-time access
- If you received an email invitation, click **Join**, complete registration (date of birth, password), choose an avatar, and you’re in.

#### Forgot password
- On the login screen, click **Forgot password** and enter your email — you’ll receive a reset link.

#### I don’t remember my email / team URL
- If you don’t remember your email, ask your **coach or administrator** — they can find it and tell you.
- If you forgot your team URL, you’ll find it in the confirmation email (typically your federation/club abbreviation).
- If you’re really stuck, write to **hello@yarmill.com**.

#### Mobile app (athletes only)
- The mobile app is **for athletes only**.
- After logging in, you see your full plan and can log training for **the day you have the app open**.
- **Backfilling a workout retroactively is not possible yet.**

### For Coaches
- If an athlete can’t find their email or team URL: help them locate it (depending on permissions) or escalate to the admin.

### For Administrators
- Admins:
  - send invitations,
  - manage users and login emails,
  - resolve access problems (and can escalate to support).

---

## 3) Plan ↔ Reality (copying, importing, publishing)

### Shared principles
- **Plan** is prepared by a coach/admin.
- **Reality** is what actually happened (left + right sides).
- “Copying” can mean:
  - athlete: **Import plan** (Plan → Reality for that day)
  - coach/admin: **Copy plan** (publish / deliver plan to athletes)
{% if copy_plan_to_reality %}
- You can use **Import plan** when you completed the plan exactly.{% if copy_plan_days_valid %} It can be done up to {{ copy_plan_days_valid }} days from the planned day.{% endif %}
{% endif %}

### For Athletes
#### If you completed training exactly as planned
- In **Reality**, use **Import plan** (usually hidden under the **three dots** on the left side).
- Then add notes/attachments if needed and fill in any remaining values on the **right (data) side**.

### For Coaches
#### Delivering changes to athletes
- **Note:** athletes won’t see plan edits until you **Copy plan** to them.
- Workflow: **Plan → (top right) Copy plan → choose athletes/groups/seasons → Copy plan**.

#### Planning modes (high level)
- **Weekly editing** (day-by-day): edit text + data in one view for quick adjustments.
- **Mesocycle / weekly / daily themes**: work with training themes across periods.
- **Top-down**: season planning; what you plan is reflected in the left (text) side after copying.
- **Annual plan**: plan the right (data) side for the whole season.

### For Administrators
- Admins support planning workflows across the instance and handle permissions and module setup (including Attendance if used).

---

## 4) Training logging & tables (what goes where)

### Shared principles
- **Left (text) side** = structured description (methodology, notes, tags, internal codes).
- **Right (data) side** = numerical values (minutes, km, load, zones, etc.).
- Exact methodology depends on the team/federation setup.
{% if backfill_scope_list and backfill_days is not none %}
{% set labels = [] %}
{% for role in backfill_scope_list %}
{% if role == "athlete" %}{% set _ = labels.append("athletes") %}{% endif %}
{% if role == "coach" %}{% set _ = labels.append("coaches") %}{% endif %}
{% if role == "admin" %}{% set _ = labels.append("admins") %}{% endif %}
{% endfor %}
- Backfilling the training diary is allowed for {% if labels|length == 1 %}{{ labels[0] }}{% elif labels|length == 2 %}{{ labels[0] }} and {{ labels[1] }}{% else %}{{ labels[:-1]|join(", ") }} and {{ labels[-1] }}{% endif %}{% if backfill_days == -1 %} and has no time limit.{% else %} and can be done up to {{ backfill_days }} days back.{% endif %}
{% endif %}

### Activity descriptions
The following fields are available in Yarmill (right and left side). They are used for recording individual training sessions, where to log them, and how to split them into the correct fields. Some fields are not editable by the user; they are calculated automatically.
The left side is meant for notes and descriptions of activities, while the right side is meant for logging numbers like time, distance, repetitions, etc. Some numeric fields can also appear on the left side. The ground truth is the list below.
Users should log their activities in the corresponding fields. If there is no exact field for an activity, use the most similar field or \"other\" if available (see the list below).

{{ activity_descriptions }}

### For Athletes
#### Logging in the web app
1. Go to **Reality**.
2. Switch weeks via the microcycle selector at the top.
3. Use the **three dots** to add notes/attachments.
4. Fill in the left (text) and right (data) sides according to your team methodology.

#### Logging in the mobile app
- **Add** opens parameters from the **left (text) side**.
- **Activities** opens the **right (data) side** (numbers).
- You record **Reality** next to the planned values your coach prepared.

#### Day off / illness / health limitation
- If your instance uses specific indicators on the right side (e.g., illness, day off, injury/limitation), use them — it will also behave correctly in reports/Attendance.

### For Coaches
- Depending on permissions and team workflow:
  - athletes log for themselves, or
  - coaches log for individuals/groups.
- If athletes ask “where do I enter X?”, point them to your team methodology and share a concrete example.

### For Administrators
- Admins can influence tracked parameters (instance configuration) and who is allowed to write where.

## 5) Abbreviations & metrics (HRV, RPE, TRIM, zones…)

### Shared principles
- Many abbreviations are **team-specific**, especially in the left (text) side.
- Some metrics are universal (HRV, RPE, zones), but what’s tracked in Yarmill depends on the instance configuration.

### For Athletes
- If you don’t understand an abbreviation in your diary:
  - check your team’s legend/methodology,
  - or ask your coach (especially for internal codes).

### For Coaches / Administrators
- Consider maintaining a short “dictionary” / legend for your instance — abbreviation questions are extremely frequent.

---

## 6) Exporting, printing & sharing

### For Athletes
- Exports (e.g., “all data” or diary export) depend on what your instance allows.
- Attach files to a training entry — they will appear in **Files** in the web app.

### For Coaches / Administrators
- **Season review (RTC)** can be downloaded as **XLS or PDF** (if enabled).
- Some bulk exports or special outputs are handled via **hello@yarmill.com**.
{% if season_evaluation_enabled %}
- Season review can be downloaded as XLS/PDF (if you have permissions).
{% endif %}

---

## 7) Roles, permissions & privacy

### Quick role overview (aligned with the original guidelines)
**Athlete**
- Sees their plan but does not edit it.
- Logs training and sees their own analysis.
- Adds notes and attachments to training.

**Coach**
- Sees assigned groups.
- Plans and edits training (group/individual).
- Publishes the plan via **Copy plan**.
- Logs training and (if enabled) Attendance.
- Sees Analytics and Evidence (depending on setup).

**Administrator**
- Full instance editor rights (everything editable).
- Adds users, creates groups, grants permissions.

### For Athletes
- Visibility of sensitive data (health information, menstruation, etc.) depends on your instance setup and roles.
- If you’re unsure who can see something, ask your coach/admin.

### For Coaches / Administrators
- Grant rights in: **Settings → Groups → select group → set read/write permissions in dropdown**.

---

## 8) Navigation & UI (where to find things)

### Shared principles
- Top bar = main modules (Reality / Plan / Analytics / Attendance / Other / Settings — depends on instance).
- Avatar menu (top right) often includes: logout, password change, tips & tricks, help.
{% if header_navigation_overview %}

### Main navigation overview
{% if header_navigation_overview.navigation %}
{% for title, item in header_navigation_overview.navigation.items() %}
#### {% if item.get("link_token") %}[{{ title }}]({{ item.get("link_token") }}){% else %}{{ title }}{% endif %}
{% endfor %}
{% endif %}
{% if header_navigation_overview.analytics %}

#### Analytics (dashboard list)
{% for item in header_navigation_overview.analytics %}
- {% if item.get("link_token") %}[{{ item.get("title") }}]({{ item.get("link_token") }}){% else %}{{ item.get("title") }}{% endif %}
{% endfor %}
{% endif %}
{% if header_navigation_overview.evidence %}

#### Evidence / tables
{% for title, item in header_navigation_overview.evidence.items() %}
- {% if item.get("link_token") %}[{{ title }}]({{ item.get("link_token") }}){% else %}{{ title }}{% endif %}
{% endfor %}
{% endif %}
{% endif %}

### For Athletes
- In the mobile app you open **today’s plan** by default.
- If you don’t see a section, it may be disabled for your instance or restricted by permissions.

### For Coaches / Administrators
- If someone says “it’s not in my top bar”, check:
  - whether the module is enabled in the instance,
  - whether the user has the correct role/permissions.

---

## 9) Analytics, graphs & “why can’t I see it?”

### Shared principles
- Analytics varies by federation/team.
- Not all metrics/modules are available to all roles.

### For Athletes
- If enabled, you’ll find it under **Analytics → Training data analysis**.

### For Coaches / Administrators
- You can switch between athletes (depending on rights).
- Missing analytics/graphs usually means:
  - the module isn’t enabled,
  - missing permissions,
  - or missing input data (left/right side not logged; integration doesn’t provide that metric).
{% if analytics_overview %}

### Available analytics overview
{% for dash_title, dash_data in analytics_overview.items() %}
#### {{ dash_title }}
{% for page_code, page_data in dash_data["pages"].items() %}
- {% if page_data.get("link_token") %}[{{ page_data.get("name") or page_code }}]({{ page_data.get("link_token") }}){% else %}{{ page_data.get("name") or page_code }}{% endif %}{% if page_data.get("description") %} — {{ page_data.get("description") }}{% endif %}
{% endfor %}
{% endfor %}
{% endif %}

---

## 10) Yollanda — what she can and can’t do

### Summary
#### What Yollanda can do (in Yarmill context)
- Help find information from training.
- Provide guidance on where to click and how workflows work (Plan/Reality, integrations, Files, etc.).
- In beta setups, she may search mainly in the **left (text) side**.

#### Limitations / when to escalate
- “Write to developers anonymously / pass messages” → privacy + process: escalate to your admin or **hello@yarmill.com**.
- “Log it automatically in the system for me” → if not supported, use the closest supported workflow (Import plan, templates, team methodology).
- Instance changes (modules, tracked parameters) → admin or **hello@yarmill.com**.

### Details
[[yollanda]]

---

# Module overview

{% if modules.get("plan") %}
## {{ modules["plan"] }}
Create and edit training plans for athletes or groups (left **text** side + right **data** side). Coaches/admins must **Copy plan** for athletes to see updates.
{% endif %}

{% if modules.get("reality") %}
## {{ modules["reality"] }}
Daily training log (what actually happened): left **text** entry + right **data** values, plus notes and attachments. Includes **Import plan** (Plan → Reality) when training matches the plan.
{% endif %}

{% if modules.get("evidence") %}
## {{ modules["evidence"] }}
Profile and personal records used by the team (e.g., identifiers, athlete details, testing IDs). What fields exist and who can edit them depends on instance settings and permissions.
{% endif %}

{% if modules.get("planner") %}
## {{ modules["planner"] }}
Shared season calendar for events (races, camps, meetings, tests). Coaches/admins can manage participants; instance admins can lock events.
{% endif %}

{% if modules.get("attendance") %}
## {{ modules["attendance"] }}
Attendance dashboard for planned training days. Tracks presence/excuse and can **copy planned training into Reality** based on attendance (if enabled and used by your team).
{% endif %}

{% if modules.get("analytics") %}
## {{ modules["analytics"] }}
Charts and summaries from logged training and integrated data. Visibility and available metrics vary by role and team setup.
{% endif %}

{% if modules.get("season-evaluation") %}
## {{ modules["season-evaluation"] }}
Season/annual cycle evaluation (plan vs. reality completion across athletes/groups), often with trend comparison and export options (XLS/PDF) if enabled.
{% endif %}

{% if modules.get("files") %}
## {{ modules["files"] }}
All training attachments in one place (from Plan or Reality). Download, rename, or delete files and jump directly to the training day they belong to.
{% endif %}

{% if modules.get("tabulars") %}
## {{ modules["tabulars"] }}
Custom tables for results and tests (races, lab tests, interim checks). Structure is team-defined; entries can be used later for reporting/analytics.
{% endif %}

{% if modules.get("goals") %}
## {{ modules["goals"] }}
Season goals and key results (KR): set targets, track status and progress, add comments/feedback, and switch between seasons.
{% endif %}

{% if modules.get("medical") %}
## {{ modules["medical"] }}
Health, wellness, and sensitive records (e.g., illness, limitations). Access is permission-based and may be restricted to specific roles.
{% endif %}

{% if modules.get("watches") %}
## {{ modules["watches"] }}
Integrations for watches and services ({% if watches_module_labels %}{{ watches_module_labels | join(", ") }}.{% else %}Garmin, Polar, WHOOP, Oura, Suunto, Apple Health, etc.{% endif %}). Imported data appears in **Reality**, but does not replace logging the left/right sides.
{% endif %}

{% if modules.get("sport-theory") %}
## {{ modules["sport-theory"] }}
Reference content for training methodology (zones, terminology, physiology) used by your team. Content can be instance-specific.
{% endif %}

{% if specific_guidelines %}

---

# Specific guidelines

{{ specific_guidelines }}
{% endif %}

---
