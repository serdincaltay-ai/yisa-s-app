import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/panel') || pathname.startsWith('/dashboard') || pathname.startsWith('/assistant')) {
    const supabaseToken = request.cookies.get('sb-access-token')?.value
    
    if (!supabaseToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (pathname.startsWith('/api/chat')) {
    const supabaseToken = request.cookies.get('sb-access-token')?.value
    
    if (!supabaseToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/panel/:path*', '/dashboard/:path*', '/assistant/:path*', '/api/chat/:path*']
}
