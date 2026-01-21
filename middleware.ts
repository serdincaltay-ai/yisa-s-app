import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Kaldırılan sayfalar - ana sayfaya yönlendir
  if (
    pathname.startsWith('/assistant') ||
    pathname.startsWith('/connections') ||
    pathname.startsWith('/panel') ||
    (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/patron'))
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Patron dashboard için auth kontrolü
  if (pathname.startsWith('/dashboard/patron')) {
    const supabaseToken = request.cookies.get('sb-access-token')?.value
    
    if (!supabaseToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // API chat için auth kontrolü
  if (pathname.startsWith('/api/chat')) {
    const supabaseToken = request.cookies.get('sb-access-token')?.value
    
    if (!supabaseToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/panel/:path*', 
    '/dashboard/:path*', 
    '/assistant/:path*', 
    '/connections/:path*',
    '/api/chat/:path*'
  ]
}
