/**
 * Next.js Proxy — Supabase Session + Tenant White-Label Domain Routing
 * Subdomain: bjktuzlacimnastik.yisa-s.com
 * Custom domain: CNAME -> verified tenant
 * Embed: /embed/:slug route
 */

import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

/** Bilinen sistem subdomain'leri — tenant degil */
const SYSTEM_SUBDOMAINS = new Set([
  "app", "www", "veli", "franchise", "api", "admin",
])

const BASE_DOMAIN = "yisa-s.com"

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const cleanHost = hostname.split(":")[0].toLowerCase()
  const url = request.nextUrl.clone()

  // Embed route: /embed/:slug — CORS headers ekle
  if (url.pathname.startsWith("/embed/")) {
    const response = NextResponse.next()
    response.headers.set("X-Frame-Options", "ALLOWALL")
    response.headers.set("Content-Security-Policy", "frame-ancestors *")
    return response
  }

  // Subdomain detection
  if (cleanHost.endsWith(`.${BASE_DOMAIN}`)) {
    const subdomain = cleanHost.replace(`.${BASE_DOMAIN}`, "")

    if (!SYSTEM_SUBDOMAINS.has(subdomain) && subdomain && subdomain.length >= 2) {
      const response = await updateSession(request)
      response.headers.set("x-tenant-slug", subdomain)
      response.headers.set("x-tenant-domain", cleanHost)
      response.headers.set("x-tenant-type", "subdomain")
      return response
    }
  }

  // Custom domain detection (CNAME)
  // updateSession'i ATLA — cunku updateSession non-yisa-s.com domainleri redirect eder
  if (
    !cleanHost.endsWith(`.${BASE_DOMAIN}`) &&
    cleanHost !== BASE_DOMAIN &&
    cleanHost !== "localhost" &&
    !cleanHost.startsWith("127.") &&
    !cleanHost.startsWith("192.168.")
  ) {
    const response = NextResponse.next()
    response.headers.set("x-tenant-domain", cleanHost)
    response.headers.set("x-tenant-type", "custom")
    return response
  }

  // Default: sadece Supabase session guncelle
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.json|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
