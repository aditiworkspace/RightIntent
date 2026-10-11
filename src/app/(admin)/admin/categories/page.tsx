import { AdminPage, AdminTable } from "@/components/admin/admin-page";

export default function AdminCategoriesPage() { return <AdminPage eyebrow="Catalog" title="Categories" description="Organize the catalog into clear collections."><AdminTable columns={["Category", "Slug", "Status"]} rows={[["Objects", "objects", "Active"], ["Textiles", "textiles", "Active"], ["Tableware", "tableware", "Active"], ["Carry", "carry", "Active"]]} /></AdminPage>; }
