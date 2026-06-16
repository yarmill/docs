import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

/** Extract the visible text of a hast heading element. */
function textOf(node: Element): string {
  let out = '';
  visit(node, 'text', (t: { value: string }) => {
    out += t.value;
  });
  return out.trim();
}

/**
 * Rehype plugin factory: collects h2/h3 headings (after rehype-slug has set
 * their ids) into the provided array as `TocItem[]`. Returns a rehype plugin.
 *
 * Usage: pass `rehypeCollectToc(sink)` AFTER `rehype-slug` in the rehype chain;
 * read `sink` after compile to get the ordered TOC.
 */
export function rehypeCollectToc(sink: TocItem[]) {
  return () => (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const tag = node.tagName;
      if (tag !== 'h2' && tag !== 'h3') return;
      const depth = tag === 'h2' ? 2 : 3;
      const id = (node.properties?.id as string | undefined) ?? '';
      const text = textOf(node);
      if (id && text) sink.push({ id, text, depth });
    });
  };
}
