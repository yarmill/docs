'use client';

import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Linear-style search trigger: a rounded `--ym-bg` button with a magnifier,
 * "Search" placeholder and a ⌘K / Ctrl+K kbd chip. Opens the Fumadocs search
 * dialog (mounted by RootProvider) via `useSearchContext`. The dialog itself
 * also binds the hotkey; we just mirror the platform-correct label.
 */
export function SearchTrigger() {
  const { setOpenSearch } = useSearchContext();
  const [isMac, setIsMac] = useState(true);

  // Resolve the modifier label after mount to avoid an SSR/client mismatch.
  useEffect(() => {
    setIsMac(/mac|iphone|ipad|ipod/i.test(navigator.platform));
  }, []);

  return (
    <button
      type="button"
      onClick={() => setOpenSearch(true)}
      className="ym-search-trigger"
      aria-label="Search documentation"
    >
      <Search className="ym-search-icon" aria-hidden />
      <span className="ym-search-label">Search</span>
      <kbd className="ym-kbd" aria-hidden>
        {isMac ? '⌘' : 'Ctrl'}
        <span className="ym-kbd-k">K</span>
      </kbd>
    </button>
  );
}
