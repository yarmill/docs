import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { ZoomImage } from './ZoomImage';

/**
 * Product-screenshot frame with Linear-style click-to-zoom.
 *
 * The image's `src`/`alt` are read from the MDX child element's props, then
 * rendered through <ZoomImage>, which reproduces Linear's FLIP zoom (the image
 * grows from its in-page box to a centred, viewport-fitted size on a
 * page-coloured canvas). The caption stays put — only the image zooms.
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
  const image = findImageProps(children);

  return (
    <figure className="ym-frame">
      <div className="ym-frame-media">
        {image ? <ZoomImage src={image.src} alt={image.alt} /> : children}
      </div>
      {caption ? <figcaption className="ym-frame-caption">{caption}</figcaption> : null}
    </figure>
  );
}
