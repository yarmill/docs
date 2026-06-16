'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';
import { Lightbox } from './Lightbox';

/**
 * Product-screenshot frame. The image is click-to-zoom: clicking it opens a
 * lightbox (Lightbox.tsx) with the enlarged image + caption. We wrap the media
 * in a button and, on click, read the rendered `<img>`'s `src`/`alt` from the
 * DOM — so the MDX author keeps writing a plain `<img>` child and zoom works
 * without threading props.
 *
 * Discoverability: a `zoom-in` cursor + an unobtrusive hover hint (handled in
 * mdx.css). SSR-safe — the Lightbox only mounts on the client when open.
 */
export function Frame({
  caption,
  children,
}: {
  caption?: ReactNode;
  children?: ReactNode;
}) {
  const mediaRef = useRef<HTMLButtonElement>(null);
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);

  const open = useCallback(() => {
    const img = mediaRef.current?.querySelector('img');
    if (!img) return;
    // Prefer the resolved currentSrc (handles any responsive sources) but fall
    // back to the attribute for SSR-rendered images.
    const src = img.currentSrc || img.src || img.getAttribute('src') || '';
    if (src) setZoom({ src, alt: img.getAttribute('alt') ?? '' });
  }, []);

  const close = useCallback(() => setZoom(null), []);

  // A plain-text caption for the lightbox figcaption (caption is usually a
  // string from MDX; non-string nodes are simply omitted there).
  const captionText = typeof caption === 'string' ? caption : undefined;

  return (
    <figure className="ym-frame">
      <button
        type="button"
        ref={mediaRef}
        className="ym-frame-media ym-frame-zoom"
        aria-label="Enlarge image"
        onClick={open}
      >
        {children}
      </button>
      {caption ? <figcaption className="ym-frame-caption">{caption}</figcaption> : null}
      {zoom ? (
        <Lightbox src={zoom.src} alt={zoom.alt} caption={captionText} onClose={close} />
      ) : null}
    </figure>
  );
}
