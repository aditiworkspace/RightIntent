"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function InventoryStockInput({ productId, variantSku, current }: { productId: string; variantSku?: string; current: number }) {
  const router = useRouter();
  const [qty, setQty] = useState(current);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantSku, quantity: qty }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update stock.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update stock.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
      <input
        type="number"
        min="0"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        style={{ width: 70, padding: "4px 8px", border: "1px solid var(--line)", background: "transparent", font: "13px var(--mono)", color: "var(--ink)" }}
      />
      <button
        onClick={save}
        disabled={saving || qty === current}
        style={{ padding: "4px 10px", fontSize: 11, fontFamily: "var(--mono)", border: "1px solid var(--line)", background: saving ? "var(--paper)" : "var(--ink)", color: saving ? "var(--muted)" : "var(--paper)", cursor: "pointer" }}
      >
        {saving ? "…" : "Save"}
      </button>
      {message && <small role="alert" className="text-danger">{message}</small>}
    </span>
  );
}
