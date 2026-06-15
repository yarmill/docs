import { defineDocs, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

// Extend the default frontmatter schema with the extra fields the Mintlify
// content uses: `icon` (Font Awesome name — ignored visually for now),
// `sidebarTitle`, and `mode` (e.g. "wide").
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      icon: z.string().optional(),
      sidebarTitle: z.string().optional(),
      mode: z.string().optional(),
    }),
  },
});

export default defineConfig();
