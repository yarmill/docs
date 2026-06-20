import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Single-column link list (home page, "directory" pages). One row per
 * destination, stacked with hairline dividers — the changelog-index pattern,
 * but with a leading illustration slot instead of a date:
 *
 *   [ illustration ] [ title + description ] [ → ]
 *
 * Pass `art` (a path to an SVG/image) for the leading illustration; it falls
 * back to the shared dog placeholder. For fully custom markup, pass
 * `illustration` (a ReactNode), which takes precedence over `art`.
 */
export function RowList({ children }: { children?: ReactNode }) {
  return <ul className="ym-rows">{children}</ul>;
}

const DEFAULT_ART = '/illustrations/placeholder-dog.svg';

export function Row({
  title,
  href,
  art,
  illustration,
  children,
}: {
  title?: ReactNode;
  href?: string;
  /** Path to the leading illustration (SVG/image). Defaults to the dog. */
  art?: string;
  /** Fully custom illustration markup; overrides `art`. */
  illustration?: ReactNode;
  children?: ReactNode;
}) {
  const inner = (
    <>
      <span className="ym-row-illu" aria-hidden="true">
        {illustration ?? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={art ?? DEFAULT_ART} alt="" />
        )}
      </span>
      <span className="ym-row-body">
        {title ? <span className="ym-row-title">{title}</span> : null}
        {children ? <span className="ym-row-desc">{children}</span> : null}
      </span>
      <span className="ym-row-arrow" aria-hidden="true">
        <ArrowRight />
      </span>
    </>
  );

  if (!href) {
    return <li className="ym-row">{inner}</li>;
  }

  const internal = href.startsWith('/');
  return (
    <li className="ym-row">
      {internal ? (
        <Link className="ym-row-link" href={href}>
          {inner}
        </Link>
      ) : (
        <a className="ym-row-link" href={href} target="_blank" rel="noreferrer noopener">
          {inner}
        </a>
      )}
    </li>
  );
}
