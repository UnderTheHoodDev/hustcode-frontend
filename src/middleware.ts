import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const access_token = request.cookies.get('accessToken');

  if (access_token && request.nextUrl.pathname.includes('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}
