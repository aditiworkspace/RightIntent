import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { connectToDatabase } from "@/lib/mongodb";
import { OrderModel, ProfileModel } from "@/lib/models";
import {
  measureAuthentication,
  measureDatabaseConnection,
  measureDatabaseQuery,
  withApiPerformance,
} from "@/lib/api-performance";

export const GET = withApiPerformance("/api/orders/:id", async (_request, metrics, context: RouteContext<"/api/orders/[id]">) => {
  const { id } = await context.params;
  if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await measureAuthentication(metrics, () => supabase.auth.getUser());
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  await measureDatabaseConnection(metrics, connectToDatabase);
  const [profile, order] = await Promise.all([
    measureDatabaseQuery(metrics, () => ProfileModel.findOne({ authUserId: user.id }).select("_id").lean()),
    measureDatabaseQuery(metrics, () => OrderModel.findById(id).select("userId status paymentStatus totalInr").lean()),
  ]);
  if (!profile || !order || String(order.userId) !== String(profile._id)) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order: { id: String(order._id), status: order.status, paymentStatus: order.paymentStatus, totalInr: order.totalInr } });
});
