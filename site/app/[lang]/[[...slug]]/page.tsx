import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPages, getPage } from '@/lib/content';
import { getGroupLabel, getPrevNext } from '@/lib/nav';
import { renderMDX } from '@/lib/mdx';
import { TopBar } from '@/components/chrome/TopBar';
import { Toc } from '@/components/chrome/Toc';
import { PrevNext } from '@/components/chrome/PrevNext';

interface PageProps {
  params: Promise<{ lang: string; slug?: string[] }>;
}

export default async function DocPage(props: PageProps) {
  const { slug } = await props.params;
  const page = getPage(slug ?? []);
  if (!page) notFound();

  const { content, toc } = await renderMDX(page.body);
  const isWide = page.frontmatter.mode === 'wide';
  const group = getGroupLabel(page.url);
  const { prev, next } = getPrevNext(page.url);

  return (
    <div className="ym-main" data-full={isWide || undefined}>
      <TopBar group={group} page={page.frontmatter.title} />

      <div className="ym-content">
        <div className="ym-content-row">
          <article id="nd-page" data-full={isWide || undefined}>
            {page.frontmatter.title ? <h1>{page.frontmatter.title}</h1> : null}
            {page.frontmatter.description ? (
              <p className="ym-lead">{page.frontmatter.description}</p>
            ) : null}
            <div className="prose">{content}</div>
            <PrevNext prev={prev} next={next} />
          </article>

          <Toc items={toc} />
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  // One entry per page; `slug: []` for the home page.
  return getAllPages().map((p) => ({ lang: p.lang, slug: p.slugs }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const page = getPage(slug ?? []);
  if (!page) return {};
  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
  };
}
