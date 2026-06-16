import type { ReactNode } from 'react';

/**
 * Card grid wrapper. The layout is fully responsive — the grid fits as many
 * ~244px cards as the width allows and reflows (auto-fill, see .ym-cardgroup in
 * mdx.css) — so it is NOT column-count driven and takes no props beyond
 * children. Any `cols={n}` authored in MDX is simply ignored (the MDX pipeline
 * drops numeric expression attributes anyway).
 */
export function CardGroup({ children }: { children?: ReactNode }) {
  return <div className="ym-cardgroup">{children}</div>;
}
