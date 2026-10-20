import { AdminPage, AdminTable } from "@/components/admin/admin-page";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminCouponsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("code, discount_type, discount_value, used_count, usage_limit, is_active, expires_at")
    .order("created_at", { ascending: false });

  const rows = (coupons ?? []).map((c) => [
    c.code,
    c.discount_type,
    c.discount_type === "percentage" ? `${c.discount_value}%` : `Rs. ${c.discount_value}`,
    c.is_active ? `Active (${c.used_count}/${c.usage_limit ?? "∞"} used)` : "Inactive",
  ]);

  return (
    <AdminPage eyebrow="Commerce" title="Coupons" description="Create controlled discounts with expiry and usage limits.">
      <AdminTable columns={["Code", "Type", "Value", "Status"]} rows={rows} />
    </AdminPage>
  );
}
