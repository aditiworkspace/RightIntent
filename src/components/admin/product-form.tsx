"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type ImageRow = {
  id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
};

type VariantRow = {
  id: string;
  name: string;
  sku: string;
  options: Record<string, string>;
  price_inr: number | null;
  stock: number;
  low_stock_threshold: number;
};

type VariantFormValue = {
  id: string;
  name: string;
  sku: string;
  optionsText: string;
  priceInr: string;
  stock: string;
  lowStockThreshold: string;
};

type Values = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  categoryId?: string;
  subcategory: string;
  priceInr: string;
  compareAtPriceInr: string;
  salePriceInr: string;
  sku: string;
  stock: string;
  lowStockThreshold: string;
  specificationsText: string;
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
};

function parseSpecifications(text: string): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Specifications must be valid JSON.");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Specifications must be a JSON object.");
  }
  return parsed as Record<string, unknown>;
}

const empty: Values = {
  name: "",
  slug: "",
  description: "",
  categoryId: "",
  subcategory: "Uncategorized",
  priceInr: "",
  compareAtPriceInr: "",
  salePriceInr: "",
  sku: "",
  stock: "0",
  lowStockThreshold: "5",
  specificationsText: "{}",
  seoTitle: "",
  seoDescription: "",
  isPublished: true,
};

function toVariantFormValue(variant: VariantRow): VariantFormValue {
  return {
    id: variant.id,
    name: variant.name,
    sku: variant.sku,
    optionsText: Object.entries(variant.options ?? {})
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n"),
    priceInr: variant.price_inr === null ? "" : String(variant.price_inr),
    stock: String(variant.stock),
    lowStockThreshold: String(variant.low_stock_threshold),
  };
}

