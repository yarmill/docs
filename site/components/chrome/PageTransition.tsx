'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Cross-page continuity (Block C1). Wraps ONLY the article region so doc-to-doc
 * client navigation fades up instead of hard-cutting; the sidebar and top bar
 * live outside this component and stay perfectly static.
 *
 * Mechanism: we key a wrapper on the pathname. When the path changes, React
 * unmounts the old subtree and mounts a fresh one, so the CSS entrance animation
 * (`ym-page-enter`, opacity 0→1 + translateY 4px→0) replays. We key on
 * `usePathname()` (path only), not the full URL, so a TOC hash change
 * (`#section`) does NOT re-trigger the fade and there is no layout shift.
 *
 * Reduced motion: the keyframes are neutralised in chrome.css under
 * `prefers-reduced-motion: reduce` (content appears instantly, no transform).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="ym-page-enter">
      {children}
    </div>
  );
}
