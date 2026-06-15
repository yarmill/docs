import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import { i18n } from '@/lib/i18n';

export default createI18nMiddleware(i18n);

export const config = {
  // Run on all paths EXCEPT: API routes, the /raw source route (it carries its
  // own locale segment), Next internals, and any request for a file with an
  // extension (a dot) — i.e. all static assets under /public (/brand, /fonts,
  // /images, icon.png, favicon.ico, …). Doc routes never contain a dot, so this
  // is a safe catch-all that needs no per-folder upkeep.
  matcher: ['/((?!api|raw|_next|.*\\.).*)'],
};
