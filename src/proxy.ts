import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_MAX_AGE } from "@/lib/supabase/browser";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Instant pass for static assets, favicons, images, and OAuth callback
  if (
    pathname === "/auth/callback" ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next({ request });
  }

  // 2. Fast path: If the visitor has no Supabase auth cookies, return immediately (< 1ms).
  // This avoids remote Supabase auth network calls for all guest browsing and tab transitions.
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
  );

  if (!hasAuthCookie) {
    return NextResponse.next({ request });
  }

  // 3. Fast path for RSC prefetch requests on public pages:
  // When Next.js prefetches routes on hover or tab navigation, don't block on auth refresh
  // unless navigating to a sensitive/protected route.
  const isPrefetch =
    request.headers.get("x-next-router-prefetch") !== null ||
    request.nextUrl.searchParams.has("_rsc");

  const isProtectedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/api/account") ||
    pathname.startsWith("/api/admin");

  if (isPrefetch && !isProtectedRoute) {
    return NextResponse.next({ request });
  }

  // 4. For authenticated sessions on protected routes or full page visits, refresh tokens seamlessly.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )!,
    {
      cookieOptions: {
        maxAge: AUTH_COOKIE_MAX_AGE,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              maxAge: AUTH_COOKIE_MAX_AGE,
              path: "/",
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
            });
          });

          if (headers) {
            Object.entries(headers).forEach(([name, value]) => {
              response.headers.set(name, value);
            });
          }
        },
      },
    }
  );

  // Silently refresh token only when necessary
  try {
    await supabase.auth.getClaims();
  } catch {
    // Continue cleanly if session refresh fails
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
