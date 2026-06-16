/**
 * linear-categories.mjs — the curation map that turns Linear's engineering
 * tracker into a product-facing changelog.
 *
 * Keyed by PROJECT BASE-NAME (the monthly date suffix like " 2026-05" stripped).
 * Each project area is assigned a category that decides how its issues are used:
 *
 *   'feature'      → headline-worthy theme; clusters into its own changelog entry
 *   'improvement'  → kept, but flows into the month's "Improvements" list
 *   'maintenance'  → mostly internal (ops, tech-debt, security/infra/perf), but
 *                    MINED for the few user-noticeable fixes & small improvements.
 *                    Never headlines. The editorial pass drops pure plumbing.
 *   'internal'     → DROPPED entirely (planning, migrations, experiments)
 *   'client'       → DROPPED as instance/config work, but MINED for generalizable
 *                    features (e.g. a new integration first built for one client)
 *   'review'       → UNSURE — reclassify before the curation run
 *
 * Edit freely. Anything not listed here defaults to 'review' so nothing is
 * silently included or dropped.
 */
export const PROJECT_CATEGORY = {
  // ── Headline product themes ─────────────────────────────────────────────
  'Yollanda': 'feature',                 // the AI assistant
  'Medical module': 'feature',
  'Season Calendar': 'feature',
  'VALD API integration': 'feature',
  'Oura ring': 'feature',
  'Apple Watch / HeathKit integration': 'feature',
  'WHOOP integrace': 'feature',
  'FIS integration & analytics': 'feature',
  'IBU SIWI DATA - zlepseni integrace a reporting': 'feature',
  'CASRI API - Biochemie': 'feature',
  'Yarmill design system': 'feature',    // the GUI 2.0 refresh
  'OKRs - 1.3': 'feature', // Goals module improvements
  'OKRs - 2.0': 'feature', // Goals module improvements
  'Metoděj': 'feature', // stopped, archived for now

  // ── Area improvements (smaller, roll into monthly "Improvements") ────────
  'Analytics': 'improvement',
  'Analytical framework': 'improvement',
  'Evidence improvements': 'improvement',
  'Sportwatch data improvements': 'improvement',
  'HR Zones in Yarmill - improvements': 'improvement',
  'UI / UX Improvements': 'improvement',

  // ── Maintenance: internal-leaning, but mine for user-noticeable fixes/tweaks ─
  'Operational Needs': 'maintenance', // mostly ops, but holds real bug fixes & small improvements
  'Tech Debt': 'maintenance',
  'SIP': 'maintenance', // security, infrastructure, performance

  // ── Internal / not user-facing → dropped entirely ────────────────────────
  'Migrace na SQL Server 2025': 'internal',
  'Accounting a účtování Yarmilla': 'internal',
  'Copilot - ML Hratky': 'internal', // internal experiment

  // ── Per-client / instance work → dropped, but mined for features ─────────
  'FC Zbrojovka Brno': 'client',
  'FK Pardubice': 'client',
  'ASC Dukla': 'client',
  'ASC Dukla - projekt pro Q1 2026': 'client',
  'SK Sigma Olomouc': 'client',
  'FC Viktoria Plzeň': 'client',
  'CVS veslovani': 'client',
  'CSPS - pozadavky': 'client',
  'CSB': 'client',
  'Biathlon Canada': 'client',
  'AC BALUO propojeni mezi instancema': 'client',
  'Slovensky zvaz biatlonu - nova biatlonova instance': 'client',
  'Aqualytica': 'client',
  'Sailing Results Integration & Reports': 'client', // sailing-federation-specific effort

  // ── AI-proposed 2026-06-16 — confirm (surfaced as unmapped during the 12-mo build) ──
  'Dexcom': 'feature',                                    // AI-proposed — confirm: new CGM integration (is it GA?)
  'Product Improvements': 'improvement',                  // AI-proposed — confirm
  'Maintenance Yarmilla': 'maintenance',                  // AI-proposed — confirm: scheduled downtime/ops
  'Tech debt - backlog': 'maintenance',                   // AI-proposed — confirm
  'Analytics - Backlog': 'maintenance',                   // AI-proposed — confirm: code cleanup in reports
  'Prechod ze styled components na CSS moduly': 'internal', // AI-proposed — confirm: FE refactor
  'Yarmill Docs 🐶 & Internal Marketing': 'internal',     // AI-proposed — confirm
  'Marketing': 'internal',                                // AI-proposed — confirm
  'Superuser': 'internal',                                // AI-proposed — confirm: internal admin tooling
  'AppParade': 'internal',                                // AI-proposed — confirm: demo for an event
  'FTK UPOL - Early Warning System': 'client',            // AI-proposed — confirm: FTK UPOL-specific R&D
  'IBU Closing the Gap - Analytics - Race Strategy': 'client', // AI-proposed — confirm: IBU federation programme
  'Weekly dashboard v2': 'review',                        // AI-proposed — confirm: is "v2" GA yet?
  'Fotbalový balíček': 'review',                          // AI-proposed — confirm: product package or per-client?
};

/** Title prefixes that mark per-instance config work (dropped even under a kept theme). */
export const CLIENT_PREFIXES = ['FCVP', 'Sigma', 'BBU', 'CSPS', 'SZB', 'FKPCE', 'FCZB', 'CSB', 'CVS'];

/** Default for any project area not listed above. */
export const DEFAULT_CATEGORY = 'review';

/** Allowed category values — curation validates the map against this and fails
 *  loudly on a typo (e.g. "feauture") so the map can't silently mis-route work. */
export const VALID_CATEGORIES = ['feature', 'improvement', 'maintenance', 'internal', 'client', 'review'];
