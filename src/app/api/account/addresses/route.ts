import { NextResponse } from "next/server";
import { addressSchema } from "@/lib/validation";
import { getAuthenticatedUserId } from "@/lib/supabase/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { AddressModel } from "@/lib/models";
import {
  measureDatabaseConnection,
  measureDatabaseQuery,
  withApiPerformance,
} from "@/lib/api-performance";

export const GET = withApiPerformance("/api/account/addresses", async (_request, metrics) => {
  const authUserId = await getAuthenticatedUserId(metrics);
  if (!authUserId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  await measureDatabaseConnection(metrics, connectToDatabase);
  const addresses = await measureDatabaseQuery(metrics, () => AddressModel.find({ authUserId }).select("_id label recipientName phone houseNumber streetArea city state pincode landmark isDefault createdAt updatedAt").sort({ isDefault: -1, createdAt: -1 }).lean());
  return NextResponse.json({ addresses });
});

export const POST = withApiPerformance("/api/account/addresses", async (request, metrics) => {
  const authUserId = await getAuthenticatedUserId(metrics);
  if (!authUserId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const parsed = addressSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Address details are invalid." }, { status: 400 });
  await measureDatabaseConnection(metrics, connectToDatabase);
  const existing = await measureDatabaseQuery(metrics, () => AddressModel.exists({ authUserId }));
  const address = await measureDatabaseQuery(metrics, () => AddressModel.create({ authUserId, ...parsed.data, isDefault: !existing }));
  return NextResponse.json({ address }, { status: 201 });
});
