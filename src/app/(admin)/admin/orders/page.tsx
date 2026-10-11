import { AdminPage, AdminTable } from "@/components/admin/admin-page";
import { connection } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { OrderModel } from "@/lib/models";

export default async function AdminOrdersPage() { await connection(); await connectToDatabase(); const orders = await OrderModel.find().sort({ createdAt: -1 }).lean(); return <AdminPage eyebrow="Commerce" title="Orders" description="Review, process, and update customer orders."><AdminTable columns={["Order", "Customer", "Total", "Status"]} rows={orders.map((order) => [`#${String(order._id).slice(-8).toUpperCase()}`, order.email, `Rs. ${order.totalInr.toLocaleString("en-IN")}`, order.status])} /></AdminPage>; }
