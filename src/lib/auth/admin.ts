import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  measureAuthentication,
  measureDatabaseQuery,
  type ApiPerformanceMetrics,
} from "@/lib/api-performance";

export async function getCurrentAdminAccess(metrics?: ApiPerformanceMetrics) {
  const supabase = await createSupabaseServerClient();
  const authenticate = () => supabase.auth.getClaims();
  const { data, error } = metrics
    ? await measureAuthentication(metrics, authenticate)
    : await authenticate();

  if (error) {
    if (error.name === "AuthSessionMissingError") return null;
    throw error;
  }

  const userId = data?.claims?.sub;
  if (typeof userId !== "string") return null;

  const findMembership = async () =>
    await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
  const { data: membership, error: membershipError } = metrics
    ? await measureDatabaseQuery(metrics, findMembership)
    : await findMembership();

  if (membershipError) throw membershipError;

  return { userId, isAdmin: membership !== null };
}
