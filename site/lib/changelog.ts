import { getAllPages, type PageRecord } from './content';

/**
 * Changelog data layer (Attio-style: year index + per-entry pages).
 *
 * Entries live at `content/docs/changelog/<year>/<slug>.mdx` and carry
 * frontmatter `title`, `description` (the one-line lede shown on the index),
 * `date` (ISO `YYYY-MM-DD`), and `tags` (a subset of TAGS below). The year
 * index pages (`/en/changelog/<year>`) and the space home (`/en/changelog`)
 * render a scannable list generated from these records — never hand-maintained.
 */

/** The fixed tag vocabulary (by product area, not change-type). */
export const TAGS = [
  'Yollanda',
  'Analytics',
  'Integrations',
  'Medical',
  'Planning',
  'Platform',
] as const;
export type Tag = (typeof TAGS)[number];

export interface ChangelogEntry {
  year: number;
  slug: string;
  /** Root-relative URL, e.g. `/en/changelog/2026/yollanda-reads-your-tabular-data`. */
  url: string;
  title: string;
  /** One-line lede (frontmatter `description`). */
  lede: string;
  /** ISO date `YYYY-MM-DD`. */
  date: string;
  tags: Tag[];
}

/** A changelog *entry* page: under `changelog/<year>/<slug>`, not an index. */
function isEntry(p: PageRecord): boolean {
  const s = p.slugs;
  return (
    s.length === 3 &&
    s[0] === 'changelog' &&
    /^\d{4}$/.test(s[1]) &&
    s[2] !== 'index'
  );
}

function toEntry(p: PageRecord): ChangelogEntry {
  const fm = p.frontmatter;
  const tags = Array.isArray(fm.tags)
    ? (fm.tags as string[]).filter((t): t is Tag => (TAGS as readonly string[]).includes(t))
    : [];
  return {
    year: Number(p.slugs[1]),
    slug: p.slugs[2],
    url: p.url,
    title: fm.title ?? p.slugs[2],
    lede: fm.description ?? '',
    date: typeof fm.date === 'string' ? fm.date : '',
    tags,
  };
}

/** All entries, newest first (by date, then title for stable ties). */
function buildEntries(): ChangelogEntry[] {
  return getAllPages()
    .filter(isEntry)
    .map(toEntry)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
}

const ENTRIES: ChangelogEntry[] = buildEntries();

/** All changelog entries across every year, newest first. */
export function getAllEntries(): ChangelogEntry[] {
  return ENTRIES;
}

/** Years that have at least one entry, newest first. */
export function getChangelogYears(): number[] {
  return [...new Set(ENTRIES.map((e) => e.year))].sort((a, b) => b - a);
}

/** The most recent year with entries (the space home shows this one). */
export function getLatestYear(): number {
  return getChangelogYears()[0] ?? new Date().getUTCFullYear();
}

/** Entries for a given year, newest first. */
export function getEntriesByYear(year: number): ChangelogEntry[] {
  return ENTRIES.filter((e) => e.year === year);
}

/** True when a page URL is a changelog *entry* (so the route renders the entry header). */
export function isChangelogEntryUrl(url: string): boolean {
  return /^\/en\/changelog\/\d{4}\/[^/]+$/.test(url);
}

/** Look up a single entry by its URL (for the entry-page header). */
export function getEntryByUrl(url: string): ChangelogEntry | undefined {
  return ENTRIES.find((e) => e.url === url);
}

/** Where a year's index lives: the latest year is the space home
 *  (`/en/changelog`); past years get their own `/en/changelog/<year>`. */
export function yearHref(year: number): string {
  return year === getLatestYear() ? '/en/changelog' : `/en/changelog/${year}`;
}

/** If a URL is a changelog year *index* (the space home or `/en/changelog/<year>`),
 *  return its year; otherwise null. Used for the breadcrumb label + sidebar count. */
export function changelogIndexYear(url: string): number | null {
  if (url === '/en/changelog') return getLatestYear();
  const m = url.match(/^\/en\/changelog\/(\d{4})$/);
  return m ? Number(m[1]) : null;
}

/** Number of entries in a year (for the sidebar count badge). */
export function countForYear(year: number): number {
  return getEntriesByYear(year).length;
}
