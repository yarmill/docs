# Seed plan: Medical module — AFC Richmond

The demo data to create in the **Medical module (Injuries & Illnesses)** for the AFC Richmond
group before re-shooting the Medical page visuals. See [`../demo-cast.md`](../demo-cast.md) for the cast
and the write-scope rule: **Ted Lasso** is the coach, **Jamie Tartt** the athlete (and the
athlete login), **Rebecca Welton** the admin. Field-by-field behaviour is in
[`../../module-notes/medical-module.md`](../../module-notes/medical-module.md).

> **PROPOSAL — not seeded.** Nothing below exists in the live app yet. Unlike the Goals set
> (seeded 2026-09-02, now the live state), this is a plan to be reviewed, then written.
> The existing `images/medical/*.png` still show the old *National Team / Simpson Lisa* data;
> the point of this set is to retire them.

Designed so the whole Medical shot list can be taken from one data set: an Entire Group
overview with red / amber / green pills, an **overdue** expected return, two athletes with
**no health problems**, a rich open injury for the anatomy shot, an illness alongside an
injury, closed records with closure dates, and a **recurring** classification that repeats a
closed record on the same athlete.

**Reference date: 2026-09-20.** Every date is chosen against it. If the seed runs much later,
shift the whole set by the same offset — otherwise "recent", "overdue" and "closed months ago"
stop reading.

## The squad at a glance — what the Entire Group overview shows

| Status pill | Athlete | Open health problems | Expected return |
|---|---|---|---|
| 🔴 No training | **Tartt Jamie** | Right ankle sprain (lateral) · Left Achilles tendon soreness | 4 Oct 2026 · – |
| 🟠 Modified training | **Kent Roy** | Right knee patellofemoral pain | **21 days overdue** (30 Aug 2026) |
| 🔴 No training | **Obisanya Sam** | Acute tonsillitis *(illness)* | 24 Sep 2026 |
| 🟢 Full training | **Rojas Dani** | Right groin adductor tightness | 28 Sep 2026 |
| 🟢 — | **McAdoo Isaac** | *No health problems* | – |
| 🟢 — | **Bumbercatch Moe** | *No health problems* | – |

That single frame carries all three pill colours, an overdue return in red, a `–` in the
expected-return column, an illness next to injuries, a stacked two-problem cell, and the
greyed empty state twice. Ted Lasso and Rebecca Welton don't get rows.

## Jamie Tartt — the lead athlete

Two open, four closed — enough that **Open (2) / Closed (4)** reads as a career log rather
than a demo. The ankle sprain is the hero: it is the one record with the full set of
circumstances, a confirmed OSIICS code, a real note and Activity comments.

| Record | Type | Class. | Treatment | Limitation | Start | Expected return | Diagnosis |
|---|---|---|---|---|---|---|---|
| **Right ankle sprain (lateral)** | Injury | New | Open | 🔴 No training | 6 Sep 2026 | 4 Oct 2026 | `AL1` · Right |
| Left Achilles tendon soreness | Injury | **Recurring** | Open | 🟢 Full training | 14 Sep 2026 | *(none)* | "Achilles tendinopathy" · Left |
| Influenza | **Illness** | New | **Closed** 21 Jan 2026 | 🔴 No training | 12 Jan 2026 | 20 Jan 2026 | "influenza" · Unknown |
| Left Achilles tendon soreness | Injury | New | **Closed** 24 Nov 2025 | 🟠 Modified | 3 Nov 2025 | 21 Nov 2025 | "Achilles tendinopathy" · Left |
| Left hamstring strain (grade 2) | Injury | New | **Closed** 21 Mar 2025 | 🔴 No training | 8 Feb 2025 | 15 Mar 2025 | "hamstring strain" · Left |
| Lower back stiffness | Injury | New | **Closed** 2 Oct 2024 | 🟠 Modified | 18 Sep 2024 | 1 Oct 2024 | "lumbar" · Unknown |

**Why this spread:**

- The **ankle sprain** is recent (14 days ago) and returns in 14 days, so nothing about the
  hero record is overdue — the overdue case lives on Roy, where it can't distract from the
  anatomy shot.
