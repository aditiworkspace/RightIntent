import { AdminPage, AdminTable } from "@/components/admin/admin-page";

export default function AdminCouponsPage() { return <AdminPage eyebrow="Commerce" title="Coupons" description="Create controlled discounts with expiry and usage limits."><AdminTable columns={["Code", "Type", "Value", "Status"]} rows={[]} /></AdminPage>; }
