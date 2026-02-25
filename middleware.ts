/**
 * Next.js Middleware — Tenant White-Label Domain Routing
 * Domain -> tenant_id cozumle, header'lara ekle
 * Subdomain: bjktuzlacimnastik.yisa-s.com
 * Custom domain: CNAME -> verified tenant
 * Embed: /embed/:slug route
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/** Bilinen sistem subdomain'leri — tenant degil */
const SYSTEM_SUBDOMAINS = new Set([
  "app",
  "www",
  "veli",
  "franchise",
  "api",
  "admin",
])

/** Tenant cozumleme icin base domain */
const BASE_DOMAIN = "yisa-s.com"

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const cleanHost = hostname.split(":")[0].toLowerCase()
  const url = request.nextUrl.clone()

  // Embed route: /embed/:slug — CORS headers ekle
  if (url.pathname.startsWith("/embed/")) {
    const response = NextResponse.next()
    response.headers.set("X-Frame-Options", "ALLOWALL")
    response.headers.set(
      "Content-Security-Policy",
      "frame-ancestors *"
    )
    return response
  }

  // Subdomain detection
  if (cleanHost.endsWith(`.${BASE_DOMAIN}`)) {
    const subdomain = cleanHost.replace(`.${BASE_DOMAIN}`, "")

    // Sistem subdomain'leri → atla
    if (SYSTEM_SUBDOMAINS.has(subdomain)) {
      return NextResponse.next()
    }

    // Tenant subdomain → header'a tenant slug ekle
    if (subdomain && subdomain.length >= 2) {
      const response = NextResponse.next()
      response.headers.set("x-tenant-slug", subdomain)
      response.headers.set("x-tenant-domain", cleanHost)
      response.headers.set("x-tenant-type", "subdomain")
      return response
    }
  }

  // Custom domain detection (CNAME)
  // Eger domain yisa-s.com degil ise → custom domain olabilir
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

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (sw.js, manifest.json, icons)
     */
    "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.json|icons).*)",
  ],
}
