---
name: yarmill-docs
description: >-
  Author or edit Yarmill user-documentation content for the React docs site (under
  site/). Use whenever the user wants to write, rewrite, regenerate, or polish a docs
  page, module/feature reference, tutorial, or use case — "write the X page", "document
  the Y module", "add a tutorial for Z", "draft a use case for <persona>", "rewrite this
  page", "update the docs for <feature>". Walks the house writing guide
  (docs-guide/writing-instructions.md) and the product facts (docs-guide/master-reference.md),
  enforces the configurability rules, and outputs valid MDX wired into the site nav. For
  changelog posts use yarmill-changelog; for the visuals themselves use
  yarmill-design / yarmill-screenshot / yarmill-visuals.
---

# Writing Yarmill docs

The docs are the **React/Next.js site under `site/`** (static export → Netlify; **not**
Mintlify). This skill is the operational checklist; the full rules live in the guide — read
it before drafting anything non-trivial.

## Read these first
1. **`docs-guide/writing-instructions.md`** — the house guide: voice & tone, the
   configurability principle (CORE/CONFIG/SPORT/ROADMAP), content types (§5: reference /
   tutorial / use case), the React output format (§7), and the pre-publish checklist (§11).
2. **`docs-guide/master-reference.md`** — the product facts (living document). Order of
   truth: **chat details > live product > this reference**. Respect its tags.
3. For a module page, skim **`docs-guide/module-notes/<module>.md`** — live-verified notes on
   what that screen actually does (and the gold-standard `medical-module.md`).

## The loop
1. **Identify** the content type (§5) and audience (§3).
2. **Verify against the live product before drafting** UI-dependent pages — ask the user for
   an authenticated walkthrough; never enter credentials yourself; check every role the page
   serves; sandbox writes on the designated test account, keep real accounts read-only. If
   the product isn't reachable, draft from chat + reference and mark every unverified UI claim
   with `{/* TODO(yarmill): verify … */}`.
3. **Apply the configurability rules** — document CORE as universal, frame CONFIG as examples
   with the standard `<Info>` caveat, quarantine SPORT to sport pages, never document ROADMAP
   as current.
4. **Write** in the Linear voice (§4): lede stating the goal → `<PageMeta audience where />`
   (or `<TutorialMeta>` / `<UseCaseMeta>`) → hero figure → scannable sections. Use the global
   MDX components in `site/components/mdx/`; reference UI by action + destination, never
   screen position; bold exact in-product labels.
5. **Wire it in:** save under `site/content/docs/<area>/<slug>.mdx`, then **add the page to
   `site/.scaffold-ref/docs.json`** (anchors → groups → pages) — without this it's
   unreachable. A new *space* also needs a `SECTION_DEFS` entry in `site/lib/nav.ts`.
6. **Visuals:** don't hand-author them here. Leave `<Frame>{/* TODO(yarmill): … */}</Frame>`
   placeholders + an annotation spec, and produce images later with **yarmill-design /
   yarmill-screenshot / yarmill-visuals** (queue in `docs-guide/visuals/_VISUAL-TODOS.md`).
   Mark non-production images with `{/* NOTE(yarmill): … mockup … */}`.
7. **Validate:** from `site/`, run `npm run build`, `npm run lint`, `npx tsc --noEmit` — all
   must pass (broken MDX/links fail the build).
8. **Keep the reference current:** apply any new/changed product facts to
   `docs-guide/master-reference.md` and surface them in a short "Suggested Master Reference
   updates" note for review.
9. Run the **pre-publish checklist** (§11) before calling it done.

## Hand-offs
- **Changelog posts** → use the `yarmill-changelog` skill (don't draft changelog entries here).
- **Tutorials / use cases** → §5.1 / §5.2 of the guide. Use cases need the `<UseCaseMeta>`
  component + a Use cases space built first (prerequisite noted in §5.2).
- **Marketing/brand copy** → `anthropic-skills:yarmill-copy`. Product docs stay plainer.
