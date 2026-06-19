import { type ChangelogEntry } from '@/lib/changelog';
import { longDate } from './dates';
import { Tag } from './Tag';

/**
 * The header above a changelog entry's body — the date + tag pills, the title,
 * and the lede. Rendered by the route (page.tsx) for entry pages, from
 * frontmatter, so entry MDX files carry only their body (hero + prose).
 */
export function ChangelogEntryHeader({ entry }: { entry: ChangelogEntry }) {
  return (
    <header className="ym-cl-entry-head">
      <div className="ym-cl-entry-meta">
        {entry.date ? (
          <time className="ym-cl-entry-date" dateTime={entry.date}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {longDate(entry.date)}
          </time>
        ) : null}
        {entry.tags.length ? (
          <div className="ym-cl-entry-tags">
            {entry.tags.map((t) => (
              <Tag key={t} name={t} />
            ))}
          </div>
        ) : null}
      </div>

      <h1 className="ym-cl-entry-title">{entry.title}</h1>

      {entry.lede ? <p className="ym-cl-entry-lede">{entry.lede}</p> : null}
    </header>
  );
}
