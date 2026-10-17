import { notFound } from "next/navigation";
import { getCatalogProduct, getCatalogProducts } from "@/lib/catalog";
import { RouteNav } from "@/components/store/route-page";
import { ProductDetailClient } from "@/components/store/product-detail-client";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return (await getCatalogProducts()).map((product) => ({ slug: product.slug }));
}

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
  const product = await getCatalogProduct(slug);
  if (!product) notFound();

  return (
    <>
      <RouteNav />
      <main>
        <ProductDetailClient product={product} />
      </main>
    </>
  );
}
