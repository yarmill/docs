import fs from 'node:fs/promises';
import path from 'node:path';
import { getAllPages, getPage } from '@/lib/content';

/**
 * Raw source route — serves a page's underlying Markdown/MDX so the "Copy page"
 * and "View as Markdown" controls have real source to work with. Statically
 * generated for every page, using our own content layer (no Fumadocs).
 *
 *   /raw/en/plan/goals  ->  content/docs/plan/goals.mdx
 *   /raw/en             ->  content/docs/index.mdx
 *
 * Served as text/plain so it renders inline in a browser tab.
 */
const CONTENT_ROOT = path.join(process.cwd(), 'content/docs');

export function generateStaticParams() {
  return getAllPages().map((p) => ({ lang: p.lang, slug: p.slugs }));
}

async function readSource(slugs: string[]): Promise<string | null> {
  const base = slugs.join('/');
  const candidates = base
    ? [`${base}.mdx`, `${base}.md`, `${base}/index.mdx`, `${base}/index.md`]
    : ['index.mdx', 'index.md'];
  for (const rel of candidates) {
    const abs = path.join(CONTENT_ROOT, rel);
    if (!abs.startsWith(CONTENT_ROOT)) continue;
    try {
      return await fs.readFile(abs, 'utf8');
    } catch {
      // try next candidate
    }
  }
  return null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string; slug?: string[] }> },
) {
  const { slug = [] } = await params;

  if (!getPage(slug)) {
    return new Response('Not found', { status: 404 });
  }

  const raw = await readSource(slug);
  if (raw == null) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(raw, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
