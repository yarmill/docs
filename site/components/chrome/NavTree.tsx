'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { NavGroup, NavTree as NavTreeData } from '@/lib/nav';
import { Icon } from '@/lib/icons';
import { useSidebar } from './SidebarContext';

/**
 * Linear-style navigation: collapsible groups from the NavTree (built in
 * lib/nav.ts from .scaffold-ref/docs.json). The group holding the active page
 * starts expanded; collapse state is local and keyboard-operable. Active links
 * carry the brand accent; the active link scrolls into view on mount.
 */
export function NavTree({ tree }: { tree: NavTreeData }) {
  const pathname = usePathname();
  // A single-group space (Tutorials / API Docs / Changelog) renders its pages
  // flat — no redundant collapsible section header repeating the space name.
  if (tree.groups.length === 1) {
    return (
      <nav className="ym-nav" aria-label="Documentation">
        <ul className="ym-nav-list">
          {tree.groups[0].pages.map((page) => (
            <NavLink key={page.url} page={page} pathname={pathname} />
          ))}
        </ul>
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

  useEffect(() => {
    if (containsActive) setOpen(true);
  }, [containsActive]);

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
      <ul id={contentId} className="ym-nav-list" hidden={!open}>
        {group.pages.map((page) => (
          <NavLink key={page.url} page={page} pathname={pathname} />
        ))}
      </ul>
    </div>
  );
}

function NavLink({
  page,
  pathname,
}: {
  page: { title: string; url: string; icon?: string };
  pathname: string;
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
        ref={ref}
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
