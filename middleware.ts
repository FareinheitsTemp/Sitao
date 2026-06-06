/**
 * middleware.ts
 * Next.js Middleware — захист маршрутів та оновлення сесій
 *
 * Захищає:
 *  - /profile/* — тільки авторизовані
 *  - /admin/*   — тільки admin/owner
 *  - /api/*     — перевірка базових заголовків
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Маршрути що потребують авторизації
const PROTECTED_ROUTES = ["/profile", "/settings"];
// Маршрути тільки для адмінів
const ADMIN_ROUTES = ["/admin"];
// Публічні auth маршрути (редірект якщо вже залоговані)
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next({ request });

  // ── Security Headers ──────────────────────────────────────
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js потребує
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
      "frame-ancestors 'none'",
    ].join("; ")
  );

  // ── Supabase Session Refresh ───────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Оновлення токенів (важливо для SSR)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Редірект для авторизованих на auth-сторінках ──────────
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (user) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    return response;
  }

  // ── Захист приватних маршрутів ────────────────────────────
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Захист адмін-маршрутів ────────────────────────────────
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Перевірка ролі через profiles таблицю
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "owner"].includes(profile.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ── Блокування прямих звернень до API без правильних заголовків ──
  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

    // Дозволяємо тільки запити зі свого домену (або у dev)
    if (
      origin &&
      process.env.NODE_ENV === "production" &&
      !origin.startsWith(siteUrl)
    ) {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Запускати middleware для всіх маршрутів крім:
     * - _next/static (статичні файли)
     * - _next/image (оптимізація зображень)
     * - favicon.ico
     * - public файли
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
