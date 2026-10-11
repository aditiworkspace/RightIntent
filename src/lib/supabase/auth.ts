import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  measureAuthentication,
  type ApiPerformanceMetrics,
} from "@/lib/api-performance";

export async function getAuthenticatedUserId(
  metrics: ApiPerformanceMetrics,
) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await measureAuthentication(metrics, () =>
    supabase.auth.getClaims(),
  );
  if (error || !data) return undefined;
  const { claims } = data;
  return typeof claims?.sub === "string" ? claims.sub : undefined;
}
