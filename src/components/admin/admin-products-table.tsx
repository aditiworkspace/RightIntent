"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  sku: string;
  subcategory: string;
  price_inr: number;
  sale_price_inr: number | null;
  stock: number;
  is_published: boolean;
  categories?: { name?: string } | null;
};

export function AdminProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(products);
  const [message, setMessage] = useState("");
  const filtered = useMemo(
    () =>
      items.filter((product) =>
        `${product.name} ${product.sku} ${product.subcategory} ${
          product.categories?.name ?? ""
        }`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [items, query],
  );

  const remove = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    setMessage("");
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to delete product.");
      }
      setItems((current) => current.filter((product) => product.id !== id));
      if (data.warning) setMessage(data.warning);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to delete product.",
      );
    }
  };

  return (
    <section className="admin-products-card">
      <div className="admin-toolbar">
        <div className="admin-search">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Search products"
            placeholder="Search products or SKU"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <span className="admin-count">{filtered.length} products</span>
      </div>
      {message && (
        <p role="alert" className="admin-form-message">
          {message}
        </p>
      )}
      <div className="admin-table-scroll">
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category / subcategory</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                  <small>{product.sku}</small>
                </td>
                <td>
                  {product.categories?.name ?? "—"}
                  <small>{product.subcategory}</small>
                </td>
                <td>
                  Rs.{" "}
                  {(product.sale_price_inr ?? product.price_inr).toLocaleString(
                    "en-IN",
                  )}
                </td>
                <td>
                  <span className={product.stock === 0 ? "stock-empty" : ""}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-pill ${
                      product.is_published ? "status-live" : "status-draft"
                    }`}
                  >
                    <i />
                    {product.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="table-actions">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-button"
                  >
                    Edit
                  </Link>
                  <button
                    className="text-button text-danger"
                    onClick={() => remove(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <div className="admin-empty">No products match your search.</div>
        )}
      </div>
    </section>
  );
}
