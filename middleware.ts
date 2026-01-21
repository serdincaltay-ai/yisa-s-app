import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function isPublicPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/api/health")
  );
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const host = (req.headers.get("host") || "").toLowerCase();

  // ✅ WWW = VİTRİN. Dashboard/Asistan ASLA.
  if (host.startsWith("www.")) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/assistant")) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ✅ APP = ZORUNLU LOGIN (public path hariç)
  if (!host.startsWith("app.")) {
    // Diğer hostlar için güvenli davran: sadece public sayfaları göster
    if (!isPublicPath(pathname)) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // app domain public sayfalar serbest
  if (isPublicPath(pathname)) return NextResponse.next();

  const res = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  // Login yoksa login'e
  if (!user) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ✅ Patron kilidi: sadece PATRON_EMAIL dashboard/asistan görür
  const patronEmail = (process.env.PATRON_EMAIL || "").toLowerCase().trim();
  const userEmail = (user.email || "").toLowerCase().trim();

  if (patronEmail && userEmail !== patronEmail) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/assistant")) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
