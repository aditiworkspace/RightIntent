import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { AUTH_COOKIE_MAX_AGE } from "@/lib/supabase/browser";
import { measureExternalApi, withApiPerformance } from "@/lib/api-performance";

/**
 * GET /auth/callback
 *
 * Handles all Supabase OAuth / PKCE code-exchange callbacks:
 *  - Google OAuth sign-in
 *  - Email magic-link (when emailRedirectTo points here)
 *
 * Supabase forwards these query params:
 *  - code              — PKCE authorization code to exchange for a session
 *  - error             — OAuth error code if provider rejected the request
 *  - error_description — Human-readable error detail from the provider
 *  - next              — Post-login destination path (we set this in redirectTo)
 */
export const GET = withApiPerformance("/auth/callback", async (request, metrics) => {
  const requestUrl = new URL(request.url);
  const { searchParams, origin } = requestUrl;

  const code = searchParams.get("code");
  const providerError = searchParams.get("error");
  const providerErrorDescription = searchParams.get("error_description");

  // Sanitise `next` — only allow same-origin relative paths.
  const rawNext = searchParams.get("next") ?? "/account";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/account";

  // ── Provider-level error (e.g., user cancelled Google consent) ──────────
  if (providerError) {
    const params = new URLSearchParams({
      error: providerError,
      error_description: providerErrorDescription ?? "Authentication failed.",
    });
    return NextResponse.redirect(`${origin}/login?${params.toString()}`);
  }

  // ── No code present ──────────────────────────────────────────────────────
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code&error_description=No+authorization+code+was+returned.`);
  }

  // ── Exchange PKCE code for session and write 28-day cookies ─────────────
  // Build the redirect response first so cookies can be written onto it.
  const response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookieOptions: {
        maxAge: AUTH_COOKIE_MAX_AGE,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
      cookies: {
        getAll() {
          return request.headers
            .get("cookie")
            ?.split(";")
            .map((c) => {
              const [name, ...rest] = c.trim().split("=");
              return { name: name.trim(), value: rest.join("=").trim() };
            }) ?? [];
        },
        setAll(cookiesToSet) {
          // Write every session cookie onto the redirect response with the
          // full 28-day maxAge so the user stays logged in for up to 28 days.
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              maxAge: AUTH_COOKIE_MAX_AGE,
              path: "/",
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
            });
          });
        },
      },
    }
  );

  const { error: exchangeError } = await measureExternalApi(metrics, () =>
    supabase.auth.exchangeCodeForSession(code)
  );

  if (exchangeError) {
    const params = new URLSearchParams({
      error: "session_exchange_failed",
      error_description: exchangeError.message,
    });
    return NextResponse.redirect(`${origin}/login?${params.toString()}`);
  }

  // Session cookies are now set on `response` — redirect the user.
  return response;
});
