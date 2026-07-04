import { AUTHENTICATED_COOKIE_VALUE, AUTHENTICATION_COOKIE_NAME } from '@/constants/config';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const hasValidSession = (request: NextRequest): boolean => {
  const sessionToken = request.cookies.get(AUTHENTICATION_COOKIE_NAME);
  return sessionToken?.value === AUTHENTICATED_COOKIE_VALUE;
};

export const middleware = (request: NextRequest): NextResponse => {
  const isAuthenticated = hasValidSession(request);

  if (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/profile')
  ) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (request.nextUrl.pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/login', '/dashboard/:path*', '/profile/:path*'],
};
