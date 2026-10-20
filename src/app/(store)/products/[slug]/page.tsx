import { notFound } from "next/navigation";
import { getCatalogProduct, getCatalogProducts } from "@/lib/catalog";
import { RouteNav } from "@/components/store/route-page";
import { ProductDetailClient } from "@/components/store/product-detail-client";
import type { Metadata } from "next";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) return { title: "Product not found | Right Intent" };
  return {
    title: `${product.name} | Right Intent`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const allProducts = await getCatalogProducts();
  const product = allProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  // Related suggestions: other pieces from the catalog, prioritized by category
  const relatedProducts = [
    ...allProducts.filter((p) => p.slug !== slug && p.category === product.category),
    ...allProducts.filter((p) => p.slug !== slug && p.category !== product.category),
  ].slice(0, 4);

  return (
    <>
      <RouteNav />
      <main>
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </main>
    </>
  );
}
