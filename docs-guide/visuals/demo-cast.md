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

## How a figure is framed

Set 2026-09 by the product owner, after a first pass got this wrong.

**A figure is the app.** Either the **whole application window**, or a **zoom into the one
region** the figure is about — and it bleeds to all four edges of the image. Do **not** cut a
region out of the window and float it as a rounded card with a drop shadow on a backdrop: it
reads as a drawing of the UI rather than a picture of it.

**A zoom is anchored to the window, never floating in the middle of it.** Pick one of nine
positions — top-left · top · top-right · left · center · right · bottom-left · bottom ·
bottom-right — and crop from that anchor, so the figure keeps the window's own edges (and the
page background and rounded corners along them) on the sides it touches. A crop taken from the
middle of the screen, cut on all four sides, leaves the reader with no idea where they are; it
also produces ugly slivers of grey where a panel's rounded corner is sliced. Choose the anchor
that best shows *where the thing lives*: the category menu sits left, the Verification popover
bottom-right, the export menu top-left.

**Not every figure needs callouts.** If the screen explains itself — a group overview whose
colours are the point, a menu whose items are readable — leave it clean and let the caption
carry it. Callouts are for naming parts that aren't self-evident.

**Callout cards are Yarmill indigo with light text** (chip in a white tint, body at ~88%
white), and they **sit off the app, in a transparent strip at the edge** of the figure — to the right
of a tall screen, underneath a wide one. The strip has no background, so it merges into the
docs frame instead of reading as a second panel, and the app itself stays unobscured. Anchor
the dot just *outside* the element it names (past the end of a line of text, at the right edge
of a table) and let the leader run out through empty space to the card; never put a dot on the
icon or control being described.

**Copy is sentence case** — "What the goal is", not "what the goal is" or "What The Goal Is".

**Callout text is baked into the PNG, so a screen reader can't see it.** Whatever the callouts
name, the figure's `alt` has to say too — otherwise the labelled parts exist only for sighted
readers.

**Callout cards** follow the Figma annotation pattern: a small **chip** carrying the name
(brand tint, Inter 600) over a line of **body text** (Inter 450) that wraps inside a ~470px
card, with roomy padding (20px) and a soft shadow. Airy beats dense. Never the browser's
default bold (700) — Yarmill's type tops out at 590. Don't colour-code the cards themselves:
on a screen that already uses colour to mean something (Verification's red/amber/green, the
state pills) coloured callouts fight the UI. Leave those screens un-annotated instead.

**Bleed the crop to the frame.** `<Frame bleed="…">` takes the edges where the screenshot is a
crop and the real screen continues — `top`/`right`/`bottom`/`left`, or `all`. Those edges lose
the frame's inset so the image runs to the edge. A partial screenshot inset on all four sides
reads as a cut-out pasted on a card. Keep the inset only on edges that are the window's own.

**Size for a retina column.** The docs column is ~700px, so a figure wants **at least ~1400px**
of source width. A narrow crop (a single column, a small popover) gets widened with
surrounding context rather than upscaled.

Some figures need no callouts at all. If the screen already names the thing — season-bucket
headers, a two-level menu — let the caption do the work.
