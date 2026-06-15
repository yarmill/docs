'use client';

import Link from 'fumadocs-core/link';
import { usePathname } from 'fumadocs-core/framework';
import type * as PageTree from 'fumadocs-core/page-tree';
import { useSidebar } from 'fumadocs-ui/layouts/docs/slots/sidebar';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { groupContainsPath, groupTree, type NavGroup } from './tree';

/**
 * Linear-style navigation: collapsible groups (from meta.json `---Label---`
 * separators) over page links with their resolved lucide icons. The group
 * holding the active page starts expanded; collapse state is local and
 * keyboard-operable. Active links carry the brand-subtle tint; the active link
 * scrolls into view on mount.
 */
export function NavTree({ tree }: { tree: PageTree.Node[] }) {
  const pathname = usePathname();
  const groups = groupTree(tree);

  return (
    <nav className="ym-nav" aria-label="Documentation">
      {groups.map((group) =>
        group.label ? (
          <NavGroupBlock key={group.id} group={group} pathname={pathname} />
        ) : (
          <ul key={group.id} className="ym-nav-list ym-nav-list--top">
            {group.items.map((item, i) => (
              <NavNode key={i} node={item} pathname={pathname} />
            ))}
          </ul>
        ),
      )}
    </nav>
  );
}

function NavGroupBlock({ group, pathname }: { group: NavGroup; pathname: string }) {
  const containsActive = groupContainsPath(group.items, pathname);
  const [open, setOpen] = useState(containsActive);
  const contentId = `${group.id}-content`;

  // Re-expand the group if navigation moves the active page into it.
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
        <ChevronRight className="ym-nav-group-chevron" aria-hidden />
        <span>{group.label}</span>
      </button>
      <ul id={contentId} className="ym-nav-list" hidden={!open}>
        {group.items.map((item, i) => (
          <NavNode key={i} node={item} pathname={pathname} />
        ))}
      </ul>
    </div>
  );
}

function NavNode({ node, pathname }: { node: PageTree.Node; pathname: string }) {
  if (node.type === 'page') return <NavLink node={node} pathname={pathname} />;
  if (node.type === 'folder') return <NavFolder node={node} pathname={pathname} />;
  return null;
}

function NavLink({ node, pathname }: { node: PageTree.Item; pathname: string }) {
  const { setOpen, closeOnRedirect } = useSidebar();
  const active = node.url === pathname;
  const ref = useRef<HTMLAnchorElement>(null);

  // Bring the active link into view when the sidebar first renders (e.g. deep
  // link, page reload) without animating the scroll under reduced motion.
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return (
    <li>
      <Link
        ref={ref}
        href={node.url}
        className="ym-nav-link"
        data-active={active}
        aria-current={active ? 'page' : undefined}
        // Close the mobile drawer on navigation (no-op on desktop where the
        // sidebar is static); keep focus behaviour predictable.
        onClick={() => {
          closeOnRedirect.current = true;
          setOpen(false);
        }}
      >
        {node.icon ? <span className="ym-nav-icon" aria-hidden>{node.icon}</span> : null}
        <span className="ym-nav-label">{node.name}</span>
      </Link>
    </li>
  );
}

function NavFolder({ node, pathname }: { node: PageTree.Folder; pathname: string }) {
  const containsActive =
    node.index?.url === pathname ||
    node.children.some((c) => c.type === 'page' && c.url === pathname);
  const [open, setOpen] = useState(node.defaultOpen ?? containsActive);
  const contentId = `fld-${node.$id}-content`;

  useEffect(() => {
    if (containsActive) setOpen(true);
  }, [containsActive]);

  return (
    <li className="ym-nav-folder" data-open={open}>
      <button
        type="button"
        className="ym-nav-link ym-nav-folder-trigger"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((v) => !v)}
      >
        {node.icon ? <span className="ym-nav-icon" aria-hidden>{node.icon}</span> : null}
        <span className="ym-nav-label">{node.name}</span>
        <ChevronDown className="ym-nav-folder-chevron" aria-hidden />
      </button>
      <ul id={contentId} className="ym-nav-list ym-nav-list--nested" hidden={!open}>
        {node.index ? <NavLink node={node.index} pathname={pathname} /> : null}
        {node.children.map((c, i) => (
          <NavNode key={i} node={c} pathname={pathname} />
        ))}
      </ul>
    </li>
  );
}
