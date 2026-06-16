'use client';

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Click-to-zoom lightbox for product screenshots (Block D3). Rendered by
 * <Frame> when a framed image is clicked: a dim backdrop, the image centered and
 * enlarged up to the viewport bounds, the caption beneath, and a close button.
 *
 * Interaction: click anywhere (backdrop) or Esc closes; focus is trapped on the
 * dialog; the body is scroll-locked; focus is restored to the opener on close.
 * `role="dialog"` + aria-modal. Open animates a subtle scale + fade (≤200ms
 * ease-out); reduced motion falls back to a plain fade (chrome handled in
 * mdx.css). SSR-safe: only mounted on the client when open.
 */
export function Lightbox({
  src,
  alt,
  caption,
  onClose,
}: {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock for the duration; restored on unmount.
  useLayoutEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Move focus to the close button on open.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab') {
        // Only the close button is tabbable — keep focus on the dialog.
        e.preventDefault();
        closeRef.current?.focus();
      }
    },
    [onClose],
  );

  return (
    <div
      ref={dialogRef}
      className="ym-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt || caption || 'Image preview'}
      onClick={onClose}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        ref={closeRef}
        className="ym-lightbox-close"
        aria-label="Close preview"
        onClick={onClose}
      >
        <X aria-hidden />
      </button>
      <figure className="ym-lightbox-figure" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ym-lightbox-img" src={src} alt={alt} />
        {caption ? <figcaption className="ym-lightbox-caption">{caption}</figcaption> : null}
      </figure>
    </div>
  );
}
