# Module Spec: Files (Soubory) — internal

> Internal specification. NOT published (excluded via `.mintignore`). Source for the
> user-facing docs page + image plan. Fill every section; leave `TODO(verify)` where unsure.

## 0. Meta
- **Module:** Files — Czech UI term **Soubory** ("all attachments")
- **Route(s):** per-athlete `/filesOverview?group={id}&athlete={id}&week=…`; group-wide
  (Entire Group) `/filesOverview?group={id}` (no `athlete`). Renders **LIGHT**.
- **Nav path:** classic top-nav → **FILES** — its **own top-level nav tab** (NOT under OTHER).
- **UI shell:** **classic light top-nav** (… · **FILES** · …, Yollanda icon in header). FILES
  is its own entry. Files has not been redesigned into the new left-rail shell — it lives in
  the classic top-menu UI. Per-athlete selection is via the standard left **group panel**
  (group dropdown → **Entire Group** + athletes), same as other classic-shell modules.
- **Surfaces:** web (PWA). {/* TODO(verify): whether the Files overview is reachable / usable in the native iOS/Android apps + mobile parity. */}
- **Primary roles:** coach, athlete
- **Config-dependence:** **low–medium** — the overview, columns, tags, and Add-file flow are universal; an embedded federation **video database** is the main instance-specific variant. `[CONFIG]`
- **Explored:** 2026-06-15 · clean coach session (we.yarmill.com, coach *Bart Simpson*) · group
  *National Team* · athlete *Kroczek Tomiš* (0 files) · by main agent · live-verified overview
  + Add-file modal; Add-file form details now confirmed against the live UI
- **Render images now?** **NO** — shot list only.

## 1. Purpose & why it exists
Every attachment a team creates lives somewhere specific — a video on a training day, an
image in a plan, a document in the log. Over a season those scatter across hundreds of
days. **Files** pulls all of them into one filterable overview, so "that prone-shooting
video from camp" is findable months later without remembering which day it was attached to.
It is a **lens over existing attachments**, not a separate store: files are created on days
in Plan and Reality, and Files is where you find, filter, and manage them in one place.

## 2. Jobs to be done (per role)
- **Coach:**
  - When I need a clip or document I attached weeks ago, I want to filter by tag, type, or
    name across the whole season, so I find it without scrubbing through days.
  - When I record one technique video that applies to several athletes, I want to attach it
    to all of them at once with the right date and tags, so I don't repeat the upload.
  - When I'm reviewing an athlete's work, I want to jump from a file straight to the day it
    belongs to, so I see it in its training context.
- **Athlete:**
  - When I want a coach's feedback clip or a shared document, I want to browse and filter my
    files in one place, so I don't hunt through the log day by day.

## 3. Personas & permissions
- **Coach:** sees the Files overview for their athletes/group; can add files (via the
  central **Add file** modal, including the multi-athlete attach), and jump to a file's
  location in the log. **Scope** is set by the standard left **group panel**: pick **Entire
  Group** for a group-wide view (`/filesOverview?group={id}`, no athlete) or an individual
  athlete for the per-athlete view. {/* TODO(verify): per-row actions (download / preview / delete / open) on a filled table — none could be tested (demo athlete had 0 files). */}
- **Athlete:** sees their own files in the overview and uses the same overview tools.
  {/* TODO(verify): whether athletes can add files at all / use the multi-athlete "Add file" attach, or only see their own. */}
- Files surfaces attachments that already exist in Plan / Reality, so **visibility follows
  the underlying day** — you see a file in the overview if you can see the day it lives on.
  {/* TODO(verify): confirm that Files visibility is inherited from the source day's permissions. */}

## 4. Key concepts & vocabulary
- **File / attachment:** a **video, image, or document** attached to a day in **Plan** or
  the **Training Log (Reality)**. These are the only sources — Files does not hold anything
  that isn't attached to a day.
- **Type:** the file kind — **video · image · other** (documents and anything non-video,
  non-image). The header count line breaks the overview down as **X videos · Y images ·
  Z others**.
