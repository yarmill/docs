# Module Spec: Yollanda — the AI layer — internal

> Internal specification. NOT published (excluded via `.mintignore`). Source for the
> user-facing docs page + image plan. Fill every section; leave `TODO(verify)` where unsure.

## 0. Meta
- **Module:** Yollanda — Yarmill's AI layer (a playful "fortune-teller / storyteller" persona — a wink at LLMs). Also historically spelled "Jolanda / Yolanda".
- **Route(s):** none — Yollanda is **not a routed page**. It is an **overlay** opened from the header on top of whatever module you are already on.
- **Nav path:** select the **blush Yollanda icon in the header** (the pink sun-face icon) → full-screen chat overlay opens. The icon is present **across the app** (both UI generations) on **most pages**, but is **absent on Settings pages** (confirmed live 2026-06-15, classic top-nav). Insights have a second entry point: a small Yollanda icon **on charts/summary cards in Analytics**. A further persona surface is the **Document check** popover in the Goals module (see §12).
- **UI shell:** **full-screen LIGHT chat overlay (blush accent)** — sits on top of the current shell (classic top-nav or GUI 2.0); not a destination page. Confirmed live 2026-06-15: a full-screen light overlay with an **X** close top-right, a centered **"Yollanda"** header carrying a blush **BETA** pill, the empty-state illustration + disclaimer (§6.2), and a bottom chat input. The earlier "dark panel" description is superseded by the live light overlay.
- **Surfaces:** web (PWA). `TODO(verify)` availability/parity on native iOS / Android.
- **Primary roles:** **everyone** — coach, athlete, admin, medical/staff. Each user **sees only the data they already have access to**; Yollanda does not widen permissions.
- **Config-dependence:** **low** for the chat (universally available); **medium** for chart **Insights** (which charts carry an Insight icon depends on which Analytics charts are enabled per instance, and insights only appear the day after a chart is enabled).
- **Explored:** 2026-06-15 · group *National Team* · athlete *Simpson Lisa* · by main agent — drafted from the master reference (§5.12) + the existing docs page; **not yet opened live**.
- **Render images now?** **NO** (shot list only). Yollanda is a new-GUI / blush surface; the live framing is now confirmed (full-screen light overlay, BETA), but renders remain deferred — produce later once the answer/transcript states are observed live.

## 1. Purpose & why it exists
Yollanda answers coaching questions in plain language. Unlike a generic chatbot, she has the
**training data in front of her** — every answer is grounded in your Yarmill, scoped to the
data you can already see. Ask "summary of last season," "compare April and May," "when did the
left shoulder last come up," or "how do I publish a plan," and get an answer drawn from this
instance rather than the open internet. The goal is to make the diary, plan, and analytics
**queryable in your own words** — and to help non-analytical users read their charts.

