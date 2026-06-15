// Build the search index consumed by the ⌘K palette.
// Walks content/docs/**.mdx, parses frontmatter, strips MDX/markdown syntax to
// plain text, and resolves each page's group from .scaffold-ref/docs.json.
// Output: lib/search-index.json — an array of { id, url, title, group, headings, text }.
//
// Runs as `prebuild`; also safe to run ad-hoc (node scripts/build-search-index.mjs).

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, 'content/docs');
const SCAFFOLD = path.join(ROOT, '.scaffold-ref/docs.json');
const OUT = path.join(ROOT, 'lib/search-index.json');
const LANG = 'en';

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(abs));
    else if (/\.mdx?$/.test(entry.name)) out.push(abs);
  }
  return out;
}

function fileToSlugs(abs) {
  const rel = path.relative(CONTENT_ROOT, abs).replace(/\\/g, '/').replace(/\.mdx?$/, '');
  const parts = rel.split('/');
  if (parts[parts.length - 1] === 'index') parts.pop();
  return parts;
}

function urlOf(slugs) {
  const u = '/' + [LANG, ...slugs].join('/');
  return u.replace(/\/$/, '') || `/${LANG}`;
}

// Group lookup: url -> group label, from the scaffold nav.
function buildGroupMap() {
  const map = new Map();
  try {
    const json = JSON.parse(fs.readFileSync(SCAFFOLD, 'utf8'));
    const anchors = json?.navigation?.languages?.[0]?.anchors ?? [];
    const visit = (groups) => {
      for (const g of groups) {
        for (const ref of g.pages ?? []) {
          if (typeof ref === 'string') {
            if (ref.includes(' ') || ref.startsWith('/')) continue;
            const parts = ref.split('/');
            if (parts[0] === 'en') parts.shift();
            if (parts[parts.length - 1] === 'index') parts.pop();
            map.set(urlOf(parts), g.group);
          } else if (ref && ref.pages) {
            visit([ref]);
          }
        }
      }
    };
    for (const a of anchors) visit(a.groups ?? []);
  } catch {
    /* no scaffold — leave groups empty */
  }
  return map;
}

// Extract h2/h3 heading text and a stripped plain-text body.
function extract(body) {
  const headings = [];
  for (const line of body.split('\n')) {
    const m = /^(#{2,3})\s+(.*)$/.exec(line.trim());
    if (m) headings.push(m[2].replace(/[#*`_]/g, '').trim());
  }
  const text = body
    .replace(/```[\s\S]*?```/g, ' ') // code fences
    .replace(/<[^>]+>/g, ' ') // jsx/html tags
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ') // mdx comments
    .replace(/[#>*_`|-]/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/\s+/g, ' ')
    .trim();
  return { headings, text };
}

function main() {
  const groupMap = buildGroupMap();
  const files = walk(CONTENT_ROOT).sort();
  const docs = files.map((abs) => {
    const raw = fs.readFileSync(abs, 'utf8');
    const { data, content } = matter(raw);
    const slugs = fileToSlugs(abs);
    const url = urlOf(slugs);
    const { headings, text } = extract(content);
    return {
      id: url,
      url,
      title: data.sidebarTitle || data.title || slugs[slugs.length - 1] || 'Home',
      group: groupMap.get(url) || '',
      headings,
      text: text.slice(0, 4000),
    };
  });
  fs.writeFileSync(OUT, JSON.stringify(docs));
  console.log(`[search] wrote ${docs.length} docs -> ${path.relative(ROOT, OUT)}`);
}

main();
