import Link from 'next/link';
import { RootRedirect } from '@/components/chrome/RootRedirect';

/**
 * Static root (`/`) → `/en`. In a static export there's no Middleware to issue a
 * server redirect, so this prerendered page redirects on load (client-side) with
 * a plain link as the no-JS / crawler fallback. All real content lives under
 * `/en/...`.
 */
export default function RootPage() {
  return (
    <main className="ym-root-redirect">
      <RootRedirect />
      <Link href="/en">Continue to the Yarmill docs →</Link>
    </main>
  );
}
