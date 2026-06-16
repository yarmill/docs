'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Code2, GraduationCap, History, LifeBuoy, type LucideIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Space } from '@/lib/nav';
import { NavTree } from './NavTree';
import { useSidebar } from './SidebarContext';
import { SearchTrigger } from './Search';

const SPACE_ICONS: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  'graduation-cap': GraduationCap,
  code: Code2,
  history: History,
};

/** Active space = the non-Docs space whose URL prefix matches; else Docs. */
function activeSpaceFor(spaces: Space[], pathname: string): Space {
  const match = spaces.find(
    (s) => s.id !== 'docs' && (pathname === s.basePath || pathname.startsWith(s.basePath + '/')),
  );
  return match ?? spaces[0];
}

/**
 * Left sidebar (280px, full height) with Linear-style "spaces". The header title
 * and nav reflect the active space (derived from the URL); the footer pins the
 * spaces as switchers — clicking one navigates into it, swapping the header +
 * nav. Desktop: static column. Mobile (≤768px): slide-in drawer (overlay,
 * scroll-lock, focus trap, ESC-to-close).
 */
export function Sidebar({ spaces }: { spaces: Space[] }) {
  const { open, setOpen } = useSidebar();
  const pathname = usePathname();
  const active = activeSpaceFor(spaces, pathname);
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
          <Link
            href={active.entryUrl}
            className="ym-sidebar-brand"
            aria-label={`Yarmill ${active.label} — home`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/yarmill-icon-blue.png"
              alt="Yarmill"
              className="ym-sidebar-symbol ym-symbol-light"
              height={24}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/yarmill-icon-white.png"
              alt="Yarmill"
              className="ym-sidebar-symbol ym-symbol-dark"
              height={24}
            />
            <span className="ym-sidebar-divider" aria-hidden />
            <span className="ym-sidebar-docs">{active.label}</span>
          </Link>
          <SearchTrigger className="ym-icon-btn ym-sidebar-search-btn" />
        </div>

        <div className="ym-sidebar-scroll">
          <NavTree tree={{ groups: active.groups }} />
        </div>

        <div className="ym-sidebar-footer">
          {spaces.map((space) => {
            const SpaceIcon = SPACE_ICONS[space.icon] ?? BookOpen;
            return (
              <Link
                key={space.id}
                href={space.entryUrl}
                className="ym-footer-link"
                data-active={space.id === active.id}
                aria-current={space.id === active.id ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                <SpaceIcon className="ym-footer-icon" aria-hidden />
                <span>{space.label}</span>
              </Link>
            );
          })}
          <a href="mailto:support@yarmill.com" className="ym-footer-link">
            <LifeBuoy className="ym-footer-icon" aria-hidden />
            <span>Contact support</span>
          </a>
        </div>
      </aside>
    </>
  );
}
