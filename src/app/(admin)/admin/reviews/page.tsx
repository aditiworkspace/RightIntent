import { AdminPage, AdminTable } from "@/components/admin/admin-page";

export default function AdminReviewsPage() { return <AdminPage eyebrow="Community" title="Reviews" description="Approve customer reviews before they appear publicly."><AdminTable columns={["Product", "Customer", "Rating", "Status"]} rows={[]} /></AdminPage>; }
