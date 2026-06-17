# How to generate docs content with Claude Code

A plain-language guide for anyone on the Yarmill team. You don't need to know the codebase —
just open Claude Code in this repo and ask. Claude reads the authoring guide for you.

## TL;DR

1. Open Claude Code in the repo and **describe the page you want** in normal words.
2. Claude pulls up the rules + product facts, **asks you for a live walkthrough** if the page
   depends on the UI, drafts the page, wires it into the site, and checks the build.
3. **Preview** locally, tweak, then commit / open a PR. **Nothing goes live until merged.**

You don't have to name a skill — Claude picks the right one from what you ask. (If you want
to be explicit, type `/yarmill-docs`.)

## What you can ask for — and what to say

| You want… | Say something like… |
|---|---|
| **A module / reference page** (what a screen does) | "Write the Attendance page" · "Rewrite the Goals page, it's out of date" |
| **A tutorial** (a step-by-step job) | "Add a tutorial: connect a watch and read recovery" |
| **A use case** (a role story) | "Draft a use case for a national-team coach" |
| **A changelog post** | "Draft the changelog for what shipped since May" (uses the `yarmill-changelog` skill) |
| **A visual** for a page | "Make the hero image for the Goals page" (uses the `yarmill-screenshot` / `yarmill-visuals` skills) |
| **A fix / polish** | "Tighten the Plan page intro" · "Fix the broken link on the Reality page" |

The more you give up front — the audience (coaches/athletes/admins), which module, anything
that's configured-per-team — the less Claude has to ask.

## What Claude does (so you know what to expect)

- **Reads the rules first:** `writing-instructions.md` (how to write) and `master-reference.md`
  (what's true about the product).
- **Asks for a live walkthrough** when the page describes UI it hasn't confirmed. You log in
  and click through; Claude never enters your credentials and only edits on a test account you
  designate. If the product isn't reachable, it drafts from known facts and leaves
  `TODO(yarmill)` markers instead of guessing.
- **Writes the page** in the house voice, marks anything configured-per-team as an example,
  and **adds it to the site navigation** (`site/.scaffold-ref/docs.json`) so it actually shows up.
- **Leaves image placeholders** (`TODO(yarmill)`) rather than faking screenshots — visuals are
  produced separately with the design skills.
- **Checks the build** (`npm run build`, lint, types) before calling it done.
- **Flags new product facts** it learned so the Master Reference stays current.

## Your part

- **Give a walkthrough** when asked — it's the difference between accurate docs and guesses.
- **Answer the configurability question:** is a field/behaviour true for everyone, or set up
  per team? When unsure, say so — Claude will mark it as configurable.
- **Review the draft.** Claude flags what it couldn't verify with `TODO(yarmill)` comments;
  those are your cue to confirm or correct.

## Preview and ship

```bash
cd site
npm run dev      # http://localhost:3000 — see your page live, light + dark
```

When it looks right, ask Claude to **commit** (and **open a PR** if you want a preview link).
Pushing to `main` deploys to production; a PR gives you a preview URL first. **Nothing
publishes on its own.**

## Where things live (if you're curious)

- Pages you create → `site/content/docs/<area>/<slug>.mdx`, served at `/en/<area>/<slug>`.
- The rules Claude follows → `docs-guide/writing-instructions.md`.
- The product facts → `docs-guide/master-reference.md`.
- Images → `site/public/images/…`.

That's it. Describe what you want, walk Claude through the screen, review, ship.
