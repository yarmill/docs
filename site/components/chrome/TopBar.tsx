'use client';

import { usePathname } from 'fumadocs-core/framework';
import type * as PageTree from 'fumadocs-core/page-tree';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import { useSidebar } from 'fumadocs-ui/layouts/docs/slots/sidebar';
import { Menu } from 'lucide-react';
import { CopyPage } from './CopyPage';
import { ThemeToggle } from './ThemeToggle';
import { Wordmark } from './Wordmark';
import { groupTree } from './tree';

const APP_URL = 'https://yarmill.com/en/sign-in';

/** Resolve "Group / Page title" for the active path from the grouped tree. */
function useBreadcrumb(tree: PageTree.Node[], pathname: string) {
  const groups = groupTree(tree);
  for (const group of groups) {
    const found = findItem(group.items, pathname);
    if (found) return { group: group.label, page: found };
  }
  return { group: '', page: '' };
}

function findItem(nodes: PageTree.Node[], pathname: string): string | null {
  for (const node of nodes) {
    if (node.type === 'page' && node.url === pathname) {
      return typeof node.name === 'string' ? node.name : String(node.name ?? '');
    }
    if (node.type === 'folder') {
      if (node.index?.url === pathname) {
        return typeof node.name === 'string' ? node.name : String(node.name ?? '');
      }
      const nested = findItem(node.children, pathname);
      if (nested) return nested;
    }
  }
  return null;
}

/**
 * Top bar (64px): translucent, backdrop-blurred, hairline bottom border. Sits
 * right of the sidebar on desktop and shows breadcrumbs on the left; on mobile
 * it switches to a wordmark + hamburger that opens the sidebar drawer.
 *
 * Right cluster (desktop): theme toggle · Copy-page split button · Open Yarmill.
 */
export function TopBar() {
  const pathname = usePathname();
  const { root } = useTreeContext();
  const { open, setOpen } = useSidebar();
  const { group, page } = useBreadcrumb(root.children, pathname);

  return (
    <header className="ym-topbar">
      {/* Mobile: hamburger + wordmark */}
      <button
        type="button"
        className="ym-icon-btn ym-topbar-burger"
        aria-label="Open navigation"
        aria-expanded={open}
        aria-controls="ym-sidebar"
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden />
      </button>
      <Wordmark className="ym-topbar-wordmark" />

      {/* Desktop: breadcrumbs */}
      <nav className="ym-breadcrumb" aria-label="Breadcrumb">
        {group ? (
          <>
            <span className="ym-crumb-muted">{group}</span>
            <span className="ym-crumb-sep" aria-hidden>
              /
            </span>
          </>
        ) : null}
        {page ? <span className="ym-crumb-current">{page}</span> : null}
      </nav>

      <div className="ym-topbar-actions">
        <ThemeToggle />
        <CopyPage />
        <a
          className="ym-cta"
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Yarmill
        </a>
      </div>
    </header>
  );
}
