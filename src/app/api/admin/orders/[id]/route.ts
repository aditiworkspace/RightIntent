import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentAdminAccess } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { OrderModel } from "@/lib/models";
import { Types } from "mongoose";

async function guard() {
  const access = await getCurrentAdminAccess();
  return access?.isAdmin ? null : NextResponse.json({ error: "Admin access required." }, { status: access ? 403 : 401 });
}

const schema = z.object({ status: z.enum(["pending","confirmed","processing","shipped","delivered","cancelled","refunded"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  
  // Try Supabase update if UUID
  if (id.length > 24) {
    const { error } = await supabase.from("orders").update({ status: parsed.data.status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Also update MongoDB if valid ObjectId or matching order
  try {
    await connectToDatabase();
    if (Types.ObjectId.isValid(id)) {
      await OrderModel.updateOne({ _id: id }, { $set: { status: parsed.data.status } });
    }
  } catch (mErr) {
    console.error("Failed to update status in Mongo:", mErr);
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return NextResponse.json({ ok: true });
}
