import { AdminPage, AdminTable } from "@/components/admin/admin-page";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminCustomersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: orderCounts } = await supabase
    .from("orders")
    .select("user_id, email");

  const countMap = new Map<string, { count: number; email: string }>();
  for (const o of orderCounts ?? []) {
    if (!o.user_id) continue;
    const existing = countMap.get(o.user_id);
    if (existing) { existing.count++; }
    else countMap.set(o.user_id, { count: 1, email: o.email });
  }

  const rows = (profiles ?? []).map((p) => {
    const orderInfo = countMap.get(p.id);
    return [
      p.full_name || "—",
      orderInfo?.email || "—",
      String(orderInfo?.count ?? 0),
      new Date(p.created_at).toLocaleDateString("en-IN"),
    ];
  });

  return (
    <AdminPage eyebrow="Relationships" title="Customers" description="Customer records and order history.">
      <AdminTable columns={["Customer", "Email", "Orders", "Joined"]} rows={rows} />
    </AdminPage>
  );
}
