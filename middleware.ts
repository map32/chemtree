import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {createClient} from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = await createClient();

  // 1. Refresh the session (this updates the cookie if needed)
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Protect "/admin" routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      // If not logged in, redirect to login page
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 3. Prevent logged-in users from seeing the login page again
  if (request.nextUrl.pathname === '/login') {
    if (user) {
      return NextResponse.redirect(new URL('/admin/write', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/login', '/admin', '/admin/:path*'],
}