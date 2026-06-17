# Yarmill Docs

The Yarmill documentation site — a React/Next.js app with a Linear-style UI that
builds to a **fully static** site and is hosted on **Netlify**.

## Repository layout

- **`site/`** — the docs app (Next.js App Router, static export). All content and
  UI live here.
  - `site/content/docs/` — the documentation pages (`.mdx` + frontmatter).
  - `site/components/` — the chrome (sidebar, TOC, search, …) and MDX components
    (`Card`, `Frame`, `Steps`, callouts, …).
  - `site/public/` — images, fonts, favicon, and the prebuilt search index.
- **`internal/`** — Nunjucks/Jinja templates for Yollanda (Yarmill's AI).
  **Not** documentation; never edit it to satisfy a build.
- **`specs/`** — internal planning / spec notes.

## Develop

```bash
cd site
npm install
npm run dev          # http://localhost:3000
```

## Build (static export)

```bash
cd site
npm run build        # → site/out  (static HTML + assets, no server runtime)
```

## Deploy

The build runs in **GitHub Actions**; Netlify only hosts the prebuilt `site/out`.

- Push to `main` touching `site/**` → **production** deploy.
- Pull request touching `site/**` → **preview** deploy (URL auto-commented on the PR).
- Workflows: `.github/workflows/docs-site-ci.yml` and `docs-site-deploy.yml`.
- Required repo secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`.

See `CLAUDE.md` for authoring conventions and writing standards.
