import { NextRequest, NextResponse } from 'next/server';

const privatePathPrefixes = [
  '/access',
  '/client',
  '/job',
  '/result',
  '/api'
];

function isPrivatePath(pathname: string) {
  return privatePathPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  if (isPrivatePath(pathname)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: [
    '/access/:path*',
    '/client/:path*',
    '/job/:path*',
    '/result/:path*',
    '/api/:path*'
  ]
};
