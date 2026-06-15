#!/usr/bin/env node
// Generate Fumadocs meta.json sidebar ordering from the Mintlify docs.json.
//
// Reads .scaffold-ref/docs.json. Its navigation.languages[0].anchors[].groups[]
// define sidebar group titles + page order. We flatten that into a single root
// content/docs/meta.json using "---Group Title---" separators, converting page
// paths from `en/plan/goals` form to `plan/goals` (content lives under
// content/docs, the `/en` prefix is added by i18n at the URL layer).
//
// Mintlify "anchors" (Guides / Tutorials / API Reference / Changelog) are the
// top-level tabs; here we render each anchor as a "===Anchor===" separator
// followed by its groups, preserving order. OpenAPI auto-endpoint pages
// (e.g. "POST /api/data/upload") are skipped — there is no MDX for them.
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const docsJsonPath = join(here, '..', '.scaffold-ref', 'docs.json');
const outPath = join(here, '..', 'content', 'docs', 'meta.json');

const cfg = JSON.parse(await readFile(docsJsonPath, 'utf8'));
const anchors = cfg.navigation.languages[0].anchors;

const stripEn = (p) => (p.startsWith('en/') ? p.slice(3) : p);
const isOpenApiEndpoint = (p) => /^(GET|POST|PUT|PATCH|DELETE)\s/i.test(p);

const pages = [];

// Collect a group's real (MDX-backed) entries; emit its heading only if it
// produced at least one — so the OpenAPI-only "Endpoints" group is dropped,
// while nested groups like Sport-specific → Biathlon are preserved.
const groupEntries = (group) => {
  const out = [];
  for (const page of group.pages) {
    if (typeof page === 'string') {
      if (isOpenApiEndpoint(page)) continue; // no MDX backing
      out.push(stripEn(page));
    } else if (page && typeof page === 'object' && Array.isArray(page.pages)) {
      const sub = page.pages
        .filter((p) => typeof p === 'string' && !isOpenApiEndpoint(p))
        .map(stripEn);
      if (sub.length) out.push(`---${page.group}---`, ...sub);
    }
  }
  return out;
};

for (const anchor of anchors) {
  for (const group of anchor.groups) {
    const entries = groupEntries(group);
    if (!entries.length) continue;
    pages.push(`---${group.group}---`, ...entries);
  }
}

const meta = {
  root: true,
  pages,
};

await writeFile(outPath, JSON.stringify(meta, null, 2) + '\n', 'utf8');
console.log(`Wrote ${outPath} with ${pages.length} entries.`);
console.log(JSON.stringify(meta, null, 2));
