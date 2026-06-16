'use client';

import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type MiniSearch from 'minisearch';
import type { SearchResult } from 'minisearch';
import { Search as SearchIcon, CornerDownLeft, Hash, Clock } from 'lucide-react';
import { getRecents, type RecentPage } from '@/lib/recents';

/**
 * ⌘K command palette — a Linear-style centered modal in Yarmill's brand.
 *
 * The search index (`public/search-index.json`, ~78 KB, produced by
 * scripts/build-search-index.mjs) and the MiniSearch library are both loaded
 * LAZILY on the first time the palette opens — `fetch()` for the JSON plus a
 * dynamic `import('minisearch')` — so neither ships in the initial client
 * bundle. The loaded index is cached at module scope, so reopening is instant.
 * It builds a highlighted body snippet from MiniSearch match data and navigates
 * to the selected page on Enter. Opens via ⌘K / Ctrl+K and the sidebar search
 * button (SearchContext).
 *
 * Empty-query state (no text typed): instead of just a hint, the palette shows
 * quick navigation — "On this page" (the current page's h2/h3 headings, read
 * live from the DOM, Enter scrolls to the anchor) and "Recent" (the last pages
 * visited, from localStorage). Once the user types, it switches to full search
 * results. Keyboard nav (↑/↓/Enter) runs across whichever combined list is shown.
 *
 * A11y: dialog role + aria-modal, labelled input, focus trap, body scroll
 * lock, focus restored to the trigger on close. Open animation is fade +
 * slight scale/translate (transform/opacity only, ≤200ms); reduced-motion
 * falls back to a fade. Full keyboard nav (↑/↓/Enter/Esc).
 */

interface SearchDoc {
  id: string;
  url: string;
  title: string;
  group: string;
  headings: string[];
  text: string;
}

interface Hit {
  url: string;
  title: string;
  group: string;
  /** Snippet segments — `match` segments are highlighted in accent. */
  snippet: { text: string; match: boolean }[] | null;
}

/** A current-page heading shown under "On this page" in the empty state. */
interface SectionItem {
  id: string;
  text: string;
  depth: number;
}

interface SearchCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
}
const Ctx = createContext<SearchCtx>({ open: false, setOpen: () => {} });
export function useSearch(): SearchCtx {
  return useContext(Ctx);
}

const MAX_RESULTS = 8;
const SNIPPET_RADIUS = 60; // chars of context on each side of the first match

// Lazily build the MiniSearch index on first palette open, then cache the
// promise at module scope so subsequent opens reuse it (no refetch, no rebuild).
let indexPromise: Promise<MiniSearch<SearchDoc>> | null = null;

function loadIndex(): Promise<MiniSearch<SearchDoc>> {
  if (!indexPromise) {
    indexPromise = (async () => {
      const [{ default: MiniSearchCtor }, docs] = await Promise.all([
        import('minisearch'),
        fetch('/search-index.json').then((r) => {
          if (!r.ok) throw new Error(`search index ${r.status}`);
          return r.json() as Promise<SearchDoc[]>;
        }),
      ]);
      const ms = new MiniSearchCtor<SearchDoc>({
        fields: ['title', 'headings', 'text', 'group'],
        storeFields: ['url', 'title', 'group', 'headings', 'text'],
        searchOptions: { boost: { title: 3, headings: 2 }, prefix: true, fuzzy: 0.2 },
      });
      ms.addAll(docs);
      return ms;
    })();
    // Allow a retry if the load fails (e.g. transient network).
    indexPromise.catch(() => {
      indexPromise = null;
    });
  }
  return indexPromise;
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // The element to restore focus to when the palette closes.
  const triggerRef = useRef<HTMLElement | null>(null);

  const openPalette = useCallback(() => {
    triggerRef.current = (document.activeElement as HTMLElement) ?? null;
    setOpen(true);
  }, []);

  // Global ⌘K / Ctrl+K toggle.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) setOpen(false);
        else openPalette();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, openPalette]);

  const close = useCallback(() => {
    setOpen(false);
    // Restore focus to whatever opened the palette (trigger button / page).
    const el = triggerRef.current;
    if (el && typeof el.focus === 'function') {
      requestAnimationFrame(() => el.focus());
    }
  }, []);

  return (
    <Ctx.Provider value={{ open, setOpen: (v) => (v ? openPalette() : close()) }}>
      {children}
      {open ? <SearchDialog onClose={close} /> : null}
    </Ctx.Provider>
  );
}