- **Tags / labels:** free-text labels on a file (e.g. *technique*, *prone shooting*,
  *race*). **Used instead of folders** — see "no folders" below. A single file can carry
  several tags at once.
- **No folders (by design):** Files deliberately has **no folder hierarchy**. Folders force
  one hierarchy and one home per file; **tags** let the same race video be both *technique*
  and *prone shooting*. Tag consistently and filtering does the rest.
- **Location:** **the module / context the file is attached to** (e.g. **Plan** / **Reality**),
  set by the upload's **Module** field — i.e. where in the log the file lives. Shown as a
  column. {/* TODO(verify): whether selecting Location/Date jumps to that day (untestable — demo had 0 files). */}
- **Date:** the date of the file's day in the log. {/* TODO(verify): whether selecting it jumps to that day — untestable in the demo (0 files). */}
- **Column filter (funnel):** **confirmed** — every table column header carries a **funnel/
  filter** icon (Type · File name · Tags · Location · Date). {/* TODO(verify): the per-column filter UI specifics (panel, operators). */}
- **Video database** `[CONFIG]`: some instances embed a federation **video database**
  (an exercise/technique library) so coaches insert videos into plans and athletes play
  them from the plan. This is an integration around files, configured per instance.

## 5. Information architecture
- **Shell:** classic light top-nav. Reach Files via the top-nav **FILES** tab → route
  `/filesOverview`.
- **One primary view:** the **Files overview** — a single header + filterable table. No
  sub-tabs observed.
- **Related modules:**
  - **Plan** and **Training Log (Reality)** — the *sources* of every file; Files links back
    into a specific day there.
  - **Athlete profile / Evidence** — separate file storage on the athlete card (personal
    documents); **not** the same as Plan/Reality attachments and **not** surfaced in this
    overview. {/* TODO(verify): confirm Evidence/athlete-card files are excluded from the Files overview. */}

## 6. Screen & UI inventory

### 6.1 Files overview
- **Layout:** a header block (title + subtitle + count line) with a primary action top-right,
  over a single full-width table; each column header carries a filter control.
- **Header:**
  - **Title:** `Files • N` — module name with the **total file count** N (live glyph is a
    bullet `•`).
  - **Subtitle:** `Overview of all the files attached to trainings and plan`.
  - **Count line:** `N videos • N images • N others` — the breakdown by type.
  - **Primary action (top-right):** **+ Add file** button, magenta. Opens the Add-file modal
    (§6.2).
- **Table columns** — **confirmed live**: **Type · File name · Tags · Location · Date**, each
  header carrying a **funnel** filter icon.
  - **Type** — `derived` · file kind (video / image / other), typically an icon. `read-only`.
  - **File name** — `text` · the file's name. {/* TODO(verify): whether the name is inline-editable / renameable — untestable (0 files). */}
  - **Tags** — `text labels` · the file's tags. {/* TODO(verify): tag editing UI on a row — untestable (0 files). */}
  - **Location** — `derived` · the **module / context** the file is attached to (e.g. Plan /
    Reality), set by the upload's **Module** field. `read-only`.
  - **Date** — `date` · the file's day.
- **Row actions:** {/* TODO(verify): per-row actions on a filled table (download / preview / delete / open) — none could be tested; demo athlete had 0 files. */}
- **States:**
  - **Empty:** **"No records"** (no files, or filters exclude everything).
  - **Filled:** rows of files; counts reflect the full set, the table reflects active filters.
  - **Loading / error:** {/* TODO(verify): loading and error states for the overview. */}

### 6.2 Add file ("Adding file" modal)
- **Trigger:** **+ Add file** (header, top-right).
- **Surface:** a **full-screen LIGHT modal** titled **"Adding file"**. **Confirmed live**.
- **Behaviour:** an **explicit Save / Cancel** modal — **not** auto-save and **not**
  create-on-open. Opening it creates nothing; you must attach a file and **Save**.
- **Purpose:** upload a file **and** attach it — this entry point can attach **one file to
  several athletes at once** (the Athletes field is a multi-select).
