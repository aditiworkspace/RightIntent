import { AdminPage, AdminTable } from "@/components/admin/admin-page";
import { getAdminOrders } from "@/lib/supabase/admin-data";
export default async function AdminOrdersPage() { const orders = await getAdminOrders(); return <AdminPage eyebrow="Commerce" title="Orders" description="Review, process, and update customer orders."><AdminTable columns={["Order","Customer","Total","Payment","Status"]} rows={orders.map((o) => [`#${o.id.slice(0,8).toUpperCase()}`, o.email, `Rs. ${o.total_inr.toLocaleString("en-IN")}`, o.payment_status, o.status])} /></AdminPage>; }
