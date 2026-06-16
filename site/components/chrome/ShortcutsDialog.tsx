'use client';

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Keyboard-shortcuts help sheet (opened with `?`). A small modal styled like the
 * search palette: dim backdrop, centered card, `--ym-*` tokens, Esc to close,
 * focus-trapped, `role="dialog"` aria-modal, body scroll-locked, focus restored
 * to the opener on close.
 *
 * Open animation is a subtle fade + scale (transform/opacity, ≤200ms); reduced
 * motion falls back to a plain fade (handled in chrome.css).
 */

interface Shortcut {
  /** Key cap(s) to render — each string is one <kbd>. */
  keys: string[];
  label: string;
  /** Render keys joined by "then" (sequence) rather than side-by-side. */
  sequence?: boolean;
}

const SHORTCUTS: Shortcut[] = [
  { keys: ['/'], label: 'Search the docs' },
  { keys: ['⌘', 'K'], label: 'Search the docs' },
  { keys: ['['], label: 'Previous page' },
  { keys: [']'], label: 'Next page' },
  { keys: ['G', 'H'], label: 'Go to home', sequence: true },
  { keys: ['?'], label: 'Show this help' },
  { keys: ['Esc'], label: 'Close a dialog' },
];

export function ShortcutsDialog({ onClose }: { onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Body scroll lock while open; restored on unmount.
  useLayoutEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Focus the dialog on open so Esc/Tab are captured immediately.
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab') {
        // Single focusable region (the card) — trap focus on it.
        e.preventDefault();
        modalRef.current?.focus();
      }
    },
    [onClose],
  );

  return (
    <div className="ym-shortcuts-overlay" onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className="ym-shortcuts-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ym-shortcuts-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="ym-shortcuts-head">
          <h2 id="ym-shortcuts-title" className="ym-shortcuts-title">
            Keyboard shortcuts
          </h2>
          <kbd className="ym-search-esc">ESC</kbd>
        </div>
        <ul className="ym-shortcuts-list">
          {SHORTCUTS.map((s) => (
            <li key={s.label + s.keys.join('+')} className="ym-shortcuts-row">
              <span className="ym-shortcuts-label">{s.label}</span>
              <span className="ym-shortcuts-keys">
                {s.keys.map((k, i) => (
                  <span key={k + i} className="ym-shortcuts-keygroup">
                    {i > 0 && s.sequence ? (
                      <span className="ym-shortcuts-then">then</span>
                    ) : null}
                    <kbd className="ym-kbd">{k}</kbd>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
