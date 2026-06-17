# Round Two — Tutorials & Use Cases for Yarmill Docs

A concrete, opinionated proposal for adding two new content types to the Yarmill
Mintlify docs, modelled on Anthropic's **Tutorials** and **Use Cases** resources, adapted
to Yarmill's product, personas, and the existing Linear-style module pages.

Status: proposal only. No docs pages were edited.

---

## 1. What Anthropic does (the patterns worth copying)

I studied both landing pages and several individual entries (e.g. the *Delegating your
first task in Cowork* tutorial and the *Draft a credit memo with Claude for Excel* use
case). The structural takeaways:

### Tutorials (`/resources/tutorials`)
- **Intent:** build a skill. "Build your skills through written guides and video lessons,
  from quick tasks to complex workflows." Teaching-first, product-feature-first.
- **Landing:** a filterable gallery. Filters along three axes — **Category** (by
  industry/function: Engineering, Finance, Healthcare, Marketing, Sales…), **Product**
  (Claude Code, Claude in Excel, Cowork…), and **Feature** (Artifacts, Connectors,
  Projects, Skills). Cards are *minimal*: thumbnail, title, category label, "Read
  tutorial". No description, no difficulty, no audience on the card.
- **Page:** short. Breadcrumb → title → thin **metadata bar** (category + product +
  "5 min" time) → one-line "what this covers" intro → the lesson (often a video or a small
  set of screenshots, not a long numbered walkthrough) → **Related tutorials** (4 cards).
- **Formula:** one task, one sitting, ~5 min, one or two visuals, ends by pointing at
  siblings. Quick and skimmable over exhaustive.

### Use Cases (`/resources/use-cases`)
- **Intent:** inspire. An "inspirational gallery" of *what you can get done*, framed by
  outcome and by who you are, not by which button to press.
- **Landing:** same multi-axis filtering, but cards are **richer** — thumbnail, title,
  1–2 sentence description, author, **model**, feature tags, "Read use case". ~16 per page,
  paginated.
- **Page:** longer (~2k words), and crucially it follows a **fixed 6-section formula**:
  1. **Describe the task** — the real-world job, framed by role + outcome.
  2. **Give Claude context** — what to feed it (files, connectors, prior data).
  3. **What Claude creates** — the concrete deliverable, with a *sample output shown*.
  4. **Follow-up prompts** — how to iterate.
  5. **Tricks, tips, and troubleshooting.**
  6. **Related use cases.**
- It opens with a **persona + outcome** framing ("$25M revolver renewal, committee
  Thursday — walk me through the credit") and shows a **real example with sample results**.

### Tutorials vs Use Cases — the distinction to preserve
| | Tutorials | Use Cases |
|---|---|---|
| Answers | "How do I *do* this task?" | "What can *someone like me* achieve, and is it for me?" |
| Organised by | Task / feature | **Persona / role + outcome** |
| Length | Short, single sitting | Longer, narrative, end-to-end |
| Card metadata | Minimal | Rich (description, role, outcome) |
| Cross-links | Sibling tutorials | Down into reference + relevant tutorials |
| Mintlify analogue | `<Steps>` journey | annotated scenario + `<CardGroup>` to modules |

**Mapping to Yarmill's three layers:** module pages = **reference** (what each field
does); tutorials = **how-to journeys** (do this end-to-end task); use cases = **role
stories** (here's how a national-team coach runs their season in Yarmill, stitched from
many modules).

---

## 2. Tutorials for Yarmill

### 2.1 The catalogue (task-based, end-to-end)

Each is a single, real coaching/athlete job that crosses one or two modules. Candidate set:

**Plan & season setup**
- Plan and publish your first training week
- Build your season structure in the Season Calendar
- Set season goals with your athlete (and review them at the end)

**Daily loop (Reality)**
- Log a training session as an athlete
- Set up the morning wellness questionnaire and read it
- Track attendance for a squad

**Devices & data**
- Connect a watch and read recovery
- Import results and read them on the results board

**Analytics & review**
- Read the team daily readiness board before you plan
- Spot training-load risk (ACWR) for an athlete
- Run an end-of-season review

**Medical**
- Record an injury and watch it flow into readiness

**Yollanda**
- Check a goal (or plan) against your team methodology with Yollanda

### 2.2 Tutorial page template

Keep it short and Linear-clean. Reuse existing components; the only new thing is a
`<TutorialMeta>` snippet (see §5). Visual cadence: **a hero, then one image roughly every
two steps** — matching `goals.mdx`.

