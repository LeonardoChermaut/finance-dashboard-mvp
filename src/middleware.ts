import {
  AUTHENTICATED_COOKIE_VALUE,
  AUTHENTICATION_COOKIE_NAME,
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
} from '@/constants/config';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const hasValidSession = (request: NextRequest): boolean => {
  const sessionToken = request.cookies.get(AUTHENTICATION_COOKIE_NAME);
  return sessionToken?.value === AUTHENTICATED_COOKIE_VALUE;
};

const matchesAnyPrefix = (pathname: string, prefixes: readonly string[]): boolean =>
  prefixes.some((prefix) => pathname.startsWith(prefix));

export const middleware = (request: NextRequest): NextResponse => {
  const isAuthenticated = hasValidSession(request);
  const { pathname } = request.nextUrl;

  if (matchesAnyPrefix(pathname, PROTECTED_ROUTES) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (matchesAnyPrefix(pathname, PUBLIC_ROUTES) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/login', '/dashboard/:path*', '/profile/:path*'],
};
