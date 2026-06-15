import type * as PageTree from 'fumadocs-core/page-tree';

export interface NavGroup {
  /** Stable id derived from the separator label (or "__top" for ungrouped). */
  id: string;
  /** Display label; empty for the leading ungrouped block. */
  label: string;
  items: PageTree.Node[];
}

/**
 * Fumadocs renders the top level of the tree as a flat sequence: a `separator`
 * node for each `---Label---` in meta.json, followed by the `page`/`folder`
 * nodes under it. Linear's sidebar groups pages under a collapsible heading, so
 * we fold that flat list into groups — each separator opens a new group and the
 * nodes after it (until the next separator) are its members.
 */
export function groupTree(nodes: PageTree.Node[]): NavGroup[] {
  const groups: NavGroup[] = [];
  let current: NavGroup | null = null;

  for (const node of nodes) {
    if (node.type === 'separator') {
      const label = typeof node.name === 'string' ? node.name : String(node.name ?? '');
      current = { id: `grp-${label || node.$id}`, label, items: [] };
      groups.push(current);
      continue;
    }
    if (!current) {
      current = { id: '__top', label: '', items: [] };
      groups.push(current);
    }
    current.items.push(node);
  }

  return groups.filter((g) => g.items.length > 0);
}

/** True if `pathname` is the page's url or sits under a folder in `items`. */
export function groupContainsPath(items: PageTree.Node[], pathname: string): boolean {
  return items.some((node) => nodeContainsPath(node, pathname));
}

function nodeContainsPath(node: PageTree.Node, pathname: string): boolean {
  if (node.type === 'page') return node.url === pathname;
  if (node.type === 'folder') {
    if (node.index?.url === pathname) return true;
    return node.children.some((child) => nodeContainsPath(child, pathname));
  }
  return false;
}