function parseOptions(text: string): Record<string, string> {
  const options: Record<string, string> = {};

  for (const line of text.split(/\r?\n/).filter((value) => value.trim())) {
    const separator = line.indexOf(":");
    if (separator < 1) {
      throw new Error('Enter variant options one per line as "Name: value".');
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (!key || !value || key in options) {
      throw new Error("Each variant option needs a unique name and a value.");
    }
    options[key] = value;
  }

  return options;
}

export function ProductForm({
  initial,
  images = [],
  variants: initialVariants = [],
  categories,
}: {
  initial?: Values;
  images?: ImageRow[];
  variants?: VariantRow[];
  categories?: { id: string; name: string }[];
}) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [form, setForm] = useState<Values>(initial ?? empty);
  const [files, setFiles] = useState<File[]>([]);
  const [currentImages, setCurrentImages] = useState(images);
  const [variants, setVariants] = useState(initialVariants.map(toVariantFormValue));
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (key: keyof Values, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));

  const updateVariant = (
    index: number,
    key: keyof VariantFormValue,
    value: string,
  ) =>
    setVariants((current) =>
      current.map((variant, itemIndex) =>
        itemIndex === index ? { ...variant, [key]: value } : variant,
      ),
    );

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const uploadedPaths: string[] = [];

    try {
      if (currentImages.length + files.length > 5) {
        throw new Error("A product can have up to 5 images.");
      }

      const allowedTypes = new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ]);
      if (
        files.some(
          (file) => !allowedTypes.has(file.type) || file.size > 5 * 1024 * 1024,
        )
      ) {
        throw new Error("Images must be JPG, PNG, WEBP or GIF under 5 MB.");
      }

      const specifications = parseSpecifications(form.specificationsText);
      const variantPayload = variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        sku: variant.sku,
        options: parseOptions(variant.optionsText),
        price_inr: variant.priceInr ? Number(variant.priceInr) : null,
        stock: Number(variant.stock),
        low_stock_threshold: Number(variant.lowStockThreshold),
      }));

      const uploadedImages: ImageRow[] = [];
      for (const file of files) {
        const path = `draft/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
        const upload = await supabase.storage
          .from("product-images")
          .upload(path, file, {
            cacheControl: "31536000",
            upsert: false,
            contentType: file.type,
          });
        if (upload.error) throw upload.error;
        uploadedPaths.push(path);
        uploadedImages.push({
          id: crypto.randomUUID(),
          storage_path: path,
          alt_text: form.name,
          sort_order: currentImages.length + uploadedImages.length,
        });
      }

      const imagePayload = [
        ...currentImages,
        ...uploadedImages,
      ].map((image, sortOrder) => ({
        id: image.id,
        storage_path: image.storage_path,
        alt_text: image.alt_text,
        sort_order: sortOrder,
      }));

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(form.id ? { id: form.id } : {}),
          name: form.name,
          slug: form.slug,
          description: form.description,
          category_id: form.categoryId || null,
          subcategory: form.subcategory,
          price_inr: Number(form.priceInr),
          compare_at_price_inr: form.compareAtPriceInr
            ? Number(form.compareAtPriceInr)
            : null,
          sale_price_inr: form.salePriceInr
            ? Number(form.salePriceInr)
            : null,
          sku: form.sku,
          stock: Number(form.stock),
          low_stock_threshold: Number(form.lowStockThreshold),
          specifications,
          is_published: form.isPublished,
          seo_title: form.seoTitle || null,
          seo_description: form.seoDescription || null,
          images: imagePayload,
          variants: variantPayload,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        const details = data.fields
          ? Object.entries(data.fields)
              .map(
                ([field, errors]) =>
                  `${field}: ${(errors as string[]).join(", ")}`,
              )
              .join("; ")
          : "";
        throw new Error(
          details || data.error || "Unable to save product details.",
        );
      }

      if (data.warning) {
        setForm((current) => ({ ...current, id: data.product.id }));
        setCurrentImages(data.images);
        setVariants(data.variants.map(toVariantFormValue));
        setFiles([]);
        setMessage(data.warning);
        router.refresh();
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      let errorMessage =
        error instanceof Error ? error.message : "Unable to save product.";
      if (uploadedPaths.length > 0) {
        const cleanup = await supabase.storage
          .from("product-images")
          .remove(uploadedPaths);
        if (cleanup.error) {
          errorMessage += ` Uploaded image cleanup also failed: ${cleanup.error.message}`;
        }
      }
      setMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const removeImage = (image: ImageRow) =>
    setCurrentImages((list) => list.filter((item) => item.id !== image.id));

  return (
    <form className="admin-form" onSubmit={save}>
      <label>
        Product name
        <input
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          required
        />
      </label>
      <label>
        Slug
        <input
          value={form.slug}
          onChange={(event) => update("slug", event.target.value)}
          required
        />
      </label>
      <label>
        Description
        <textarea
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          required
        />
      </label>
      <label>
        Category
        <select
          value={form.categoryId ?? ""}
          onChange={(event) => update("categoryId", event.target.value)}
        >
          <option value="">— No category —</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Subcategory
        <input
          value={form.subcategory}
          onChange={(event) => update("subcategory", event.target.value)}
          maxLength={100}
          required
        />
      </label>

      <div className="admin-form-grid">
        <label>
          Price in INR
          <input
            type="number"
            min="0"
            value={form.priceInr}
            onChange={(event) => update("priceInr", event.target.value)}
            required
          />
        </label>
        <label>
          Compare-at price
          <input
            type="number"
            min={form.priceInr || "0"}
            value={form.compareAtPriceInr}
            onChange={(event) =>
              update("compareAtPriceInr", event.target.value)
            }
          />
        </label>
        <label>
          Sale price
          <input
            type="number"
            min="0"
            value={form.salePriceInr}
            onChange={(event) => update("salePriceInr", event.target.value)}
          />
        </label>
        <label>
          SKU
          <input
            value={form.sku}
            onChange={(event) => update("sku", event.target.value)}
            required
          />
        </label>
        <label>
          Stock (no variants)
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={(event) => update("stock", event.target.value)}
            disabled={variants.length > 0}
            required
          />
        </label>
        <label>
          Low-stock threshold
          <input
            type="number"
            min="0"
            value={form.lowStockThreshold}
            onChange={(event) =>
              update("lowStockThreshold", event.target.value)
            }
            disabled={variants.length > 0}
            required
          />
        </label>
      </div>

      <label>
        Specifications (JSON object)
        <textarea
          value={form.specificationsText}
          onChange={(event) =>
            update("specificationsText", event.target.value)
          }
          rows={6}
        />
      </label>
      <label>
        SEO title
        <input
          value={form.seoTitle}
          maxLength={160}
          onChange={(event) => update("seoTitle", event.target.value)}
        />
      </label>
      <label>
        SEO description
        <textarea
          value={form.seoDescription}
          maxLength={320}
          onChange={(event) => update("seoDescription", event.target.value)}
        />
      </label>

      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={form.isPublished}
          onChange={(event) => update("isPublished", event.target.checked)}
        />
        <span>
          <strong>Publish on storefront</strong>
          <small>Make this product visible to customers.</small>
        </span>
      </label>

      <div className="admin-upload">
        <label>
          Product images
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={(event) =>
              setFiles(Array.from(event.target.files ?? []))
            }
          />
        </label>
        <p>Select up to 5 images total, max 5 MB each. They are saved with the product.</p>
      </div>
      {currentImages.length > 0 && (
        <div className="admin-image-list">
          {currentImages.map((image) => (
            <div key={image.id}>
              <span>{image.storage_path.split("/").pop()}</span>
              <button
                type="button"
                onClick={() => removeImage(image)}
                className="text-button text-danger"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <section className="admin-upload">
        <h2>Variants and variant stock</h2>
        <p>Each variant has its own SKU, optional price, options, and stock threshold.</p>
        <p>The storefront checkout does not yet support variant selection or variant price overrides.</p>
        {variants.map((variant, index) => (
          <div className="admin-form-grid" key={variant.id ?? `new-${index}`}>
            <label>
              Variant name
              <input
                value={variant.name}
                onChange={(event) =>
                  updateVariant(index, "name", event.target.value)
                }
                required
              />
            </label>
            <label>
              Variant SKU
              <input
                value={variant.sku}
                onChange={(event) =>
                  updateVariant(index, "sku", event.target.value)
                }
                required
              />
            </label>
            <label>
              Price override
              <input
                type="number"
                min="0"
                value={variant.priceInr}
                onChange={(event) =>
                  updateVariant(index, "priceInr", event.target.value)
                }
              />
            </label>
            <label>
              Variant stock
              <input
                type="number"
                min="0"
                value={variant.stock}
                onChange={(event) =>
                  updateVariant(index, "stock", event.target.value)
                }
                required
              />
            </label>
            <label>
              Low-stock threshold
              <input
                type="number"
                min="0"
                value={variant.lowStockThreshold}
                onChange={(event) =>
                  updateVariant(index, "lowStockThreshold", event.target.value)
                }
                required
              />
            </label>
            <label>
              Options (one &quot;Name: value&quot; per line)
              <textarea
                value={variant.optionsText}
                onChange={(event) =>
                  updateVariant(index, "optionsText", event.target.value)
                }
              />
            </label>
            <button
              type="button"
              className="text-button text-danger"
              onClick={() =>
                setVariants((current) =>
                  current.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            >
              Remove variant
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-secondary-button"
          onClick={() =>
            setVariants((current) => [
              ...current,
              {
                id: crypto.randomUUID(),
                name: "",
                sku: "",
                optionsText: "",
                priceInr: "",
                stock: "0",
                lowStockThreshold: "5",
              },
            ])
          }
        >
          + Add variant
        </button>
      </section>

      {message && <p className="admin-form-message">{message}</p>}
      <div className="admin-form-actions">
        <button className="admin-primary-button" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save product"}
        </button>
        <button
          type="button"
          className="admin-secondary-button"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
