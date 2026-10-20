import { AdminPage } from "@/components/admin/admin-page";
import { getAdminInventory } from "@/lib/supabase/admin-data";
import Link from "next/link";
import { InventoryStockInput } from "@/components/admin/inventory-stock-input";

export default async function AdminInventoryPage() {
  const inventory = await getAdminInventory();

  return (
    <AdminPage
      eyebrow="Operations"
      title="Inventory"
      description="Track and update live stock levels by SKU."
    >
      <div className="admin-inventory-table">
        <div className="admin-inventory-head">
          <span>Product / variant</span>
          <span>SKU</span>
          <span>Stock</span>
          <span>Threshold</span>
          <span>Status</span>
          <span />
        </div>
        {inventory.length ? (
          inventory.map((item) => {
            const product = Array.isArray(item.products)
              ? item.products[0]
              : item.products;
            const isOut = item.quantity < 1;
            const isLow = !isOut && item.quantity <= item.low_stock_threshold;
            return (
              <div className="admin-inventory-row" key={item.id}>
                <strong>
                  {product?.name ?? "Unnamed product"}
                  {item.variant_name ? ` — ${item.variant_name}` : ""}
                </strong>
                <span>{item.variant_sku ?? product?.sku ?? "—"}</span>
                <InventoryStockInput
                  productId={item.product_id}
                  variantSku={item.variant_sku ?? undefined}
                  current={item.quantity}
                />
                <span>{item.low_stock_threshold}</span>
                <span
                  className={`status-pill ${
                    isOut ? "status-out" : isLow ? "status-low" : "status-live"
                  }`}
                >
                  <i />
                  {isOut ? "Out of stock" : isLow ? "Low stock" : "Healthy"}
                </span>
                {product && (
                  <Link
                    className="text-button"
                    href={`/admin/products/${product.id}`}
                  >
                    Edit
                  </Link>
                )}
              </div>
            );
          })
        ) : (
          <div className="admin-empty">No products yet.</div>
        )}
      </div>
    </AdminPage>
  );
}
