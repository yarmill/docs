# Yarmill Docs — Writing Instructions (v0.11)

> **What this is.** The house guide for writing Yarmill's user docs — for any team member
> or for Claude Code. It lives at `docs-guide/writing-instructions.md` in the docs repo and
> governs *how* to write. The `yarmill-docs` skill points here; read it before any doc work.
>
> **The docs are the React site under `site/`** (Next.js App Router, static export to
> Netlify) — **not Mintlify** (that was removed). Content is `.mdx` under
> `site/content/docs/`, components live in `site/components/mdx/`, and the nav/sidebar is
> driven by `site/.scaffold-ref/docs.json`. See §7 for the output format.
>
> **Companion file.** `docs-guide/master-reference.md` (the *Yarmill Master Reference*) is
> the **baseline source for product facts**, and a **living document**. For *what is true*:
> details provided in the current conversation (the human usually supplies fresher, more
> specific info about the module/feature being documented) **win over the Master
> Reference**; the Master Reference fills in everything not covered in chat. Whenever chat
> info adds to or contradicts the reference, propose updates to it as a secondary
> deliverable (§10) so it stays current.
>
> **Status.** v0.11 — de-Mintlified and reconciled to the React site: §7 rewritten to the
> `site/` output format; the `For/Where` signpost is now the `<PageMeta>` component;
> tutorials/use-cases content types folded into §5; visuals point to the yarmill-design /
> -screenshot / -visuals skills. Voice modeled on Linear's docs; structure on Diátaxis.

---

## 0. How to use this prompt

When asked to write or edit a Yarmill doc page, you (the LLM) should:

1. Gather the facts: **chat-provided details first**, then the **Master Reference**
   for everything else, respecting its tags (CORE/CONFIG/SPORT/ROADMAP).
2. Identify the **content type** (§5) and the **audience** (§3).
3. **Verify against the live product first.** For a module/feature page that depends on
   UI behavior or labels, **ask the user for a live walkthrough before drafting** — an
   authenticated browser session you can explore — and confirm behavior there rather than
   inferring it (§10). If the product isn't reachable, draft from chat + Master Reference
   and mark every unverified UI claim with a TODO.
4. Apply the **configurability rules** (§2) — this is what makes Yarmill docs different
   from documenting a fixed product.
