import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPages, getPage } from '@/lib/content';
import { getGroupLabel, getPrevNext } from '@/lib/nav';
import { renderMDX } from '@/lib/mdx';
import { isChangelogEntryUrl, getEntryByUrl, changelogIndexYear } from '@/lib/changelog';
import { TopBar } from '@/components/chrome/TopBar';
import { Toc } from '@/components/chrome/Toc';
import { PrevNext } from '@/components/chrome/PrevNext';
import { PageTransition } from '@/components/chrome/PageTransition';
import { ChangelogEntryHeader } from '@/components/changelog/ChangelogEntryHeader';

interface PageProps {
  params: Promise<{ lang: string; slug?: string[] }>;
}

export default async function DocPage(props: PageProps) {
  const { slug } = await props.params;
  const page = getPage(slug ?? []);
  if (!page) notFound();

  const { content, toc } = await renderMDX(page.body);
  const isWide = page.frontmatter.mode === 'wide';
  // Changelog entry pages get a custom header (date + tags + copy-link) from
  // frontmatter instead of the generic h1/lead, and drop the TOC + prev/next.
  const clEntry = isChangelogEntryUrl(page.url) ? getEntryByUrl(page.url) : undefined;
  // Year index pages (space home + /changelog/<year>) show the year as the
  // breadcrumb leaf instead of the repeated "Changelog" page title.
  const clYear = clEntry ? null : changelogIndexYear(page.url);
  // The year index is a list page: no TOC, and left-aligned at the content
  // gutter (the default 1024 wrapper) so its left edge matches entry pages —
  // NOT centered like a `mode: wide` page.
  const clIndex = clYear != null;
  const group = clEntry || clIndex ? 'Changelog' : getGroupLabel(page.url);
  // Entry breadcrumb: Changelog / <year> / <title>.
  const topbarParent = clEntry ? String(clEntry.year) : undefined;
  const topbarPage = clYear != null ? String(clYear) : page.frontmatter.title;
  const { prev, next } = clEntry || clIndex ? { prev: undefined, next: undefined } : getPrevNext(page.url);

  return (
    <div className="ym-main" data-full={isWide || undefined}>
      <TopBar group={group} parent={topbarParent} page={topbarPage} />

      <div className="ym-content">
        <div className="ym-content-row">
          <article
            id="ym-page"
            data-full={isWide || undefined}
            data-changelog-entry={clEntry ? '' : undefined}
            data-changelog-index={clIndex ? '' : undefined}
          >
            <PageTransition>
              {clEntry ? (
                <ChangelogEntryHeader entry={clEntry} />
              ) : (
                <>
                  {page.frontmatter.title ? <h1>{page.frontmatter.title}</h1> : null}
                  {page.frontmatter.description ? (
                    <p className="ym-lead">{page.frontmatter.description}</p>
                  ) : null}
                </>
              )}
              <div className="prose">{content}</div>
              {clEntry || clIndex ? null : <PrevNext prev={prev} next={next} />}
            </PageTransition>
          </article>

          {/* The homepage dashboard (mode: wide), changelog entry pages, and the
              changelog year index all drop the right-hand TOC. */}
          {!isWide && !clEntry && !clIndex && <Toc items={toc} />}
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
