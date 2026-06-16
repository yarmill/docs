import type { CSSProperties, ReactNode } from 'react';

export function Columns({
  cols = 2,
  children,
}: {
  cols?: number;
  children?: ReactNode;
}) {
  return (
    <div className="ym-columns" style={{ '--ym-cols': cols } as CSSProperties}>
      {children}
    </div>
  );
}
