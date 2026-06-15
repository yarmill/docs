import type { ReactNode } from 'react';

export function Update({
  label,
  description,
  children,
}: {
  label?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="ym-update">
      {label ? <div className="ym-update-label">{label}</div> : null}
      {description ? (
        <div className="ym-update-desc">{description}</div>
      ) : null}
      <div className="ym-update-body">{children}</div>
    </div>
  );
}
