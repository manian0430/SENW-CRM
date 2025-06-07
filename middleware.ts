import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const publicPaths = ['/login', '/signup', '/api/auth', '/_next', '/favicon.ico']
  
  // Skip auth check for public paths and static files
  if (publicPaths.some(path => pathname.startsWith(path)) || 
      pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)) {
    return NextResponse.next()
  }

  // --- DEBUG LOGGING ---
  const cookies = request.cookies.getAll()

  // Dynamically check for any Supabase auth token cookie (including chunked cookies)
  const hasAuthCookie = cookies.some(cookie => cookie.name.includes('-auth-token'))

  if (!hasAuthCookie && pathname !== '/') {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};