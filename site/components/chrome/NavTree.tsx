'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { NavGroup, NavTree as NavTreeData } from '@/lib/nav';
import { Icon } from '@/lib/icons';
import { useSidebar } from './SidebarContext';

// useLayoutEffect on the client, useEffect on the server (avoids SSR warning).
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Linear-style navigation: collapsible groups from the NavTree (built in
 * lib/nav.ts from .scaffold-ref/docs.json). The group holding the active page
 * starts expanded; collapse state is local and keyboard-operable. Active links
 * carry the brand accent; the active link scrolls into view on mount.
 *
 * A single shared accent indicator (a 2px `--ym-accent` bar at the left of the
 * active link) SLIDES between sibling pages when the route changes — echoing
 * the TOC rail. It's measured and positioned per nav list (only the list
 * containing the active page shows it), so it behaves correctly across
 * group collapse/expand and space switches.
 */
export function NavTree({ tree }: { tree: NavTreeData }) {
  const pathname = usePathname();
  // A single-group space (Tutorials / API Docs / Changelog) renders its pages
  // flat — no redundant collapsible section header repeating the space name.
  if (tree.groups.length === 1) {
    return (
      <nav className="ym-nav" aria-label="Documentation">
        <NavList pages={tree.groups[0].pages} pathname={pathname} />
      </nav>
    );
  }
  return (
    <nav className="ym-nav" aria-label="Documentation">
      {tree.groups.map((group) => (
        <NavGroupBlock key={group.label} group={group} pathname={pathname} />
      ))}
    </nav>
  );
}

function groupContains(group: NavGroup, pathname: string): boolean {
  return group.pages.some((p) => p.url === pathname);
}

function NavGroupBlock({ group, pathname }: { group: NavGroup; pathname: string }) {
  const containsActive = groupContains(group, pathname);
  const [open, setOpen] = useState(containsActive);
  const contentId = `grp-${group.label.replace(/\s+/g, '-')}`;

  // Re-open the group when navigation moves the active page into it, without an
  // effect: adjust state during render keyed on the previous `containsActive`
  // value (React's "storing information from previous renders" pattern). The
  // user can still collapse it again afterwards.
  const [prevContains, setPrevContains] = useState(containsActive);
  if (containsActive !== prevContains) {
    setPrevContains(containsActive);
    if (containsActive) setOpen(true);
  }

  return (
    <div className="ym-nav-group" data-open={open}>
      <button
        type="button"
        className="ym-nav-group-label"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ym-nav-group-name">{group.label}</span>
        <ChevronDown className="ym-nav-group-chevron" aria-hidden />
      </button>
      <NavList
        id={contentId}
        pages={group.pages}
        pathname={pathname}
        hidden={!open}
        open={open}
      />
    </div>
  );
}

/**
 * A nav `<ul>` that hosts the shared sliding indicator. The indicator is
 * absolutely positioned and animates `transform: translateY()` + `height` to
 * the active link's box (measured via offsetTop/offsetHeight within the list).
 * If no page in this list is active the indicator is hidden. When it first
 * appears (no previous active in this list) it fades in without a slide, so it
 * never glides in from off-screen.
 */
function NavList({
  id,
  pages,
  pathname,
  hidden = false,
  open = true,
}: {
  id?: string;
  pages: { title: string; url: string; icon?: string }[];
  pathname: string;
  hidden?: boolean;
  open?: boolean;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  // Track whether the indicator was already placed in THIS list, so the first
  // appearance fades in (no transform) but subsequent moves within the list
  // glide.
  const hadActive = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    const link = linkRefs.current.get(pathname);

    // Hidden (collapsed group) or no active page here → hide; reset so the next
    // appearance fades in rather than sliding from a stale position.
    if (hidden || !link) {
      indicator.dataset.visible = 'false';
      hadActive.current = false;
      return;
    }

    const top = link.offsetTop;
    const height = link.offsetHeight;

    if (!hadActive.current) {
      // First placement in this list: jump (no slide), then fade in.
      const prev = indicator.style.transition;
      indicator.style.transition = 'none';
      indicator.style.transform = `translateY(${top}px)`;
      indicator.style.height = `${height}px`;
      // Force reflow so the jump applies before re-enabling transitions.
      void indicator.offsetHeight;
      indicator.style.transition = prev;
      hadActive.current = true;
    } else {
      indicator.style.transform = `translateY(${top}px)`;
      indicator.style.height = `${height}px`;
    }
    indicator.dataset.visible = 'true';
  }, [pathname, hidden, open, pages]);

  return (
    <ul id={id} className="ym-nav-list" hidden={hidden} ref={listRef}>
      <span ref={indicatorRef} className="ym-nav-indicator" aria-hidden />
      {pages.map((page) => (
        <NavLink
          key={page.url}
          page={page}
          pathname={pathname}
          linkRefs={linkRefs}
        />
      ))}
    </ul>
  );
}

function NavLink({
  page,
  pathname,
  linkRefs,
}: {
  page: { title: string; url: string; icon?: string };
  pathname: string;
  linkRefs: React.RefObject<Map<string, HTMLAnchorElement>>;
}) {
  const { setOpen } = useSidebar();
  const active = page.url === pathname;
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return (
    <li>
      <Link
        ref={(el) => {
          ref.current = el;
          if (el) linkRefs.current.set(page.url, el);
          else linkRefs.current.delete(page.url);
        }}
        href={page.url}
        className="ym-nav-link"
        data-active={active}
        aria-current={active ? 'page' : undefined}
        onClick={() => setOpen(false)}
      >
        {page.icon ? (
          <span className="ym-nav-icon" aria-hidden>
            <Icon name={page.icon} />
          </span>
        ) : null}
        <span className="ym-nav-label">{page.title}</span>
      </Link>
    </li>
  );
}
