# docs-guide — how to write Yarmill docs

The authoring knowledge base for the Yarmill documentation site. If you're adding or
rewriting docs content, start here. (The docs site itself — the React/Next.js app — lives in
[`../site/`](../site); see the root [`README.md`](../README.md) and [`CLAUDE.md`](../CLAUDE.md).)

## Contents

| File | What it is |
|---|---|
| **[`writing-instructions.md`](writing-instructions.md)** | The house guide: voice & tone, the configurability principle, content types (reference / tutorial / use case), the React output format (frontmatter, components, nav), and the pre-publish checklist. **Read this before drafting.** |
| **[`master-reference.md`](master-reference.md)** | The Yarmill product facts — a **living document**. Tagged CORE / CONFIG / SPORT / ROADMAP. Order of truth: chat details > live product > this reference. Keep it current. |
| **`module-notes/`** | Per-module live-verification notes (what each screen actually does), the page `_TEMPLATE.md`, the `_REVIEW-CHECKLIST.md`, and `_BUILD-STATUS.md` (the docs build progress / resume anchor). |
| **`visuals/`** | `_VISUAL-TODOS.md` (the queued screenshot/shot list for the docs) and `yarmill-visuals-brief.md` (what the visuals skill must produce for tutorials). |
| **`changelog/`** | `changelog-automation-architecture.md` — the Linear → changelog pipeline design (operationalized by the `yarmill-changelog` skill). |

## How to use it

- **Writing a docs page, tutorial, or use case?** Invoke the **`yarmill-docs`** skill (it
  walks `writing-instructions.md`), or read the guide directly. Output goes under
  `site/content/docs/` and must be added to `site/.scaffold-ref/docs.json`.
- **Need a product fact?** It's in `master-reference.md`. When a conversation or live
  walkthrough reveals something new or wrong, update that file and note the change.
- **Need a visual?** Defer to the `yarmill-design` / `yarmill-screenshot` / `yarmill-visuals`
  skills; the shot queue is in `visuals/_VISUAL-TODOS.md`.
- **Drafting changelog posts?** Use the **`yarmill-changelog`** skill; the design rationale is
  in `changelog/changelog-automation-architecture.md`.

The `module-notes/`, `visuals/`, and `changelog/` folders are **working notes** captured
during the docs build — useful context, not published content and not contracts.
