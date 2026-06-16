#!/usr/bin/env node
/**
 * linear-curate.mjs — turn the raw Linear cache into a reviewable changelog plan.
 *
 * Deterministic, no AI: filter window → drop internal/client/config → split
 * bug vs change → cluster by month × theme → rank → emit changelog-plan.json.
 * The prose + visuals come later (per cluster), this just decides WHAT ships.
 *
 *   node scripts/linear-curate.mjs          # writes plan + prints per-month summary
 *   node scripts/linear-curate.mjs 2026-05  # also dumps the full cluster for one month
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROJECT_CATEGORY, CLIENT_PREFIXES, DEFAULT_CATEGORY, VALID_CATEGORIES } from './linear-categories.mjs';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '.cache/linear');
const { issues } = JSON.parse(fs.readFileSync(path.join(dir, 'issues.json')));

// Fail loudly on a mistyped category in the map (e.g. "feauture").
for (const [proj, cat] of Object.entries(PROJECT_CATEGORY)) {
  if (!VALID_CATEGORIES.includes(cat)) {
    throw new Error(`Invalid category "${cat}" for project "${proj}". Allowed: ${VALID_CATEGORIES.join(', ')}`);
  }
}

// Last 12 months (per agreed scope): 2025-06 .. 2026-06.
const WINDOW_START = '2025-06-01';
const HEADLINE_MIN = 2; // a 'feature' theme needs ≥2 kept issues (or a high-prio one) to headline

const baseName = (n) => (n ?? '∅').replace(/\s*\d{4}-\d{2}\s*$/, '').trim();
const categoryOf = (i) => PROJECT_CATEGORY[baseName(i.project?.name)] ?? DEFAULT_CATEGORY;
const labels = (i) => (i.labels?.nodes ?? []).map((l) => l.name);
const isBug = (i) => labels(i).includes('bug') || /^bug[:\s]/i.test(i.title);
// Per-instance config work: title leads with a client code, or "BUG:"/client prefix.
const clientPrefixRe = new RegExp(`^(${CLIENT_PREFIXES.join('|')})\\b`, 'i');
const isClientConfig = (i) => clientPrefixRe.test(i.title.replace(/^bug:\s*/i, ''));

const slim = (i) => ({
  id: i.identifier,
  title: i.title,
  description: (i.description ?? '').slice(0, 600),
  priority: i.priority,
  theme: baseName(i.project?.name),
  labels: labels(i).filter((l) => !['task', 'bug'].includes(l)),
  url: i.url,
  completedAt: i.completedAt,
});

// --- detect unmapped projects (keeps the category map honest as Linear grows) ---
const mapped = new Set(Object.keys(PROJECT_CATEGORY));
const unmapped = new Map(); // base-name -> { count, samples[] }
for (const i of issues) {
  if (!i.completedAt || i.completedAt < WINDOW_START) continue;
  const bn = baseName(i.project?.name);
  if (mapped.has(bn) || bn === '∅') continue;
  if (!unmapped.has(bn)) unmapped.set(bn, { count: 0, samples: [] });
  const u = unmapped.get(bn);
  u.count++;
  if (u.samples.length < 4) u.samples.push(i.title);
}
const unmappedProjects = [...unmapped.entries()]
  .map(([name, v]) => ({ name, ...v }))
  .sort((a, b) => b.count - a.count);

// --- filter + bucket -------------------------------------------------------
const stats = { total: 0, dropInternal: 0, dropClient: 0, dropConfig: 0, dropReview: 0, kept: 0 };
const minedClient = []; // client work that might hide a generalizable feature
const byMonth = new Map();

for (const i of issues) {
  if (!i.completedAt || i.completedAt < WINDOW_START) continue;
  stats.total++;
  const cat = categoryOf(i);

  if (cat === 'internal') { stats.dropInternal++; continue; }
  if (cat === 'review') { stats.dropReview++; continue; } // includes unmapped (DEFAULT_CATEGORY)
  if (cat === 'client') {
    stats.dropClient++;
    if (i.priority && i.priority <= 2) minedClient.push(slim(i)); // surface notable client work to mine
    continue;
  }
  // kept theme ('feature' | 'improvement' | 'maintenance') — still drop per-instance config
  if (isClientConfig(i)) { stats.dropConfig++; continue; }

  stats.kept++;
  const month = i.completedAt.slice(0, 7);
  if (!byMonth.has(month)) byMonth.set(month, []);
  byMonth.get(month).push({ ...slim(i), category: cat, kind: isBug(i) ? 'fix' : 'change' });
}

