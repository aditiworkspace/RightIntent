import { AdminPage, AdminTable } from "@/components/admin/admin-page";

export default function AdminInventoryPage() { return <AdminPage eyebrow="Operations" title="Inventory" description="Track stock and low-stock thresholds by SKU."><AdminTable columns={["Product", "SKU", "Available", "Threshold"]} rows={[["Sienna Stoneware Set", "AD-SIE-001", "25", "5"], ["Mitti Linen Throw", "AD-MIT-002", "25", "5"], ["Dhoop Brass Candle", "AD-DHO-003", "25", "5"], ["Neel Everyday Tote", "AD-NEE-004", "25", "5"]]} /></AdminPage>; }
