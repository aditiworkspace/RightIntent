import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { measureExternalApi, withApiPerformance } from "@/lib/api-performance";

export const GET = withApiPerformance("/auth/callback", async (request, metrics) => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedNext = requestUrl.searchParams.get("next") || "/account";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/account";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await measureExternalApi(metrics, () => supabase.auth.exchangeCodeForSession(code));
    if (error) return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin));
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
});
