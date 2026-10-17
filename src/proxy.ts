import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_MAX_AGE } from "@/lib/supabase/browser";

export async function proxy(request: NextRequest) {
  // Allow the OAuth callback to complete without interference.
  // Supabase needs to set cookies on this response itself.
  if (request.nextUrl.pathname === "/auth/callback") {
    return NextResponse.next({ request });
  }

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
          // Update request cookies for downstream rendering.
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // Recreate the response only once.
          response = NextResponse.next({ request });

          // Re-stamp every session cookie with a fresh 28-day maxAge.
          // This creates a sliding window — as long as the user browses the
          // site at least once every 28 days their session never expires.
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

  // getClaims() silently refreshes the access token (JWT) if it has expired.
  // When it does, setAll above is called and the browser cookies are re-stamped
  // with a fresh 28-day maxAge — giving the user a sliding session window.
  await supabase.auth.getClaims();

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files, image optimizations, and favicon.
     * This ensures the 28-day session token is constantly verified and refreshed seamlessly.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
