import type { ReactNode } from 'react';
import {
  Info as InfoIcon,
  Lightbulb,
  TriangleAlert,
  StickyNote,
  CircleCheck,
  type LucideIcon,
} from 'lucide-react';

type Kind = 'info' | 'tip' | 'warning' | 'note' | 'check';

const ICONS: Record<Kind, LucideIcon> = {
  info: InfoIcon,
  tip: Lightbulb,
  warning: TriangleAlert,
  note: StickyNote,
  check: CircleCheck,
};

function Callout({ kind, children }: { kind: Kind; children?: ReactNode }) {
  const Glyph = ICONS[kind];
  return (
    <div className={`ym-callout ym-callout-${kind}`} role="note">
      <span className="ym-callout-icon" aria-hidden="true">
        <Glyph />
      </span>
      <div className="ym-callout-body">{children}</div>
    </div>
  );
}

export function Info({ children }: { children?: ReactNode }) {
  return <Callout kind="info">{children}</Callout>;
}
export function Tip({ children }: { children?: ReactNode }) {
  return <Callout kind="tip">{children}</Callout>;
}
export function Warning({ children }: { children?: ReactNode }) {
  return <Callout kind="warning">{children}</Callout>;
}
export function Note({ children }: { children?: ReactNode }) {
  return <Callout kind="note">{children}</Callout>;
}
export function Check({ children }: { children?: ReactNode }) {
  return <Callout kind="check">{children}</Callout>;
}
