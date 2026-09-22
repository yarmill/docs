import Link from 'next/link';

/**
 * Static root (`/`) → `/en`. All real content lives under `/en/...`.
 *
 * In production this page is never served: `public/_redirects` makes Netlify
 * answer `/` with a 302 to `/en` at the edge, before any HTML is downloaded.
 * This file is the fallback for everything else (`next dev`, other static
 * hosts, a missing _redirects), layered so nothing ever flashes:
 *
 *   1. An inline script runs the moment the parser reaches it — before React,
 *      before any bundle download, and before the body has painted — so the
 *      navigation starts while the page is still blank. `replace` (not
 *      `assign`) keeps the bare root out of history.
 *   2. A meta refresh (hoisted into <head> by React 19) covers browsers with
 *      JavaScript disabled.
 *   3. A plain link, revealed by CSS only after a short delay, is the last
 *      resort — invisible during a normal redirect, present if both fail.
 *
 * No loading state is needed: on a normal load the user sees a blank page for
 * one HTML round-trip at most, and nothing in between.
 */
export default function RootPage() {
  return (
    <main className="ym-root-redirect">
      <meta httpEquiv="refresh" content="0;url=/en" />
      <script dangerouslySetInnerHTML={{ __html: "location.replace('/en')" }} />
      <p>
        <Link href="/en">Continue to the Yarmill docs →</Link>
      </p>
    </main>
  );
}
