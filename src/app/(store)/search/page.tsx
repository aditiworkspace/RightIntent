import { Suspense } from "react";
import { Search } from "lucide-react";
import { RouteNav, RoutePage } from "@/components/store/route-page";
import { ProductTile } from "@/components/store/product-tile";
import { getCatalogProducts } from "@/lib/catalog";
import { PageLoading } from "@/components/store/page-loading";
import styles from "./search-page.module.css";

type SearchPageProps = { searchParams: Promise<{ q?: string }> };

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<PageLoading />}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchContent({ searchParams }: SearchPageProps) {
  const query = (await searchParams).q?.trim() ?? "";
  const products = await getCatalogProducts();
  const results = query ? products.filter((product) => `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query.toLowerCase())) : products;
  return (
    <>
      <RouteNav />
      <RoutePage
        eyebrow="Search"
        title="Find your feeling."
        description="Search the Right Intent collection."
        className="[padding-top:64px] max-[960px]:[padding-top:36px] [&>div:first-child]:[margin-bottom:48px] max-[960px]:[&>div:first-child]:[margin-bottom:44px]"
      >
        <form className={styles.searchForm} role="search">
          <label className={styles.searchField}>
            <Search size={18} aria-hidden="true" />
            <input
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search journals, planners, gifts..."
              aria-label="Search products"
            />
          </label>
          <button className={styles.searchSubmit} type="submit">
            Search
          </button>
        </form>
        <div className={styles.resultsHeading} aria-live="polite">
          <p>{query ? `${results.length} ${results.length === 1 ? "piece" : "pieces"} found` : "The collection"}</p>
          {query && <span>Results for “{query}”</span>}
        </div>
        {results.length > 0 ? (
          <div className={`${styles.results} ${results.length === 1 ? styles.singleResult : ""}`}>
            {results.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Search size={22} aria-hidden="true" />
            <h2>No pieces found</h2>
            <p>Try a different name or browse the collection.</p>
          </div>
        )}
      </RoutePage>
    </>
  );
}
