import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        // Corrected: Removed duplicate function signature
        set(name: string, value: string, options: CookieOptions) {
          // Modify request and response cookies directly
          request.cookies.set({ name, value, ...options });
          response.cookies.set({
            name,
            value,
            ...options,
            // Add standard attributes for robustness (adjust domain/secure for production)
            path: '/',
            // domain: 'your-domain.com', // Uncomment and set for production
            // secure: true, // Uncomment for production (HTTPS)
            sameSite: 'lax',
            maxAge: options.maxAge,
          })
        },
        // Corrected: Removed duplicate function signature
        remove(name: string, options: CookieOptions) {
          // Modify request and response cookies directly
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({
            name,
            value: '',
            ...options,
            path: '/',
          })
        },
      },
    }
  )

  // Refresh session if expired - important! This needs to be done
  // before checking the auth status in Server Components or API routes.
  // We run it here before getUser() as recommended.
  await supabase.auth.getSession()

  // Check auth status AFTER potential refresh
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl
  const publicPaths = ['/login', '/signup']

  // Restore logic using the user object from getUser()
  if (!user && !publicPaths.includes(pathname)) {
    // Allow access to the root path even if not logged in
    if (pathname === '/') {
       return response; // Allow access to root
    }
    // Redirect to login for other protected paths
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Restore logic using the user object from getUser()
  if (user && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow request to proceed
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (Supabase auth routes if you use them)
     * Feel free to modify this pattern to include more exceptions.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
