'use client';

import type { ReactNode } from 'react';
import type { Space } from '@/lib/nav';
import { SidebarProvider } from './SidebarContext';
import { SearchProvider } from './Search';
import { Sidebar } from './Sidebar';
import { CodeBlockEnhancer } from '@/components/mdx/CodeBlock';

/**
 * Client shell: providers (sidebar drawer state + ⌘K search) wrap the Linear
 * three-column grid `.ym-shell` (styled in chrome.css with grid-areas
 * sidebar/header/main/toc). The Sidebar fills the `sidebar` area; the page route
 * supplies the `header` (TopBar), `main` (article) and `toc` areas as children.
 */
export function DocsShell({
  spaces,
  children,
}: {
  spaces: Space[];
  children: ReactNode;
}) {
  return (
    <SearchProvider>
      <SidebarProvider>
        <div id="nd-docs-layout" className="ym-shell">
          <Sidebar spaces={spaces} />
          {children}
        </div>
        {/* Global: adds copy buttons to every code block, on any page. */}
        <CodeBlockEnhancer />
      </SidebarProvider>
    </SearchProvider>
  );
}
