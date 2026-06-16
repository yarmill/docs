import type { ReactNode } from 'react';

export function ParamField({
  path,
  name,
  type,
  required,
  default: defaultValue,
  children,
}: {
  path?: string;
  name?: string;
  type?: string;
  required?: boolean;
  default?: string;
  children?: ReactNode;
}) {
  const label = path ?? name;
  return (
    <div className="ym-paramfield">
      <div className="ym-paramfield-head">
        {label ? <code className="ym-paramfield-name">{label}</code> : null}
        {type ? <span className="ym-paramfield-type">{type}</span> : null}
        {required ? (
          <span className="ym-paramfield-required">required</span>
        ) : null}
        {defaultValue ? (
          <span className="ym-paramfield-default">
            Default: <code>{defaultValue}</code>
          </span>
        ) : null}
      </div>
      {children ? (
        <div className="ym-paramfield-body">{children}</div>
      ) : null}
    </div>
  );
}
