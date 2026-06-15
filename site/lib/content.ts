import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

/**
 * Content layer (no Fumadocs). Recursively reads `content/docs/**.mdx`, parses
 * YAML frontmatter with gray-matter, and exposes a flat list of page records.
 *
 * URL rules (single locale `en`):
 *   content/docs/index.mdx            -> /en
 *   content/docs/tutorials/index.mdx  -> /en/tutorials
 *   content/docs/plan/goals.mdx       -> /en/plan/goals
 *
 * `slugs` is the path segments AFTER the lang (e.g. ['plan','goals']); for the
 * home page it is `[]`. This is what `generateStaticParams` and the routing
 * `[[...slug]]` segment consume.
 */

export interface Frontmatter {
  title?: string;
  description?: string;
  icon?: string;
  sidebarTitle?: string;
  mode?: string;
  [key: string]: unknown;
}

export interface PageRecord {
  /** Path segments after the lang prefix; [] for the home page. */
  slugs: string[];
  lang: 'en';
  /** Root-relative URL, e.g. `/en/plan/goals` or `/en`. */
  url: string;
  frontmatter: Frontmatter;
  /** Raw MDX body (frontmatter stripped). */
  body: string;
  /** Absolute path to the source file. */
  filePath: string;
}

export const LANG = 'en' as const;
const CONTENT_ROOT = path.join(process.cwd(), 'content/docs');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(abs));
    } else if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
      out.push(abs);
    }
  }
  return out;
}

/** Convert an absolute file path into URL slug segments (after the lang). */
function fileToSlugs(abs: string): string[] {
  const rel = path.relative(CONTENT_ROOT, abs).replace(/\\/g, '/');
  const noExt = rel.replace(/\.mdx?$/, '');
  const parts = noExt.split('/');
  // `index` collapses to its parent directory (home -> []).
  if (parts[parts.length - 1] === 'index') parts.pop();
  return parts;
}

function buildPages(): PageRecord[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];
  const files = walk(CONTENT_ROOT).sort();
  return files.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    const slugs = fileToSlugs(filePath);
    const url = '/' + [LANG, ...slugs].join('/');
    return {
      slugs,
      lang: LANG,
      url: url.replace(/\/$/, '') || `/${LANG}`,
      frontmatter: data as Frontmatter,
      body: content,
      filePath,
    };
  });
}

// Read once per module load (build time / dev server).
const PAGES: PageRecord[] = buildPages();

export function getAllPages(): PageRecord[] {
  return PAGES;
}

/** Look up a page by its slug segments ([] = home). */
export function getPage(slugs: string[] = []): PageRecord | undefined {
  const key = slugs.join('/');
  return PAGES.find((p) => p.slugs.join('/') === key);
}

/** The display title for a page (sidebarTitle wins for nav, title otherwise). */
export function pageTitle(p: PageRecord): string {
  return (
    p.frontmatter.sidebarTitle ||
    p.frontmatter.title ||
    p.slugs[p.slugs.length - 1] ||
    'Home'
  );
}
