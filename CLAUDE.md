# CLAUDE.md — Yarmill documentation

Guidance for Claude Code working in this repository.

## Working relationship
- Ask for clarification rather than guessing. Yarmill is **configured per customer**, so
  most fields, modules, and terminology are instance-specific — when unsure whether
  something is universal, ask or mark it `[CONFIG]` rather than stating it as fact.
- Prefer small, reviewable changes. Tell the user what you changed and why.
- The factual source of truth for product behaviour is the **Yarmill Master Reference**
  (provided by the user, not in this repo). Don't invent product behaviour; if a claim
  isn't backed by the reference or the user, leave a `{/* TODO(yarmill): verify … */}`.

## Project context
- This is a **React / Next.js** documentation site (App Router) with a Linear-style UI,
  built as a **fully static export** (`output: 'export'`) and hosted on **Netlify**. It is
  **not** Mintlify — the old Mintlify setup (`docs.json`, `en/`) was removed once this site
  superseded it.
- **Everything lives under `site/`.** Run commands from there:
  - `npm run dev` — local preview at http://localhost:3000
  - `npm run build` — static export to `site/out`
  - `npm run lint` / `npx tsc --noEmit` — what CI checks
- **Content:** `.mdx` files with YAML frontmatter under `site/content/docs/`, grouped by
  module: `get-started/`, `plan/`, `reality/`, `results/`, `analytics/`, `medical/`,
  `platform/`, `sport-specific/`, plus `tutorials/`, `api-reference/`, and `changelog/`.
  URLs are `/en/<path>` (the page's path under `content/docs`).
- **Engine:** a custom MDX pipeline (no Fumadocs) — `next-mdx-remote`, `remark-gfm`,
  `rehype-slug`, `rehype-pretty-code` (Shiki, dual light/dark). Brand + type live in
  `site/app/theme/tokens.css`; the shell in `app/theme/chrome.css`; MDX components in
  `site/components/mdx/`.
- **`internal/`** is NOT documentation — it holds Nunjucks/Jinja templates for Yollanda
  (the AI) and sits outside `site/`, so it is never part of the docs build. **Never** edit,
  delete, or reformat `internal/`.
- **Deploy:** GitHub Actions builds and deploys (`.github/workflows/docs-site-*.yml`);
  Netlify only hosts. Push to `main` → production; PRs → preview.

## Content strategy
- One source of truth per topic — link, don't duplicate. Cross-link related modules with
  root-relative paths including the lang, e.g. `[Analytics](/en/analytics/analytics)`.
- Match the structure and tone of the existing module pages. Each page opens with a one-
  line purpose, then a `**For:** … · **Where:** …` audience line, then the body.
- Lead with mechanics that are true everywhere; call out instance-specific bits with an
  `<Info>` note ("configured per team").

## Frontmatter requirements
Every page needs at least:
```yaml
---
title: "Page title"
description: "One-line summary for SEO and search."
---
```
Use `icon:` on module landing pages (Font Awesome-style names, resolved to icons in
`site/lib/icons`), `sidebarTitle:` when the sidebar label should differ, and `mode: "wide"`
for full-width pages that drop the right-hand TOC (e.g. the home dashboard, changelog).

## Writing standards
- **Voice:** address the reader as "you"; refer to athletes by name. Calm, clear,
  concrete — never jokey. (For marketing/brand copy use the `yarmill-copy` skill; product
  docs are plainer.) Sentence case for headings and UI labels.
- **Components:** use the MDX components in `site/components/mdx/` — `<Card>/<CardGroup>`,
  `<Columns>`, `<Steps>/<Step>`, callouts (`<Info>`, `<Tip>`, `<Warning>`, `<Note>`,
  `<Check>`), `<Frame>` for images, `<ParamField>`, `<Accordion>`, `<Tabs>`.
- **Images:** store under `site/public/images/`, reference as `/images/…`, wrap in
  `<Frame caption="…">`, and always set `alt`.
- **Internal links:** root-relative, include the `/en/` prefix.
- **Code/values:** real units and tabular numbers (`112 km`, `ACWR 1.18`).
- Leave a `{/* TODO(yarmill): … */}` comment for anything unverified or any placeholder
  asset, rather than asserting it.

## Screenshots & UI mockups
- Use the **`anthropic-skills:yarmill-design`** skill for any Yarmill UI visual — it is the
  source of truth for brand tokens, the new UI ("GUI 2.0"), and assets (Inter, icons,
  avatars). Yollanda accents are Blush `#FC7B9B`, never indigo.
- Prefer **real product screenshots**, then prettify: zoom to the feature, place on a clean
  brand backdrop, and overlay callout labels in the design language (Linear/Claude-docs
  style). Render to PNG with headless Chrome from design-system HTML.
- Mark any non-production image with a `{/* NOTE(yarmill): … mockup … */}` comment.

## Git workflow
- Default branch is **`main`**. Branch for substantial work unless the user says
  otherwise; commit/push only when asked.
- End commit messages with:
  `Co-Authored-By: Claude <noreply@anthropic.com>`

## Do not
- Don't skip frontmatter (`title` + `description` minimum).
- Don't edit, reformat, or remove anything in `internal/`.
- Don't state instance-specific behaviour as universal — mark it as configurable.
- Don't reference images/pages that don't exist (`npm run build` fails on broken MDX).
- Don't add product claims that aren't backed by the Master Reference or the user.
