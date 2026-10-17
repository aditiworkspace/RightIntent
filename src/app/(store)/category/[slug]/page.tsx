import { Suspense } from "react";
import { notFound } from "next/navigation";
import { RouteNav, RoutePage } from "@/components/store/route-page";
import { ProductTile } from "@/components/store/product-tile";
import { getCatalogProducts } from "@/lib/catalog";
import { PageLoading } from "@/components/store/page-loading";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
      product.category.toLowerCase() === slug.toLowerCase() ||
      (slug.toLowerCase() === "objects" && product.category === "Objects"),
  );

  if (!matches.length) notFound();

  return (
    <>
      <RouteNav />
      <RoutePage
        eyebrow={`Collection / ${category}`}
        title={category}
        description={`Pieces curated within the ${category} discipline, made to foster calm and purposeful execution.`}
      >
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-[var(--line)]">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <ArrowLeft size={14} /> Back to all pieces
          </Link>
          <span className="text-[11px] font-[family-name:var(--mono)] text-[var(--muted)]">
            {matches.length} {matches.length === 1 ? "piece" : "pieces"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {matches.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </RoutePage>
    </>
  );
}
