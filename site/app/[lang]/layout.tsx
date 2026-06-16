import type { ReactNode } from 'react';
import { getSpaces } from '@/lib/nav';
import { DocsShell } from '@/components/chrome/DocsShell';
import '@/app/theme/chrome.css';

/**
 * Locale layout. Builds the sidebar "spaces" (Docs / Tutorials / API Docs /
 * Changelog) from the scaffold (server-side) and hands them to the client shell.
 * The active space is derived from the URL in the sidebar. The page route fills
 * the header/main/toc grid areas.
 */
export default function LangLayout({ children }: { children: ReactNode }) {
  const spaces = getSpaces();
  return <DocsShell spaces={spaces}>{children}</DocsShell>;
}
