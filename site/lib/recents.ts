/**
 * Recently-visited doc pages, persisted in localStorage. Used by the ⌘K command
 * palette's empty-query state ("Recent"). Kept tiny and SSR-safe: every accessor
 * guards `typeof window` and swallows storage errors (private mode / quota), so
 * importing this never throws on the server or in a hardened browser.
 */

export interface RecentPage {
  url: string;
  title: string;
}

const KEY = 'ym:recents';
const CAP = 5;

/** Read the recents list (most-recent first). Returns [] off the client. */
export function getRecents(): RecentPage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (p): p is RecentPage =>
          !!p &&
          typeof (p as RecentPage).url === 'string' &&
          typeof (p as RecentPage).title === 'string',
      )
      .slice(0, CAP);
  } catch {
    return [];
  }
}

/**
 * Record a visit: push to the front, dedupe by url, cap at {@link CAP}. No-op on
 * the server or when storage is unavailable. Returns the new list so callers can
 * update state without a re-read.
 */
export function pushRecent(page: RecentPage): RecentPage[] {
  if (typeof window === 'undefined') return [];
  if (!page.url || !page.title) return getRecents();
  try {
    const next = [page, ...getRecents().filter((p) => p.url !== page.url)].slice(0, CAP);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return getRecents();
  }
}