- The **two Achilles records** are the recurring pattern, on one athlete's own list: a closed
  one from November 2025 and an open one classified **Recurring**. That makes the
  "recurring problems become visible" claim on the docs page demonstrable in a single frame
  instead of asserted.
- The open Achilles record has **no expected return** and a **green** limitation, which does
  two jobs at once: it produces the `–` in the overview's date column, and it proves the pill
  is the athlete's *worst* open limitation (green + red → the row is red).
- The **hamstring strain** costs 8 Feb → 21 Mar 2025 = **41 days**, which is exactly the start
  value of the *Days lost to injury* key result on Jamie's Goals objective "Finish the season
  fit" (41 → 6). The two modules then tell the same story, and a reader who opens both sees a
  product, not two demos.
- Nothing here contradicts that Goals objective: the season it measures (2025/26) contains
  only the nine-day influenza and the three-week Achilles episode, both of which fit
  "6 days lost" loosely enough for a demo — see *Assumptions* below.
- The **lower back** record is the oldest, from 2024/25, alongside the 2024 "Win back a
  starting place" goal.

### Shots it serves

- **Record detail / anatomy shot** — the ankle sprain: properties row, key dates, OSIICS
  diagnosis with side and auto-tags, circumstances, note, Activity.
- **Record list** — Jamie's Open (2) / Closed (4), with the type icons, pills and the check on
  closed records.
- **Athlete view** — the same list from Jamie's own login, with no group switcher.
- **Closing and history** — any of the four closed records, with its closure date.

## The rest of the squad

One record each, chosen for what it contributes to the overview.

### Kent Roy — the overdue row, and the other half of the pattern angle

| Record | Type | Class. | Treatment | Limitation | Start | Expected return | Diagnosis |
|---|---|---|---|---|---|---|---|
| **Right knee patellofemoral pain** | Injury | **Recurring** | Open | 🟠 Modified | 10 Aug 2026 | **30 Aug 2026 → 21 days overdue** | "patellofemoral" · Right |
| Right knee cartilage irritation | Injury | New | **Closed** 20 Apr 2025 | 🟠 Modified | 2 Mar 2025 | 14 Apr 2025 | "knee cartilage" · Right |

The knee is why his Goals objective *"Last the full ninety again"* is **Canceled** — the Goals
plan already says "the knee made the decision", so the two data sets agree. His open record is
the amber pill and the overdue date in one row.

**Leave the expected return in the past.** If a later pass "tidies" it forward, the overview
loses its red "X days overdue" and the shot is gone — the same rule as Rojas Dani's
deliberately incomplete goal in the Goals set.

### Obisanya Sam — the illness

| Record | Type | Class. | Treatment | Limitation | Start | Expected return | Diagnosis |
|---|---|---|---|---|---|---|---|
| **Acute tonsillitis** | **Illness** | New | Open | 🔴 No training | 18 Sep 2026 | 24 Sep 2026 | "tonsillitis" · Unknown |

An open **illness** on the overview next to open injuries, so the two type icons (injury
flower vs. illness triangle) are visible in the same frame and the "the codelist is filtered
by record type" line can be shown rather than only stated. Short and current — two days old,
back in four.

### Rojas Dani — the green pill that still has a record

| Record | Type | Class. | Treatment | Limitation | Start | Expected return | Diagnosis |
|---|---|---|---|---|---|---|---|
| **Right groin adductor tightness** | Injury | **Recurring** | Open | 🟢 Full training | 11 Sep 2026 | 28 Sep 2026 | "adductor" · Right |

The useful nuance: an athlete can carry an open problem and still be fully available. Green
pill, open record, a return date anyway.

### McAdoo Isaac — history only

| Record | Type | Class. | Treatment | Limitation | Start | Expected return | Diagnosis |
|---|---|---|---|---|---|---|---|
| Left fifth metacarpal fracture | Injury | New | **Closed** 2 Apr 2026 | 🔴 No training | 14 Feb 2026 | 28 Mar 2026 | "metacarpal fracture" · Left |

