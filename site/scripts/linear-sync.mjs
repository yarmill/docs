#!/usr/bin/env node
/**
 * linear-sync.mjs — pull raw data from Linear for the changelog pipeline.
 *
 * Usage:
 *   node scripts/linear-sync.mjs probe        # auth check + list teams/labels/counts
 *   node scripts/linear-sync.mjs pull         # full extraction -> scripts/.cache/linear/*.json
 *
 * Auth: set LINEAR_API_KEY in site/.env.local (gitignored). A personal API key
 * from Linear → Settings → Security & access → API. Sent verbatim in the
 * Authorization header (Linear personal keys are NOT prefixed with "Bearer").
 *
 * Scope (per the agreed plan): ALL teams, FULL history (or since LINEAR_SINCE=YYYY-MM-DD),
 * grouped downstream by calendar month. This script only EXTRACTS; curation/
 * classification happens in linear-curate.mjs.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.join(__dirname, '..');
const CACHE_DIR = path.join(SITE_ROOT, 'scripts/.cache/linear');
const ENDPOINT = 'https://api.linear.app/graphql';

// --- env -------------------------------------------------------------------
// Node 20.12+ can load .env.local natively; fall back to a tiny parser.
try {
  process.loadEnvFile?.(path.join(SITE_ROOT, '.env.local'));
} catch {
  /* no .env.local — rely on the ambient environment */
}
const API_KEY = process.env.LINEAR_API_KEY;
const SINCE = process.env.LINEAR_SINCE || null; // e.g. "2023-01-01"

if (!API_KEY) {
  console.error(
    'Missing LINEAR_API_KEY. Add it to site/.env.local:\n' +
      "  echo 'LINEAR_API_KEY=lin_api_xxx' >> site/.env.local",
  );
  process.exit(1);
}

// --- GraphQL client with pagination + rate-limit backoff -------------------
async function gql(query, variables = {}) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: API_KEY },
      body: JSON.stringify({ query, variables }),
    });

    if (res.status === 429) {
      const wait = Number(res.headers.get('retry-after') ?? 2 ** attempt) * 1000;
      console.warn(`  rate-limited, waiting ${wait}ms…`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    const json = await res.json();
    if (json.errors) {
      throw new Error('GraphQL error: ' + JSON.stringify(json.errors, null, 2));
    }
    return json.data;
  }
}

/** Page through a connection. `pick` returns the connection node from the data. */
async function paginate(query, variables, pick, label) {
  const out = [];
  let cursor = null;
  let page = 0;
  do {
    const data = await gql(query, { ...variables, after: cursor });
    const conn = pick(data);
    out.push(...conn.nodes);
    cursor = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null;
    page++;
    process.stdout.write(`\r  ${label}: ${out.length} (page ${page})   `);
  } while (cursor);
  process.stdout.write('\n');
  return out;
}

// --- queries ---------------------------------------------------------------
const Q_VIEWER = `query { viewer { id name email } organization { name urlKey } }`;

const Q_TEAMS = `query { teams(first: 250) { nodes { id key name } } }`;

const Q_LABELS = `query { issueLabels(first: 250) { nodes { id name } } }`;

const Q_ISSUES = `
  query Issues($after: String, $filter: IssueFilter) {
    issues(first: 100, after: $after, filter: $filter,
           orderBy: updatedAt) {
      pageInfo { hasNextPage endCursor }
      nodes {
        identifier title description url
        completedAt priority estimate
        team { key name }
        state { name type }
        labels { nodes { name } }
        project { id name }
        parent { id identifier }
      }
    }
  }`;

const Q_PROJECTS = `
  query Projects($after: String) {
    projects(first: 50, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id name description state url
        startedAt completedAt
        lead { name }
        projectUpdates(last: 5) { nodes { body health createdAt } }
      }
    }
  }`;

// --- modes -----------------------------------------------------------------
function completedFilter() {
  const filter = { state: { type: { eq: 'completed' } } };
  if (SINCE) filter.completedAt = { gte: `${SINCE}T00:00:00.000Z` };
  return filter;
}

async function probe() {
  const v = await gql(Q_VIEWER);
  console.log(`✓ Authenticated as ${v.viewer.name} <${v.viewer.email}>`);
  console.log(`  Org: ${v.organization.name} (${v.organization.urlKey})`);

  const teams = (await gql(Q_TEAMS)).teams.nodes;
  console.log(`\nTeams (${teams.length}):`);
  for (const t of teams) console.log(`  ${t.key.padEnd(6)} ${t.name}`);

  const labels = (await gql(Q_LABELS)).issueLabels.nodes;
  console.log(`\nLabels (${labels.length}) — used to classify & de-noise:`);
  console.log('  ' + labels.map((l) => l.name).join(', '));

  console.log(
    `\nBackfill window: ${SINCE ? `since ${SINCE}` : 'FULL history'} (set LINEAR_SINCE=YYYY-MM-DD to limit).`,
  );
  console.log('Next: node scripts/linear-sync.mjs pull');
}

async function pull() {
  await fs.mkdir(CACHE_DIR, { recursive: true });

  console.log('Pulling completed issues…');
  const issues = await paginate(
    Q_ISSUES,
    { filter: completedFilter() },
    (d) => d.issues,
    'issues',
  );

  console.log('Pulling projects…');
  const projects = await paginate(Q_PROJECTS, {}, (d) => d.projects, 'projects');

  const stamp = new Date().toISOString();
  await fs.writeFile(
    path.join(CACHE_DIR, 'issues.json'),
    JSON.stringify({ pulledAt: stamp, since: SINCE, issues }, null, 2),
  );
  await fs.writeFile(
    path.join(CACHE_DIR, 'projects.json'),
    JSON.stringify({ pulledAt: stamp, projects }, null, 2),
  );

  console.log(
    `\n✓ Wrote ${issues.length} issues + ${projects.length} projects to scripts/.cache/linear/`,
  );
  console.log('Next: node scripts/linear-curate.mjs');
}

const mode = process.argv[2];
if (mode === 'probe') await probe();
else if (mode === 'pull') await pull();
else {
  console.error('Usage: node scripts/linear-sync.mjs <probe|pull>');
  process.exit(1);
}
