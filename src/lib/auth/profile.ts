import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentProfile() {
  const supabase = await createSupabaseServerClient();
  const [{ data, error }, { connectToDatabase }, { ProfileModel }] =
    await Promise.all([
      supabase.auth.getClaims(),
      import("@/lib/mongodb"),
      import("@/lib/models/profile"),
    ]);
  const claims = data?.claims;
  if (error || typeof claims?.sub !== "string") {
    return { user: null, profile: null };
  }

  const user = {
    id: claims.sub,
    email: claims.email,
    phone: claims.phone,
    user_metadata: claims.user_metadata ?? {},
  };
  await connectToDatabase();

  let profile = await ProfileModel.findOne({ authUserId: user.id })
    .select("_id fullName role")
    .lean();

  if (!profile) {
    profile = await ProfileModel.findOneAndUpdate(
      { authUserId: user.id },
      {
        $setOnInsert: {
          authUserId: user.id,
          email: user.email ?? "",
          phone: user.phone,
          fullName: user.user_metadata.full_name,
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    )
      .select("_id fullName role")
      .lean();
  }

  return { user, profile };
}
