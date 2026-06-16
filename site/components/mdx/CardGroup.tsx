import type { CSSProperties, ReactNode } from 'react';

/**
 * Card grid. Responsive auto-fit by default: it fits as many ~272px cards as the
 * width allows and collapses empty tracks, so every row reads full-width at any
 * size (Linear). This is deliberately NOT driven by a fixed column count —
 * partly for the responsive feel, partly because the MDX pipeline drops numeric
 * expression attributes (`cols={3}` arrives as undefined), which would silently
 * fall back. An explicit `cols` (e.g. the string `cols="3"`) is still honored.
 */
export function CardGroup({
  cols,
  children,
}: {
  cols?: number | string;
  children?: ReactNode;
}) {
  const hasCols = cols !== undefined && cols !== '';
  return (
    <div
      className="ym-cardgroup"
      data-cols={hasCols ? cols : 'auto'}
      style={hasCols ? ({ '--ym-cols': Number(cols) } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
