# Changelog automation — architecture & requirements

**Status:** proposal (2026-06-16). Owner: Tomáš. Focus here is **structure & content**;
visual design of entries is deferred and solved later with the React docs portal.

## 1. Goal

Two deliverables, one pipeline:

1. **Initial load** — generate ~12 months of Linear-style changelog entries into the
   React docs site's Changelog space (`site/content/docs/changelog/`).
2. **Ongoing automation** — a system that runs on a schedule (target: **biweekly**),
   monitors Linear for newly-completed user-facing work, drafts on-brand English
   entries, and opens a **draft PR** for human approval. Nothing auto-publishes.

The same pipeline serves both — the initial load is just the first (large) run.

## 2. Source-data reality (why the design is shaped this way)

From the pull on 2026-06-16 (2,455 completed issues since 2023):
- ~all work is in the **Engineering** team; titles are mostly **Czech** → drafting must
  translate + rewrite into English product copy.
- **Linear projects are recurring monthly ops buckets**, not features, and carry no
  descriptions/updates → narrative comes from the **issues' own descriptions**.
- **Labels** are `task` vs `bug`, not Feature/Improvement/Bug → bug→Fixes, else→change;
  headline-worthiness comes from the **project base-name category map**, not labels.
- The majority is **per-instance config/onboarding** work → dropped (Yarmill is
  configured per customer; that work isn't a product change).

The curation axis that works: **project base-name → category** (`linear-categories.mjs`).

## 3. Pipeline (5 stages)

```
 (1) SYNC          (2) MAP-CHECK        (3) CURATE         (4) DRAFT            (5) PUBLISH
 Linear GraphQL →  detect unmapped  →   de-noise + class → translate + write → emit MDX +
 incremental       projects, propose    + cluster by       prose (LLM) +        open/refresh
 since watermark   categories (LLM)     month × theme      hero visual slot     draft PR
   |                   |                    |                  |                    |
 raw cache         categories.mjs       changelog-plan.json  drafted entries     git branch + PR
 (.cache/linear)   (version-controlled)  (.cache)            (.cache)            (human merges)
```

- **Stages 1–3 are deterministic scripts** (fast, no tokens, testable): `linear-sync.mjs`,
  `linear-curate.mjs` + `linear-categories.mjs`. Already built.
- **Stages 2(propose) & 4 are LLM steps** — the judgment work. Encapsulated in a skill.
- **Stage 5** writes MDX and uses `gh`/git to open a PR.

### 3.1 Incremental sync + state
- Add a watermark file `site/scripts/.cache/linear/state.json` holding the max
  `updatedAt`/`completedAt` processed. Each run pulls only issues changed since then
  (filter `updatedAt: { gt: <watermark> }`), not the full backlog.
- The initial load is a full pull (already done, cached).

### 3.2 Category-map self-maintenance (the "keep it up to date" mechanism)
- New projects appear daily. Any project base-name **not** in `linear-categories.mjs`
  defaults to `review` (dropped, never silently included).
- `linear-curate.mjs` now emits `unmappedProjects` (count + sample titles) — surfaced in
  the run report and `changelog-plan.json`.
- On each scheduled run, the skill takes unmapped projects and, using the existing map as
  few-shot guidance, **proposes a category for each**, writes it into `linear-categories.mjs`
  with a `// AI-proposed — confirm` comment, and lists them in the PR description. The
  human confirms/corrects in the PR. The map is the durable, version-controlled source of
  truth and improves over time with light oversight.
- Live example (this window) of newly-appeared areas needing a call: `Dexcom` (new
  integration?), `Product Improvements`, `Weekly dashboard v2`, `Fotbalový balíček`,
  `Tech debt - backlog`, `FTK UPOL - Early Warning System`.

### 3.3 Curation categories
`feature` (headline) · `improvement` (monthly list) · `maintenance` (mine for the few
user-noticeable fixes/tweaks; never headline) · `internal` (drop) · `client` (drop, mine
for generalizable features) · `review` (drop, surface for mapping). A `VALID_CATEGORIES`
guard fails the run on a typo.

### 3.4 Post structure — modeled on linear.app/changelog (studied 2026-06-16)
**One dated post per SHIPMENT CLUSTER**, not per month. A theme that shipped as a coherent
drop within a few days = one post; a single month can yield several posts (May 2026 → 3:
Yollanda squad May 11, Yollanda settings May 26, VALD May 29). Cadence is irregular and
**momentum-driven** (every few days to biweekly), reflecting real development progress —
this supersedes the earlier "group strictly by calendar month" decision. Curation clusters
by **theme + time-proximity** (date gap within a theme starts a new post).
Each post:
- **Date label**: full date `Month D, YYYY` — NOT just the month. Convention: the cluster's
  ship date (latest completed-issue date in the cluster; firms up to GitHub merge date, §6).
- Keep related work together: sub-features that shipped *with* a feature (e.g. "open Yollanda
  from profile/Tabular" shipped with the squad release) belong in that post — as a secondary
  `##` heading, NOT buried in Improvements. Improvements/Fixes are for genuinely minor items.
- **Lead feature** = the post title + a **hero image** + **1–3 short paragraphs**. The lead
  is the single biggest theme that period. Prose pattern Linear uses: set up the context/
  problem, then "Now …" introduces what changed and the benefit.
- **Secondary features**: each additional big theme gets **its own `##` heading**, **1–3
  short paragraphs**, and **optionally its own image**.
- **Improvements**: one-line bullets, each with a **bold area tag** prefix —
  `**Yollanda** — Open Yollanda from the athlete profile and Tabular.`
- **Fixes**: same `**Tag** — …` one-liners; surface only user-noticeable ones and collapse
  the rest into a single "Plus a range of smaller fixes and performance improvements" line.

Component support (`components/mdx/Update.tsx` + `mdx.css`): `<Update label title>` renders
date + big title (with #permalink); body holds the hero `<Frame>`, lead paras, `##`
secondary-feature headings (styled subordinate to the title), per-feature `<Frame>`s, and
`### Improvements` / `### Fixes` (compact muted lists).

### 3.5 Editorial drafting rules (content)
- **Translate** Czech → English; rewrite engineer-speak into what a *user* gained.
- **Drop internal plumbing** even inside kept themes (e.g. "eval dataset", "MLflow db",
  "tracking event", "BE: bulk create…"). `maintenance` items get the most aggressive cut.
- **Exclude unreleased features.** Linear "completed" ≠ shipped. Until GitHub release-gating
  lands (§6), the human reviewer is the net — and the draft must **flag** suspect items
  (`v2`/`beta`/`WIP`/behind-flag) rather than publish them. (e.g. "Planner v2" is WIP, not in
  production — must NOT appear.)
- **Demote, don't pad**: a curator-flagged headline that loses its substance to plumbing/
  config (e.g. May's "Sailing", 4 tickets → 1 user-facing) drops to an Improvements line.
- **Benefit / jobs-to-be-done framing** for features: name the real use cases and concrete
  terms a coach knows (e.g. VALD → CMJ trends, pre-season testing batteries, L/R asymmetry;
  name the actual devices ForceDecks/ForceFrame/NordBord/DynaMo). Get product names exactly
  right (verify spelling) and use the right brand/product ("VALD Performance", "VALD Hub").
- **Instance-specific behaviour** → `<Info>` callout ("configured/connected per team"),
  never stated as universal (e.g. VALD needs custom per-federation setup).
- **Improvements/Fixes formatting**: each bullet is a **full sentence (1–2 sentences ok)** —
  not a terse fragment; say what changed and the benefit. A **bold area/capability tag**
  prefix ONLY where it adds clarity — don't force a tag on every bullet. Each section ends
  with its OWN collapse bullet (Improvements: "Plus a range of smaller improvements…"; Fixes:
  "Plus a number of smaller fixes and performance improvements.") — separate, not one shared
  line. NO ellipses ("…"/"...") in copy.
- **Minor-item windowing**: each post sweeps up the Improvements/Fixes that shipped **since
  the previous post's date** (not the calendar month) — so the post's fix/improvement list is
  defined by the gap to the prior post, and assigning a date to one post shifts which minor
  items land in its neighbours.
- **Cadence sanity**: avoid two *major* posts within ~3 days — merge them into one dated post
  (one lead + the other as a secondary `##`), or wait and bundle with later fixes.
- **Cross-link** to module docs (`/en/<module>/…`) where it helps.
- **Voice**: Linear's register — imperative, benefit-first, concrete, calm, no fluff
  ("Connect VALD force-plate testing directly to Yarmill."). Polish via
  `anthropic-skills:yarmill-copy`.

### 3.6 Visuals (deferred)
Each headline reserves a hero slot. For now a placeholder; later the skill calls
`yarmill-visuals`. Design treatment solved with the portal.

### 3.7 Publish + idempotency
- Entries are grouped by month; published file is `changelog/changelog.mdx` (or per-year).
- **Rolling current-period**: each run regenerates the in-progress current month (and any
  newly-closed prior month) and refreshes a single open "changelog draft" PR — no duplicate
  fragments. Track published issue IDs (derive from MDX or a `published.json`) to avoid
  re-emitting.

## 4. The skill: `yarmill-changelog`
Distill the pipeline into a Claude Code skill so it runs identically **on-demand**
("draft the changelog for the last 2 weeks") and **scheduled**. SKILL.md encodes stages,
editorial rules, the map-maintenance protocol, script invocations, and PR conventions.
Build with `anthropic-skills:skill-creator`.

## 5. Scheduling & where it runs
**Recommended: a scheduled Claude Code cloud routine** (the `schedule` skill / cron) that
invokes `yarmill-changelog`. Rationale: drafting is inherently LLM work; Claude Code already
has the repo, the `yarmill-copy`/`yarmill-visuals` skills, and git/gh. Cadence: **biweekly**
draft refresh, monthly finalization (~24 user-facing items/batch).

Alternatives: GitHub Actions cron (can run stages 1–3 deterministically, but needs the
Anthropic API for drafting — more plumbing, loses the skill ecosystem). Webhooks (Linear can
push on completion) are a future real-time optimization; polling is sufficient for biweekly.

## 6. GitHub — confirmed plan (Phase 1.5, after the Linear-only pipeline proves out)
**Primary source stays Linear** (intent + structure); GitHub is the **"did it actually
ship" layer**. Decided 2026-06-16:
- **Release model = continuous deploy from `main`.** So the shipped boundary is **"the
  issue's linked PR is merged to `main`"** (≈ deployed). Posts are dated by that merge date,
  not by Linear's "completed" status. This is what would have excluded Planner v2.
- **Linear's GitHub integration is on** — issues already link their PRs (via `YWE-####`).
  So traverse **issue → linked PR → merged-to-main?** without broad commit crawling.
- **Unreleased/flag-gated work** (merged but not GA, e.g. Planner v2) → **caught by human
  review** of the draft PR (no special Linear label for now). The skill must additionally
  **flag suspect items** for the reviewer — titles containing `v2`, `beta`, `WIP`,
  `(skryté)`, behind-flag hints — rather than silently publishing them.
- Repos: **backend, frontend, yollanda** (read-only). The yollanda repo's PR descriptions
  are expected to be the best raw copy source.

Value delivered, in priority order: (1) release-gating + accurate dates; (2) better source
copy from PR titles/bodies; (3) coverage of PRs with thin/missing issues; (4) provenance
links. **Build Linear-only first** (Phase 1), add this in Phase 1.5.

## 7. Access & credentials needed (Tomáš → me)

| # | What | Why | Status |
|---|------|-----|--------|
| 1 | **Linear API key** | sync | ✅ have (personal key in `site/.env.local`) |
| 2 | **Dedicated Linear key / bot user** (read-only) | automation shouldn't depend on a personal account | recommended for the scheduled run |
| 3 | **GitHub token for the docs repo** (`yarmill/docs`: contents + pull_requests) | open the draft PR from the routine | needed when we automate publishing |
| 4 | **Decision: where the routine runs** | determines secret placement | needed |
| 5 | **GitHub read token + product repo names** | Phase-2 commit/release enrichment | deferred |

Step-by-step guides are in §8.

## 8. Step-by-step setup guides

**A. Dedicated Linear key (recommended for automation)**
1. Create a service account / "Changelog bot" user in Linear (or reuse a personal key for now).
2. Settings → Security & access → API → Create key. (Personal keys inherit that user's read
   access — give the bot read access to the relevant teams.)
3. Provide the key; it goes in the routine's secret store (and `site/.env.local` locally).

**B. GitHub token for docs-repo PRs** (when automating publish)
1. github.com → Settings → Developer settings → Fine-grained personal access tokens.
2. Repository access: only `yarmill/docs`. Permissions: Contents = Read/Write,
   Pull requests = Read/Write, Metadata = Read.
3. Provide the token; stored as a secret in the run environment. (`gh` CLI isn't installed
   locally — automation will use the token via git/API directly.)

**C. Phase-2 GitHub commit/release access** (deferred)
1. Same fine-grained PAT flow, read-only Contents on the product repos.
2. Tell me the repo names and whether releases are tagged.

## 9. Decisions — resolved 2026-06-16
1. **Where it runs** — ✅ Claude Code cloud routine.
2. **Cadence** — ✅ biweekly, **plus on-demand manual trigger** (skill is callable directly).
3. **Grouping** — ✅ per **shipment cluster** (theme + time-proximity), dated by ship date,
   irregular momentum-driven cadence — NOT one-post-per-month (§3.4). Backfill = last 12 months.
4. **GitHub** — ✅ in scope as **Phase 1.5** (release-gate via merge-to-`main`); build
   Linear-only first. Repos: backend, frontend, yollanda (read-only, later).
5. **Unreleased work** — ✅ human review + skill flags `v2`/`beta`/`WIP` items.
6. **`maintenance` tier + per-section collapse + relaxed tagging** — ✅ adopted (§3.5).
7. Still open: **dedicated Linear bot key** vs personal key for the scheduled run.

## 10. Phased rollout
- **P0 (done):** May-2026 proof entry in Linear structure + voice (squad Yollanda + VALD
  Performance), placeholder heroes → awaiting final sign-off.
- **P1:** distill `yarmill-changelog` skill (on-demand + scheduled) + incremental sync
  (watermark) + map-maintenance (propose unmapped) + publish draft PR.
- **P1.5:** GitHub release-gating (issue → linked PR → merged-to-`main`), PR-body copy,
  provenance links; read access to backend/frontend/yollanda.
- **P2:** schedule the routine (biweekly) as a Claude Code cloud routine.
- **P3 (optional):** Linear webhooks for near-real-time; gap detection vs merged PRs.
- **Then:** generate the remaining 11 months (Tomáš wants this after the skill exists).
```
