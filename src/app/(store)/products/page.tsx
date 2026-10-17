import { RouteNav, RoutePage } from "@/components/store/route-page";
import { ProductTile } from "@/components/store/product-tile";
import { getCatalogProducts } from "@/lib/catalog";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Shop Journals, Planners & Thoughtful Tools | Right Intent",
  description: "Explore journals, planners and thoughtful everyday tools from Right Intent.",
};

export default async function ProductsPage() {
  const products = await getCatalogProducts();
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <>
      <RouteNav />
      <RoutePage
        eyebrow="The Full Edit"
        title="Tools for intentional living."
        description="A considered collection of physical journals, structured planners, and thoughtful artifacts designed for deep focus and personal growth."
      >
        {/* Category Pills & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 mb-8 border-y border-[var(--line)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="editorial-chip active">All ({products.length})</span>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="editorial-chip hover:bg-[var(--ink)] hover:text-[var(--paper)]"
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 text-[11px] font-[family-name:var(--mono)] text-[var(--muted)]">
            <span className="hidden sm:inline">Showing all {products.length} pieces</span>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[var(--line)] hover:border-[var(--ink)] text-[var(--ink)] transition-colors">
                <SlidersHorizontal size={13} /> Filter
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[var(--line)] hover:border-[var(--ink)] text-[var(--ink)] transition-colors">
                <ArrowUpDown size={13} /> Sort: Featured
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </RoutePage>
    </>
  );
}
