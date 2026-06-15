import type { ReactNode } from 'react';

export function Frame({
  caption,
  children,
}: {
  caption?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <figure className="ym-frame">
      <div className="ym-frame-media">{children}</div>
      {caption ? (
        <figcaption className="ym-frame-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