5. Follow **voice & tone** (§4) and **page-writing rules** (§6).
6. Output **MDX for the React site** (§7) modeled on **Appendix A** — frontmatter, the
   `site/components/mdx/` components, the file under `site/content/docs/`, and the matching
   nav entry in `site/.scaffold-ref/docs.json` (every new page needs one or it's hidden).
7. Write **English only** for now, but **translation-ready** (§8), using the
   **glossary** (§9) for terminology.
8. Never invent product behavior. Gaps get **TODO markers** (§10).
9. **Secondary deliverable:** after the page, propose **Master Reference updates**
   capturing anything new or changed that the conversation or walkthrough revealed (§10).
10. Finish against the **pre-publish checklist** (§11).

---

## 1. Product context (verified)

**Yarmill is a sports data platform / athlete-management system** — "not just another
training log." It began as a training log and grew into a unified data hub for sport:
data flows in from many sources (training entries, watches, sleep, tests, race results,
video, wellness, medical), is standardized in one place, and flows out as analytics and
the **Yollanda** AI layer that answers coaching questions in plain language.

**Philosophy that should color the docs:**

- Yarmill **supports** coach decisions; it does **not** replace coach intuition or
  auto-generate plans ("a little art, a little science"). Never write as if the tool
  decides for the coach.
- Built for **serious and professional sport** — not a hobby app, no social sharing.
- Success includes well-being and athletes staying in sport, not only results.

**The canonical model — six areas.** Use this as the docs' information architecture and
mental model:

| Area | Question it answers | Modules |
|---|---|---|
| **Plan** | Season planning & structure | Plan; Season Calendar; Goals |
| **Reality** | What actually happened | Training Log; Attendance; Wellness questionnaire |
| **Results** | Did it produce the effect? | Testing & Diagnostics; Competition Results |
| **Analytics** | Insights that close the loop | Training data; Load & Readiness; sport-specific reports |
| **Medical** | Health records & injury history | Medical Module |
| **Platform Foundation** | The substrate | Integrations; Yollanda (AI); Athlete Profile |

**Core mechanics every writer must know** (all CORE — safe to document as universal):

- **Left side / right side** — the central concept across Plan and Reality. Left =
  free-form text (methodology, notes, in the coach's/athlete's own words). Right =
  numeric data (minutes, km, zones…), with some rows auto-calculated and locked.
- **Three versions of data** — **annual plan** (season-start intention, by
  mesocycle/month), **plan** (operational, week to week), **reality** (what happened).
  The Season review (RTC) compares all three.
- **Copy plan** — the coach's publish action. Planning on the whole group is a private
  sandbox; athletes see changes only after Copy plan. Editing an individual athlete's
  plan is visible to them immediately.
- **Import plan** — the athlete's one-click copy of the planned day into Reality
  (then editable). Can be disabled per instance.
- **Auto-save** — entries save instantly; there is no Save button.
- **HR zones live in Yarmill** — set in Yarmill (not only the watch), with per-activity
  zone sets and validity periods; time-in-zone is computed by Yarmill's own
  brand-independent algorithm. Watch data appears under the entry but does not replace
  filling in the left/right sides.
- **Backfill philosophy** — it's a training *diary*; logging windows are limited
  (commonly ~7 days on web, current day only on mobile) because late entries degrade
  analysis. Reflect this stance in tips.

**Surfaces:**

- **Web app** — the full feature set; primary for coaches and administrators.
- **iOS/Android apps** — athletes only, a limited subset (plan, logging, watch data,
  iOS widget).
- **PWA** — "add to home screen" from the web app; the recommended phone experience for
  coaches, and works for athletes too. Don't forget it when writing "Where" notes.

**Instances & login:** each customer has its own configured instance at
`<slug>.yarmill.com` (the **team URL**). Login is email + password; the mobile app also
asks for the team URL slug (found in the confirmation email). In docs, use a neutral
placeholder like `your-team.yarmill.com` — never a real customer's slug.

**Yollanda** — the in-product AI layer (chat over the athlete's data + how-to guidance,
and chart "Insight" explanations). Athletes can query only their own data; coaches any
athlete they can access. Docs can point readers to Yollanda for quick in-product help,
and these docs may eventually feed it — another reason pages must be precise and
self-contained.

---

## 2. The configurability principle (load-bearing)

**Every Yarmill instance is tailored** — to the sport *and* to the specific
federation/team: which modules are on, which fields exist on the left and right sides,
test and result forms, analytics, even terminology. The same sport differs by
federation. This is the single biggest constraint on how Yarmill docs must be written.

The Master Reference tags every fact; translate the tags into writing behavior:

**[CORE] → document as universal.** Mechanics like left/right side, Copy plan, Import
plan, auto-save, zones, the three data versions, and roles are true everywhere. Write
them in plain declarative voice.

**[CONFIG] → document the mechanism, exemplify the content.** Never present a specific
field list, activity set, test form, or analytic as if every reader has it. Patterns:

- Frame specifics as examples: "your instance might track, for example, …"
- Use the standard caveat callout once per page where it matters:

  ```mdx
  <Info>Yarmill is configured for each team, so the exact fields, activities, and
  names you see may differ from this guide. The mechanics work the same way.</Info>
  ```
- For module availability: "If you don't see this module, it may not be enabled for
  your team — ask your administrator."
- Missing analytics specifically have three usual causes: module not enabled, missing
  permissions, or missing input data. Use this triad in troubleshooting notes.

**[SPORT] → quarantine.** Sport-specific mechanics (biathlon shooting notation,
freestyle trick logging, etc.) never appear in general pages. They live in clearly
scoped sport pages/sections (e.g. a "Sport guides" group), and general pages may link
to them at most.

**[ROADMAP] → never document as current.** If something is tagged ROADMAP in the Master
Reference, it does not go in the docs as an existing feature — at most omit it, or flag
it to the human as "roadmap, confirm status before documenting." Mobile retroactive
logging, WHOOP, plan/planner merge, the new left-side UI, and similar items are in this
category; their status is time-sensitive.

**Screenshots & UI references:** continuous deployment ships multiple times per day and
a UI refresh is rolling out — **two shells currently coexist** (old top-menu UI and the
new left-rail UI; modules migrate one by one). Write so UI drift doesn't break the
page: name the **module and action**, never the shell, menu position, or pixel location
("open **Settings → Applications & devices**", not "click the third icon in the top
bar" or "under Other").

---

## 3. Audiences & roles

All three roles read the same docs. **Don't split the docs *by role*** — most concepts
are shared; a role-first structure would duplicate them and let them drift. Use **one
shared library with role-aware doors**:

- **Organize by topic/feature.** Each concept and task documented once.
- **Role on-ramps.** A "Start here" hub routes each persona to a curated first path.
- **Split inside a page only where the task diverges** (coach on web vs. athlete on
  mobile) using `<Tabs>`, not separate pages.
- **Signpost every page** directly under the lede with the **`<PageMeta>`** component
  (`site/components/mdx/PageMeta.tsx`, global — no import): a two-pill *For / Where* row.
  ```mdx
  <PageMeta audience="Coaches & athletes" where="Web app" />
  ```
  `audience` is a comma/ampersand-joined subset of *coaches, athletes, administrators* (or
  *everyone*); `where` a subset of *Web app, Mobile app, PWA*. Add a permissions note in the
  body where access matters. (Tutorials use `<TutorialMeta>` and use cases `<UseCaseMeta>`
  instead — see §5.)

**The three account types (verified — there are exactly three):**

- **Athlete** — sees but cannot edit the plan; logs Reality; sees only their own data
  and analysis; does not see groups. Uses the mobile app or PWA. Keep athlete content
  short and action-first.
- **Coach** — sees assigned groups; plans (group sandbox + individual), publishes via
  Copy plan; logs training and Attendance; sees Analytics and the Athlete Profile per
  setup. Multiple coaches can share one athlete (e.g. shooting coach + conditioning
  coach); physiotherapists and other staff typically work through coach-type accounts.
  Mostly web. The power users — most depth is for them.
- **Administrator** — full instance editor: adds users, creates groups, grants
  permissions, sends invitations, handles access issues.

**Special cases to handle gracefully:**

- **Self-coached athletes** get a coach account so they can write their own plan and
  reality. When a page says "your coach does X," a self-coached reader does it
  themselves — phrase coach actions so this reads naturally, or note it where confusion
  is likely.
- **Sensitive data** (medical, wellness, menstrual cycle) — visibility depends on
  instance setup and roles. Docs must never imply a fixed visibility rule; say it is
  permission-controlled and configured per team. Use a neutral, clinical, respectful
  tone for these topics.
- **"You can't see it" is usually permissions or configuration** — make this the
  standard first troubleshooting step, pointing to the administrator.

---

## 4. Voice & tone

**Primary model: Linear's docs** — clear, calm, confident, concrete. Two secondary
inspirations, each for one specific strength:

- **Stripe docs** — progressive disclosure and precision: simple happy path first,
  edge cases and exact details afterward, never mixed.
- **Notion & Slack help centers** — warm, task-first writing for non-technical readers;
  the register to keep in mind for athlete-facing pages.

Yarmill's brand is playful and bold; in docs, channel that as *warmth and confidence*,
not jokes or emoji. Yollanda's persona can be playful in-product; the docs describing
her stay precise.

**Principles**

- **Lead with the reader's goal.** Open each page with what they'll be able to do.
- **Second person, present tense, active voice.** "You publish the plan with **Copy
  plan**," not "The plan can be published."
- **Why before how, briefly.** One sentence of rationale before steps builds the mental
  model — this is the Linear move. E.g.: "Planning on the whole group is your private
  sandbox — athletes see nothing until you publish."
- **Be opinionated where Yarmill is.** The product has philosophy: log the same day,
  write reality in your own words, the diary degrades if backfilled late. Use
  "we recommend …" and carry these stances into Tips.
- **Concise.** Cut hedging and filler. One idea per sentence.
- **Concrete over abstract.** Real, sport-plausible examples (a week of roller-ski
  training, an RPE of 7, a 3-week mesocycle) — flagged as examples per §2.
- **No hype, no condescension.** Avoid "simply," "just," "easy," "obviously."

**Do / Don't**

| Do | Don't |
|---|---|
| "Athletes see the plan only after you select **Copy plan**." | "Don't worry — publishing is super easy!" |
| "We recommend logging the same day; entries written a week later are guesses, and guesses degrade your analytics." | "You should probably try to log soon if possible." |
| "Your instance might track, for example, time on snow and time on rails." | "Yarmill tracks time on snow and time on rails." (presents CONFIG as universal) |

---

## 5. Documentation structure (the system)

Use a pragmatic **Diátaxis** split — separate content by reader need; don't mix types
on one page; link between them.

| Type | Reader need | Form |
|---|---|---|
| **Getting started** | "Get me running." | One happy path, step-by-step |
| **How-to guide** | "Help me do this task." | Goal-titled, numbered steps |
| **Concept** | "Help me understand how Yarmill thinks." | Prose + mental model |
| **Reference** | "Give me the exact detail." | Tables, exhaustive, CONFIG-caveated |
| **Tutorial** | "Walk me through this end-to-end job." | A journey: prereqs → steps → outcome (§5.1) |
| **Use case** | "What can someone like me achieve?" | A role story by persona + outcome (§5.2) |

**The three layers, and how they relate.** Module pages are **reference** (what each field
does); **tutorials** are how-to journeys (do this end-to-end task); **use cases** are role
stories (how a national-team coach runs their season, stitched from many modules). One
source of truth per topic: tutorials and use cases *narrate and link*, they never
re-document fields. Cross-link direction — use cases link *down* (to tutorials = "do this",
and to reference = "details"); tutorials link *across* (sibling tutorials) and *down*
(reference); module pages may gain a "See it in action" link *up* to a tutorial/use case.

**Notation references** (a reference sub-genre, proven by the biathlon shooting page):
sport logging grammars and similar input syntaxes are documented like a mini language
spec — an annotated syntax image up top, each token defined with `<ParamField>`
(name, required/optional, accepted values, short examples), then titled code-block
examples ordered simple → complex with `//` comments, and a closing tip on how to
verify the input was parsed correctly.

**Information architecture — the live folder map** (`site/content/docs/<area>/`, mirroring
the canonical six areas; the sidebar order/grouping comes from `site/.scaffold-ref/docs.json`
— §7):

1. **`get-started/`** — Concepts (the hub), role on-ramps (`for-coaches` / `for-athletes`
   / `for-admins`), registration & first steps (profile → connect devices → set HR zones),
   login & team URL.
2. **`plan/`** — `plan` (season top-down, goals/4-week, week; left/right sides; Copy plan &
   individualization; print/export), `season-calendar`, `goals` (objectives & key results).
3. **`reality/`** — `training-log` (daily diary, Import plan, backfill), `attendance`,
   `wellness-questionnaire`.
4. **`results/`** — Testing & Diagnostics forms, Competition Results (manual + imported).
5. **`analytics/`** — training data, Weekly Dashboard, Load & Readiness (Training Load /
   ACWR, Recovery, Wellness, Team Daily Readiness), Season review (RTC). Heavy
   CONFIG-caveating throughout.
6. **`medical/`** — records, statuses, who can see what (permission-controlled).
7. **`platform/`** — the substrate: `yollanda` (what it answers, entry points, limits,
   per-role data access), `integrations` (connect workflow, wearables, HR-zone engine),
   `athlete-profile` (the athlete card + admin: users, groups, permissions), `files`
   (attachments overview; tags, no folders).
8. **`sport-specific/<sport>/`** — quarantined SPORT content (e.g. `biathlon/shooting`).
9. **`tutorials/`** — the **Tutorials space** (§5.1); `index.mdx` gallery + verb-led pages.
10. **`use-cases/`** — the **Use cases space** (§5.2), once built; `index.mdx` + role pages.
11. **`api-reference/`** — API docs (its own space).
12. **`changelog/`** — release notes; generated via the **`yarmill-changelog`** skill.

Mobile/PWA scope isn't a separate area — fold surface differences into the relevant page
with `<Tabs>` and the `<PageMeta where>` line.

**The Concepts page is load-bearing.** It establishes: instance & team URL → groups →
roles → the six areas → plan vs. reality (and the three data versions) → left/right
side → Copy plan / Import plan → zones → configurability itself ("your instance is
tailored"). Everything else leans on it.

**Page anatomy** (every page): frontmatter → 1–2 sentence lede stating the goal →
`<PageMeta>` signpost → optional prerequisites note → body in scannable `##`/`###`
sections → cross-links. Substantial pages lead with a hero figure (§6).

**Length & splitting.** Keep a page to one job. A how-to that needs more than ~7 steps
or starts covering a second task is two pages — split it and cross-link. Concepts pages
can be longer but stay skimmable by heading.

### 5.1 Tutorials (how-to journeys)

A tutorial is **one real coaching/athlete job, single sitting** (~5–6 min), crossing one or
two modules. Short and Linear-clean: a hero, then **one visual roughly every two steps**.
Lives under `site/content/docs/tutorials/`, verb-led slug (`plan-first-week`), shown in the
Tutorials space. Uses **`<TutorialMeta>`** (`site/components/mdx/TutorialMeta.tsx`, global).

**Section contract:** *promise (lede) → `<TutorialMeta>` → hero `<Frame>` → Before you start
(prereqs, `<Info>`) → What you'll do (outcome + a 3–5 bullet "by the end you'll have…") →
Steps (`<Steps>`) → You're done (`<Check>`) → Next steps (`<CardGroup>` of siblings) →
Reference (links down to module pages).*

```mdx
---
title: "Plan and publish your first training week"
description: "Build a week of sessions in Plan and share it with your group — start to finish."
icon: "calendar-week"
---

Short 1–2 sentence promise: what you'll have built by the end.

<TutorialMeta audience="Coaches" time="6 min" modules={["Plan","Season Calendar"]} />

<Frame caption="The finished week — sessions across the microcycle, ready to publish.">
  <img src="/images/tutorials/plan-week/hero.png" alt="…" />
</Frame>

## Before you start
<Info>What you need in place, with links to the relevant reference pages.</Info>

## What you'll do
A one-line outcome + a 3–5 bullet "by the end you'll have…" list.

## Steps
<Steps>
  <Step title="…">… <Frame>…</Frame></Step>
</Steps>

## You're done
<Check>What success looks like and where it now shows up.</Check>

## Next steps
<CardGroup cols={2}>
  <Card title="…" href="/en/tutorials/…" icon="…" />
</CardGroup>

## Reference
- [Plan](/en/plan/plan) · [Season Calendar](/en/plan/season-calendar)
```

### 5.2 Use cases (role stories)

A use case **inspires** — "what can someone like me achieve?" — framed by **persona +
outcome**, not by module. Longer and narrative; stitches several modules into one story and
shows a concrete payoff (a real screen, real numbers). Personas are Yarmill's real
archetypes (national-team/federation coach, youth sport school, club coach, solo/self-coached
athlete, S&C/performance staff, team doctor/physio, club admin). Lives under
`site/content/docs/use-cases/`, role-noun slug (`national-team-coach`), in the Use cases
space. Uses **`<UseCaseMeta>`** (Role / Outcome / Modules).

**Section contract** (the Anthropic 6-section rhythm in product terms): *`<UseCaseMeta>` →
The situation (role + stakes, in their voice) → How Yarmill fits (the modules as a narrated
path, not a feature dump) → A week in the life (the end-to-end loop, shown with a screen +
real numbers) → Going further → Tips for this setup (`<Tip>`) → Start here (`<CardGroup>`
linking down to tutorials + reference).*

> **Prerequisite — build before writing use cases:** the `<UseCaseMeta>` component and the
> Use cases space don't exist yet. Before the first use-case page: (1) add
> `site/components/mdx/UseCaseMeta.tsx` (clone `PageMeta.tsx`; Role / Outcome / Modules
> pills) and register it in `site/mdx-components.tsx`; (2) add a **Use cases** anchor/group
> to `site/.scaffold-ref/docs.json` and a matching `SECTION_DEFS` entry in `site/lib/nav.ts`
> (`{ id: 'use-cases', label: 'Use cases', icon: 'users', groupLabels: ['Use cases'] }`);
> (3) create `site/content/docs/use-cases/index.mdx` (intro + `<CardGroup>` gallery) as the
> space's first page.

True faceted filtering (Anthropic-style Category/Product/Feature) is custom React — skip for
v1; the grouped sidebar + landing `<CardGroup>` cover discovery until the catalogue passes
~25 items.

---

## 6. Page-writing rules

- **Titles**: short, sentence case; how-to titles start with a verb ("Publish a plan
  with Copy plan," "Connect your watch").
- **Lede**: 1–2 sentences, what the reader will accomplish; no heading above it.
- **Headings**: scannable and parallel — skimming only headings should tell the story.
- **Steps**: `<Steps>` for procedures; one action per step; bold the UI target; state
  the visible result where it confirms success ("a green *data saved* indicator
  appears").
- **UI references**: action + destination, not screen positions (§2). Quote in-product
  labels exactly (**Copy plan**, **Import plan**, **Settings → Applications & devices**).
- **Examples**: sport-plausible and explicitly exemplary where CONFIG applies.
- **Callouts**: sparing; never stacked. `<Info>` for the configurability caveat,
  `<Tip>` for Yarmill's recommended practice, `<Warning>` only for destructive or
  data-affecting actions (e.g. attendance-based copy overwriting a self-logged diary).
- **Links**: link first mention of another concept; descriptive text, never
  "click here."
- **Images, lead with them.** Readers scan visuals first, so substantial pages
  (especially module pages) should open with a figure and place more through the flow.
  Two kinds:
  - **Real product screenshots** for "what the screen looks like" — the Linear approach.
    Prefer whole screens over cropped pixels so they age well.
  - **Labeled schematic figures** (hand-authored SVG, in the style of the biathlon
    shooting-syntax image) for "anatomy/structure" — the parts of a screen with their
    labels. Prefer these for structure teaching because, unlike an annotated screenshot,
    a schematic doesn't drift as the UI ships daily.
  - **Always** include meaningful alt text (describe what's shown, not "screenshot") —
    Yarmill invests in accessibility. Wrap every image in `<Frame>` (add a `caption`
    where it helps). Store under `site/public/images/<module>/…`, reference as `/images/…`,
    and mark any non-production image with a `{/* NOTE(yarmill): … mockup … */}` comment.
    Placeholder-mark if unavailable (§10).
  - **How figures are produced — defer to the skills.** Don't hand-author production
    visuals here; the design system lives in the skills:
    - **`anthropic-skills:yarmill-design`** — source of truth for brand tokens, the new UI
      ("GUI 2.0"), and assets (Inter, icons, avatars). Yollanda accent is Blush `#FC7B9B`,
      never indigo.
    - **`yarmill-screenshot`** — a single docs-ready screen: render from design-system HTML,
      frame in minimal Safari chrome with edge bleed/fade, optional callout labels.
    - **`yarmill-visuals`** — annotated stills (callouts, arrows, step badges, spotlight),
      doodles, step sequences, marketing/social compositions, and motion (GIF/MP4/reels).
      This is the skill for tutorial/use-case visuals (hero, per-step stills, walkthroughs).
    Visuals are rendered HTML → headless Chrome PNG. The queued shot list for the module
    pages lives in `docs-guide/visuals/_VISUAL-TODOS.md`. If you can't produce an image, leave
    a `<Frame>{/* TODO(yarmill): … */}</Frame>` placeholder plus an annotation spec (which
    elements to label and the label text) rather than attempting it inline.

---

## 7. Output format — the React site (`site/`)

The docs are a **Next.js App Router** app, statically exported to Netlify. **Not
Mintlify** — never use `mint.json`, a root `docs.json`, or `en/**`/`snippets/` paths. The
custom MDX pipeline uses `next-mdx-remote`, `remark-gfm`, `rehype-slug`, and
`rehype-pretty-code` (Shiki, dual light/dark). Run everything from `site/`:
`npm run dev` (preview at localhost:3000), `npm run build` (static export to `site/out`),
`npm run lint` + `npx tsc --noEmit` (what CI checks; broken MDX/links fail the build).

**Where pages live.** `.mdx` under `site/content/docs/<area>/<slug>.mdx`; the URL is
`/en/<area>/<slug>` (single locale `en`). `kebab-case` filename = URL slug. Home is
`site/content/docs/index.mdx` → `/en`; a section's `index.mdx` → `/en/<area>`. Sport content
is quarantined under `site/content/docs/sport-specific/<sport>/`. Images go in
`site/public/images/…`, referenced as `/images/…`.

**Frontmatter** — `title` + `description` required on every page:

```mdx
---
title: "Publish a plan with Copy plan"
description: "Move your group plan from sandbox to your athletes' view."
---
```

- **`icon:`** on module/landing pages only (e.g. Goals → `bullseye`) — a Font Awesome-style
  name resolved by `site/lib/icons.tsx`; sub-pages and how-tos omit it. Confirm the name
  resolves before relying on it.
- **`sidebarTitle:`** when the sidebar label should differ from the title.
- **`mode: "wide"`** for full-width pages that drop the right-hand TOC (home dashboard,
  changelog).

**Components** live in `site/components/mdx/` and are **global — no imports needed**. Use
them; don't hand-roll HTML:

| Component | Use for |
|---|---|
| `<PageMeta audience where />` | The For/Where signpost under the lede (module/reference pages) |
| `<TutorialMeta>` | The meta row on tutorials (§5.1). `<UseCaseMeta>` is its use-case sibling — **build it first** (§5.2) |
| `<Note>` / `<Info>` | Asides; the standard configurability caveat |
| `<Tip>` | Recommended practice ("we recommend …") |
| `<Warning>` | Destructive/data-affecting actions only |
| `<Check>` | Success confirmation |
| `<Steps>` + `<Step>` | Any multi-step procedure |
| `<Tabs>` + `<Tab>` | Role/surface splits (Coach · Web / Athlete · Mobile) |
| `<Accordion>` | FAQs, optional depth, troubleshooting |
| `<Card>` / `<CardGroup>` | Hub/overview/landing pages |
| `<Columns>` | Side-by-side content |
| `<Frame>` | Every image/screenshot (with `caption` where it helps) |
| `<ParamField>` | A set of fields/attributes — module fields, key-result fields, notation tokens (name, required/optional, accepted values, default) |
| `<Update>` | Changelog entries (via the `yarmill-changelog` skill) |

The available set is whatever exists in `site/components/mdx/` and is registered in
`site/mdx-components.tsx` — check there before using a component, and don't invent new ones
(add a real component first if genuinely needed). For notation examples, use fenced code
blocks with a `title="…"` and `//` comments; prefer the `text` language for plain notation.

**Navigation & spaces.** Order, grouping, and the Linear-style sidebar **spaces** (the
footer tab switcher: Docs · Tutorials · API Docs · Changelog) are driven by
**`site/.scaffold-ref/docs.json`** — `navigation.languages[0].anchors[].groups[].pages[]`,
where each page ref is a content path like `en/plan/goals`. `site/lib/nav.ts` reads this
file to build the tree, and `SECTION_DEFS` in `nav.ts` promotes named anchors/groups into
spaces. **Pages don't appear automatically — every new page must be added to
`.scaffold-ref/docs.json` or it's unreachable** (an unlisted page is hidden, which can be
deliberate). A brand-new *space* needs both a new anchor/group there and a `SECTION_DEFS`
entry in `nav.ts` (see §5.2 for the use-cases example).

**Don't:** use `mint.json` or a root `docs.json`; reference `en/**` filesystem paths (URLs
use `/en/…` but files live under `site/content/docs/…`); emit raw styled HTML; invent
components; omit frontmatter; add a page without its `.scaffold-ref/docs.json` entry.

---

## 8. Localization (English-first, translation-ready)

The site is **English-only today** — a single locale `en` (see `site/lib/content.ts`); all
content lives under `site/content/docs/` and URLs are `/en/…`. Target languages later:
**Czech, English, German, Slovak**. Write English now, but so translation is cheap:

- Self-contained sentences; no idioms or wordplay; no interpolated sentence fragments.
- **UI labels are per-instance-language.** A Czech instance shows *Skutečnost*,
  *Plán*, *Termínovka*, *Docházka*, *Kartotéka* where English docs say Training Log,
  Plan, Season Calendar, Attendance, Athlete Profile. English docs use the **canonical
  EN module names** (§9) consistently — the Master Reference's name map becomes the
  translators' terminology table later, so never improvise synonyms.
- Locale-neutral examples; note where dates/numbers/units localize.

> **Multi-locale isn't wired yet.** The content layer and routing assume one locale. When
> additional languages are added, decide the directory/routing scheme then (likely a
> sibling locale dir + a locale switch in the chrome) — don't author `cs/…`, `de/…`,
> `sk/…` trees until that's built. Flag it when the need arrives.

---

## 9. Terminology & house style

**Glossary — canonical EN terms (verified against the Master Reference):**

- **Instance** — a customer's configured Yarmill environment at its own **team URL**
  (`<slug>.yarmill.com`). Prefer "instance"/"team" over "workspace."
- **Group** — the coach's organizing unit of athletes. Athletes don't see groups.
- **Athlete / Coach / Administrator** — the three account types.
- **Plan** — the planning module; also the operational plan itself.
- **Annual plan / plan / reality** — the three comparable versions of training data.
- **Training Log / Reality** — the daily diary of what actually happened.
- **Left side / right side** — text side vs. data side of a day's entry.
- **Copy plan** — coach action: publish the sandbox plan to athletes.
- **Import plan** — athlete action: copy the planned day into Reality.
- **Season Calendar** — full-season events scaffold (camps, races, testing…).
- **Goals** — objectives with **key results** (initial/current/target).
- **Attendance** — participation tracking (morning/afternoon).
- **Wellness questionnaire (ASMR)** — short daily morning self-report.
- **Testing & Diagnostics / Competition Results** — configurable forms + tables.
- **Medical Module** — clinical records; permission-gated.
- **Athlete Profile** — the central athlete card.
- **Files** — all attachments; tags/labels, deliberately no folders.
- **Yollanda** — the AI layer (this spelling only).
- **Season review (RTC)** — annual cycle evaluation, plan/reality side by side.
- **Mesocycle / microcycle / training phase** — season → week → within-day blocks.
- **HR zones / zone validity periods** — set per activity in Yarmill, dated.
- **RPE / sRPE** (Borg CR10, 0–10) · **TRIMP** · **ACWR** (acute:chronic workload
  ratio; <0.8 / 0.8–1.3 / >1.3 zones) — expand each abbreviation on first use per page.

**House style**

- Sentence case for titles and headings.
- **UI labels** bold with in-product casing on instructional use.
- Keys/literals as `code`.
- Numbers: spell out one–nine in prose; digits with units (5 km, 30 min, 3 × 400 m).
- Oxford comma. **"We" = Yarmill, "you" = the reader.** No emoji in doc body.
- Placeholder team URL: `your-team.yarmill.com`. Support contact: `hello@yarmill.com`.

---

## 10. Knowledge sources, uncertainty & keeping the reference current

Order of truth: **(1) details provided in the current conversation → (2) the live
product → (3) the Master Reference → (4) nothing else.** The human typically supplies
fresher, more specific information about the module/feature at hand — that wins. The
Master Reference fills in everything not covered in chat. General training-methodology
knowledge may inform tone and examples, but no product claim may rest on it.

**When chat contradicts an established [CORE] fact, don't override silently.** Flag the
discrepancy to the human in a sentence — the product may have changed, or it may be a
slip — proceed with the chat version for the page, and propose the reference update
(§10 update block). Silent overrides are how the reference quietly goes wrong.

- The Master Reference is dated and tagged. Respect its tags (§2). Anything ROADMAP or
  flagged time-sensitive: verify with the human before documenting.
- Anything **not covered by chat or the Master Reference** and not confirmed by the
  human gets a marker, never a guess:
  - `{/* TODO(yarmill): verify exact label / limit / behavior */}` inline;
  - `<Frame>{/* TODO(yarmill): screenshot of … */}</Frame>` for missing images.
- If a request can't be completed without missing facts, say so and list exactly what's
  needed. **A page of honest TODOs is useful; confident fabrication is harmful.**

**Keeping the Master Reference current (standing secondary task).** Conversations are
ephemeral; the reference is the durable memory. It's now an in-repo file
(`docs-guide/master-reference.md`), so you can **apply** updates directly in the same
change — but still surface them in a short **"Suggested Master Reference updates"** block so
the human can review what changed. Do this when the conversation revealed anything the
reference lacks or gets wrong:

- **What to capture:** new facts, corrections, renamed UI labels, changed limits,
  ROADMAP items that shipped (retag to CORE/CONFIG), new modules/integrations.
- **Format:** the target section of `docs-guide/master-reference.md`, the new text with the
  appropriate tag ([CORE]/[CONFIG]/[SPORT]/[ROADMAP]), and for corrections the old line →
  new line.
- **Scope:** durable product facts only — not one-off examples, drafting decisions, or
  style matters (those belong in *this* file).
- If nothing new surfaced, say so in one line rather than inventing updates.

**Verifying against the live product (preferred for module/feature pages).** When the
live product is reachable and the page depends on UI behavior or labels, verify there
instead of inferring — and **ask for it before drafting** (§0). The loop:

- **Ask for a walkthrough.** Request an authenticated browser session and explore it.
  The user logs in; never enter credentials yourself. Where the view differs by role,
  check **every role the page serves** (e.g. coach *and* athlete).
- **Verify before asserting.** Confirm each label, limit, state list, default, and flow
  in the UI before stating it or clearing a `TODO`. Don't promote a guess to a fact
  because it seems likely.
- **Sandbox writes; read real data.** Make create/edit/delete actions only on the
  **test account the user designates**; keep real accounts **read-only**; pause before
  irreversible actions. Don't reproduce an individual's sensitive data in the docs — use
  it only as inspiration if the user has allowed it.
- **Feed findings both ways.** Clear the verified `TODO`s on the page *and* capture the
  durable facts in the Suggested Master Reference updates block.
- If no walkthrough is possible, proceed from chat + reference and leave the UI specifics
  as `TODO`s rather than inventing them.

---

## 11. Pre-publish checklist

- [ ] Facts follow the order of truth (§10): chat-provided details win, Master
      Reference fills the rest; tags respected.
- [ ] "Suggested Master Reference updates" block included (or an explicit "nothing
      new") when delivering a page.
- [ ] CONFIG content framed as example, with the standard `<Info>` caveat where needed.
- [ ] No ROADMAP feature documented as current; no SPORT content outside sport pages.
- [ ] Correct content type (§5); page in the right IA section.
- [ ] Frontmatter present (`title` + `description`); lede states the goal; `<PageMeta>`
      signpost present (or `<TutorialMeta>`/`<UseCaseMeta>` for those types).
- [ ] Headings scannable; steps in `<Steps>`, one action each, UI targets bolded.
- [ ] UI referenced by action + destination, not screen position.
- [ ] Voice: second person, present, active, opinionated where Yarmill is, no hype.
- [ ] Terminology matches §9 (Copy plan, Import plan, left/right side, Yollanda…).
- [ ] Sensitive-data topics phrased as permission-controlled, tone respectful.
- [ ] File under `site/content/docs/…`; added to `site/.scaffold-ref/docs.json`;
      `npm run build` + `npm run lint` + `npx tsc --noEmit` pass; English, translation-ready.
- [ ] Live product checked where reachable (walkthrough requested before drafting); UI
      claims verified, not inferred — or noted why not.
- [ ] Unknowns marked `TODO(yarmill)` — nothing fabricated.

---

## Appendix A — Model page (gold standard)

When in doubt, match this. It shows the full assembly: frontmatter, lede, signpost, a
configurability caveat, why-before-how, `<Steps>` with bolded UI targets and a result, a
Yarmill-philosophy `<Tip>`, a TODO marker, and cross-links. (Content is illustrative; the
mechanics it describes — Copy plan, the sandbox, immediate individual edits — are CORE.)

````mdx
---
title: "Publish a plan with Copy plan"
description: "Move your group plan from your private sandbox to your athletes' view."
---

When you plan for a whole group, it stays in your private sandbox — athletes see nothing
until you publish with **Copy plan**. This guide shows how to publish a week and hold
back days that aren't ready.

<PageMeta audience="Coaches" where="Web app" />

<Info>Yarmill is configured for each team, so the exact fields and activity names you
see may differ from this guide. The mechanics work the same way.</Info>

## Publish a week to your group

<Steps>
  <Step title="Open the group plan">
    In **Plan**, select your group and open the week you want to publish.
  </Step>
  <Step title="Select Copy plan">
    Choose **Copy plan** (top right). Your athletes receive the week as planned.
    {/* TODO(yarmill): confirm the exact label and position of the Copy plan control. */}
  </Step>
  <Step title="Hold back unfinished days">
    Exclude any days still in progress (for example Friday–Sunday), so athletes only see
    finished plans.
  </Step>
</Steps>

<Tip>Publish early, then individualize — editing one athlete's plan is visible to them
immediately, with no need to publish again.</Tip>

## Individualize after publishing

Selecting a single athlete and editing their plan changes only their copy — use it to
tailor load or activities without touching the group.

Next: [Build a season plan](/en/plan/season-plan) ·
[How plan and reality relate](/en/get-started/concepts)
````

---

### Changelog of this prompt
- **v0.11** — **De-Mintlified and reconciled to the React site.** The docs are now the
  Next.js app under `site/`, not Mintlify. §7 rewritten end-to-end to the real output
  format (`site/content/docs/**.mdx`, the `site/components/mdx/` component set, nav driven
  by `site/.scaffold-ref/docs.json` + `lib/nav.ts` spaces, `npm run build`/`lint`/`tsc` as
  validators). The `For/Where` signpost is now the **`<PageMeta>`** component (§3, §6,
  Appendix A, checklist). Folded the tutorials & use-cases proposal into §5 as two content
  types with section contracts and templates (§5.1 Tutorials → `<TutorialMeta>`; §5.2 Use
  cases → `<UseCaseMeta>`, with a build-first prerequisite); the example kick-off set was
  dropped. §6 figure production now defers to the **yarmill-design / -screenshot / -visuals**
  skills (not Claude Design). §8 reflects English-only single-locale reality. §10 notes the
  Master Reference is now the in-repo file `docs-guide/master-reference.md` (apply + surface
  updates). File relocated to `docs-guide/writing-instructions.md`; the `yarmill-docs` skill
  points here.
- **v0.10** — From the full product walkthrough: added **Files** to the §5 IA; the
  UI-drift rule now names the dual-shell transition explicitly (never reference a shell
  or menu position — name the module and action).
- **v0.9** — Added a live-product verification workflow (§0 step 3, §10, checklist): for
  UI-dependent module/feature pages, ask for an authenticated walkthrough *before*
  drafting; verify labels/flows in the UI before asserting them; sandbox all writes on a
  designated test account, keep real accounts read-only; check every role the page serves;
  feed findings into both the page and the reference.
- **v0.8** — Labeled real-UI figures (annotated product screens) are produced in Claude
  Design from a reusable brief template, not hand-drawn; schematic SVGs remain for pure
  structure diagrams. Captured the callout-style-consistency rule.
- **v0.7** — Module-level pages get a frontmatter `icon` (Font Awesome name matching the
  in-app glyph). Generalized `<ParamField>` to any field/attribute reference (module
  fields, key-result fields, notation tokens). Added an images-first guideline: real
  screenshots for "what the screen looks like," hand-authored labeled SVG schematics for
  "anatomy/structure," always alt text, and the constraint that raster screenshots can't
  be auto-annotated (supply an annotation spec instead).
- **v0.6** — Added Appendix A (gold-standard model page). Fixed version drift (Status
  was v0.3). Reconciled §0 with the undecided structure (paths are provisional). Pinned
  the `For/Where` signpost format. Added: flag chat↔[CORE] contradictions instead of
  overriding silently (§10); page length/splitting rule (§5); mandatory meaningful alt
  text (§6).
- **v0.5** — Correction: the live docs.yarmill.com structure is obsolete and must not
  be copied; paths now follow the §5 IA pending a new structure proposal. docs.yarmill.com
  confirmed as the publishing target.
- **v0.4** — Patterns learned from the live biathlon shooting page: notation-reference
  sub-genre (`<ParamField>` tokens, annotated syntax image, simple→complex titled
  examples, verify-the-parse tip). *(Note: the file-path change in this version was
  superseded by v0.5 — paths are not aligned to the live structure.)*
- **v0.3** — New order of truth: chat-provided feature details override the Master
  Reference; added the standing secondary task of proposing Master Reference updates
  after each docs page, with format and scope rules.
- **v0.2** — Rebuilt on the verified Master Reference: real six-area model, core
  mechanics (left/right side, three data versions, Copy plan/Import plan, zones),
  verified roles and glossary; added the configurability principle (§2) with
  CORE/CONFIG/SPORT/ROADMAP writing rules, sensitive-data handling, UI-drift-proof
  writing, knowledge-source hierarchy; added Stripe and Notion/Slack as secondary
  voice inspirations.
- **v0.1** — Initial draft: Linear voice, Diátaxis structure, Mintlify output,
  English-first localization.