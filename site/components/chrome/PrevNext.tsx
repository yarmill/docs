import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { PrevNext as PrevNextData } from '@/lib/nav';

/**
 * Bottom-of-article previous/next navigation, derived from the flat page order
 * (lib/nav `getPrevNext`). Left-aligned "Previous", right-aligned "Next".
 */
export function PrevNext({ prev, next }: PrevNextData) {
  if (!prev && !next) return null;
  return (
    <nav className="ym-prevnext" aria-label="Pagination">
      {prev ? (
        <Link href={prev.url} className="ym-prevnext-link ym-prevnext-prev">
          <ArrowLeft className="ym-prevnext-icon" aria-hidden />
          <span>
            <span className="ym-prevnext-cap">Previous</span>
            <span className="ym-prevnext-title">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.url} className="ym-prevnext-link ym-prevnext-next">
          <span>
            <span className="ym-prevnext-cap">Next</span>
            <span className="ym-prevnext-title">{next.title}</span>
          </span>
          <ArrowRight className="ym-prevnext-icon" aria-hidden />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
