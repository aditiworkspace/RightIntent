"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["pending","confirmed","processing","shipped","delivered","cancelled","refunded"] as const;

export function OrderStatusSelect({ orderId, current }: { orderId: string; current: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const save = async (newStatus: string) => {
    setSaving(true);
    setMessage("");
    setStatus(newStatus);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setMessage("Status updated.");
      router.refresh();
    } else {
      setMessage("Failed to update status.");
    }
    setSaving(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <select
        value={status}
        onChange={(e) => save(e.target.value)}
        disabled={saving}
        style={{ minHeight: 44, padding: "0 12px", border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", font: "13px var(--sans)" }}
      >
        {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
      </select>
      {message && <p style={{ fontSize: 12, color: "var(--muted)" }}>{message}</p>}
    </div>
  );
}
