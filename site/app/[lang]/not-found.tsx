import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFlatPages, getSpaces, type NavPage } from '@/lib/nav';
import { DocsShell } from '@/components/chrome/DocsShell';
import { TopBar } from '@/components/chrome/TopBar';
import { NotFoundActions } from '@/components/chrome/NotFoundActions';
import '@/app/theme/chrome.css';

/**
 * Branded 404, rendered INSIDE the docs shell so the sidebar/spaces are present.
 *
 * Next renders a dynamic-segment `not-found.tsx` against the ROOT layout, not
 * the `[lang]` layout (the segment's params aren't available to the not-found
 * boundary), so we can't rely on `app/[lang]/layout.tsx` to supply <DocsShell>.
 * We therefore mount the shell here ourselves and fill the same grid areas a
 * real page does — a <TopBar> in `header` and a centred empty state in `main`
 * (no TOC). Reached whenever `page.tsx` calls notFound() for an unresolved slug.
 */

// Preferred "Popular" destinations, resolved against the live nav so we never
// link to a page that doesn't exist; falls back to the first real pages.
const PREFERRED = ['/en/get-started/concepts', '/en/plan/goals', '/en/reality/training-log'];

function popularPages(): NavPage[] {
  const flat = getFlatPages();
  const byUrl = new Map(flat.map((p) => [p.url, p]));
  const picked: NavPage[] = [];
  // Always lead with the home page, then preferred, then fill from the top.
  const home = byUrl.get('/en');
  if (home) picked.push(home);
  for (const url of PREFERRED) {
    const p = byUrl.get(url);
    if (p && !picked.includes(p)) picked.push(p);
  }
  for (const p of flat) {
    if (picked.length >= 4) break;
    if (!picked.includes(p)) picked.push(p);
  }
  return picked.slice(0, 4);
}

export default function NotFound() {
  const popular = popularPages();
  const spaces = getSpaces();

  return (
    <DocsShell spaces={spaces}>
      <div className="ym-main">
        <TopBar group="" page="Not found" />

      <div className="ym-content">
        <div className="ym-notfound">
          <p className="ym-notfound-code" aria-hidden>
            404
          </p>
          <h1 className="ym-notfound-title">Page not found</h1>
          <p className="ym-notfound-message">This page doesn&rsquo;t exist or moved.</p>

          <NotFoundActions />

          {popular.length > 0 ? (
            <div className="ym-notfound-popular">
              <p className="ym-notfound-popular-label">Popular pages</p>
              <ul className="ym-notfound-popular-list">
                {popular.map((p) => (
                  <li key={p.url}>
                    <Link href={p.url} className="ym-notfound-popular-link">
                      <span>{p.title}</span>
                      <ArrowRight className="ym-notfound-popular-icon" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          </div>
        </div>
      </div>
    </DocsShell>
  );
}
