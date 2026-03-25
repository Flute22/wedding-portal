import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Skip auth entirely if Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  const { supabase, supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  // ── Public routes (no auth needed) ──────────────────────────
  const publicPaths = ['/login', '/signup', '/forgot-password', '/book']
  const isPublic = publicPaths.some(p => pathname.startsWith(p))
    || pathname === '/'
    || pathname.startsWith('/_next')
    || pathname.startsWith('/api/bookings/availability')
    || pathname.startsWith('/api/bookings/create')
    || pathname.match(/\.(ico|svg|png|jpg|jpeg|webp|woff2?)$/)

  if (isPublic) return supabaseResponse

  // ── Unauthenticated → login ──────────────────────────────────
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // ── Admin-only routes ────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
