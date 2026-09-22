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
 * This lives at the app ROOT on purpose: the static export builds `out/404.html`
 * from the root `/_not-found` route, and that file is what Netlify serves for
 * every unknown URL. A `not-found.tsx` nested under `[lang]` never reaches the
 * export — Next would emit its default 404 instead. As a root boundary it also
 * catches `notFound()` from `app/[lang]/[[...slug]]/page.tsx` in `next dev`.
 *
 * Not-found boundaries render against the root layout only, so `[lang]/layout`
 * does not supply <DocsShell> here. We mount the shell ourselves and fill the
 * same grid areas a real page does — a <TopBar> in `header` and a centred empty
 * state in `main` (no TOC). chrome.css is imported here because the root layout
 * does not load it.
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
