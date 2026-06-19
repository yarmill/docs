import type { Tag as TagName } from '@/lib/changelog';

/**
 * A changelog category chip — a small tinted dot + label. Tints are driven by
 * `data-tag` in changelog.css (Yollanda = Blush; the rest from our token set).
 * Display-only for now (not a filter control).
 */
export function Tag({ name }: { name: TagName }) {
  return (
    <span className="ym-cl-tag" data-tag={name}>
      <span className="ym-cl-tag-dot" aria-hidden="true" />
      {name}
    </span>
  );
}
