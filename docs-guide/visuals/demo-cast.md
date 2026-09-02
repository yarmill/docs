# Demo cast & data scope for docs visuals

The standing convention for every Yarmill docs screenshot, screencast, and worked example.
Set 2026-09 by the product owner; supersedes the earlier biathlon *National Team /
Simpson Lisa* cast used for the first module passes.

## The group

**AFC Richmond** on we.yarmill.com — a football (soccer) group named after *Ted Lasso*, with
its members named after the show's characters. Every new visual and every example in the docs
uses this group, so the docs read as one coherent product tour instead of a pile of unrelated
instances.

Three named accounts do the work; the rest of the squad is scenery.

| Role in the docs | Member | Used for |
|---|---|---|
| **Coach** (the primary login) | **Ted Lasso** | the coach's-eye view in most shots; the supervisor on goals |
| **Athlete** (the athlete login) | **Jamie Tartt** | the athlete with the richest data, and every athlete-role screen |
| **Admin** (occasional) | **Rebecca Welton** | the few shots that need an admin |
| Supporting athletes | the rest of the squad — **Roy Kent**, Sam Obisanya, Dani Rojas, … | visible in group overviews and athlete lists; rarely the subject of a shot |

**Roy Kent is an athlete here**, not a coach — the squad list is whatever the group actually
contains, so check the member list before naming anyone in a caption.

Keep a member's role stable across modules — if Jamie Tartt is the lead athlete in Goals, he's
the lead athlete in Reality too. Ted Lasso is the only coach; don't invent a second one to fill
a supervisor field.

## Data scope — hard rule

**Writes are allowed only inside AFC Richmond.** Adding, editing, and deleting goals, plans,
log entries, records, and member data is authorized for the AFC Richmond group and its members.

**Never write to any other group, coach, or athlete on any instance** — not the biathlon
National Team, not Simpson Lisa, not the accounts of real staff. Reading elsewhere to verify
behaviour is fine; changing anything there needs explicit, per-case confirmation from the
product owner.

## Sourcing visuals

**Capture the real UI, then annotate it.** Screenshots come from the live app driven in a
logged-in session; the callout layer (labels, badges, spotlights, framing) is composited on
top afterwards. Do not rebuild a screen as HTML and pass it off as a screenshot — a rebuild
drifts from the shipped UI in exactly the details nobody wrote down, and it has to be rebuilt
on every UI change instead of re-shot.

Figma designs, where available, are a **secondary reference**: brand tokens and spacing for
the annotation layer, and a cross-check when a live screen looks wrong (design intent vs. a
bug). They are not the source of the screenshot.

Anything that is *not* a real capture keeps its
`{/* NOTE(yarmill): … mockup … */}` marker in the MDX.
