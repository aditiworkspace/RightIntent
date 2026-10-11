import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { measureAuthentication, withApiPerformance } from "@/lib/api-performance";

export const POST = withApiPerformance("/api/account/phone/dev-verify", async (request, metrics) => {
  if (process.env.NODE_ENV === "production" || process.env.DEV_BYPASS_PHONE_OTP !== "true") {
    return NextResponse.json({ error: "Development phone verification is disabled." }, { status: 404 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await measureAuthentication(metrics, () => supabase.auth.getUser());
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const body = await request.json() as { phone?: string; otp?: string };
  const phone = body.phone?.replace(/\D/g, "");
  if (!phone || !/^[6-9]\d{9}$/.test(phone) || body.otp !== "123456") {
    return NextResponse.json({ error: "Invalid development verification details." }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set("aditi-dev-phone", phone, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ ok: true, phone });
});