// --- cluster each month into headlines / improvements / fixes --------------
const prioRank = (arr) => arr.sort((a, b) => (a.priority || 5) - (b.priority || 5));
const months = [...byMonth.keys()].sort().reverse().map((month) => {
  const items = byMonth.get(month);
  const changes = items.filter((x) => x.kind === 'change');
  const fixes = prioRank(items.filter((x) => x.kind === 'fix'));

  // group changes by theme
  const themes = new Map();
  for (const x of changes) {
    if (!themes.has(x.theme)) themes.set(x.theme, []);
    themes.get(x.theme).push(x);
  }
  const headlines = [];
  const improvements = [];
  for (const [theme, list] of themes) {
    const cat = list[0].category;
    const highPrio = list.some((x) => x.priority && x.priority <= 2);
    if (cat === 'feature' && (list.length >= HEADLINE_MIN || highPrio)) {
      headlines.push({ theme, issues: prioRank(list) });
    } else {
      improvements.push(...list);
    }
  }
  headlines.sort((a, b) => b.issues.length - a.issues.length);
  return { month, headlines, improvements: prioRank(improvements), fixes };
});

const plan = { generatedFor: 'last-12-months', window: WINDOW_START, stats, months, minedClient, unmappedProjects };
fs.writeFileSync(path.join(dir, '..', 'changelog-plan.json'), JSON.stringify(plan, null, 2));

// --- report ----------------------------------------------------------------
console.log('De-noise funnel (last 12 months):');
console.log(`  ${stats.total} completed → kept ${stats.kept}  (dropped: ${stats.dropInternal} internal, ${stats.dropClient} client, ${stats.dropConfig} config, ${stats.dropReview} review)`);

if (unmappedProjects.length) {
  console.log(`\n⚠ ${unmappedProjects.length} UNMAPPED project area(s) in this window (currently dropped as 'review' — add to linear-categories.mjs):`);
  for (const u of unmappedProjects) console.log(`     ${String(u.count).padStart(4)}  ${u.name}   e.g. "${u.samples[0]}"`);
}
console.log(`\nPer-month plan  (H = headline themes, I = improvements, F = fixes):`);
for (const m of months) {
  console.log(`\n  ${m.month}  —  ${m.headlines.length}H · ${m.improvements.length}I · ${m.fixes.length}F`);
  for (const h of m.headlines) console.log(`     ★ ${h.theme}  (${h.issues.length})`);
}
console.log(`\n  ${minedClient.length} high-priority client items set aside to mine for generalizable features.`);
console.log('\nWrote scripts/.cache/changelog-plan.json');

// flat dated timeline of kept items — the input for clustering into shipment posts.
//   node scripts/linear-curate.mjs timeline [YYYY-MM | YYYY-MM-DD]
if (process.argv[2] === 'timeline') {
  const since = process.argv[3] || '';
  const flat = [...byMonth.values()].flat()
    .filter((x) => x.completedAt.slice(0, since.length) >= since || x.completedAt >= since)
    .sort((a, b) => (a.completedAt < b.completedAt ? -1 : 1));
  console.log(`\nDated timeline of ${flat.length} kept items${since ? ` since ${since}` : ''} (date · kind · category · theme · title):`);
  for (const x of flat) {
    const d = x.completedAt.slice(0, 10);
    const k = x.kind === 'fix' ? 'FIX' : 'chg';
    console.log(`  ${d}  ${k}  [${x.category[0]}|${x.theme.slice(0, 22).padEnd(22)}] ${x.title}`);
  }
}

// optional deep-dump of one month
const focus = process.argv[2];
if (focus && focus !== 'timeline') {
  const m = months.find((x) => x.month === focus);
  if (!m) { console.log(`\n(no data for ${focus})`); }
  else {
    console.log(`\n──────── ${focus} full cluster ────────`);
    for (const h of m.headlines) {
      console.log(`\n★ HEADLINE: ${h.theme}`);
      for (const x of h.issues) console.log(`   [P${x.priority}] ${x.title}`);
    }
    console.log(`\n▸ IMPROVEMENTS (${m.improvements.length}):`);
    for (const x of m.improvements) console.log(`   [${x.theme}] ${x.title}`);
    console.log(`\n▸ FIXES (${m.fixes.length}):`);
    for (const x of m.fixes) console.log(`   [${x.theme}] ${x.title}`);
  }
}
