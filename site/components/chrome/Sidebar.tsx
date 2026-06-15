'use client';

import Link from 'fumadocs-core/link';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import { useSidebar } from 'fumadocs-ui/layouts/docs/slots/sidebar';
import { History, LifeBuoy, PanelLeftClose } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { NavTree } from './NavTree';
import { SearchTrigger } from './SearchTrigger';
import { Wordmark } from './Wordmark';

/**
 * Linear-style left sidebar (280px, full height). On desktop it is a static
 * column; on mobile (≤768px) it becomes a slide-in drawer driven by the
 * Fumadocs `useSidebar` `open` state, with a dimmed overlay, body-scroll-lock,
 * focus trap and ESC-to-close. We render our own chrome but keep Fumadocs'
 * sidebar state so the mobile hamburger (in the top bar) and link-close-on-
 * navigate continue to work.
 */
export function Sidebar() {
  const { root } = useTreeContext();
  const tree = root.children;
  const { open, setOpen, collapsed, setCollapsed } = useSidebar();
  const asideRef = useRef<HTMLElement>(null);

  // Drawer behaviours — only active while open on mobile.
  useEffect(() => {
    if (!open) return;
    const aside = asideRef.current;
    if (!aside) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    // Move focus into the drawer.
    const focusables = () =>
      Array.from(
        aside.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
    focusables()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [open, setOpen]);

  return (
    <>
      {/* Dimmed overlay — mobile only, fades with the drawer. */}
      <div
        className="ym-drawer-overlay"
        data-open={open}
        aria-hidden
        onClick={() => setOpen(false)}
      />

      <aside
        ref={asideRef}
        id="ym-sidebar"
        className="ym-sidebar"
        data-open={open}
        data-collapsed={collapsed}
        // Hide from AT + tab order when off-canvas on mobile is handled via CSS
        // (the overlay sits above the page); the drawer itself stays operable.
        aria-label="Sidebar"
      >
        {/* Top row: wordmark + desktop collapse toggle */}
        <div className="ym-sidebar-top">
          <Wordmark className="ym-sidebar-wordmark" />
          <button
            type="button"
            className="ym-icon-btn ym-sidebar-collapse"
            aria-label="Collapse sidebar"
            onClick={() => setCollapsed((v) => !v)}
          >
            <PanelLeftClose aria-hidden />
          </button>
        </div>

        <div className="ym-sidebar-search">
          <SearchTrigger />
        </div>

        <div className="ym-sidebar-scroll">
          <NavTree tree={tree} />
        </div>

        {/* Pinned footer (Linear's Docs/Support row equivalent) */}
        <div className="ym-sidebar-footer">
          <Link href="/en/changelog/changelog" className="ym-footer-link">
            <History className="ym-footer-icon" aria-hidden />
            <span>Changelog</span>
          </Link>
          {/* TODO target: confirm the right support destination */}
          <a href="mailto:support@yarmill.com" className="ym-footer-link">
            <LifeBuoy className="ym-footer-icon" aria-hidden />
            <span>Contact support</span>
          </a>
        </div>
      </aside>
    </>
  );
}
