import type { ReactNode } from 'react';
import { Users, Clock } from 'lucide-react';

/**
 * Tutorial header line: audience, time-to-complete, and the modules a tutorial
 * touches (shown as accent pills). Styled via .ym-pagemeta in mdx.css.
 */
export function TutorialMeta({
  audience,
  time,
  modules = [],
}: {
  audience?: ReactNode;
  time?: ReactNode;
  modules?: string[];
}) {
  return (
    <div className="ym-pagemeta not-prose">
      <span className="pm-pill">
        <span className="pm-icon" aria-hidden="true">
          <Users />
        </span>
        <span className="pm-label">For</span>
        <span className="pm-value">{audience}</span>
      </span>
      {time ? (
        <span className="pm-pill">
          <span className="pm-icon" aria-hidden="true">
            <Clock />
          </span>
          <span className="pm-value">{time}</span>
        </span>
      ) : null}
      {modules.map((m) => (
        <span className="pm-pill pm-module" key={m}>
          {m}
        </span>
      ))}
    </div>
  );
}
