import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register');
  const hasToken = request.cookies.has('token');

  console.log('Middleware check:', {
    path: request.nextUrl.pathname,
    isAuthPage,
    hasToken,
    cookies: request.cookies.getAll()
  });

  if (isAuthPage && hasToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/study-plan/:path*',
    '/calendar/:path*',
    '/tasks/:path*',
    '/login',
    '/register'
  ]
}; 