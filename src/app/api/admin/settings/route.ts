import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentAdminAccess } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";
const schema = z.object({ announcement: z.record(z.string(), z.unknown()), footer: z.record(z.string(), z.unknown()) });
export async function POST(request: Request) { const access = await getCurrentAdminAccess(); if (!access?.isAdmin) return NextResponse.json({ error: "Admin access required." }, { status: access ? 403 : 401 }); const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid settings." }, { status: 400 }); const supabase = await createSupabaseServerClient(); for (const [key, value] of Object.entries(parsed.data)) { const { error } = await supabase.from("site_settings").upsert({ key, value, updated_by: access.userId, updated_at: new Date().toISOString() }); if (error) return NextResponse.json({ error: error.message }, { status: 400 }); } revalidatePath("/"); return NextResponse.json({ ok: true }); }
