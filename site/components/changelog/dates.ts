/** Date helpers for the changelog. ISO `YYYY-MM-DD` is parsed as UTC so the
 *  displayed day never drifts with the viewer's timezone. */

function parseUTC(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

/** Short index-row label, e.g. `Jun 16` (year is implied by the page). */
export function shortDate(iso: string): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parseUTC(iso));
}

/** Full entry-page label, e.g. `June 16, 2026`. */
export function longDate(iso: string): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseUTC(iso));
}
