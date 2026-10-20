import { AdminPage } from "@/components/admin/admin-page";
import { ProductForm } from "@/components/admin/product-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NewProductPage() {
  const supabase = await createSupabaseServerClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id,name")
    .eq("is_active", true)
    .order("name");
  return (
    <AdminPage
      eyebrow="Catalog / New"
      title="Add a product"
      description="Create a catalog entry with server-side validation."
    >
      <ProductForm categories={categories ?? []} />
    </AdminPage>
  );
}