/** Escape a string for use inside a RegExp. */
function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Read the current page's section headings straight from the rendered article
 * (`#nd-page :is(h2,h3)[id]`) — simplest and always correct for the page in view.
 * The leading H1 is the page title (no id from rehype-slug on the synthetic
 * title), so this naturally yields just the in-page sections.
 */
function readPageSections(): SectionItem[] {
  if (typeof document === 'undefined') return [];
  const nodes = document.querySelectorAll<HTMLHeadingElement>('#nd-page :is(h2, h3)[id]');
  const out: SectionItem[] = [];
  nodes.forEach((el) => {
    const text = el.textContent?.trim();
    if (el.id && text) out.push({ id: el.id, text, depth: el.tagName === 'H3' ? 3 : 2 });
  });
  return out;
}

/**
 * Build a highlighted body snippet from MiniSearch match data. We take the
 * matched terms, find the earliest occurrence in the page text, slice a window
 * around it, then split that window on the matched terms so they can be wrapped
 * in an accent <mark>. Returns null when no body match exists (e.g. a title-only
 * hit) so the row falls back to the breadcrumb only.
 */
function buildSnippet(text: string, terms: string[]): Hit['snippet'] {
  if (!text || terms.length === 0) return null;
  const lower = text.toLowerCase();

  // Earliest match position across all matched terms.
  let first = -1;
  for (const t of terms) {
    const idx = lower.indexOf(t.toLowerCase());
    if (idx !== -1 && (first === -1 || idx < first)) first = idx;
  }
  if (first === -1) return null;

  let start = Math.max(0, first - SNIPPET_RADIUS);
  let end = Math.min(text.length, first + SNIPPET_RADIUS * 2);
  // Snap to word boundaries so we don't cut mid-word.
  if (start > 0) {
    const sp = text.indexOf(' ', start);
    if (sp !== -1 && sp < first) start = sp + 1;
  }
  if (end < text.length) {
    const sp = text.lastIndexOf(' ', end);
    if (sp > first) end = sp;
  }

  let window = text.slice(start, end).trim();
  if (start > 0) window = '…' + window;
  if (end < text.length) window = window + '…';

  // Split the window on any matched term (prefix match, longest first).
  const sorted = [...new Set(terms)].sort((a, b) => b.length - a.length);
  const re = new RegExp(`(${sorted.map(escapeRe).join('|')})`, 'gi');
  const parts = window.split(re).filter((p) => p !== '');
  const matchSet = new Set(sorted.map((t) => t.toLowerCase()));

  return parts.map((p) => ({ text: p, match: matchSet.has(p.toLowerCase()) }));
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // The index is loaded lazily (see loadIndex) the first time the dialog mounts.
  const [mini, setMini] = useState<MiniSearch<SearchDoc> | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    loadIndex()
      .then((ms) => {
        if (alive) setMini(ms);
      })
      .catch(() => {
        /* leave mini null; the empty state covers it */
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const hasQuery = query.trim().length > 0;

  const hits = useMemo<Hit[]>(() => {
    if (!mini || !hasQuery) return [];
    const raw = mini.search(query).slice(0, MAX_RESULTS) as (SearchResult & SearchDoc)[];
    return raw.map((r) => {
      const terms = r.terms ?? [];
      // Only build a snippet when a term actually matched the body/heading text,
      // not just the title — so title-only hits stay clean.
      const bodyMatched = terms.filter((t) => {
        const fields = r.match?.[t] ?? [];
        return fields.includes('text') || fields.includes('headings');
      });
      return {
        url: r.url,
        title: r.title,
        group: r.group,
        snippet: buildSnippet(r.text, bodyMatched.length ? bodyMatched : terms),
      };
    });
  }, [query, mini, hasQuery]);

  // Empty-query quick-nav: current-page sections + recent pages. Captured once
  // when the dialog mounts (the page behind the modal can't change while open).
  const [sections] = useState<SectionItem[]>(() => readPageSections());
  // Exclude the current page from "Recent" — it's already covered by the
  // "On this page" group, and is always the most-recent entry.
  const [recents] = useState<RecentPage[]>(() =>
    getRecents().filter((r) => r.url !== pathname),
  );

  // Flatten the empty-state lists into one selectable sequence so ↑/↓/Enter can
  // run across both groups. Sections scroll to an anchor; recents navigate.
  const quickItems = useMemo(
    () => [
      ...sections.map((s) => ({ kind: 'section' as const, key: `s:${s.id}`, item: s })),
      ...recents.map((r) => ({ kind: 'recent' as const, key: `r:${r.url}`, item: r })),
    ],
    [sections, recents],
  );

  // How many selectable rows the active view shows (search hits or quick-nav).
  const count = hasQuery ? hits.length : quickItems.length;

  // Reset selection whenever the query toggles between empty/non-empty or the
  // text changes — done during render (keyed on the previous query) rather than
  // in an effect, so there's no extra commit.
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActive(0);
  }

  // Autofocus the input on open.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Body scroll lock while open; restored on unmount.
  useLayoutEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Keep the active row scrolled into view.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = useCallback(
    (url: string) => {
      onClose();
      router.push(url);
    },
    [onClose, router],
  );

  // Scroll to an in-page section (empty-state "On this page"). We close first,
  // then jump to the anchor; honours the page's scroll-margin-top so the heading
  // clears the sticky top bar. Also reflect it in the URL hash.
  const goSection = useCallback(
    (id: string) => {
      onClose();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        history.replaceState(null, '', `#${id}`);
      }
    },
    [onClose],
  );

  // Activate the currently-selected row in whichever list is showing.
  const selectActive = useCallback(() => {
    if (hasQuery) {
      const r = hits[active];
      if (r) go(r.url);
      return;
    }
    const q = quickItems[active];
    if (!q) return;
    if (q.kind === 'section') goSection(q.item.id);
    else go(q.item.url);
  }, [hasQuery, hits, quickItems, active, go, goSection]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (count ? (i + 1) % count : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (count ? (i - 1 + count) % count : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectActive();
    } else if (e.key === 'Tab') {
      // Focus trap: only the input is tabbable, so keep focus on it.
      e.preventDefault();
      inputRef.current?.focus();
    }
  }

  // While the index is still loading, a typed query shows a "Searching…" hint
  // rather than a false "No results".
  const isSearching = hasQuery && loading && !mini;
  const showEmpty = hasQuery && !isSearching && hits.length === 0;
  // Empty query → quick-nav view (sections + recents) when there's anything to
  // show; otherwise the input row + keyboard hint stand alone.
  const showQuick = !hasQuery && quickItems.length > 0;

  return (
    <div className="ym-search-overlay" onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className="ym-search-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="ym-search-input-row">
          <SearchIcon className="ym-search-input-icon" aria-hidden />
          <input
            ref={inputRef}
            className="ym-search-input"
            type="text"
            placeholder="Search documentation…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded={count > 0}
            aria-controls="ym-search-listbox"
            aria-activedescendant={count > active ? `ym-search-opt-${active}` : undefined}
            aria-label="Search documentation"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="ym-search-esc">ESC</kbd>
        </div>

        {hasQuery && hits.length > 0 ? (
          <ul
            ref={listRef}
            id="ym-search-listbox"
            className="ym-search-results"
            role="listbox"
            aria-label="Search results"
          >
            {hits.map((r, i) => (
              <li key={r.url} role="presentation">
                <button
                  type="button"
                  id={`ym-search-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className="ym-search-result"
                  data-active={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(r.url)}
                >
                  <span className="ym-search-result-main">
                    <span className="ym-search-crumb">
                      {r.group ? <span>{r.group}</span> : null}
                      {r.group ? <span className="ym-search-crumb-sep" aria-hidden>›</span> : null}
                      <span className="ym-search-title">{r.title}</span>
                    </span>
                    {r.snippet ? (
                      <span className="ym-search-snippet">
                        {r.snippet.map((seg, j) =>
                          seg.match ? (
                            <mark key={j} className="ym-search-mark">
                              {seg.text}
                            </mark>
                          ) : (
                            <span key={j}>{seg.text}</span>
                          ),
                        )}
                      </span>
                    ) : null}
                  </span>
                  <CornerDownLeft className="ym-search-enter" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {showQuick ? (
          <ul
            ref={listRef}
            id="ym-search-listbox"
            className="ym-search-results"
            role="listbox"
            aria-label="Quick navigation"
          >
            {sections.length > 0 ? (
              <li className="ym-search-section-label" role="presentation" aria-hidden>
                On this page
              </li>
            ) : null}
            {quickItems.map((q, i) =>
              q.kind === 'section' ? (
                <li key={q.key} role="presentation">
                  <button
                    type="button"
                    id={`ym-search-opt-${i}`}
                    role="option"
                    aria-selected={i === active}
                    className="ym-search-result ym-search-result--quick"
                    data-active={i === active}
                    data-depth={q.item.depth}
                    onMouseMove={() => setActive(i)}
                    onClick={() => goSection(q.item.id)}
                  >
                    <Hash className="ym-search-quick-icon" aria-hidden />
                    <span className="ym-search-result-main">
                      <span className="ym-search-title">{q.item.text}</span>
                    </span>
                    <CornerDownLeft className="ym-search-enter" aria-hidden />
                  </button>
                </li>
              ) : (
                <Fragment key={q.key}>
                  {/* Group label before the first recent item. */}
                  {quickItems[i - 1]?.kind !== 'recent' ? (
                    <li className="ym-search-section-label" role="presentation" aria-hidden>
                      Recent
                    </li>
                  ) : null}
                  <li role="presentation">
                    <button
                      type="button"
                      id={`ym-search-opt-${i}`}
                      role="option"
                      aria-selected={i === active}
                      className="ym-search-result ym-search-result--quick"
                      data-active={i === active}
                      onMouseMove={() => setActive(i)}
                      onClick={() => go(q.item.url)}
                    >
                      <Clock className="ym-search-quick-icon" aria-hidden />
                      <span className="ym-search-result-main">
                        <span className="ym-search-title">{q.item.title}</span>
                      </span>
                      <CornerDownLeft className="ym-search-enter" aria-hidden />
                    </button>
                  </li>
                </Fragment>
              ),
            )}
          </ul>
        ) : null}

        {isSearching ? (
          <div className="ym-search-empty" role="status">
            Searching…
          </div>
        ) : null}

        {showEmpty ? (
          <div className="ym-search-empty" role="status">
            No results for “{query.trim()}”.
          </div>
        ) : null}

        {!query.trim() ? (
          <div className="ym-search-hint">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> to navigate
            </span>
            <span>
              <kbd>↵</kbd> to open
            </span>
            <span>
              <kbd>esc</kbd> to close
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Standalone search trigger button (sidebar header). */
export function SearchTrigger({ className }: { className?: string }) {
  const { setOpen } = useSearch();
  return (
    <button
      type="button"
      className={className ?? 'ym-icon-btn'}
      aria-label="Search documentation"
      aria-keyshortcuts="Meta+K Control+K"
      onClick={() => setOpen(true)}
    >
      <SearchIcon aria-hidden />
    </button>
  );
}
