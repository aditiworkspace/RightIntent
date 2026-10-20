import { Suspense } from "react";
import { RouteNav } from "@/components/store/route-page";
import { CatalogBrowser } from "@/components/store/catalog-browser";
import { getCatalogProducts } from "@/lib/catalog";
import { PageLoading } from "@/components/store/page-loading";

export const metadata = {
  title: "Shop Journals, Planners & Thoughtful Tools | Right Intent",
  description: "Explore journals, planners and thoughtful everyday tools from Right Intent.",
};

type ProductsPageProps = {
  searchParams: Promise<{ category?: string; sort?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = await searchParams;
  const products = await getCatalogProducts();

  return (
    <>
      <RouteNav />
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-20 animate-hero-glide">
        <Suspense fallback={<PageLoading />}>
          <CatalogBrowser products={products} initialCategory={category} />
        </Suspense>
      </main>
    </>
  );
}
