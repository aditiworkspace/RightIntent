import { AdminPage, AdminTable } from "@/components/admin/admin-page";

export default function AdminCustomersPage() { return <AdminPage eyebrow="Relationships" title="Customers" description="Customer records are protected by Supabase RLS."><AdminTable columns={["Customer", "Email", "Orders", "Joined"]} rows={[]} /></AdminPage>; }
