
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const { data: { user }} = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protected routes for admin
  
  // Redirect logged in users from the login page
  if (pathname === '/login' && user) {
     // User is authenticated, redirect to the admin dashboard.
     // The original response object is not needed here as we are creating a new redirect response.
     return NextResponse.redirect(new URL('/admin', request.url))
  }

  // If we've made it this far, the user is accessing a page they are allowed to see.
  // It is critical to return the `response` object from the `createClient` call.
  // This object has the refreshed session cookies, and returning it ensures they are
  // passed to the browser for subsequent requests.
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