- **Fields (top → bottom, confirmed live):**
  - **Date** — date field, **defaults to today**.
  - **Module** — dropdown selecting which module the file attaches to; **default "Plan"**.
    This sets the file's **Location** in the overview. {/* TODO(verify): full Module option set — Plan confirmed, Reality/others presumed. */}
  - **Tags** — a searchable **multi-select** ("Add tag …").
  - **Athletes** — a searchable **multi-select**, **prefilled with the currently-selected
    athlete** (removable chips); add more to attach the file to several athletes at once.
  - **Files** — a **"+ Add file"** control (the actual file picker / upload).
    {/* TODO(verify): single vs multiple file upload; drag & drop; accepted types / size limits. */}
- **Footer:** **Cancel** + **Save**. **Save is disabled until at least one file is attached.**
- **States:** {/* TODO(verify): in-progress upload + success/error states. */}

## 7. Actions & interactions
- **Add file:** **+ Add file** → **"Adding file"** modal (§6.2) → set **Date** (defaults
  today), pick a **Module** (defaults Plan), add **Tags**, confirm/extend **Athletes**
  (prefilled with the current athlete), attach a file via **+ Add file** → **Save** (gated on
  at least one attached file). Creates the attachment(s); a file also lands in the overview
  if it was attached on a training/Plan day elsewhere.
- **Filter a column:** open a column's **funnel** → narrow by type / name / tag / location /
  date. {/* TODO(verify): filter UI specifics + whether filters change the header counts. */}
- **Jump to location / date:** {/* TODO(verify): whether selecting a file's Date / Location opens that day in the log — untestable (0 files). */}
- **Row actions (download / preview / delete / open):** {/* TODO(verify): exist + placement — none could be tested (0 files). */}
- **Activity log:** {/* TODO(verify): whether Files actions (add / rename / delete) are written to any Activity/audit log — Files is classic-shell and may not have the GUI-2.0 Activity log the Medical module has. */}

## 8. User journeys / flows (per role)
**Coach — find a file from earlier in the season:** top-nav **FILES** → overview → open the
**Tags** funnel → filter to *prone shooting* (optionally add a **Type = video** filter) →
scan results → **select the date** to open that training day and watch the clip in context.

**Coach — share one video with several athletes:** **+ Add file** → set **Date** and **Module**
(e.g. Reality) → add **tags** (*technique*, *prone shooting*) → in **Athletes** keep the
current athlete and add the rest of the relay group → attach the clip via **+ Add file** →
**Save**. The same file now appears for each athlete and in the overview.

**Athlete — get a feedback clip:** top-nav **FILES** → overview → filter by **Type = video**
or by tag → select the date to jump to the day, or download the file.

## 9. Use cases / scenarios
- **Season-long video library by tag:** a biathlon coach tags every range clip *prone
  shooting* or *standing shooting* and every ski clip *technique*; months later they pull the
  whole prone-shooting set with one filter — no folders, no remembering dates.
- **One clip, whole group:** a coach films a drill once and attaches it to the entire relay
  squad in a single **Add file** action, with the date and tags set once.
- **Back to context:** reviewing the overview, a coach clicks a file's date to land on the
  exact training day, seeing the clip alongside the session it documents.
- **Document retrieval:** a shared PDF (camp schedule, protocol) attached to a plan day is
  found later via the **other** type filter or a *logistics* tag.
- **Embedded technique library** `[CONFIG]`: on an instance with a federation **video
  database**, coaches insert library videos into plans and athletes play them from the plan.

## 10. Configuration & variants
- **Universal mechanics:** the Files overview, the **Type / File name / Tags / Location /
  Date** columns and their filters, the **no-folders / tags** model, the **count line**, and
  the multi-athlete **Add file** flow.
- `[CONFIG]` **Video database** — an embedded federation exercise/technique library (per
  instance), letting coaches insert videos into plans and athletes play them from the plan.
- `[CONFIG]` **Language** — the module label is **Soubory** on Czech instances; column and
  header labels follow the instance language.
- {/* TODO(verify): whether accepted file types / size limits are universal or instance-configured. */}

