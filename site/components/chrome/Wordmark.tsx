import Link from 'fumadocs-core/link';

/**
 * Yarmill wordmark, links to the docs home (`/en`). Both theme variants are
 * rendered and toggled with CSS (`.dark`) so there is no theme-flash or layout
 * shift on hydration — the correct one is shown by the cascade alone.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/en" className={className} aria-label="Yarmill docs — home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/yarmill-logo-blue.png"
        alt="Yarmill"
        className="ym-wordmark ym-wordmark-light"
        height={22}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/yarmill-logo-white.png"
        alt="Yarmill"
        className="ym-wordmark ym-wordmark-dark"
        height={22}
      />
    </Link>
  );
}
