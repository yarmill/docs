import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { i18n } from '@/lib/i18n';
import { getIcon } from '@/lib/icons';

// baseUrl '/' + i18n => pages resolve to `/<lang>/<...slug>`, e.g. `/en/plan/goals`.
// The home page (content/docs/index.mdx) resolves to `/en`.
//
// `icon` maps Font Awesome frontmatter names to lucide nodes (see lib/icons.tsx),
// so page-tree icons render as real glyphs instead of leaking the literal string.
export const source = loader({
  baseUrl: '/',
  i18n,
  icon: getIcon,
  source: docs.toFumadocsSource(),
});