## 11. Edge cases, limits, gotchas
- **Files is a lens, not a store:** there is no way to add a file that isn't attached to a
  Plan/Reality day — everything in the overview belongs to a day.
- **No folders — ever:** organisation is **tags only**; inconsistent tagging is the main
  failure mode (filtering is only as good as the tags).
- **Type bucket "other":** anything that isn't a video or image (documents, etc.) falls under
  **other** in both the count line and the Type filter.
- **Empty / over-filtered:** the table shows **"No records"** both when there are no files and
  when active filters exclude everything — counts in the header still reflect the full set.
- **Classic shell:** Files is **not** redesigned into the new left-rail UI; it stays in the
  top-nav. Don't describe it via the new shell.
- {/* TODO(verify): mobile/PWA differences for the Files overview and Add-file form. */}
- {/* TODO(verify): delete semantics — removing from the overview vs detaching from the source day. */}

## 12. Cross-module integration & data flow
- **← Plan / Training Log (Reality):** the **source** of every file. Attachments created on
  days in those modules are what Files aggregates.
- **→ Plan / Training Log (Reality):** Files links **back** to a specific day via the date /
  location, so a found file reopens in its training context.
- **↔ Athlete profile / Evidence:** the athlete card has its **own** file fields (personal
  documents) — separate storage, not the same as day attachments. {/* TODO(verify): confirm Evidence files are not part of the Files overview. */}
- `[CONFIG]` **Video database integration:** an embedded library that feeds videos into plans.

## 13. Shot list (images for the docs page)
> Render now? = **NO** for all — shot list only.

| # | Screen / state | Sample data | Caption (draft) | Callouts | Supports doc section | Role | Render now? |
|---|----------------|-------------|-----------------|----------|----------------------|------|-------------|
| 1 | Files overview (filled) | National Team; `Files · 48`, `31 videos · 12 images · 5 others`; rows incl. a prone-shooting clip tagged *technique, prone shooting* on Simpson Lisa's range day | "Every attachment from Plan and Reality in one place — filter by type, name, tag, location, or date." | Count line · column filters (funnel) · **+ Add file** · Date → jumps to the day | Find a file | coach | shot-list (no) |
| 2 | Tags column filtered | Same overview, **Tags** funnel open, filtered to *prone shooting* | "No folders — tags. Filter to *prone shooting* and the whole set surfaces at once." | Tags funnel open · matching rows | Why tags, not folders | coach | shot-list (no) |
| 3 | Add file form | One technique video → Reality → **multiple athletes** (relay squad) → date + tags | "Add a file once and attach it to several athletes at the same time, with its date and tags." | Multi-athlete selector · Plan/Reality target · tags · date | Add a file | coach | shot-list (no) |
| 4 | Empty state | Filters exclude everything | "No records." | "No records" empty state | (optional, edge) | coach/athlete | shot-list (no) |

## 14. Open questions / TODO(verify)
> Resolved live on 2026-06-15 (now in the body): route + query params, FILES as its own
> top-level tab, group-panel scope (Entire Group + per-athlete) incl. the group-wide view,
> the overview header/subtitle/breakdown, the Type/File name/Tags/Location/Date table with
> funnels + "No records" empty state, and the **Adding file** modal (full-screen LIGHT;
> Date default today · Module default Plan · Tags · Athletes prefilled · Files picker;
> explicit Cancel/Save with Save gated on a file).

- **Per-row actions on a filled table** — download / preview / delete / open: none could be
  tested (demo athlete had 0 files). Existence + placement unknown.
- **Module dropdown** — full option set (Plan confirmed default; Reality / others presumed).
- **Per-column filter UI** — the funnel panel specifics, operators, and whether filters
  change the header counts.
- **Accepted file types / size limits**; single vs multi-file upload; drag & drop.
- **In-app preview behaviour** (video/image preview from a row).
- **Jump to day** — whether selecting a file's Date / Location opens that day in the log.
- **Athlete capabilities** — can athletes add files / use the multi-athlete Add file, or only
  see their own files.
- **Visibility model** — confirm Files visibility is inherited from the source day's
  permissions.
