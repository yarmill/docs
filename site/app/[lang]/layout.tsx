import type { ReactNode } from 'react';
import { getNavTree } from '@/lib/nav';
import { DocsShell } from '@/components/chrome/DocsShell';
import '@/app/theme/chrome.css';

/**
 * Locale layout. Builds the NavTree from the scaffold (server-side) and hands it
 * to the client shell (sidebar + drawer/search providers + grid). The page route
 * fills the header/main/toc grid areas.
 */
export default function LangLayout({ children }: { children: ReactNode }) {
  const tree = getNavTree();
  return <DocsShell tree={tree}>{children}</DocsShell>;
}