```mdx
---
title: "Plan and publish your first training week"
description: "Build a week of sessions in Plan and share it with your group — start to finish."
icon: "calendar-week"          # Font Awesome
---

Short 1–2 sentence promise: what you'll have built by the end.

import { TutorialMeta } from "/snippets/tutorial-meta.jsx";

<TutorialMeta audience="Coaches" time="6 min" modules={["Plan","Season Calendar"]} />

<Frame caption="The finished week — sessions laid out across the microcycle, ready to publish.">
  <img src="/images/tutorials/plan-week/hero.png" alt="…" />
</Frame>

## Before you start
<Info>What you need in place: a group with athletes, and a season created in the
Season Calendar. New to those? See [Plan](/en/plan/plan).</Info>

## What you'll do
A one-line outcome statement + a 3–5 bullet "by the end you'll have…" list.

## Steps
<Steps>
  <Step title="Open Plan and pick the week">…<Frame>…</Frame></Step>
  <Step title="Add sessions to the microcycle">…</Step>
  <Step title="Set load and content for each session">…<Frame>…</Frame></Step>
  <Step title="Publish to the group">…</Step>
</Steps>

## You're done
<Check>What success looks like + where it now shows up (e.g. athletes see it in their
feed; it feeds [Analytics](/en/analytics/analytics)).</Check>

## Next steps
<CardGroup cols={2}>
  <Card title="Log a session as an athlete" href="/en/tutorials/log-a-session" icon="dumbbell" />
  <Card title="Read team readiness" href="/en/tutorials/read-readiness" icon="gauge" />
</CardGroup>

## Reference
- [Plan](/en/plan/plan) · [Season Calendar](/en/plan/season-calendar)
```

**Section contract:** *promise → meta → hero → Before you start (prereqs) → What you'll do
(outcome) → Steps → You're done (`<Check>`) → Next steps (`<CardGroup>`) → Reference
links.* This adds the two things Anthropic's tutorials imply but Yarmill module pages
lack: an explicit **prerequisites** block and an explicit **outcome** block.

---

## 3. Use Cases for Yarmill

### 3.1 Framed by persona + outcome (not module)

The personas are Yarmill's actual buyer/user archetypes:

- **For a national-team / federation coach** — run a centralised programme across many
  athletes and external clubs; readiness and medical availability before camps.
- **For a youth sport school / academy** — many groups, attendance and wellness
  monitoring, parent/athlete accountability, long-horizon development.
- **For a club coach with one squad** — the weekly plan → log → review loop for a single
  group.
- **For a solo athlete / self-coached athlete** — own plan, own log, own goals, watch
  data, no group switcher.
- **For an S&C / performance staff member** — load management and analytics across squads.
- **For a team doctor / physio** — the medical log and how it gates training.
- **For a club admin** — set up the instance, groups, users, integrations.

### 3.2 Use-case page template (Yarmill adaptation of the 6-section formula)

Anthropic's six sections are Claude-prompting-shaped. The Yarmill analogue keeps the same
*rhythm* — situation → setup → outcome → iterate → tips → related — but in product terms:

```mdx
---
title: "For a national-team coach"
description: "Run a centralised programme across athletes and external clubs — and know who's ready before every camp."
sidebarTitle: "National-team coach"
icon: "flag"
---

import { UseCaseMeta } from "/snippets/use-case-meta.jsx";

<UseCaseMeta role="National-team coach" outcome="Camp-ready squad, every camp"
  modules={["Plan","Medical","Analytics","Attendance"]} />

## The situation            {/* = "Describe the task": role + outcome, concrete */}
A 2–3 sentence scenario in the coach's voice. Real stakes, a real moment ("two weeks
out from a World Cup camp, athletes spread across five home clubs").

## How Yarmill fits         {/* = "Give Claude context": what you set up / feed in */}
The modules that carry this persona, as a short narrated path — not a feature dump.

## A week in the life       {/* = "What Claude creates": the concrete payoff, shown */}
The end-to-end loop with one or two real screenshots and real numbers
(e.g. "the readiness board shows 9 green, 2 amber, 1 out — ACWR 1.3 on Nordvik").

## Going further            {/* = "Follow-up": deepen / scale */}
Next moves once the basics run (methodology checks via Yollanda, season review).

## Tips for this setup      {/* = "Tricks & troubleshooting" */}
<Tip>…instance-specific gotchas, perms, config notes.</Tip>

## Start here               {/* cross-link DOWN into tutorials + reference */}
<CardGroup cols={2}>
  <Card title="Read team readiness" href="/en/tutorials/read-readiness" icon="gauge" />
  <Card title="Record an injury" href="/en/tutorials/record-injury" icon="briefcase-medical" />
  <Card title="Analytics reference" href="/en/analytics/analytics" icon="chart-line" />
  <Card title="Medical reference" href="/en/medical/medical-module" icon="briefcase-medical" />
</CardGroup>
```

