'use client';

import type { ComponentProps } from 'react';
import { useSidebar } from 'fumadocs-ui/layouts/docs/slots/sidebar';

/**
 * Layout grid for the docs shell, replacing Fumadocs' default container so we
 * own the Linear three-column structure. The DocsPage places its article in
 * `[grid-area:main]` and the TOC in `[grid-area:toc]`/`[grid-area:toc-popover]`;
 * our TopBar takes `header` and the Sidebar takes `sidebar`. We keep those exact
 * area names so the built-in page primitives drop straight in.
 *
 * Columns (desktop): sidebar 280px · main 1fr (capped by the article's own
 * max-width) · toc 250px. The header spans main+toc; the sidebar spans all rows
 * so it reads as one full-height rail. Collapsing the sidebar animates its
 * column to 0 (transform/width only).
 */
export function Container(props: ComponentProps<'div'>) {
  const { collapsed } = useSidebar();
  return (
    <div
      id="nd-docs-layout"
      data-sidebar-collapsed={collapsed}
      {...props}
      className={`ym-shell ${props.className ?? ''}`}
    >
      {props.children}
    </div>
  );
}
