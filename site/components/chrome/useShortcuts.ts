'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from './Search';

/**
 * Global keyboard layer (Block D2), mounted once in DocsShell:
 *   /            open the search palette
 *   [ / ]        previous / next page (read from the rendered PrevNext anchors)
 *   g then h     go home (/en) — a 2-key sequence within ~1s
 *   ?            open the keyboard-shortcuts help sheet
 *   (⌘K/Ctrl+K opens search; owned by SearchProvider already.)
 *
 * Every shortcut is guarded so it does NOT fire while the user is typing in an
 * input / textarea / contenteditable, or when a modal/menu is already open —
 * Esc is the only key allowed through to those surfaces (handled by the
 * dialogs themselves, not here). Modifier combos (⌘/Ctrl/Alt) are ignored so we
 * never shadow browser/OS chords.
 *
 * Returns the shortcuts-dialog open state + a closer, so DocsShell can render
 * <ShortcutsDialog> and restore focus on close.
 */

const HOME = '/en';
const SEQUENCE_WINDOW = 1000; // ms allowed between `g` and `h`

/** True when focus is in a field where typing should win over shortcuts. */
function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    el.isContentEditable
  );
}

/** True when any modal/menu surface is open (so global shortcuts stand down). */
function isOverlayOpen(): boolean {
  return (
    document.querySelector('[role="dialog"][aria-modal="true"]') !== null ||
    // Mobile sidebar drawer.
    document.querySelector('.ym-sidebar[data-open="true"]') !== null
  );
}

/** Resolve a PrevNext neighbour href from the rendered anchors. */
function neighbourHref(which: 'prev' | 'next'): string | null {
  const a = document.querySelector<HTMLAnchorElement>(`a[data-prevnext="${which}"]`);
  return a?.getAttribute('href') ?? null;
}

export function useShortcuts() {
  const router = useRouter();
  const { open: searchOpen, setOpen: setSearchOpen } = useSearch();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  // Element to restore focus to after the shortcuts dialog closes.
  const shortcutsTrigger = useRef<HTMLElement | null>(null);
  // Tracks a pending `g` for the `g h` sequence.
  const pendingG = useRef<number | null>(null);

  const closeShortcuts = useCallback(() => {
    setShortcutsOpen(false);
    const el = shortcutsTrigger.current;
    if (el && typeof el.focus === 'function') {
      requestAnimationFrame(() => el.focus());
    }
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Never interfere with browser/OS chords (⌘K is handled elsewhere).
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // Don't steal keystrokes while typing.
      if (isTypingTarget(e.target)) return;
      // Stand down while a modal/menu is open (those own their own keys + Esc).
      // Exception: the shortcuts dialog handles its own Esc, so we never need to.
      const overlay = searchOpen || shortcutsOpen || isOverlayOpen();

      // `g` then `h` → home. Arm on `g`; fire if `h` follows within the window.
      if (!overlay && e.key === 'g') {
        pendingG.current = Date.now();
        return;
      }
      if (!overlay && e.key === 'h' && pendingG.current !== null) {
        if (Date.now() - pendingG.current <= SEQUENCE_WINDOW) {
          e.preventDefault();
          pendingG.current = null;
          router.push(HOME);
          return;
        }
        pendingG.current = null;
      } else if (e.key !== 'g') {
        // Any other key cancels a pending `g`.
        pendingG.current = null;
      }

      // `?` (shift+/) → shortcuts help. Allowed even when nothing else is open.
      if (e.key === '?') {
        if (overlay) return;
        e.preventDefault();
        shortcutsTrigger.current = (document.activeElement as HTMLElement) ?? null;
        setShortcutsOpen(true);
        return;
      }

      if (overlay) return;

      // `/` → open search.
      if (e.key === '/') {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }

      // `[` / `]` → prev / next page.
      if (e.key === '[') {
        const href = neighbourHref('prev');
        if (href) {
          e.preventDefault();
          router.push(href);
        }
        return;
      }
      if (e.key === ']') {
        const href = neighbourHref('next');
        if (href) {
          e.preventDefault();
          router.push(href);
        }
        return;
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router, searchOpen, shortcutsOpen, setSearchOpen]);

  return { shortcutsOpen, closeShortcuts };
}
