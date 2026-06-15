#!/usr/bin/env node
// Codemod: remove ONLY the Mintlify `/snippets/*.jsx` import lines from the
// MDX content under site/content/docs. These components (PageMeta, TutorialMeta)
// are now provided globally via the Fumadocs MDX components provider, so the
// per-file imports must go or the build fails.
//
// Operates only on the copies under site/content/docs. Idempotent.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'docs');

// Matches lines like:  import { PageMeta } from "/snippets/page-meta.jsx";
const IMPORT_RE = /^\s*import\s+.*from\s+["']\/snippets\/[^"']+\.jsx["'];?\s*$/;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (entry.name.endsWith('.mdx')) out.push(p);
  }
  return out;
}

let changed = 0;
let removed = 0;
for (const file of await walk(root)) {
  const original = await readFile(file, 'utf8');
  const lines = original.split('\n');
  const kept = lines.filter((l) => !IMPORT_RE.test(l));
  const cut = lines.length - kept.length;
  if (cut > 0) {
    await writeFile(file, kept.join('\n'), 'utf8');
    changed += 1;
    removed += cut;
    console.log(`stripped ${cut} import(s): ${file.replace(root, 'content/docs')}`);
  }
}
console.log(`\nDone. ${changed} file(s) modified, ${removed} import line(s) removed.`);
