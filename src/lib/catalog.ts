import { createClient } from "@supabase/supabase-js";
import { products as defaultProducts, type Product } from "@/lib/products";

export type CatalogImage = { id: string; src: string; alt: string };
export type CatalogProduct = Product & {
  slug: string;
  stock: number;
  sku: string;
  images: CatalogImage[];
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
);

export async function readCatalogProducts(): Promise<CatalogProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,description,price_inr,sale_price_inr,compare_at_price_inr,sku,subcategory,images,variants,stock,categories(name)"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase catalog read error:", error);
    return [];
  }

  const products: CatalogProduct[] = (data ?? []).map((record) => {
    const images = Array.isArray(record.images)
      ? record.images.flatMap((value, index) => {
          if (!value) return [];
          let path = "";
          let alt = record.name;
          let id = `${record.id}-image-${index}`;
          let sortOrder = index;

          if (typeof value === "string") {
            path = value;
          } else if (typeof value === "object" && !Array.isArray(value)) {
            const item = value as Record<string, unknown>;
            path = (item.storage_path || item.path || item.url || "") as string;
            if (typeof item.alt_text === "string") alt = item.alt_text;
            if (typeof item.id === "string") id = item.id;
            if (typeof item.sort_order === "number") sortOrder = item.sort_order;
          }

          if (!path) return [];
          const src =
            path.startsWith("http://") || path.startsWith("https://")
              ? path
              : supabase.storage.from("product-images").getPublicUrl(path).data
                  .publicUrl;

          return [{ id, src, alt, sortOrder }];
        })
      : [];

    images.sort((left, right) => left.sortOrder - right.sortOrder);
    let image = images[0]?.src ?? "";

    const match = defaultProducts.find(
      (p) =>
        p.name.toLowerCase() === record.name.toLowerCase() ||
        p.slug === record.slug ||
        p.id === record.id
    );

    if (!image) {
      image =
        match?.image ||
        "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85";
    }

    const price = record.sale_price_inr ?? record.price_inr;
    const compareAt = record.sale_price_inr
      ? (record.compare_at_price_inr ?? record.price_inr)
      : (record.compare_at_price_inr && record.compare_at_price_inr > record.price_inr
          ? record.compare_at_price_inr
          : undefined);

    const stock = typeof record.stock === "number" ? record.stock : 25;

    return {
      id: record.id,
      name: record.name,
      category:
        (Array.isArray(record.categories)
          ? record.categories[0]?.name
          : (record.categories as { name?: string } | null)?.name) ??
        record.subcategory ??
        "Objects",
      subcategory: record.subcategory || "Uncategorized",
      price,
      compareAt,
      description: record.description,
      image,
      accent: match?.accent || "#d8b6a1",
      badge: undefined,
      slug: record.slug,
      stock,
      sku: record.sku,
      images: images.map(({ id, src, alt }) => ({ id, src, alt })),
    };
  });

  return products;
}

export function invalidateCatalogCache() {
  // Direct live fetch from Supabase ensures zero cache lag
}

export async function getCatalogProducts() {
  return readCatalogProducts();
}

export async function getCatalogProduct(slug: string) {
  const all = await getCatalogProducts();
  return all.find((product) => product.slug === slug);
}
