// Prebuild: emit each doc's raw Markdown source as a static .md file under
// public/raw/, mirroring its page URL — e.g. /en/plan/goals -> public/raw/en/
// plan/goals.md, and the home page /en -> public/raw/en.md.
//
// This replaces a Route Handler so the site works as a pure static export
// (`output: 'export'`): real .md files serve with a sane MIME on any static host
// and, crucially, the file extension prevents the file-vs-directory name clash a
// section index would otherwise cause (e.g. `raw/en` the file vs `raw/en/` the
// directory). Consumed by the "Copy page" / "View as Markdown" controls.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, 'content/docs');
const OUT_ROOT = path.join(ROOT, 'public/raw');
const LANG = 'en';

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(abs));
    else if (entry.isFile() && /\.mdx?$/.test(entry.name)) out.push(abs);
  }
  return out;
}

// Same mapping as lib/content.ts: strip extension, split, and collapse a
// trailing `index` segment to its parent directory.
function fileToSlugs(abs) {
  const rel = path.relative(CONTENT_ROOT, abs).replace(/\\/g, '/');
  const parts = rel.replace(/\.mdx?$/, '').split('/');
  if (parts[parts.length - 1] === 'index') parts.pop();
  return parts;
}

if (!fs.existsSync(CONTENT_ROOT)) {
  console.log('[raw-md] no content/docs — skipping');
  process.exit(0);
}

fs.rmSync(OUT_ROOT, { recursive: true, force: true });

let n = 0;
for (const file of walk(CONTENT_ROOT)) {
  const segments = [LANG, ...fileToSlugs(file)];
  const target = path.join(OUT_ROOT, ...segments) + '.md';
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(file, target);
  n++;
}

console.log(`[raw-md] wrote ${n} raw sources -> public/raw/`);
