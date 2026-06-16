import type { ReactNode } from 'react';

/** Slugify a title into a stable anchor id (Linear-style per-entry permalink). */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function textOf(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  const props = (node as { props?: { children?: ReactNode } }).props;
  return props ? textOf(props.children) : '';
}

export function Update({
  label,
  description,
  title,
  children,
}: {
  /** Date or period — e.g. "June 2026". Rendered as the small mono kicker. */
  label?: ReactNode;
  /** Optional version tag or sub-label. */
  description?: ReactNode;
  /** Entry headline. Gets an auto-slug `id` so the entry is independently linkable. */
  title?: ReactNode;
  children?: ReactNode;
}) {
  const id = title ? slugify(`${textOf(label)} ${textOf(title)}`.trim()) : undefined;

  return (
    <section className="ym-update" id={id}>
      {label ? <div className="ym-update-label">{label}</div> : null}
      {title ? (
        <h2 className="ym-update-title">
          {id ? (
            <a href={`#${id}`} className="ym-update-anchor" aria-hidden="true">
              #
            </a>
          ) : null}
          {title}
        </h2>
      ) : null}
      {description ? (
        <div className="ym-update-desc">{description}</div>
      ) : null}
      <div className="ym-update-body">{children}</div>
    </section>
  );
}
