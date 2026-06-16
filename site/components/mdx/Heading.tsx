'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * In-article heading (h2/h3) with a hover-revealed permalink affordance.
 *
 * rehype-slug has already assigned the `id`; we keep it (and the
 * `scroll-margin-top` from chrome.css) and render a real `<a href="#id">` to
 * the LEFT of the text. Clicking copies the absolute deep link
 * (`origin + pathname + #id`) to the clipboard and briefly swaps the link glyph
 * for a check + a small "Copied" tooltip. The anchor is keyboard-focusable and
 * screen-reader-labeled; it's absolutely positioned so revealing it causes no
 * layout shift. Motion is opacity/transform only and reduced-motion safe (CSS).
 */
export function Heading({
  as: Tag,
  id,
  children,
  ...props
}: {
  as: 'h2' | 'h3';
  id?: string;
  children?: ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  // No id (shouldn't happen for h2/h3 post-rehype-slug) → render plain heading.
  if (!id) {
    return (
      <Tag {...props}>
        {children}
      </Tag>
    );
  }

  const href = `#${id}`;

  async function copyLink(e: React.MouseEvent<HTMLAnchorElement>) {
    // Let the browser still update the URL hash / scroll (native anchor
    // behaviour) — we only add the clipboard copy + confirmation on top.
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}#${id}`
        : href;
    try {
      e.preventDefault();
      await navigator.clipboard.writeText(url);
      // Keep the navigation behaviour we just suppressed.
      window.history.replaceState(null, '', href);
      document.getElementById(id!)?.scrollIntoView();
    } catch {
      // Clipboard blocked (insecure context / denied): fall back to the plain
      // anchor jump — don't preventDefault, just let it navigate.
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <Tag id={id} className="ym-heading" {...props}>
      <a
        href={href}
        className="ym-heading-anchor"
        data-copied={copied || undefined}
        aria-label="Copy link to section"
        onClick={copyLink}
      >
        <span className="ym-heading-anchor-icon" aria-hidden="true">
          {/* link glyph (lucide "link") */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="15"
            height="15"
            className="ym-heading-anchor-link"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          {/* check glyph shown after copy */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="15"
            height="15"
            className="ym-heading-anchor-check"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <span className="ym-heading-anchor-toast" role="status" aria-live="polite">
          {copied ? 'Copied' : ''}
        </span>
      </a>
      {children}
    </Tag>
  );
}
