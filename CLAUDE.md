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
- This is a **Mintlify** documentation site, published from this repo.
- **Content format:** `.mdx` files with YAML frontmatter.
- **Config:** `docs.json` (Mintlify schema — `$schema: https://mintlify.com/docs.json`).
  Navigation is `navigation.languages → [{ language: "en" }] → anchors → groups → pages`.
  Theme `almond`, brand indigo `#513FF8`, font **Inter**.
- **Pages live under `en/`**, grouped by module: `get-started/`, `plan/`, `reality/`,
  `results/`, `analytics/`, `medical/`, `platform/`, `sport-specific/`, plus
  `api-reference/` (OpenAPI) and `changelog/`.
- **`internal/`** is NOT documentation — it holds Nunjucks/Jinja templates for Yollanda
  (the AI). It is excluded from Mintlify via root `.mintignore`. **Never** edit, delete,
  or reformat `internal/` to satisfy a build; keep it excluded instead.
- **Run locally:** `mint dev` (preview at http://localhost:3000). **Validate links:**
  `mint broken-links` — must pass before committing.

## Content strategy
- One source of truth per topic — link, don't duplicate. Cross-link related modules with
  relative paths (e.g. `[Analytics](/en/analytics/analytics)`).
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
Use `icon:` (Font Awesome name) on module landing pages, `sidebarTitle:` when the sidebar
label should differ, and `mode: "wide"` only where a page needs full width (e.g. changelog).

## Writing standards
- **Voice:** address the reader as "you"; refer to athletes by name. Calm, clear,
  concrete — never jokey. (For marketing/brand copy use the `yarmill-copy` skill; product
  docs are plainer.) Sentence case for headings and UI labels.
- **Components:** use Mintlify components — `<Card>/<CardGroup>`, `<Columns>`,
  `<Steps>/<Step>`, callouts (`<Info>`, `<Tip>`, `<Warning>`, `<Note>`, `<Check>`),
  `<Frame>` for images, `<ParamField>` for field/parameter lists, `<Accordion>`, `<Tabs>`.
- **Icons:** Font Awesome names (the default library here), e.g. `chart-line`, `bullseye`.
- **Images:** wrap in `<Frame caption="…">` and always set `alt`. Store under `images/`.
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
- Don't reference images/pages that don't exist (run `mint broken-links`).
- Don't add product claims that aren't backed by the Master Reference or the user.
