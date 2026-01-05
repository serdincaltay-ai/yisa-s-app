import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Panel rotalarını koru
  if (pathname.startsWith('/panel') || pathname.startsWith('/dashboard')) {
    // Supabase auth cookie kontrolü
    const supabaseToken = request.cookies.get('sb-access-token')?.value
    
    if (!supabaseToken) {
      // Auth yok, login'e yönlendir
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // API koruma
  if (pathname.startsWith('/api/chat')) {
    const supabaseToken = request.cookies.get('sb-access-token')?.value
    
    if (!supabaseToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/panel/:path*', '/dashboard/:path*', '/api/chat/:path*']
}
