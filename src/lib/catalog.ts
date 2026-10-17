import { createClient } from "@supabase/supabase-js";
import type { Product } from "@/lib/products";
import { cacheLife, cacheTag } from "next/cache";

export type CatalogProduct = Product & { slug: string; stock: number; sku: string };
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function readCatalogProducts(): Promise<CatalogProduct[]> {
  const { data, error } = await supabase.from("products").select("id,name,slug,description,price_inr,sale_price_inr,sku,product_images(storage_path),inventory(quantity),categories(name)").eq("is_published", true).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((record) => {
    const path = record.product_images?.[0]?.storage_path;
    const image = path ? supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl : "";
    return { id: record.id, name: record.name, category: record.categories?.[0]?.name ?? "Objects", price: record.sale_price_inr ?? record.price_inr, compareAt: record.sale_price_inr ? record.price_inr : undefined, description: record.description, image, accent: "#d8b6a1", badge: undefined, slug: record.slug, stock: record.inventory?.[0]?.quantity ?? 0, sku: record.sku };
  });
}

async function getCachedCatalogProducts() { "use cache"; cacheLife({ stale: 60, revalidate: 60, expire: 3600 }); cacheTag("catalog"); return readCatalogProducts(); }
export async function getCatalogProducts() { return getCachedCatalogProducts(); }
export async function getCatalogProduct(slug: string) { return (await getCatalogProducts()).find((product) => product.slug === slug); }
