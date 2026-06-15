import { NextResponse, type NextRequest } from 'next/server';

/**
 * Minimal redirect (no i18n library): send the bare root `/` to `/en`. All doc
 * URLs already live under `/en/...`; static assets, `/raw`, and `/_next` are
 * excluded by the matcher so they are untouched.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
