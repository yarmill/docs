import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import type { ReactElement } from 'react';
import { getMDXComponents } from '@/mdx-components';
import { rehypeCollectToc, type TocItem } from './toc';

export type { TocItem } from './toc';

/**
 * Compile an MDX body to a React element through our own pipeline:
 *   remark: remark-gfm
 *   rehype: rehype-slug -> rehype-pretty-code (Shiki, dual theme) -> TOC collector
 *
 * Returns the rendered content plus the collected `TocItem[]` (h2/h3).
 * `rehype-pretty-code` is configured with `keepBackground: false` so code blocks
 * inherit our `--ym-*` surface (see mdx.css), and emits both light + dark token
 * colors as CSS variables that flip with the `.dark` class.
 */
export async function renderMDX(
  body: string,
): Promise<{ content: ReactElement; toc: TocItem[] }> {
  const toc: TocItem[] = [];

  const { content } = await compileMDX({
    source: body,
    components: getMDXComponents(),
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              theme: { light: 'github-light', dark: 'github-dark' },
              keepBackground: false,
            },
          ],
          rehypeCollectToc(toc),
        ],
      },
    },
  });

  return { content, toc };
}
