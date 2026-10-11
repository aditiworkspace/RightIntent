import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  RouteNav,
  RoutePage,
} from "@/components/store/route-page";
import { ProductTile } from "@/components/store/product-tile";
import { getCatalogProducts } from "@/lib/catalog";
import { PageLoading } from "@/components/store/page-loading";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<PageLoading />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = slug.charAt(0).toUpperCase() + slug.slice(1);
  const products = await getCatalogProducts();
  const matches = products.filter(
    (product) =>
      product.category.toLowerCase() === slug ||
      (slug === "objects" && product.category === "Objects"),
  );
  if (!matches.length) notFound();
  return (
    <>
      <RouteNav />
      <RoutePage
        eyebrow={`Collection / ${category}`}
        title={category}
        description="Pieces that make room for a little more feeling."
      >
        <div className="[display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:44px_18px] max-[960px]:[grid-template-columns:repeat(2,_1fr)] max-[960px]:[gap:30px_12px]">
          {matches.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </RoutePage>
    </>
  );
}
