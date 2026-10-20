import { AdminPage, AdminTable } from "@/components/admin/admin-page";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminReviewsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, body, is_approved, created_at, products(name), profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (reviews ?? []).map((r) => [
    (r.products as { name?: string } | null)?.name ?? "—",
    (r.profiles as { full_name?: string } | null)?.full_name ?? "—",
    `${r.rating}/5`,
    r.is_approved ? "Approved" : "Pending",
  ]);

  return (
    <AdminPage eyebrow="Community" title="Reviews" description="Approve customer reviews before they appear publicly.">
      <AdminTable columns={["Product", "Customer", "Rating", "Status"]} rows={rows} />
    </AdminPage>
  );
}
