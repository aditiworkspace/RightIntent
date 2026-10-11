import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { addressSchema } from "@/lib/validation";
import { getAuthenticatedUserId } from "@/lib/supabase/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { AddressModel } from "@/lib/models";
import {
  measureDatabaseConnection,
  measureDatabaseQuery,
  withApiPerformance,
} from "@/lib/api-performance";

export const PATCH = withApiPerformance("/api/account/addresses/:id", async (request, metrics, { params }: { params: Promise<{ id: string }> }) => {
  const authUserId = await getAuthenticatedUserId(metrics);
  const { id } = await params;
  if (!authUserId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Address not found." }, { status: 404 });
  const parsed = addressSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Address details are invalid." }, { status: 400 });
  await measureDatabaseConnection(metrics, connectToDatabase);
  const address = await measureDatabaseQuery(metrics, () => AddressModel.findOneAndUpdate({ _id: id, authUserId }, { $set: parsed.data }, { returnDocument: "after" }).lean());
  return address ? NextResponse.json({ address }) : NextResponse.json({ error: "Address not found." }, { status: 404 });
});

export const DELETE = withApiPerformance("/api/account/addresses/:id", async (_request, metrics, { params }: { params: Promise<{ id: string }> }) => {
  const authUserId = await getAuthenticatedUserId(metrics);
  const { id } = await params;
  if (!authUserId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  await measureDatabaseConnection(metrics, connectToDatabase);
  await measureDatabaseQuery(metrics, () => AddressModel.deleteOne({ _id: id, authUserId }));
  return NextResponse.json({ ok: true });
});
