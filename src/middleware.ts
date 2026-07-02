import { AUTHENTICATION_COOKIE_NAME } from '@/constants/config';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = (request: NextRequest): NextResponse => {
  const sessionToken = request.cookies.get(AUTHENTICATION_COOKIE_NAME);

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login') {
    if (sessionToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
};
