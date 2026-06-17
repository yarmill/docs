# CLAUDE.md — Yarmill documentation

Guidance for Claude Code working in this repository.

## Working relationship
- Ask for clarification rather than guessing. Yarmill is **configured per customer**, so
  most fields, modules, and terminology are instance-specific — when unsure whether
  something is universal, ask or mark it `[CONFIG]` rather than stating it as fact.
- Prefer small, reviewable changes. Tell the user what you changed and why.
- The factual source of truth for product behaviour is the **Yarmill Master Reference** at
  [`docs-guide/master-reference.md`](docs-guide/master-reference.md). Don't invent product
  behaviour; if a claim isn't backed by the reference or the user, leave a
  `{/* TODO(yarmill): verify … */}`.

## What's in this repo
- **`site/`** — the docs site: a **React / Next.js** App Router app with a Linear-style UI,
  built as a **fully static export** (`output: 'export'`) and hosted on **Netlify**. It is
  **not** Mintlify (the old `docs.json` / `en/` setup was removed). All content + UI live here.
- **`docs-guide/`** — the authoring knowledge base (how to write Yarmill docs + the product
  facts). See "Authoring docs" below.
- **`internal/`** — NOT documentation: Nunjucks/Jinja templates for Yollanda (the AI), outside
  `site/`, never part of the docs build. **Never** edit, delete, or reformat `internal/`.
- **`.claude/skills/`** — repo skills (`yarmill-docs`, `yarmill-changelog`).

## Working in `site/` (the docs app)
- **Everything runs from `site/`:**
  - `npm run dev` — local preview at http://localhost:3000
  - `npm run build` — static export to `site/out`
  - `npm run lint` / `npx tsc --noEmit` — what CI checks (broken MDX/links fail the build)
- **Content:** `.mdx` + YAML frontmatter under `site/content/docs/`, grouped by area:
  `get-started/`, `plan/`, `reality/`, `results/`, `analytics/`, `medical/`, `platform/`,
  `sport-specific/`, plus `tutorials/`, `api-reference/`, `changelog/`. URLs are `/en/<path>`.
- **Nav/sidebar** (order, groups, the Linear-style "spaces") is driven by
  `site/.scaffold-ref/docs.json` + `site/lib/nav.ts`. **A new page must be added there or
  it's unreachable.**
- **Engine:** custom MDX pipeline (no Fumadocs) — `next-mdx-remote`, `remark-gfm`,
  `rehype-slug`, `rehype-pretty-code` (Shiki, dual light/dark). Brand + type in
  `site/app/theme/tokens.css`; shell in `app/theme/chrome.css`; MDX components in
  `site/components/mdx/`.
- **Deploy:** GitHub Actions builds and deploys (`.github/workflows/docs-site-*.yml`); Netlify
  only hosts. Push to `main` → production; PRs → preview.

## Authoring docs — read the guide first
When writing, editing, or regenerating any **docs content** (a module page, tutorial,
use case, or changelog post), the detailed rules live in **`docs-guide/`** — don't rely on
this file alone:

- **[`docs-guide/writing-instructions.md`](docs-guide/writing-instructions.md)** — the house
  guide: voice & tone, the configurability principle (CORE/CONFIG/SPORT/ROADMAP), content
  types (reference / tutorial / use case), the React output format (frontmatter, components,
  `.scaffold-ref/docs.json` nav), and the pre-publish checklist. The **`yarmill-docs`** skill
  walks this.
- **[`docs-guide/master-reference.md`](docs-guide/master-reference.md)** — the product facts
  (living document; chat > live product > this reference). Apply + surface updates when a
  conversation reveals something new.
- **`docs-guide/module-notes/`** — per-module live-verification notes (what each screen
  actually does) and the build status. **`docs-guide/visuals/`** — the queued screenshot/shot
  list. **`docs-guide/changelog/`** — changelog automation architecture.

**Skills (use them):**
- **`yarmill-docs`** — authoring a docs page / tutorial / use case (walks the guide above).
- **`yarmill-changelog`** — drafting changelog posts from Linear.
- **`anthropic-skills:yarmill-design`** — brand tokens, GUI 2.0, assets (Yollanda accent
  Blush `#FC7B9B`, never indigo). **`yarmill-screenshot`** — one docs-ready framed screen.
  **`yarmill-visuals`** — annotated stills, step sequences, marketing/social, motion (the
  skill for tutorial/use-case visuals). Mark non-production images with `{/* NOTE(yarmill):
  … mockup … */}`.
- **`anthropic-skills:yarmill-copy`** — marketing/brand copy (product docs are plainer).

**Frontmatter minimum** (every page): `title` + `description`. Add `icon:` on module/landing
pages, `sidebarTitle:` to override the sidebar label, `mode: "wide"` for full-width pages.

## Git workflow
- Default branch is **`main`**. Branch for substantial work unless the user says otherwise;
  commit/push only when asked.
- End commit messages with:
  `Co-Authored-By: Claude <noreply@anthropic.com>`

## Do not
- Don't skip frontmatter (`title` + `description` minimum) or add a page without its
  `site/.scaffold-ref/docs.json` nav entry.
- Don't edit, reformat, or remove anything in `internal/`.
- Don't state instance-specific behaviour as universal — mark it as configurable.
- Don't reference images/pages that don't exist (`npm run build` fails on broken MDX).
- Don't add product claims that aren't backed by the Master Reference or the user.
