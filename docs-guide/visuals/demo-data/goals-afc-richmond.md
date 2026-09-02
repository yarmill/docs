# Seed plan: Goals — AFC Richmond

The demo data to create in the **Goals** module for the AFC Richmond group before shooting the
Goals page visuals. See [`../demo-cast.md`](../demo-cast.md) for the cast and the write-scope rule.

Designed so the eight shots in the Goals shot list can all be taken from this one data set —
including the three season buckets, every state colour in the Entire Group overview, a goal
closed with final evaluations, and a goal incomplete enough for Document check to flag it.

**To confirm live before seeding:** the season labels the instance offers (does a season read
`2026`, `2026/27`, …?), and how far back seasons go — the **Other** bucket needs a goal at least
two seasons old. Category names are per-team `[CONFIG]`; the ones below assume the
Performance / Fitness / Personal / Technical / Health / Conditions codelist and get swapped for
whatever AFC Richmond actually has.

## Jamie Tartt — the lead athlete

The one athlete with data in all three buckets, so his list is the "Where to find Goals" shot.

### Current season

**Turn into the team's playmaker** · On track · High · Performance → Attacking
· supervisors: Ted Lasso, Roy Kent
> Stop being the guy who scores and start being the guy who makes it happen for everyone else.

| State | Key result | Start | Current | Target | Target date |
|---|---|---|---|---|---|
| On track | League assists | 3 | 6 | 10 | 10 May 2027 |
| On track | Key passes per 90 | 1.4 | 2.1 | 3.0 | 10 May 2027 |
| Off track | Track-backs per 90 | 2 | 3 | 6 | 20 Dec 2026 |

**Add strength without losing sharpness** · Off track · Medium · Fitness → Strength
· supervisor: Coach Beard
> Heavier in the gym, same over 10 metres.

| State | Key result | Start | Current | Target | Target date |
|---|---|---|---|---|---|
| On track | Back squat | 110 kg | 125 kg | 140 kg | 28 Feb 2027 |
| Off track | 10 m sprint | 1.72 s | 1.71 s | 1.68 s | 28 Feb 2027 |
| Not started | Gym sessions per week | 0 | 0 | 3 | 30 Nov 2026 |

### Past season

**Finish the season fit** · **Completed** · High · Health → Availability · supervisor: Ted Lasso
— the goal that carries the **final evaluations** and a couple of Activity comments.

| State | Key result | Start | Current | Target | Target date |
|---|---|---|---|---|---|
| Completed | League appearances | 0 | 34 | 30 | 24 May 2026 |
| Completed | Days lost to injury | 41 | 6 | under 10 | 24 May 2026 |

Final evaluation — *Jamie*: "Longest run of games I've had. The boring stuff — sleep, the gym
on Mondays — is what did it."
Final evaluation — *Ted Lasso*: "Thirty-four games. Not one of them because he got lucky with
his body. Proud of this one."

### Other (older than last season)

**Win back a starting place** · **Completed** · High · Performance → Selection

| State | Key result | Start | Current | Target | Target date |
|---|---|---|---|---|---|
| Completed | League starts | 4 | 21 | 15 | 25 May 2025 |

## The rest of the squad

| Athlete | Goal | State | Why it's in the set |
|---|---|---|---|
| **Sam Obisanya** | Grow into a leader on the pitch · Personal → Leadership · 2 KRs | On track | a second populated athlete for the overview |
| **Dani Rojas** | Stay dangerous in the air · *no supervisor, no category, 1 KR* | Not started | the **Document check** shot — red "Add supervisor", amber "Add at least 3 key results" |
| **Isaac McAdoo** | Cut the cards · Technical → Discipline · 2 KRs | **Failed** | a red pill in the overview |
| **Colin Hughes** | Break into the starting XI · Performance → Selection · 2 KRs | Off track | an amber pill |
| **Jan Maas** | Learn the new back-three shape · Technical → Positioning · 1 KR | **Canceled** | shape change dropped mid-season; the sixth state |
| **Zoreaux (Van Damme)** | — | — | deliberately empty: an athlete row with no pills |
| **Bumbercatch** | — | — | deliberately empty |

Between them the overview shows all six state colours in one frame.

## Coach's own goals — Roy Kent

**Get through a full season without being sent to the stands** · On track · Personal → Conduct
· 1 KR — proves the "coaches can set goals for themselves" line without needing a second shot.

## Notes for seeding

- There's no Save button — every field commits on edit and lands in **Activity**, so the seed
  pass writes the Activity history for free. Set states *last* on the closed goals, so
  "changed goal's state from On track to Completed" reads sensibly in the log.
- Final evaluations only unlock once a goal is Completed / Canceled / Failed — so Jamie's
  "Finish the season fit" must be set to **Completed** before its evaluations can be written.
- Leave Dani Rojas's goal deliberately incomplete. If a seeding pass "tidies" it, the Document
  check shot loses its red item.
- Keep values short — the key results table is narrow and long strings wrap badly in a
  screenshot.
