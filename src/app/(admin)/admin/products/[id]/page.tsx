import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin/admin-page";
import { ProductForm } from "@/components/admin/product-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type JsonObject = Record<string, unknown>;

function asObject(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : {};
}

function readImages(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((image) => {
    const item = asObject(image);
    if (
      typeof item.id !== "string" ||
      typeof item.storage_path !== "string" ||
      typeof item.alt_text !== "string" ||
      typeof item.sort_order !== "number"
    ) {
      return [];
    }
    return [
      {
        id: item.id,
        storage_path: item.storage_path,
        alt_text: item.alt_text,
        sort_order: item.sort_order,
      },
    ];
  });
}

function readVariants(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((variant) => {
    const item = asObject(variant);
    if (
      typeof item.id !== "string" ||
      typeof item.name !== "string" ||
      typeof item.sku !== "string"
    ) {
      return [];
    }
    const options = asObject(item.options);
    return [
      {
        id: item.id,
        name: item.name,
        sku: item.sku,
        options: Object.fromEntries(
          Object.entries(options).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        ),
        price_inr: typeof item.price_inr === "number" ? item.price_inr : null,
        stock: typeof item.stock === "number" ? item.stock : 0,
        low_stock_threshold:
          typeof item.low_stock_threshold === "number"
            ? item.low_stock_threshold
            : 5,
      },
    ];
  });
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("id", id)
    .single();
  if (error || !data) notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("id,name")
    .eq("is_active", true)
    .order("name");

  return (
    <AdminPage
      eyebrow="Catalog / Edit"
      title={data.name}
      description="Edit product details, stock, images, and variants in one product record."
    >
      <ProductForm
        categories={categories ?? []}
        images={readImages(data.images)}
        variants={readVariants(data.variants)}
        initial={{
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          categoryId: data.category_id ?? "",
          subcategory: data.subcategory ?? "Uncategorized",
          priceInr: String(data.price_inr),
          compareAtPriceInr:
            data.compare_at_price_inr === null
              ? ""
              : String(data.compare_at_price_inr),
          salePriceInr:
            data.sale_price_inr === null ? "" : String(data.sale_price_inr),
          sku: data.sku,
          stock: String(data.stock),
          lowStockThreshold: String(data.low_stock_threshold),
          specificationsText: JSON.stringify(data.specifications ?? {}, null, 2),
          seoTitle: data.seo_title ?? "",
          seoDescription: data.seo_description ?? "",
          isPublished: data.is_published,
        }}
      />
    </AdminPage>
  );
}