Shows "No health problems" on the overview while his own list has a **Closed (1)** section —
the empty row means *nothing open*, not *nothing on file*.

### Bumbercatch Moe — nothing at all

Deliberately empty, the same as in the Goals set: the truly empty athlete, for the empty
record list as well as the empty overview row. Don't give him a record.

### Ted Lasso / Rebecca Welton

No medical records. Coaches and admins don't appear in the Entire Group overview, and a
medical record on the coach's account would only muddy the athlete-list shots.

## Two things to verify in the live app before seeding

**1. OSIICS codes.** Only **`AL1` Sprain lateral collateral ligament ankle** is confirmed —
it's the code cited in the module notes. Every other record carries the **search term to
type** and `code: null` in the seed file, with a `TODO(verify)` comment. Pick the real code
from the live picker at seeding time and write it back into `medical.mjs`. **Do not invent a
code:** a plausible-looking but fake OSIICS code baked into a screenshot is worse than a
record with no diagnosis, because nobody will catch it later.

**2. Circumstances values.** Activity · Injury mechanism · Location · Severity · Surface are
**Yarmill codelists configured per instance** — not OSIICS, not standardised. Every
`[category, value]` pair in the seed file is a **guess** (Match / Training, Contact /
Non-contact / Overuse, Home, Moderate / Mild / Severe, Natural grass). Check the live picker
and correct them; the driver should skip a category or value that doesn't exist rather than
fail. Only the hero record carries a full set of five — if the codelist turns out to be
different, the hero is the one record worth fixing by hand.

## Notes for seeding

- **Everything auto-saves and lands in Activity**, so the log writes itself. Set
  **Treatment Status → Closed last** on the closed records, so Activity reads as progress
  ("changed treatment status to Closed") rather than a record that was born closed.
- **The Closure date may not be editable.** The module notes only say it *appears* once the
  record is Closed, which suggests it's set to the day you close it. The seed file carries a
  `closureDate` for each closed record anyway; if the field can't be set, the closed records
  will all show the seeding date. That costs the "closed months ago" reading in the Closed
  list — decide before shooting whether that matters, and if it does, capture the Closed list
  in a way that doesn't lean on the dates. `TODO(verify)`
- **Comments are posted from the seeding session** — the coach, Ted Lasso. An athlete-voice
  comment on the ankle sprain would need Jamie's own login, the same gap the Goals plan notes
  for his final evaluation. Optional; add it in a second pass if the Activity shot wants two
  voices.
- **Start dates default to today on create** and are editable via the calendar — every record
  needs its start date corrected after creation, especially the historical ones.
- **Clear the announcement modals** before capturing (the capture harness does this).
- **Keep titles short.** They stack in the overview's *Open health problems* column and in the
  record cards; long titles wrap badly in a screenshot. "Right ankle sprain (lateral)" is
  about the maximum.
- **No real medical data.** These are fictional characters. Keep the clinical detail plausible
  and sober — the docs are a product tour, and a joke diagnosis would undermine the one module
  where trust matters most.

## Assumptions the product owner should confirm

1. **Closure date editability** (above) — the one thing that could change what the Closed list
   can show.
2. **Jamie's 2025/26 availability.** His Goals objective claims 6 days lost that season, while
   this plan gives him nine days of influenza and a three-week modified-training Achilles
   episode in the same window. Modified training isn't "lost", but 9 > 6. Either round the
   influenza down to a long weekend, or accept the looseness — it only bites if a figure ever
   shows both numbers together.
3. **Two athletes with no open problems** (McAdoo Isaac, Bumbercatch Moe) — keeps the empty
   state unmissable, but it's two of six rows. Drop to one if the overview looks thin.
4. **Responsible Staff is free text**, so the values here ("Club physiotherapist", "Club
   doctor", "Consultant orthopaedic surgeon", "Hand clinic — orthopaedics") are invented. If
   the instance has house conventions for this field, use those instead.

---

**Executable form:** `docs-guide/visuals/tooling/seed/medical.mjs` — the same data as a literal,
for the seed driver (coach session required). Not yet runnable: the driver
(`seed/medical-lib.mjs`) is owned by another pass.
