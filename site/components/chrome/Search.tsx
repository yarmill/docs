'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import MiniSearch, { type SearchResult } from 'minisearch';
import { Search as SearchIcon, CornerDownLeft } from 'lucide-react';
import searchDocs from '@/lib/search-index.json';

/**
 * ⌘K command palette — a Linear-style centered modal in Yarmill's brand.
 * Reads the prebuilt JSON index (`lib/search-index.json`, produced by
 * scripts/build-search-index.mjs) into MiniSearch, builds a highlighted body
 * snippet from MiniSearch match data, and navigates to the selected page on
 * Enter. Opens via ⌘K / Ctrl+K and the sidebar search button (SearchContext).
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
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const mini = useMemo(() => {
    const ms = new MiniSearch<SearchDoc>({
      fields: ['title', 'headings', 'text', 'group'],
      storeFields: ['url', 'title', 'group', 'headings', 'text'],
      searchOptions: { boost: { title: 3, headings: 2 }, prefix: true, fuzzy: 0.2 },
    });
    ms.addAll(searchDocs as unknown as SearchDoc[]);
    return ms;
  }, []);

  const hits = useMemo<Hit[]>(() => {
    if (!query.trim()) return [];
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
  }, [query, mini]);

  // Reset selection whenever the result set changes.
  useEffect(() => setActive(0), [query]);

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

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (hits.length ? (i + 1) % hits.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (hits.length ? (i - 1 + hits.length) % hits.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const r = hits[active];
      if (r) go(r.url);
    } else if (e.key === 'Tab') {
      // Focus trap: only the input is tabbable, so keep focus on it.
      e.preventDefault();
      inputRef.current?.focus();
    }
  }

  const showEmpty = query.trim().length > 0 && hits.length === 0;

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
            aria-expanded={hits.length > 0}
            aria-controls="ym-search-listbox"
            aria-activedescendant={hits[active] ? `ym-search-opt-${active}` : undefined}
            aria-label="Search documentation"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="ym-search-esc">ESC</kbd>
        </div>

        {hits.length > 0 ? (
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
