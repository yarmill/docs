import fs from 'node:fs';
import path from 'node:path';
import { getAllPages, getPage, pageTitle, type PageRecord } from './content';
import { changelogIndexYear, countForYear } from './changelog';

/**
 * Navigation tree (no Fumadocs). Order + grouping come from the Mintlify
 * scaffold `.scaffold-ref/docs.json`:
 *   navigation.languages[0].anchors[].groups[].pages[]
 *
 * Each page reference is a content path like `en/plan/goals` or `en/index`,
 * which we resolve to a PageRecord (by its slug segments after `en/`) to pull
 * the title / sidebarTitle / icon from frontmatter. Nested groups (e.g.
 * Biathlon under Sport-specific) are flattened into their parent group with the
 * nested label as a sub-section — for this foundation phase we surface them as
 * additional top-level groups so every page is reachable. Endpoint/openapi
 * groups (page refs like `POST /api/...`) have no MDX file and are skipped.
 */

export interface NavPage {
  title: string;
  url: string;
  icon?: string;
  /** Optional count badge (e.g. changelog year → number of entries). */
  count?: number;
}

export interface NavGroup {
  label: string;
  pages: NavPage[];
}

export interface NavTree {
  groups: NavGroup[];
}

interface RawGroup {
  group: string;
  icon?: string;
  pages?: RawPageRef[];
}
type RawPageRef = string | RawGroup;

const SCAFFOLD = path.join(process.cwd(), '.scaffold-ref/docs.json');

/** Display-name overrides for docs.json group labels. */
const LABEL_OVERRIDES: Record<string, string> = {
  'API Documentation': 'API Docs',
};

/** Strip the leading `en/` (and collapse `en/index` -> home) from a docs.json ref. */
function refToSlugs(ref: string): string[] | null {
  // Only mdx-backed refs (a path); openapi refs look like "POST /api/...".
  if (ref.includes(' ') || ref.startsWith('/')) return null;
  const parts = ref.split('/');
  if (parts[0] === 'en') parts.shift();
  if (parts[parts.length - 1] === 'index') parts.pop();
  return parts;
}

function toNavPage(ref: string): NavPage | null {
  const slugs = refToSlugs(ref);
  if (!slugs) return null;
  const page = getPage(slugs);
  if (!page) return null;
  const year = changelogIndexYear(page.url);
  return {
    title: pageTitle(page),
    url: page.url,
    icon: page.frontmatter.icon,
    count: year != null ? countForYear(year) : undefined,
  };
}

function collectGroups(rawGroups: RawGroup[], out: NavGroup[]): void {
  for (const g of rawGroups) {
    const pages: NavPage[] = [];
    const nested: RawGroup[] = [];
    for (const ref of g.pages ?? []) {
      if (typeof ref === 'string') {
        const np = toNavPage(ref);
        if (np) pages.push(np);
      } else {
        nested.push(ref);
      }
    }
    if (pages.length > 0) out.push({ label: LABEL_OVERRIDES[g.group] ?? g.group, pages });
    // Surface nested groups (e.g. Biathlon) as their own sections so links stay
    // reachable in the flat sidebar.
    if (nested.length > 0) collectGroups(nested, out);
  }
}

function buildNavTree(): NavTree {
  let groups: NavGroup[] = [];
  try {
    const json = JSON.parse(fs.readFileSync(SCAFFOLD, 'utf8'));
    const anchors = json?.navigation?.languages?.[0]?.anchors ?? [];
    for (const anchor of anchors) {
      collectGroups(anchor.groups ?? [], groups);
    }
  } catch {
    groups = [];
  }

  // Fallback: if the scaffold yielded nothing, list every page in one group so
  // the site is still navigable.
  if (groups.length === 0) {
    groups = [
      {
        label: 'Documentation',
        pages: getAllPages().map((p) => ({
          title: pageTitle(p),
          url: p.url,
          icon: p.frontmatter.icon,
        })),
      },
    ];
  }
  return { groups };
}

const NAV_TREE: NavTree = buildNavTree();

/** Flat, ordered list of pages (for prev/next), derived from the nav tree. */
export function getFlatPages(): NavPage[] {
  return NAV_TREE.groups.flatMap((g) => g.pages);
}

export interface PrevNext {
  prev?: NavPage;
  next?: NavPage;
}

/** Resolve the previous/next page for a given url in the flat order. */
export function getPrevNext(url: string): PrevNext {
  const flat = getFlatPages();
  const i = flat.findIndex((p) => p.url === url);
  if (i === -1) return {};
  return {
    prev: i > 0 ? flat[i - 1] : undefined,
    next: i < flat.length - 1 ? flat[i + 1] : undefined,
  };
}

/** Find the group label that owns a url (for breadcrumbs). */
export function getGroupLabel(url: string): string {
  for (const g of NAV_TREE.groups) {
    if (g.pages.some((p) => p.url === url)) return g.label;
  }
  return '';
}

/* ============================================================
   Spaces (Linear-style sidebar "tabs")
   The default "Docs" space holds the main module groups; Tutorials, API Docs
   and Changelog are separate spaces pinned in the sidebar footer. Switching a
   space swaps the sidebar nav + header title; the active space is derived from
   the current URL.
   ============================================================ */

export interface Space {
  id: string;
  /** Sidebar header title + footer label when this space is active. */
  label: string;
  /** lucide icon name for the footer switcher. */
  icon: string;
  /** Where the footer switcher navigates (first page of the space). */
  entryUrl: string;
  /** URL prefix used to detect the active space (empty for Docs). */
  basePath: string;
  groups: NavGroup[];
}

/** Non-default spaces, matched by (overridden) group label, in footer order. */
const SECTION_DEFS: { id: string; label: string; icon: string; groupLabels: string[] }[] = [
  { id: 'tutorials', label: 'Tutorials', icon: 'graduation-cap', groupLabels: ['Tutorials'] },
  { id: 'api', label: 'API Docs', icon: 'code', groupLabels: ['API Docs'] },
  { id: 'changelog', label: 'Changelog', icon: 'history', groupLabels: ['Changelog'] },
];

function basePathOf(groups: NavGroup[]): string {
  const url = groups[0]?.pages[0]?.url ?? '';
  // '/en/tutorials/x' -> '/en/tutorials' ; '/en/changelog/changelog' -> '/en/changelog'
  return '/' + url.split('/').slice(1, 3).join('/');
}

function buildSpaces(): Space[] {
  const claimed = new Set(SECTION_DEFS.flatMap((s) => s.groupLabels));
  const docsGroups = NAV_TREE.groups.filter((g) => !claimed.has(g.label));

  const sections: Space[] = SECTION_DEFS.map((def) => {
    const groups = NAV_TREE.groups.filter((g) => def.groupLabels.includes(g.label));
    return {
      id: def.id,
      label: def.label,
      icon: def.icon,
      groups,
      entryUrl: groups[0]?.pages[0]?.url ?? '/en',
      basePath: basePathOf(groups),
    };
  }).filter((s) => s.groups.length > 0);

  const docs: Space = {
    id: 'docs',
    label: 'Docs',
    icon: 'book-open',
    groups: docsGroups,
    entryUrl: '/en',
    basePath: '/en',
  };
  return [docs, ...sections];
}

const SPACES: Space[] = buildSpaces();

export function getSpaces(): Space[] {
  return SPACES;
}
