import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Icon } from '@/lib/icons';

export function Card({
  title,
  icon,
  href,
  children,
}: {
  title?: ReactNode;
  icon?: string;
  href?: string;
  children?: ReactNode;
}) {
  const inner = (
    <div className="ym-card" data-has-icon={icon ? true : undefined}>
      {icon ? (
        <div className="ym-card-top">
          <span className="ym-card-icon" aria-hidden="true">
            <Icon name={icon} />
          </span>
        </div>
      ) : null}
      <div className="ym-card-bottom">
        {title ? (
          <div className="ym-card-title">
            <span>{title}</span>
            {href ? (
              <span className="ym-card-arrow" aria-hidden="true">
                <ArrowRight />
              </span>
            ) : null}
          </div>
        ) : null}
        {children ? <div className="ym-card-body">{children}</div> : null}
      </div>
    </div>
  );

  if (!href) return inner;

  const internal = href.startsWith('/');
  if (internal) {
    return (
      <Link className="ym-card-link" href={href}>
        {inner}
      </Link>
    );
  }
  return (
    <a
      className="ym-card-link"
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      {inner}
    </a>
  );
}
