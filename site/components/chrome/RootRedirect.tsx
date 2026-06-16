'use client';

import { useEffect } from 'react';

/**
 * Client-side `/` → `/en` redirect for the static root page. `replace` (not
 * push) so the bare root never lands in history. Paired with a real <a> in the
 * server-rendered page as the no-JS fallback.
 */
export function RootRedirect() {
  useEffect(() => {
    window.location.replace('/en');
  }, []);
  return null;
}
