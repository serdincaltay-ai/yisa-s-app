import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getPanelFromHost, PANEL_DEFAULT_PATH } from '@/lib/subdomain'

const APP_DOMAIN = 'app.yisa-s.com'
const VALID_SUBDOMAINS = ['app.', 'franchise.', 'veli.']

export async function updateSession(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const hostname = host.split(':')[0].toLowerCase()

  // Ana giriş domaini kaldırıldı — yisa-s.com, www, vercel.app → app.yisa-s.com (franchise/veli korunur)
  const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1')
  const hasValidSubdomain = VALID_SUBDOMAINS.some((s) => hostname.startsWith(s))
  if (!isLocal && !hasValidSubdomain) {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    url.host = APP_DOMAIN
    return NextResponse.redirect(url)
  }

  const panel = getPanelFromHost(host)
  const pathname = request.nextUrl.pathname

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Kök path (/) — subdomain'e göre yönlendir
  if ((pathname === '/' || pathname === '') && panel !== 'www') {
    const target = user ? PANEL_DEFAULT_PATH[panel] : '/auth/login'
    const url = request.nextUrl.clone()
    url.pathname = target
    if (!user) url.searchParams.set('from', panel)
    const redirect = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((c) => {
      const { name, value, ...opts } = c
      redirect.cookies.set(name, value, opts)
    })
    redirect.headers.set('x-yisa-panel', panel)
    return redirect
  }

  supabaseResponse.headers.set('x-yisa-panel', panel)

  const protectedPaths = ['/patron', '/franchise', '/tesis', '/antrenor', '/veli', '/dashboard']
  const isProtected = protectedPaths.some((p) => request.nextUrl.pathname.startsWith(p))
  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('from', panel)
    const redirectRes = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((c) => {
      const { name, value, ...opts } = c
      redirectRes.cookies.set(name, value, opts)
    })
    return redirectRes
  }
  if (request.nextUrl.pathname.startsWith('/protected') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    const redirectRes = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((c) => {
      const { name, value, ...opts } = c
      redirectRes.cookies.set(name, value, opts)
    })
    return redirectRes
  }

  return supabaseResponse
}
