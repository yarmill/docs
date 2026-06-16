'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pushRecent } from '@/lib/recents';

/**
 * Record each visited doc page into the localStorage "recents" list (consumed by
 * the ⌘K palette's empty-query state). Mounted once in DocsShell so it fires on
 * the initial load and on every client navigation (keyed on the pathname).
 *
 * The page title is read from the rendered `#ym-page h1` — always the correct,
 * up-to-date title for the current route — falling back to `document.title`.
 * Pages without an `<h1>` (none expected) are skipped rather than recorded blank.
 */
export function useTrackRecent() {
  const pathname = usePathname();
  useEffect(() => {
    // Defer to the next frame so the freshly-navigated article (and its h1) is
    // in the DOM before we read it.
    const id = requestAnimationFrame(() => {
      const h1 = document.querySelector<HTMLHeadingElement>('#ym-page h1');
      const title = (h1?.textContent ?? document.title).trim();
      if (pathname && title) pushRecent({ url: pathname, title });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);
}
