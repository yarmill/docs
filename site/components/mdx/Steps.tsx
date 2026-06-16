import type { ReactNode } from 'react';

export function Steps({ children }: { children?: ReactNode }) {
  return (
    <div className="ym-steps" role="list">
      {children}
    </div>
  );
}

export function Step({
  title,
  children,
}: {
  title?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="ym-step" role="listitem">
      {title ? <div className="ym-step-title">{title}</div> : null}
      <div className="ym-step-body">{children}</div>
    </div>
  );
}
