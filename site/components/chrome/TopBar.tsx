'use client';

import { Menu } from 'lucide-react';
import { CopyPage } from './CopyPage';
import { ThemeToggle } from './ThemeToggle';
import { Wordmark } from './Wordmark';
import { useSidebar } from './SidebarContext';

const APP_URL = 'https://yarmill.com/en/sign-in';

/**
 * Top bar (64px): translucent, backdrop-blurred, hairline bottom border. Sits
 * right of the sidebar on desktop with breadcrumbs (`Group / Page`); on mobile
 * it shows a wordmark + hamburger that opens the sidebar drawer.
 *
 * Breadcrumb parts are resolved server-side (from lib/nav) and passed in, so
 * the bar needs no nav context.
 */
export function TopBar({ group, page }: { group?: string; page?: string }) {
  const { open, setOpen } = useSidebar();

  return (
    <header className="ym-topbar">
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
        <a className="ym-cta" href={APP_URL} target="_blank" rel="noopener noreferrer">
          Open Yarmill
        </a>
      </div>
    </header>
  );
}
