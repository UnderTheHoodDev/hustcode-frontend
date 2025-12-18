import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const access_token = request.cookies.get('accessToken');
  const refresh_token = request.cookies.get('refreshToken');

  if (access_token && request.nextUrl.pathname.includes('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const protectedPaths = ['/problems', '/profile', '/admin'];

  if (
    !access_token &&
    !refresh_token &&
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}
