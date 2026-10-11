import { AdminPage } from "@/components/admin/admin-page";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() { return <AdminPage eyebrow="Catalog / New" title="Add a product" description="Create a catalog entry with server-side validation."><ProductForm /></AdminPage>; }
