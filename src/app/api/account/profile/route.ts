import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ProfileModel } from "@/lib/models";
import {
  measureAuthentication,
  measureDatabaseConnection,
  measureDatabaseQuery,
  withApiPerformance,
} from "@/lib/api-performance";

const profileSchema = z.object({ fullName: z.string().trim().min(2).max(100) });

export const PATCH = withApiPerformance("/api/account/profile", async (request, metrics) => {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await measureAuthentication(metrics, () => supabase.auth.getUser());
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Name is invalid." }, { status: 400 });
  await measureDatabaseConnection(metrics, connectToDatabase);
  const profile = await measureDatabaseQuery(metrics, () => ProfileModel.findOneAndUpdate({ authUserId: user.id }, { $set: parsed.data }, { returnDocument: "after", upsert: true }).lean());
  return NextResponse.json({ profile });
});
