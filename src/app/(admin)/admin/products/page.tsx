import Link from "next/link";
import { AdminPage } from "@/components/admin/admin-page";
import { getAdminProducts } from "@/lib/supabase/admin-data";
import { AdminProductsTable } from "@/components/admin/admin-products-table";
export default async function AdminProductsPage() { const products = await getAdminProducts(); return <AdminPage eyebrow="Catalog" title="Products" description="Manage the pieces customers can discover."><Link className="admin-primary-button" href="/admin/products/new">+ Create product</Link><AdminProductsTable products={products as never[]} /></AdminPage>; }
