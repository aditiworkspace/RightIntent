import { AdminPage, AdminTable } from "@/components/admin/admin-page";
import { getAdminCategories } from "@/lib/supabase/admin-data";
export default async function AdminCategoriesPage() { const categories = await getAdminCategories(); return <AdminPage eyebrow="Catalog" title="Categories" description="Organize the catalog into clear collections."><AdminTable columns={["Category","Slug","Status","Created"]} rows={categories.map((c) => [c.name,c.slug,c.is_active ? "Active" : "Hidden",new Date(c.created_at).toLocaleDateString("en-IN")])} /></AdminPage>; }
