import { AdminPage, AdminTable } from "@/components/admin/admin-page";
import Link from "next/link";
import { connection } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models";

export default async function AdminProductsPage() {
  await connection();
  await connectToDatabase();
  const products = await ProductModel.find().sort({ createdAt: -1 }).lean();
  return <AdminPage eyebrow="Catalog" title="Products" description="Manage the pieces customers can discover."><Link className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]" href="/admin/products/new">Create new</Link><AdminTable columns={["Product", "SKU", "Price", "Status"]} rows={products.map((product) => [product.name, product.sku, `Rs. ${product.priceInr.toLocaleString("en-IN")}`, product.isPublished ? "Published" : "Draft"])} /></AdminPage>;
}
