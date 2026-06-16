'use client';

import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';
import { useSearch } from './Search';

/**
 * Client actions for the branded 404: a primary "Search docs" button that opens
 * the ⌘K palette, and a secondary "Back to docs" link. Split out from the
 * (server) not-found page so the page itself can stay a server component and
 * resolve popular links from the nav tree.
 */
export function NotFoundActions() {
  const { setOpen } = useSearch();
  return (
    <div className="ym-notfound-actions">
      <button
        type="button"
        className="ym-notfound-btn ym-notfound-btn-primary"
        onClick={() => setOpen(true)}
        aria-keyshortcuts="Meta+K Control+K"
      >
        <SearchIcon className="ym-notfound-btn-icon" aria-hidden />
        Search docs
        <kbd className="ym-notfound-kbd">⌘K</kbd>
      </button>
      <Link href="/en" className="ym-notfound-btn ym-notfound-btn-secondary">
        Back to docs
      </Link>
    </div>
  );
}
