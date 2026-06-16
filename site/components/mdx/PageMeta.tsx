import type { ReactNode } from 'react';
import { Users, MonitorSmartphone } from 'lucide-react';

/**
 * Audience line shown under a page title: "For … · Where …" as pills.
 * Styled via .ym-pagemeta in mdx.css — themes automatically from --ym-* tokens.
 */
export function PageMeta({
  audience,
  where,
}: {
  audience?: ReactNode;
  where?: ReactNode;
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
      <span className="pm-pill">
        <span className="pm-icon" aria-hidden="true">
          <MonitorSmartphone />
        </span>
        <span className="pm-label">Where</span>
        <span className="pm-value">{where}</span>
      </span>
    </div>
  );
}
