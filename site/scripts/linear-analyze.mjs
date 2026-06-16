#!/usr/bin/env node
/** Quick distribution report over the raw cache, to design curation rules. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '.cache/linear');
const { issues } = JSON.parse(fs.readFileSync(path.join(dir, 'issues.json')));

const tally = (arr, key) => {
  const m = new Map();
  for (const x of arr) {
    const k = key(x) ?? '∅';
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};
const show = (label, pairs, n = 40) => {
  console.log(`\n${label}`);
  for (const [k, v] of pairs.slice(0, n)) console.log(`  ${String(v).padStart(5)}  ${k}`);
};

// Project-name "buckets" (these turned out to be monthly ops categories, not features)
const baseName = (n) => (n ?? '∅').replace(/\s*\d{4}-\d{2}\s*$/, '').trim();
show('Issue count by project base-name (date suffix stripped):', tally(issues, (i) => baseName(i.project?.name)));

// Label families actually in use
const allLabels = tally(issues.flatMap((i) => (i.labels?.nodes ?? []).map((l) => l.name)), (x) => x);
show('Top labels on issues:', allLabels, 35);

// Description availability (narrative source on the issue itself)
const withDesc = issues.filter((i) => (i.description ?? '').trim().length > 40).length;
console.log(`\nIssues with a real description (>40 chars): ${withDesc} / ${issues.length}`);

// Priority distribution (signal for "headline-worthy")
show('By priority (0=none,1=urgent,2=high,3=med,4=low):', tally(issues, (i) => String(i.priority)));

// Sample recent titles — can we cluster on them?
const recent = issues
  .filter((i) => (i.completedAt ?? '') >= '2026-05')
  .sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1));
console.log(`\nSample titles completed since 2026-05 (${recent.length} total, showing 45):`);
for (const i of recent.slice(0, 45)) {
  const ls = (i.labels?.nodes ?? []).map((l) => l.name).filter((n) => ['bug', 'task'].includes(n));
  console.log(`  [${i.team?.key}|${ls.join(',') || '—'}|${baseName(i.project?.name)}] ${i.title}`);
}