## 2. Jobs to be done (per role)
- **Coach:**
  - When I want a quick read on an athlete, I want to ask in plain language ("summary of
    Lisa's last season," "bench-press kilos from her last gym session"), so I get the
    answer without building a query or digging through the diary.
  - When I want to compare periods, I want to ask ("compare April and May this season"), so
    trends surface without me assembling a report.
  - When I'm not sure how a workflow works, I want to ask Yarmill itself ("how do I publish
    a plan"), so I don't leave the app to find help.
  - When a chart is hard to read, I want a plain-language description and interpretation, so
    I can act on it even if I'm not analytically minded.
- **Athlete:**
  - When I want to look back at my own data, I want to ask in my language ("summary of my
    last season"), so I get a grounded answer scoped to me.
  - When I don't know where to click, I want to ask how Yarmill works, so I can keep going.
- **Admin / staff:** same as their data access allows; Yollanda is not an admin tool — it
  cannot change the instance (see §3, §7).

## 3. Personas & permissions
- **Everyone** can open Yollanda — the header icon is universal.
- **Data scope follows existing access, never widens it.** An **athlete** can ask only about
  **their own** data. A **coach** can ask about **any athlete they can access**. Yollanda
  surfaces only what the asker is already permitted to see.
- **Language:** any user can ask in their own language; Yollanda answers **in the language
  asked** (Latvian, German, Polish, etc.). The UI and data languages can differ.
- **No privileged actions.** No role can use Yollanda to change configuration, log entries,
  or message the Yarmill team (see §7).

## 4. Key concepts & vocabulary
- **Yollanda** — the AI layer / persona. Header chat opens with a persona line ("I am one
  big ear.") and a beta disclaimer ("Even Yollanda sometimes gropes in the fog. Verify
  important information.").
- **Entry points:** the **header chat** (blush sun-face icon → full-screen overlay), **chart Insights** (Analytics), and the **Document check** persona popover (Goals — see §12).
- **BETA:** Yollanda is explicitly flagged as **BETA** — a blush pill next to the "Yollanda" header in the overlay (confirmed live 2026-06-15).
- **Two kinds of questions** in the chat:
  - **About the data** — summaries, comparisons, finding things in the diary/plan
    (e.g. "summary of last season"; "compare April and May"; "when did the left shoulder
    last come up"; "bench-press kilos from the last gym session").
  - **About Yarmill** — where to click, how workflows work (e.g. "how do I publish a plan").
- **Grounded answers** — responses are drawn from this instance's data, scoped to the
  asker's access; not the open internet.
- **Insight (on a chart)** — a plain-language **description** of the chart (axes/values) plus
  an **interpretation** of what it means. **Computed overnight** — appears the **day after**
  a chart is enabled.
- **Beta** — the chat itself flags that answers can be wrong; verify important information.
- **Persona spelling:** "Yollanda" is canonical; "Jolanda / Yolanda" appear in older material.

## 5. Information architecture
- **Not a page.** Yollanda is reached by the **blush sun-face header icon**, present in both the
  classic top-nav UI and GUI 2.0, on most modules (absent on Settings) — so it overlays the
  current context rather than navigating away. The chat is a **full-screen LIGHT overlay with
  blush accents** (confirmed live 2026-06-15).
- **Second surface:** in **Analytics**, charts and summary cards carry a **small Yollanda
  icon**; selecting it opens the chart's Insight (description + interpretation). See
  `/en/analytics/analytics`.
- **No sub-views/tabs** within the chat beyond the conversation itself. `TODO(verify)`
  whether the chat keeps history across sessions, supports multiple threads, or resets per
  open.

## 6. Screen & UI inventory
> The **overlay chrome** below (entry icon, framing, empty state, input) was **confirmed live
> 2026-06-15** (clean coach session, classic top-nav). The **answer/transcript behaviour** was
> NOT tested live (no query sent, to avoid side effects) and stays `TODO(verify)`.

### 6.1 Header entry point
- **Control:** **blush Yollanda icon** in the app **header** — the **pink sun-face** glyph,
  present across the app in both shells. Selecting it opens the full-screen chat overlay.
  (Confirmed live 2026-06-15.)
- **Absent on Settings pages** — the icon does not appear in Settings (confirmed live).
- States: the **BETA** flag lives inside the overlay header (a blush pill next to "Yollanda"),
  not on the header icon itself.

### 6.2 Chat overlay
- Layout: a **full-screen LIGHT overlay** with blush accents over the current screen,
  dismissed via an **X** top-right (confirmed live 2026-06-15). Header is **centered**:
  **"Yollanda"** + a blush **BETA** pill.
- **Empty state** (confirmed live): a large blush **sun-face illustration**, the heading
  **"I am one big ear."**, and the disclaimer subtext **"Even Yollanda sometimes gropes in the
  fog. Verify important information."** — an explicit verify-AI-output caveat.
- **Message input** (confirmed live): a **bottom chat input** with placeholder **"Just ask
  Yollanda"**, a small **sparkle/✦ icon** to the left of the send control, and a **send (↑)
  button** — i.e. a conversational, natural-language chat assistant. `TODO(verify)` the
  function of the **sparkle/✦ icon** (context / scope / model selector?); attachments / voice.
- **Conversation transcript** — user prompts + Yollanda's grounded answers. **Not tested live**
  (no query sent this pass). `TODO(verify)` answer format, whether answers cite/link the
  underlying records, and whether responses stream.
- States:
  - **Empty / first open** — sun-face illustration + "I am one big ear." + verify disclaimer
    (confirmed live). `TODO(verify)` whether starter prompts/examples are shown.
  - **Loading** — `TODO(verify)` thinking/typing indicator.
  - **Filled** — Q&A transcript (`TODO(verify)` — not observed live).
  - **Error / "doesn't know"** — `TODO(verify)` how a no-answer or out-of-scope request is
    shown (e.g. "I can't do that — contact your administrator").

### 6.3 Chart Insight (Analytics)
- **Control:** small **Yollanda icon** on a chart or summary card (Analytics only).
- Behaviour: selecting it surfaces the chart's **description + interpretation**; the reference
  notes it **zooms the chart**. `TODO(verify)` exact presentation (inline panel vs popover)
  and whether it reuses the chat overlay.
- States: **available** (icon present, insight computed) · **pending** (chart enabled <1 day
  ago → insight computed overnight, not yet shown) · **absent** (chart has no Insight icon —
  not all charts do).

## 7. Actions & interactions
- **Open chat:** select the header Yollanda icon → overlay opens.
- **Ask a question:** type in any language → grounded answer in the same language, scoped to
  the asker's data access. Two question types: about the data; about Yarmill (§4).
- **Open a chart Insight:** select the chart's Yollanda icon → description + interpretation.
- **Close:** select the **X** top-right of the overlay (confirmed live 2026-06-15).
  `TODO(verify)` whether click-away / Esc also dismiss.
- **What she will NOT do (hard limits — escalate instead):**
  - **Change your instance / configuration** — route to an **administrator**.
  - **Log entries for you** — Yollanda answers; she does not write to the diary/plan.
  - **Pass messages to the Yarmill team** (including anonymous messages to developers).
  - For configuration changes or feedback: talk to an administrator or write to
    `hello@yarmill.com`.
- **Activity log:** Yollanda is read-only over your data, so it writes **nothing** to any
  module's Activity log. `TODO(verify)` whether the chat keeps its own conversation history.

## 8. User journeys / flows (per role)
**Coach — ask about an athlete (data question):** open the header Yollanda icon → "give me a
summary of Simpson Lisa's last season" → grounded summary from Lisa's diary/plan → follow up
"compare April and May" → comparison. Scoped to athletes the coach can access.

**Coach — ask how Yarmill works (how-to question):** open the chat → "how do I publish a
plan" → step-by-step guidance for the workflow, without leaving the app.

**Coach — read a chart (Insight):** in Analytics, on a chart that carries the Yollanda icon →
select it → plain-language description + interpretation. (If the chart was enabled today, the
insight appears tomorrow — computed overnight.)

**Athlete — ask about own data:** open the chat → "summary of my last season" / "bench-press
kilos from my last gym session" → grounded answer scoped to themselves. An athlete cannot ask
about teammates.

**Any role — hits a limit:** ask Yollanda to change a setting or log something → she explains
she can't and points to an administrator / `hello@yarmill.com`. `TODO(verify)` exact wording.

## 9. Use cases / scenarios
- **Quick season read:** a coach asks for "a summary of last season" for an athlete instead of
  paging through the diary.
- **Period comparison:** "compare April and May this season" — trends without building a
  report.
- **Find a moment:** "when did the left shoulder last come up" — locate a note buried in the
  diary.
- **Pull a number:** "bench-press kilos from the last gym session" — a specific value on
  demand.
- **In-app how-to:** "how do I publish a plan" — workflow help without leaving Yarmill.
- **Make a chart legible:** a non-analytical coach opens a chart Insight to get a plain-English
  description + interpretation.
- **Ask in your own language:** a Latvian/German/Polish-speaking user asks and is answered in
  that language.

## 10. Configuration & variants
- Universal: the **header chat** is available to everyone, in both UI generations, across the
  app.
- `[CONFIG]` **Chart Insights** depend on which **Analytics charts are enabled** per instance
  — only some charts carry the Yollanda Insight icon, and an insight appears only the **day
  after** its chart is enabled.
- Universal gate: **data scope = the asker's existing access** (athlete = self; coach = any
  accessible athlete) — not separately configurable for Yollanda.
- `[CONFIG]` / `[ROADMAP]` Teaching Yollanda **sport-specific code meanings** (e.g.
  trick/shooting notation), and giving her access to **watch/sleep data** and **federation
  methodology docs**, are roadmap items — verify status before documenting.

## 11. Edge cases, limits, gotchas
- **Beta accuracy:** answers can be wrong ("gropes in the fog") — verify important info.
- **Beta search bias:** per support guidance, in beta Yollanda may search mainly the **left
  (text) side** of the diary; right-side / numeric data coverage may be partial.
  `TODO(verify)` current behaviour.
- **No writes:** cannot log entries, change config, or message the team — escalate to admin /
  `hello@yarmill.com`.
- **Access wall:** an athlete asking about a teammate gets nothing — scope follows existing
  permissions.
- **Insight latency:** newly enabled charts have **no insight until the next day** (overnight
  compute).
- **Not all charts** carry an Insight icon.
- `TODO(verify)` behaviour when the asker has no data for the question (empty result wording).

## 12. Cross-module integration & data flow
- **← Reality (training diary) + Plan:** the chat's data answers are grounded in the athlete's
  **training log and plan**. See `/en/reality/training-log`, `/en/plan/plan`.
- **← Analytics:** chart **Insights** read the rendered Analytics charts/summary cards and
  produce description + interpretation; computed overnight. See `/en/analytics/analytics`.
- **← Plan / Goals (Document check):** the **Document check** panel in the Goals module is a
  Yollanda persona surface — a dark popover with the blush sun-face illustration and a persona
  quip (e.g. "I see big bad."). Documented in the Goals spec; referenced here as another
  Yollanda touchpoint. See `/en/plan/goals`.
- **Permissions ← platform access model:** Yollanda inherits each user's existing data access
  (athlete = self, coach = accessible athletes); it never widens it.
- **→ nothing written back:** Yollanda is read-only; no Activity-log entries, no changes to
  records or config.
- `[ROADMAP]` Future inputs: sport-specific notations, watch/sleep data, methodology docs.

## 13. Shot list (images for the docs page)
| # | Screen / state | Sample data | Caption (draft) | Callouts | Supports doc section | Role | Render now? |
|---|----------------|-------------|-----------------|----------|----------------------|------|-------------|
| 1 | Chat overlay — data question (dark panel, blush accents) | Coach asks "summary of Simpson Lisa's last season"; grounded answer | "Ask in your own language — Yollanda answers from your Yarmill, scoped to what you can see." | Header Yollanda icon · message input · grounded answer | Ask Yollanda | coach | NO — shot-list only (new-GUI render later, once live framing confirmed) |
| 2 | Header entry point | App header with the blush Yollanda icon (+ BETA badge) | "Open Yollanda from the icon in the header — it's there on every screen." | the header icon | How to open | everyone | NO — shot-list only |
| 3 | Chat overlay — how-to question | "how do I publish a plan" → step guidance | "She also explains how Yarmill works — where to click." | the answer | Two kinds of questions | coach | NO — shot-list only |
| 4 | Chart Insight (Analytics) | A chart with the small Yollanda icon → description + interpretation | "On charts, the Yollanda icon turns a graph into plain language." | the Insight icon · the interpretation text | Insights on charts | coach | NO — shot-list only |
| 5 | Athlete chat (own data) | Athlete (Lisa) asks "summary of my last season" | "As an athlete you can ask only about your own data." | "scoped to you" | What athletes see | athlete | NO — shot-list only |

> All renders deferred — see §0 "Render images now? NO". The existing docs page currently
> ships without screenshots; add these as new-GUI renders once the overlay is opened live.

## 14. Open questions / TODO(verify)
- **Answer format & capabilities:** what Yollanda actually returns, which data it grounds on,
  and the full set of question types it handles — **not tested live this pass** (no query sent
  to avoid side effects); stays reference-grounded.
- **Sparkle/✦ icon function:** the small icon left of the send button — context / scope / model
  selector? Confirm live.
- **History/threads:** does the chat persist conversation history across sessions / support
  multiple threads, or reset per open?
- **Per-role differences:** coach vs athlete — what each can see in-UI (data-scope rule is
  reference-grounded; confirm in the live answer surface).
- **Per-instance enablement:** is the header chat ever gated off for some instances?
- **Citations:** do data answers link back to the underlying records?
- **Chat UI details (untested):** send via Enter vs button, attachments/voice, streaming,
  starter prompts, loading indicator, error/"can't do that" wording.
- **Insight presentation:** inline panel vs popover; whether it reuses the chat overlay; exact
  "zoom the chart" behaviour.
- **Surfaces:** native iOS / Android availability + parity.
- **Beta search bias:** is the "searches mainly the left/text side" limitation still current?
- **Dismiss:** confirm whether click-away / Esc also close the overlay (X confirmed).
- *Resolved live 2026-06-15:* entry icon = blush sun-face in the header (absent on Settings);
  full-screen **light** overlay with X close; centered "Yollanda" header + blush **BETA** pill;
  empty state "I am one big ear." + verify disclaimer; bottom chat input "Just ask Yollanda"
  with sparkle/✦ icon + send (↑) button. Document check (Goals) confirmed as a Yollanda surface.
- *Grounded (no TODO):* universal availability + header entry, two question types, language
  behaviour, data-scope rule, beta disclaimer, chart Insights + overnight latency, and the
  hard limits (no config/logging/messaging) — all from master reference §5.12 + existing page.

## 15. Source log
Drafted **2026-06-15** from the **master reference §5.12** (Yollanda — the AI layer) and the
existing user-facing page `en/platform/yollanda.mdx`.

**Live-verified 2026-06-15** — clean coach session on **we.yarmill.com**, coach **"Bart
Simpson"**, **classic top-nav UI**. Confirmed: the **blush sun-face Yollanda icon** in the
header (present on most pages, **absent on Settings**); a **full-screen LIGHT overlay** with an
**X** close top-right and a centered **"Yollanda" + blush BETA pill** header; the empty state
(blush sun-face illustration, **"I am one big ear."**, and the **"Even Yollanda sometimes
gropes in the fog. Verify important information."** disclaimer); and the bottom chat input with
placeholder **"Just ask Yollanda"**, a **sparkle/✦** icon, and a **send (↑)** button. **No
query was sent** (to avoid side effects), so Yollanda's **answer format and capabilities remain
reference-grounded / `TODO(verify)`**. The **Document check** popover (Goals) was confirmed as
another Yollanda persona surface. Demo cast used for examples only.

**Confidence: high** on the overlay chrome (now live-confirmed) and on what Yollanda *does*
per the reference — entry points (header chat + chart Insights + Goals Document check), the two
question types, language behaviour, the access-scoped data rule, the beta disclaimer, overnight
insight latency, and the hard limits (no config changes, no logging, no messaging the team;
escalate to admin / `hello@yarmill.com`). **Confidence: low / `TODO(verify)`** on the in-UI
answer surface — answer format, capabilities/grounding scope, the sparkle/✦ icon's function,
history/threads, citations, and per-role/per-instance differences (§6/§14), to be captured live
before any render. Internal background: Yollanda is backed by Nunjucks/Jinja prompt templates
in `internal/` (kept excluded from Mintlify).

## 16. Docs page plan
> The existing page (`en/platform/yollanda.mdx`) already follows this shape — this plan
> matches it and notes where the spec can deepen it.
- **Audience line:** `**For:** everyone (you see only data you have access to) · **Where:** Web app`
- **Proposed page outline** (H2s → which spec sections feed them):
  | Page section (H2) | Fed by |
  |-------------------|--------|
  | intro + audience line + grounded-not-generic framing | §1, §0 |
  | Ask Yollanda (open from header; two question types; language; access scope) + `<Info>` beta note | §4, §5, §6.1–6.2, §3, §11 |
  | Insights on charts | §4, §6.3, §12 |
  | What she can't do (no config/logging/messaging → admin / hello@yarmill.com) | §7, §10 |
- **Cross-links** (exact paths to link from this page):
  - `/en/analytics/analytics` — Insights on charts.
  - `/en/reality/training-log` and `/en/plan/plan` — the data Yollanda answers over.
- **UI label → doc term:**
  | UI label | Doc term |
  |----------|----------|
  | Yollanda (Jolanda / Yolanda) | Yollanda |
  | Insight icon (on charts) | Insights on charts |
  | Chat overlay | the chat |
  | Totem panel / icon rail | (internal only — name the module, not the shell) |