- **Delete semantics** — overview-only vs detaching from the source day; confirmation dialog.
- **Activity/audit logging** for Files actions (likely none in the classic shell).
- **Loading / error / mobile parity (PWA, native apps)** for overview and modal.
- **Evidence/athlete-card files** — confirm they're excluded from this overview.

## 15. Source log
- **Live-verified — clean coach session (2026-06-15):** we.yarmill.com, coach *Bart Simpson*,
  group *National Team*, athlete *Kroczek Tomiš* (0 files), classic top-nav UI. Confirmed:
  - **Route & nav:** `/filesOverview?group={id}&athlete={id}&week=…` per-athlete and
    `/filesOverview?group={id}` (no athlete) for the **Entire Group / group-wide** view;
    **FILES** is its own top-level classic nav tab (not under OTHER); per-athlete via the left
    **group panel** (group dropdown → Entire Group + athletes). Renders **LIGHT**.
  - **Overview:** header **"Files • N"** (file count) + subtitle "Overview of all the files
    attached to trainings and plan" + breakdown **"N videos • N images • N others"**; magenta
    **+ Add file** top-right; table **Type · File name · Tags · Location · Date** with a
    **funnel** on each header; **"No records"** empty state (Kroczek had 0 files).
  - **"Adding file" modal (full-screen LIGHT):** fields top→bottom **Date** (default today) ·
    **Module** (default **Plan**) · **Tags** (searchable multi-select) · **Athletes**
    (searchable multi-select, **prefilled** with current athlete, removable chips) · **Files**
    (+ Add file picker); footer **Cancel / Save** with **Save disabled until a file is
    attached**. Explicit Save/Cancel — not auto-save, not create-on-open.
  - **Confidence: high** on all of the above.
- **Master reference (§5.10, line 167):** per-file rename/download/delete; one file → multiple
  athletes; the `[CONFIG]` embedded **video database**. The Add-file form is now confirmed
  live (above); the field is **Module** (not a Plan/Reality "Target"). Row actions
  (download/preview/delete/open) **not yet confirmed live** — flagged in §14.
- **Module name map (line 78):** Files = Czech **Soubory**.
- **Shell context (line 41):** Files lives in the classic top-menu UI; not yet redesigned.
- **Not observed live (0 files in demo):** per-row actions, in-app preview, jump-to-day from a
  row, full Module option set, filter-panel specifics, loading/error/mobile — all `TODO(verify)`.

## 16. Docs page plan
- **Audience line:** `**For:** coaches, athletes · **Where:** Web app`
- **Proposed page outline** (H2s → spec sections):
  | Page section (H2) | Fed by |
  |-------------------|--------|
  | intro + audience line | §1, §0 |
  | Find a file (overview + columns + filters, jump-to-day) | §6.1, §4, §5, §7 |
  | Why tags, not folders | §4 (no folders), §11 |
  | Add a file (incl. one file → several athletes) | §6.2, §7, §8 |
  | (optional) Embedded video library — `<Info>` `[CONFIG]` | §4, §10, §12 |
- **Cross-links** (exact paths):
  - `/en/reality/training-log` — the Training Log (Reality) source of attachments.
  - `/en/plan/plan` — the Plan source of attachments.
  - `/en/platform/athlete-profile` — note that personal documents live on the athlete card,
    not in Files. {/* TODO(verify): confirm this distinction before linking. */}
- **UI label → doc term:**
  | UI label | Doc term |
  |----------|----------|
  | Files / Soubory | Files |
  | Location (column) | where the file lives in the log |
  | other (type) | documents and other files |
  | Add file | Add a file |
- **Notes for the writer:** the **Add-file modal fields are now confirmed live** (2026-06-15) —
  the `files.mdx` `{/* TODO(yarmill): verify the Add file form fields … */}` can be cleared;
  use **Module** (default Plan), Date (default today), Tags, Athletes (prefilled), Files
  picker, Cancel/Save (Save gated on a file). Match the existing
  page's two-section shape (Find a file / Add a file); this spec adds the optional tags-vs-
  folders and video-library angles.
