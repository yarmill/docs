'use client';

import Link from 'next/link';
import { History, LifeBuoy } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { NavTree as NavTreeData } from '@/lib/nav';
import { NavTree } from './NavTree';
import { useSidebar } from './SidebarContext';
import { SearchTrigger } from './Search';

/**
 * Left sidebar (280px, full height). Desktop: static column. Mobile (≤768px):
 * slide-in drawer driven by SidebarContext `open`, with a dimmed overlay,
 * body-scroll-lock, focus trap and ESC-to-close.
 */
export function Sidebar({ tree }: { tree: NavTreeData }) {
  const { open, setOpen } = useSidebar();
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const aside = asideRef.current;
    if (!aside) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

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
        aria-label="Sidebar"
      >
        <div className="ym-sidebar-top">
          <Link href="/en" className="ym-sidebar-brand" aria-label="Yarmill docs — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/yarmill-icon-blue.png"
              alt="Yarmill"
              className="ym-sidebar-symbol ym-symbol-light"
              height={22}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/yarmill-icon-white.png"
              alt="Yarmill"
              className="ym-sidebar-symbol ym-symbol-dark"
              height={22}
            />
            <span className="ym-sidebar-divider" aria-hidden />
            <span className="ym-sidebar-docs">Docs</span>
          </Link>
          <SearchTrigger className="ym-icon-btn ym-sidebar-search-btn" />
        </div>

        <div className="ym-sidebar-scroll">
          <NavTree tree={tree} />
        </div>

        <div className="ym-sidebar-footer">
          <Link href="/en/changelog/changelog" className="ym-footer-link">
            <History className="ym-footer-icon" aria-hidden />
            <span>Changelog</span>
          </Link>
          <a href="mailto:support@yarmill.com" className="ym-footer-link">
            <LifeBuoy className="ym-footer-icon" aria-hidden />
            <span>Contact support</span>
          </a>
        </div>
      </aside>
    </>
  );
}
