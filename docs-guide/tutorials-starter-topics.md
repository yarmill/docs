# Tutorials — the starter topics

The first set of tutorials to write for the **Tutorials** space, chosen from real user
demand. These are **topics, not content** — write the pages later with the `yarmill-docs`
skill (tutorial section contract: `writing-instructions.md` §5.1).

**Source.** Mined from ~713 real "how do I…" questions users asked the in-app assistant
(Yollanda), with the asker's role, 2026-06. Volumes there are *relative demand* (per message,
not per user), so treat them as priority signal, not exact counts.

## How these tutorials work

- **Dual-path where it applies.** Where a task can be done both by clicking through the app
  **and** by asking Yollanda, the tutorial shows both — the app steps first, then the
  "or just ask Yollanda" shortcut. (Some tasks have no Yollanda path — see the column.)
- **Shared = one page, a coach one-liner.** For tutorials that serve both athletes and
  coaches, write one page and add a single line where the path diverges — *"If you're a coach,
  select the athlete (or group) first."* Athletes only ever see their own data; coaches pick
  an athlete/group before the same steps.
- **Role label is required** on every tutorial (`<TutorialMeta audience=…>`): Athlete, Coach,
  Administrator, or Shared.

## The set (10)

| # | Title | Role | Yollanda path? | Module(s) |
|---|---|---|---|---|
| 1 | Log a training session | Shared (athlete + coach) | **No** — Yollanda can't create log entries | Training Log |
| 2 | Connect your watch or wearable *(incl. importing historical data)* | Athlete | No | Integrations & devices |
| 3 | Build and publish a plan for your group | Coach | No | Plan |
| 4 | Manage athletes, groups, and permissions | Administrator | No | Settings / administration |
| 5 | Find your way around Yarmill | Shared (onboarding) | — | Get started |
| 6 | Find a past session or record | Shared | Yes (log search + *"find my last bouldering session"*) | Training Log + Yollanda |
| 7 | Summarize your training volume | Shared (athlete + coach) | Yes (Analytics + *"how many hours in May?"*) | Analytics + Yollanda |
| 8 | Review and compare training | Shared (athlete-leaning + coach) | Yes | Analytics + Yollanda |
| 9 | Check your squad's recovery and readiness | Coach | Yes (Analytics + ask Yollanda, incl. morning resting HR) | Analytics + Yollanda |
| 10 | Set season goals | Athlete & coach | (optional) | Goals |

No backlog is kept on purpose — new topics get added when demand or a release calls for them.

## Deliberately *not* tutorials (routed elsewhere)

- **Record biathlon shooting & shooting tests** — high volume but **100% one customer
  (`csb`)**. Belongs in `sport-specific/biathlon/`, not a universal tutorial.
- **Club-specific codes** (e.g. `KXT`, `ležka`/`stojka`) — per-team notation, not product
  features. A per-instance glossary at most; document only the generic terms (RPE, ACWR,
  HR zones).
- ⚠️ **Emotional-support chat** — surfaced in the question data (one minor athlete). **Not a
  docs item** — this was flagged to Yarmill product/safeguarding, not the docs team.

## Terminology

Use correct English sports terms, not literal translations of the Czech UI — see the
**Sports terminology** note in `writing-instructions.md` §9 (e.g. *training session*, not
"training unit"; *group*, not "team").
