import Link from 'next/link';
import { getEntriesByYear, getLatestYear } from '@/lib/changelog';
import { shortDate } from './dates';
import { Tag } from './Tag';

/**
 * The scannable changelog index (Attio-style): a dense text list, one row per
 * entry — `date · title + lede · tags · →` — with hairline dividers. No hero
 * thumbnails here; rich media lives on the entry page. Rendered from frontmatter
 * via the data layer, so the list is never hand-maintained.
 *
 * `year` defaults to the latest year (the `/en/changelog` space home).
 */
export function ChangelogIndex({ year }: { year?: number }) {
  const activeYear = year ?? getLatestYear();
  const entries = getEntriesByYear(activeYear);

  // Show the date only on the first row of a date group (consecutive entries
  // sharing a date align under one label). Precomputed to keep render pure.
  const rows = entries.map((e, i) => ({
    entry: e,
    showDate: i === 0 || e.date !== entries[i - 1].date,
  }));

  return (
    <div className="ym-cl">
      <ol className="ym-cl-list">
        {rows.map(({ entry: e, showDate }) => {
          return (
            <li key={e.url} className="ym-cl-row">
              <Link href={e.url} className="ym-cl-rowlink group">
                <time className="ym-cl-date" dateTime={e.date}>
                  {showDate ? shortDate(e.date) : ''}
                </time>
                <div className="ym-cl-body">
                  <h2 className="ym-cl-title">{e.title}</h2>
                  {e.lede ? <p className="ym-cl-lede">{e.lede}</p> : null}
                </div>
                {e.tags.length ? (
                  <div className="ym-cl-tags">
                    {e.tags.map((t) => (
                      <Tag key={t} name={t} />
                    ))}
                  </div>
                ) : (
                  <div className="ym-cl-tags" />
                )}
                <span className="ym-cl-chev" aria-hidden="true">
                  {/* lucide "arrow-right" */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
