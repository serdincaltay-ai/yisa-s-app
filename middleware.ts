import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/panel', '/dashboard', '/assistant', '/connections']

// API routes that require authentication
const PROTECTED_API_ROUTES = ['/api/chat', '/api/db']

// Public routes (no auth required)
const PUBLIC_ROUTES = ['/', '/reset-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const supabaseToken = request.cookies.get('sb-access-token')?.value

  // Check if it's a protected page route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  
  // Check if it's a protected API route
  const isProtectedApiRoute = PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))

  // Check if it's a public route
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route)

  // If accessing protected route without auth, redirect to login
  if (isProtectedRoute && !supabaseToken) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing protected API without auth, return 401
  if (isProtectedApiRoute && !supabaseToken) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' }, 
      { status: 401 }
    )
  }

  // Allow request to proceed
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (icons, manifest, sw.js etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|screenshots).*)',
  ]
}
