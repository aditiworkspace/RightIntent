import { connectToDatabase } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models";
import { products as sampleProducts, type Product } from "@/lib/products";
import { cacheLife, cacheTag } from "next/cache";

export type CatalogProduct = Product & { slug: string; stock: number; sku: string };

function toCatalogProduct(product: Record<string, unknown>, fallback?: Product): CatalogProduct {
  return {
    id: String(product._id ?? product.id),
    name: String(product.name ?? fallback?.name ?? "Product"),
    category: String(product.category ?? fallback?.category ?? "Objects"),
    price: Number(product.priceInr ?? product.price ?? fallback?.price ?? 0),
    compareAt: product.compareAtPriceInr ? Number(product.compareAtPriceInr) : undefined,
    description: String(product.description ?? fallback?.description ?? ""),
    image: String(fallback?.image || (product.images as Array<{ path?: string }> | undefined)?.[0]?.path || product.image || ""),
    accent: "#d8b6a1",
    badge: undefined,
    slug: String(product.slug ?? fallback?.name.toLowerCase().replaceAll(" ", "-") ?? "product"),
    stock: Number(product.stock ?? 0),
    sku: String(product.sku ?? ""),
  };
}

async function readCatalogProducts(): Promise<CatalogProduct[]> {
  await connectToDatabase();
  const records = await ProductModel.find({ isPublished: true })
    .select("name slug category description priceInr compareAtPriceInr images stock sku")
    .sort({ createdAt: -1 })
    .lean();
  if (records.length) {
    const sampleBySlug = new Map(sampleProducts.map((product) => [product.name.toLowerCase().replaceAll(" ", "-"), product]));
    const live = records.map((record) => {
      const raw = record as unknown as Record<string, unknown>;
      return toCatalogProduct(raw, sampleBySlug.get(String(raw.slug)));
    });
    const liveSlugs = new Set(live.map((product) => product.slug));
    const missingSamples = sampleProducts
      .map((product) => ({ ...product, slug: product.name.toLowerCase().replaceAll(" ", "-"), stock: 25, sku: `AD-${product.id}` }))
      .filter((product) => !liveSlugs.has(product.slug));
    return [...live, ...missingSamples];
  }
  return sampleProducts.map((product) => ({ ...product, slug: product.name.toLowerCase().replaceAll(" ", "-"), stock: 0, sku: `AD-${product.id}` }));
}

async function getCachedCatalogProducts() {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  cacheTag("catalog");
  return readCatalogProducts();
}

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  try {
    return await getCachedCatalogProducts();
  } catch (error) {
    console.error("Catalog database read failed", error);
    return sampleProducts.map((product) => ({ ...product, slug: product.name.toLowerCase().replaceAll(" ", "-"), stock: 0, sku: `AD-${product.id}` }));
  }
}

export async function getCatalogProduct(slug: string) {
  return (await getCatalogProducts()).find((product) => product.slug === slug);
}
