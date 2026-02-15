import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getPanelFromHost, getFranchiseSlugFromHost, PANEL_DEFAULT_PATH, FRANCHISE_SUBDOMAINS_DEFAULT } from '@/lib/subdomain'
import { getFranchiseSubdomains } from '@/lib/db/franchise-subdomains'

const APP_DOMAIN = 'app.yisa-s.com'
const WWW_DOMAIN = 'www.yisa-s.com'

function getValidSubdomains(subdomains: string[]) {
  return ['app.', 'franchise.', 'veli.', ...subdomains.map((s) => s + '.')]
}
const ROOT_SITE_DOMAINS = ['yisa-s.com', 'www.yisa-s.com']

export async function updateSession(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const hostname = host.split(':')[0].toLowerCase()

  // yisa-s.com ve www.yisa-s.com → Bu sitede kal (tanıtım/landing). app/franchise/veli subdomain'leri → aynı proje.
  // Diğer domainler (vercel.app vb.) → app.yisa-s.com'a yönlendir
  const subdomains = await getFranchiseSubdomains()
  const validSubdomains = getValidSubdomains(subdomains)
  const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1')
  const isRootSite = ROOT_SITE_DOMAINS.includes(hostname)
  const hasValidSubdomain = validSubdomains.some((s) => hostname.startsWith(s))
  if (!isLocal && !isRootSite && !hasValidSubdomain) {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    url.host = APP_DOMAIN
    return NextResponse.redirect(url)
  }

  const panel = getPanelFromHost(host, subdomains)
  const pathname = request.nextUrl.pathname

  // franchise.yisa-s.com → www.yisa-s.com (spor okulları listesi)
  if (hostname.startsWith('franchise.')) {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    url.host = WWW_DOMAIN
    return NextResponse.redirect(url)
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  let user: { id?: string; email?: string } | null = null

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
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
      const { data } = await supabase.auth.getUser()
      user = data?.user ?? null
    } catch {
      user = null
    }
  }

  // Kök path (/) — subdomain'e göre yönlendir
  if ((pathname === '/' || pathname === '') && panel !== 'www') {
    const target = user ? PANEL_DEFAULT_PATH[panel] : '/auth/login'
    const url = request.nextUrl.clone()
    url.pathname = target
    const franchiseSlug = getFranchiseSlugFromHost(host, subdomains)
    if (franchiseSlug) url.searchParams.set('t', franchiseSlug)
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