**Cross-linking rule:** use cases link *down* (to tutorials = "do this", and to module
reference = "details"); tutorials link *across* (sibling tutorials) and *down* (reference);
module pages keep their existing "How it connects" sections and may gain a "See it in
action" link *up* to the relevant tutorial/use case. One source of truth per topic
preserved — use cases narrate and point, they don't re-document fields.

---

## 4. Information architecture (docs.json)

Add a new top-level **anchor** rather than burying these under Guides — it mirrors
Anthropic's separation and keeps "reference vs journeys" legible in the nav.

Recommended: **one new anchor "Guides"** is already taken by the module reference. So
rename the existing module anchor's role conceptually and add a sibling anchor:

- Keep current anchor **`Guides`** (`book-open-cover`) = module reference (unchanged).
- Add anchor **`Tutorials`** (`graduation-cap`) with groups mirroring the catalogue
  buckets: *Get going*, *Daily loop*, *Data & devices*, *Review*.
- Add anchor **`Use cases`** (`users` / `flag`) with a single flat group *By role*.

```jsonc
{
  "anchor": "Tutorials",
  "icon": "graduation-cap",
  "groups": [
    { "group": "Get going", "pages": [
        "en/tutorials/plan-first-week",
        "en/tutorials/season-structure",
        "en/tutorials/set-season-goals" ] },
    { "group": "The daily loop", "pages": [
        "en/tutorials/log-a-session",
        "en/tutorials/wellness-setup",
        "en/tutorials/track-attendance" ] },
    { "group": "Data & devices", "pages": [
        "en/tutorials/connect-a-watch",
        "en/tutorials/import-results" ] },
    { "group": "Read & review", "pages": [
        "en/tutorials/read-readiness",
        "en/tutorials/acwr-risk",
        "en/tutorials/record-injury",
        "en/tutorials/end-of-season-review" ] }
  ]
},
{
  "anchor": "Use cases",
  "icon": "users",
  "groups": [
    { "group": "By role", "pages": [
        "en/use-cases/national-team-coach",
        "en/use-cases/youth-sport-school",
        "en/use-cases/club-coach",
        "en/use-cases/solo-athlete",
        "en/use-cases/sc-staff",
        "en/use-cases/team-doctor",
        "en/use-cases/club-admin" ] }
  ]
}
```

Files live under `en/tutorials/` and `en/use-cases/`. Images under
`images/tutorials/<slug>/` and `images/use-cases/<slug>/`. Naming: tutorial slugs are
verb-led (`plan-first-week`); use-case slugs are role nouns (`national-team-coach`).

If a separate anchor feels heavy this early, the fallback is **two new groups under the
existing Guides anchor** ("Tutorials", "Use cases") placed above "Get started" — trivial
to start, easy to promote to anchors later.

---

## 5. Mintlify feasibility

**Trivial (no new tech):**
- New `.mdx` pages, frontmatter, `<Steps>`, `<Frame>`, `<Card>/<CardGroup>`, `<Info>`,
  `<Tip>`, `<Check>`, `<Columns>`, `<Tabs>`, `<Accordion>` — all already in use.
- New anchors/groups in `docs.json` — pure config.
- Cross-links via root-relative `/en/…` paths.

**Small custom work (one-time, mirrors existing `page-meta.jsx`):**
- `snippets/tutorial-meta.jsx` — a pill row showing **For / Time / Modules** (clone of
  `PageMeta`; add a clock pill and render `modules[]` as small pills). ~30 min.
- `snippets/use-case-meta.jsx` — pill row showing **Role / Outcome / Modules**. Same
  pattern.
- Optional: a thumbnailed **gallery card** look for the landing index pages. Mintlify
  `<Card>` with an `img` gets ~80% of the Anthropic card; a custom snippet only needed if
  we want the description+tag chrome.

