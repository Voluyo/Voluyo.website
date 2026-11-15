import { NextResponse, type NextRequest } from 'next/server';
import { isLocale, localizePathname, negotiateLocale } from '@/i18n/config';

/**
 * Locale routing only: paths without a locale prefix are redirected to the visitor's preferred
 * supported language (Accept-Language), e.g. "/" → "/de", "/explore?city=x" → "/en/explore?city=x".
 * No cookies are set. Auth/session checks are NOT done here (see docs/architecture.md).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isLocale(pathname.split('/')[1])) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = localizePathname(pathname, negotiateLocale(request.headers.get('accept-language')));
  const response = NextResponse.redirect(url);
  response.headers.set('Vary', 'Accept-Language');
  return response;
}

export const config = {
  // Skip Next internals, API routes and any path with a file extension (static assets).
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
};
