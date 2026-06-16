'use client';

import {
  Children,
  isValidElement,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Lightbox } from './Lightbox';

/**
 * Product-screenshot frame. The image is click-to-zoom: clicking opens a
 * lightbox (Lightbox.tsx) with the enlarged image + caption.
 *
 * The clickable button is ALWAYS rendered, and the src is resolved at click
 * time from the live `<img>` in the DOM (works for any rendering) with the MDX
 * child's `src` prop as a fallback — so zoom is robust in dev and on a
 * production/CDN build alike. The MDX author keeps writing a plain `<img>`.
 *
 * Discoverability: a `zoom-in` cursor + an unobtrusive hover hint (mdx.css).
 * SSR-safe — the Lightbox only mounts on the client when open.
 */
function findImageProps(node: ReactNode): { src: string; alt: string } | null {
  let found: { src: string; alt: string } | null = null;
  Children.forEach(node, (child) => {
    if (found || !isValidElement(child)) return;
    const el = child as ReactElement<{ src?: unknown; alt?: unknown; children?: ReactNode }>;
    if (typeof el.props.src === 'string' && el.props.src) {
      found = { src: el.props.src, alt: typeof el.props.alt === 'string' ? el.props.alt : '' };
      return;
    }
    if (el.props.children) {
      const inner = findImageProps(el.props.children);
      if (inner) found = inner;
    }
  });
  return found;
}

export function Frame({
  caption,
  children,
}: {
  caption?: ReactNode;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const captionText = typeof caption === 'string' ? caption : undefined;

  function open() {
    const imgEl = ref.current?.querySelector('img');
    let src = imgEl?.currentSrc || imgEl?.getAttribute('src') || '';
    let alt = imgEl?.getAttribute('alt') ?? '';
    if (!src) {
      const fromProps = findImageProps(children);
      if (fromProps) {
        src = fromProps.src;
        alt = fromProps.alt;
      }
    }
    if (src) setZoom({ src, alt });
  }

  return (
    <figure className="ym-frame">
      <button
        type="button"
        ref={ref}
        className="ym-frame-media ym-frame-zoom"
        aria-label="Enlarge image"
        onClick={open}
      >
        {children}
      </button>
      {caption ? <figcaption className="ym-frame-caption">{caption}</figcaption> : null}
      {zoom ? (
        <Lightbox src={zoom.src} alt={zoom.alt} caption={captionText} onClose={() => setZoom(null)} />
      ) : null}
    </figure>
  );
}
