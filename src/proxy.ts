
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )!,
    {
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

          // Preserve every cookie, including refresh-token updates.
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
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


  await supabase.auth.getClaims();

  return response;
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
