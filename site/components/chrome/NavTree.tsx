'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { NavGroup, NavTree as NavTreeData } from '@/lib/nav';
import { useSidebar } from './SidebarContext';

/**
 * Linear-style navigation: collapsible groups from the NavTree (built in
 * lib/nav.ts from .scaffold-ref/docs.json). The group holding the active page
 * starts expanded; collapse state is local and keyboard-operable. The active
 * link is marked by COLOUR ONLY — brand-accent text, no background and no
 * indicator bar — matching Linear's restrained active state. The active link
 * scrolls into view on mount.
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
      {tree.groups.map((group, i) => (
        <NavGroupBlock key={group.label} group={group} groupIndex={i} pathname={pathname} />
      ))}
    </nav>
  );
}

function groupContains(group: NavGroup, pathname: string): boolean {
  return group.pages.some((p) => p.url === pathname);
}

function NavGroupBlock({
  group,
  groupIndex,
  pathname,
}: {
  group: NavGroup;
  groupIndex: number;
  pathname: string;
}) {
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
    <div
      className="ym-nav-group"
      data-open={open}
      data-active-section={containsActive}
    >
      <button
        type="button"
        className="ym-nav-group-label"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ym-nav-rowtext">
          <span className="ym-nav-num" aria-hidden>{`${groupIndex}.0`}</span>
          <span className="ym-nav-group-name">{group.label}</span>
        </span>
        <ChevronDown className="ym-nav-group-chevron" aria-hidden />
      </button>
      <NavList
        id={contentId}
        pages={group.pages}
        pathname={pathname}
        groupIndex={groupIndex}
        hidden={!open}
      />
    </div>
  );
}

function NavList({
  id,
  pages,
  pathname,
  groupIndex,
  hidden = false,
}: {
  id?: string;
  pages: { title: string; url: string; icon?: string; count?: number }[];
  pathname: string;
  /** When set, pages are numbered `<groupIndex>.<n>` (Linear-style, Docs space). */
  groupIndex?: number;
  hidden?: boolean;
}) {
  return (
    <ul id={id} className="ym-nav-list" hidden={hidden}>
      {pages.map((page, i) => (
        <NavLink
          key={page.url}
          page={page}
          pathname={pathname}
          number={groupIndex === undefined ? undefined : `${groupIndex}.${i + 1}`}
        />
      ))}
    </ul>
  );
}

function NavLink({
  page,
  pathname,
  number,
}: {
  page: { title: string; url: string; icon?: string; count?: number };
  pathname: string;
  number?: string;
}) {
  const { setOpen } = useSidebar();
  const router = useRouter();
  const active = page.url === pathname;
  const ref = useRef<HTMLAnchorElement>(null);
  // Hover/focus-intent prefetch: warm the route the moment the pointer or focus
  // lands on the link, in addition to Next's default in-viewport prefetch. Guard
  // so it only fires once per link (router.prefetch is idempotent, but this
  // avoids redundant calls on repeated hovers).
  const prefetched = useRef(false);
  const prefetchIntent = () => {
    if (prefetched.current || active) return;
    prefetched.current = true;
    router.prefetch(page.url);
  };

  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return (
    <li>
      <Link
        ref={ref}
        href={page.url}
        className="ym-nav-link"
        data-active={active}
        aria-current={active ? 'page' : undefined}
        onMouseEnter={prefetchIntent}
        onFocus={prefetchIntent}
        onClick={() => setOpen(false)}
      >
        <span className="ym-nav-rowtext">
          {number ? (
            <span className="ym-nav-num" aria-hidden>{number}</span>
          ) : null}
          <span className="ym-nav-label">{page.title}</span>
        </span>
        {typeof page.count === 'number' ? (
          <span className="ym-nav-count">{page.count}</span>
        ) : null}
      </Link>
    </li>
  );
}