**Not natively available (don't block on it):**
- True faceted **filtering** (Anthropic's Category/Product/Feature filters) is a custom
  JS/React feature Mintlify doesn't ship. Skip for v1 — the grouped nav + landing
  `<CardGroup>` pages cover discovery. Revisit only if the catalogue grows past ~25 items.
- Video hosting/embeds: fine via standard embeds, but Yarmill's strength is rendered
  screenshots (yarmill-design pipeline), so start image-led, add video later.

**Each new content type needs a landing/index page** (`en/tutorials/index.mdx`,
`en/use-cases/index.mdx`) — a short intro + `<CardGroup>` gallery — set as the first page
in its anchor.

---

## 6. Prioritised starter set

Write these first; they cover the highest-traffic jobs and seed the cross-link graph.

**Tutorials (write 5):**
1. **Plan and publish your first training week** — the #1 coach activation task; anchors
   the whole "get going" path.
2. **Log a training session as an athlete** — the #1 athlete task; the other half of the
   daily loop.
3. **Connect a watch and read recovery** — highest "wow", drives integrations + analytics;
   common pre-sales question.
4. **Read the team daily readiness board** — the payoff that ties Wellness + Medical +
   Analytics together; coaches' daily landing.
5. **Set season goals with your athlete** — already strong reference exists (`goals.mdx`)
   to link into; high-value pre/post-season moment.

*(Why these five: together they span Plan, Reality, Integrations, Analytics, Goals — so
every starter use case below has at least two tutorials to link down to.)*

**Use cases (write 3):**
1. **For a club coach with one squad** — the most common buyer; maps cleanly onto
   tutorials 1, 2, 4. Lowest risk, validates the template.
2. **For a national-team / federation coach** — the flagship/aspirational story; showcases
   Medical + Analytics + Attendance across clubs. Strong for sales.
3. **For a solo athlete** — distinct, simple persona (no group switcher); reuses tutorials
   2 and 3; proves the template stretches to the athlete side.

---

## 7. Example skeletons (real Yarmill content)

### 7.1 Sample tutorial — *Connect a watch and read recovery*

> **Promise:** Pair an athlete's watch, let it sync overnight, and read their recovery and
> sleep the next morning — without typing a number.
>
> **Meta:** For *Coaches & athletes* · *5 min* · Modules *Integrations, Analytics, Athlete
> profile*
>
> **Before you start** `<Info>`: The athlete needs a supported device account (Garmin,
> Polar, etc.) and the right permission to connect it. Which providers are available is
> **configured per team** — see [Devices & integrations](/en/platform/integrations).
>
> **What you'll do:** By the end you'll have a watch linked to the athlete's profile,
> overnight data flowing in automatically, and recovery + sleep visible on the readiness
> board.
>
> **Steps** `<Steps>`:
> 1. *Open the athlete's profile and find Integrations* — where the connect buttons live.
> 2. *Connect the provider* — OAuth handoff to the device account; consent; return.
> 3. *Confirm data is flowing* — first sync lands overnight; a `<Tip>` on what "no data
>    yet" means.
> 4. *Read recovery the next morning* — open [Analytics](/en/analytics/analytics) →
>    readiness; recovery/sleep now sit beside wellness and load.
>
> **You're done** `<Check>`: Overnight recovery and sleep now populate automatically and
> feed the morning readiness board — one fewer thing for the athlete to log.
>
> **Next steps** `<CardGroup>`: *Read team readiness* · *Set up the wellness questionnaire*.
>
> **Reference:** [Integrations](/en/platform/integrations) ·
> [Analytics](/en/analytics/analytics) · [Athlete profile](/en/platform/athlete-profile).

*(All device specifics and the exact provider list stay in the Integrations reference;
the tutorial links, it doesn't restate — and anything unconfirmed gets a
`{/* TODO(yarmill): verify provider OAuth flow */}`.)*

### 7.2 Sample use case — *For a club coach with one squad*

> **Meta:** Role *Club coach* · Outcome *A weekly loop that runs itself* · Modules *Plan,
> Training Log, Wellness, Analytics*
>
> **The situation:** You coach one squad of 14. Mondays you set the week; through the week
> athletes log what they actually did and how they feel; Sunday you want to know whether
> the plan landed — without chasing spreadsheets.
>
> **How Yarmill fits:** Plan holds the week you intend; the Training Log and Wellness
> questionnaire capture what really happened and how athletes are coping; Analytics turns
> the two into a planned-vs-actual and a load picture for the squad.
>
> **A week in the life:** Monday — build the microcycle in [Plan] and publish to the
> group. Tue–Sat — athletes log sessions; the morning wellness check rolls up to a squad
> view. Sunday — open readiness: *11 green, 2 amber, 1 flagged*; one athlete's ACWR at 1.4
> tells you to back off next week. Adjust Monday's plan accordingly.
>
> **Going further:** Set squad goals at season start and evaluate them at the end
> ([Goals]); let [Yollanda] check the plan against your methodology.
>
> **Tips for this setup** `<Tip>`: With a single group you can skip the group switcher —
> set your default group once. Wellness questions are configured per team.
>
> **Start here** `<CardGroup>`: *Plan your first week* · *Log a session (share with
> athletes)* · *Read team readiness* · *Plan reference*.

---

## 8. Recommended sequencing

1. Add `tutorial-meta.jsx` + `use-case-meta.jsx` snippets (clone `page-meta.jsx`).
2. Create `en/tutorials/` + `en/use-cases/` dirs and the two index landing pages.
3. Wire the two new anchors into `docs.json`.
4. Write the 5 starter tutorials, then the 3 starter use cases (use cases link into the
   tutorials, so tutorials first).
5. Add "See it in action" up-links from the relevant module reference pages.
6. `mint broken-links` must pass before commit.

All product claims to be checked against the Yarmill Master Reference; mark anything
unverified with `{/* TODO(yarmill): verify … */}` per CLAUDE.md.
