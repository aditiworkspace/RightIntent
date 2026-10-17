"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type ImageRow = { id: string; storage_path: string; alt_text: string; sort_order: number };
type Values = { id?: string; name: string; slug: string; description: string; priceInr: string; salePriceInr: string; sku: string; stock: string; isPublished: boolean };
const empty: Values = { name: "", slug: "", description: "", priceInr: "", salePriceInr: "", sku: "", stock: "0", isPublished: true };

export function ProductForm({ initial, images = [] }: { initial?: Values; images?: ImageRow[] }) {
  const router = useRouter(); const supabase = createSupabaseBrowserClient();
  const [form, setForm] = useState<Values>(initial ?? empty); const [files, setFiles] = useState<File[]>([]); const [currentImages, setCurrentImages] = useState(images); const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false);
  const update = (key: keyof Values, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const save = async (event: React.FormEvent) => { event.preventDefault(); setSaving(true); setMessage(""); try {
    const response = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, priceInr: Number(form.priceInr), salePriceInr: form.salePriceInr ? Number(form.salePriceInr) : null, stock: Number(form.stock) }) });
    const data = await response.json(); if (!response.ok) { const details = data.fields ? Object.entries(data.fields).map(([field, errors]) => `${field}: ${(errors as string[]).join(", ")}`).join("; ") : ""; throw new Error(details || data.error || "Unable to save product."); }
    const productId = data.product.id as string; if (files.length > 5) throw new Error("You can upload up to 5 images at a time.");
    for (const [index, file] of files.entries()) { if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) throw new Error("Images must be JPG, PNG, WEBP or GIF under 5 MB."); const path = `${productId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`; const upload = await supabase.storage.from("product-images").upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type }); if (upload.error) throw upload.error; const row = await supabase.from("product_images").insert({ product_id: productId, storage_path: path, alt_text: form.name, sort_order: currentImages.length + index }).select().single(); if (row.error) throw row.error; }
    router.push("/admin/products"); router.refresh();
  } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save product."); } finally { setSaving(false); } };
  const removeImage = async (image: ImageRow) => { const result = await supabase.from("product_images").delete().eq("id", image.id); if (result.error) { setMessage(result.error.message); return; } await supabase.storage.from("product-images").remove([image.storage_path]); setCurrentImages((list) => list.filter((item) => item.id !== image.id)); };
  return <form className="admin-form" onSubmit={save}>
    <label>Product name<input value={form.name} onChange={(e) => update("name", e.target.value)} required /></label><label>Slug<input value={form.slug} onChange={(e) => update("slug", e.target.value)} required /></label><label>Description<textarea value={form.description} onChange={(e) => update("description", e.target.value)} required /></label>
    <div className="admin-form-grid"><label>Price in INR<input type="number" min="0" value={form.priceInr} onChange={(e) => update("priceInr", e.target.value)} required /></label><label>Sale price<input type="number" min="0" value={form.salePriceInr} onChange={(e) => update("salePriceInr", e.target.value)} /></label><label>SKU<input value={form.sku} onChange={(e) => update("sku", e.target.value)} required /></label><label>Stock<input type="number" min="0" value={form.stock} onChange={(e) => update("stock", e.target.value)} required /></label></div>
    <label className="admin-checkbox"><input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} /><span><strong>Publish on storefront</strong><small>Make this product visible to customers.</small></span></label>
    <div className="admin-upload"><label>Product images<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} /></label><p>Select up to 5 images, max 5 MB each. Images upload securely after saving.</p></div>
    {currentImages.length > 0 && <div className="admin-image-list">{currentImages.map((image) => <div key={image.id}><span>{image.storage_path.split("/").pop()}</span><button type="button" onClick={() => removeImage(image)} className="text-button text-danger">Delete image</button></div>)}</div>}
    {message && <p className="admin-form-message">{message}</p>}<div className="admin-form-actions"><button className="admin-primary-button" type="submit" disabled={saving}>{saving ? "Saving…" : "Save product"}</button><button type="button" className="admin-secondary-button" onClick={() => router.push("/admin/products")}>Cancel</button></div>
  </form>;
}
