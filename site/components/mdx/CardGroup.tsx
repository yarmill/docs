import type { CSSProperties, ReactNode } from 'react';

export function CardGroup({
  cols = 2,
  children,
}: {
  cols?: number;
  children?: ReactNode;
}) {
  return (
    <div
      className="ym-cardgroup"
      style={{ '--ym-cols': cols } as CSSProperties}
    >
      {children}
    </div>
  );
}
