"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductTile } from "@/components/store/product-tile";
import type { CatalogProduct } from "@/lib/catalog";
import {
  Search,
  X,
  ArrowUpDown,
  Package,
  LayoutGrid,
  Grid3X3,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Star,
  Check,
  Zap,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useRouter } from "next/navigation";

type CatalogBrowserProps = {
  products: CatalogProduct[];
  initialCategory?: string;
};

export function CatalogBrowser({ products, initialCategory }: CatalogBrowserProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category || "Uncategorized"))).filter(Boolean);
  }, [products]);

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (initialCategory) {
      const match = categories.find(
        (c) => c.toLowerCase() === initialCategory.toLowerCase()
      );
      if (match) return match;
    }
    return "all";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name-asc">("featured");
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [quickViewProduct, setQuickViewProduct] = useState<CatalogProduct | null>(null);
  const [modalAdded, setModalAdded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync category with URL query param if changed
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get("category");
    if (catParam) {
      const match = categories.find(
        (c) => c.toLowerCase() === catParam.toLowerCase()
      );
      if (match) {
        setSelectedCategory(match);
      }
    }
  }, [categories]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (quickViewProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [quickViewProduct]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (category === "all") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", category.toLowerCase());
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("featured");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("category");
      window.history.replaceState({}, "", url.pathname);
    }
  };

  // Category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const p of products) {
      const cat = p.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [products]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let list = products;

    if (selectedCategory !== "all") {
      list = list.filter(
        (p) => (p.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(q))
      );
    }

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      return [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const isFiltered = selectedCategory !== "all" || Boolean(searchQuery.trim()) || sortBy !== "featured";

  const triggerToast = (name: string) => {
    setToastMessage(name);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleModalAdd = () => {
    if (!quickViewProduct) return;
    addItem({
      slug: quickViewProduct.slug,
      name: quickViewProduct.name,
      price: quickViewProduct.price,
      image: quickViewProduct.image,
    });
    setModalAdded(true);
    triggerToast(quickViewProduct.name);
    setTimeout(() => setModalAdded(false), 1400);
  };

  const handleModalBuyNow = () => {
    if (!quickViewProduct) return;
    addItem({
      slug: quickViewProduct.slug,
      name: quickViewProduct.name,
      price: quickViewProduct.price,
      image: quickViewProduct.image,
    });
    setQuickViewProduct(null);
    router.push("/checkout");
  };

  return (
    <div className="w-full">
      {/* Sleek Compact Header Bar (Products start immediately below!) */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 mb-2 border-b border-[rgba(28,38,34,0.06)]">
        <div className="flex items-baseline gap-2.5">
          <h1 className="font-[family-name:var(--serif)] text-[24px] sm:text-[30px] font-normal text-[var(--ink)] tracking-tight m-0">
            The Collection
          </h1>
          <span className="font-[family-name:var(--mono)] text-[11px] text-[var(--muted)] uppercase tracking-wider">
            {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] font-[family-name:var(--mono)] text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <Sparkles size={11} className="text-[var(--terra)]" /> Handcrafted Archival Series
          </span>
          <span>·</span>
          <span>Complimentary shipping over ₹999</span>
        </div>
      </div>

      {/* Luxury Category Filter & Controls Toolbar */}
      <div className="relative py-3 my-2 border-b border-[var(--line)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Category Filter Pills with Glowing Dot Indicator & Live Counts */}
          <div
            className="catalog-category-filter flex flex-wrap items-center gap-2 pb-1 sm:pb-0"
            role="group"
            aria-label="Filter categories"
          >
            <button
              type="button"
              onClick={() => handleCategorySelect("all")}
              aria-pressed={selectedCategory === "all"}
              className={`editorial-chip shrink-0 whitespace-nowrap transition-all duration-300 text-[11px] py-1.5 px-3.5 flex items-center gap-1.5 ${
                selectedCategory === "all"
                  ? "active shadow-xs font-semibold"
                  : "hover:border-[var(--ink)] hover:text-[var(--ink)]"
              }`}
            >
              {selectedCategory === "all" && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--terra)]" />
              )}
              All ({categoryCounts.all})
            </button>

            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  aria-pressed={isSelected}
                  className={`editorial-chip shrink-0 whitespace-nowrap transition-all duration-300 text-[11px] py-1.5 px-3.5 flex items-center gap-1.5 ${
                    isSelected
                      ? "active shadow-xs font-semibold"
                      : "hover:border-[var(--ink)] hover:text-[var(--ink)]"
                  }`}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--terra)]" />
                  )}
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Search, Sort, and Grid Switcher */}
          <div className="grid w-full gap-2.5 sm:flex sm:w-auto sm:items-center sm:shrink-0">
            {/* Live Search Input */}
            <div className="relative flex w-full min-w-0 items-center sm:w-auto sm:min-w-[190px]">
              <Search size={12} className="absolute left-3 text-[var(--muted)] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pieces..."
                className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-[var(--line)] bg-white/70 hover:border-[var(--ink)] focus:border-[var(--ink)] text-[12px] font-[family-name:var(--sans)] text-[var(--ink)] outline-none placeholder:text-[var(--muted)] transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="relative inline-flex w-full items-center sm:w-auto">
              <ArrowUpDown size={11} className="absolute left-2.5 text-[var(--muted)] pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products"
                className="w-full sm:w-auto pl-7 pr-3 py-1.5 rounded-xl border border-[var(--line)] bg-white/70 hover:border-[var(--ink)] text-[11px] font-[family-name:var(--mono)] text-[var(--ink)] outline-none cursor-pointer transition-colors shadow-2xs"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical: A - Z</option>
              </select>
            </div>

            {/* Grid Columns Switcher (Desktop) */}
            <div className="hidden md:inline-flex items-center border border-[var(--line)] rounded-xl bg-white/70 p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridCols === 4
                    ? "bg-[var(--ink)] text-[var(--paper)] shadow-2xs"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
                title="4-column compact grid"
                aria-label="4 columns"
              >
                <LayoutGrid size={13} />
              </button>
              <button
                type="button"
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridCols === 3
                    ? "bg-[var(--ink)] text-[var(--paper)] shadow-2xs"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
                title="3-column editorial grid"
                aria-label="3 columns"
              >
                <Grid3X3 size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Feedback Context Bar (if filtered) */}
        {isFiltered && (
          <div className="flex items-center justify-between gap-4 pt-2.5 mt-2 border-t border-[rgba(28,38,34,0.06)] text-[11px] font-[family-name:var(--mono)] text-[var(--muted)]">
            <span>
              Filtered:{" "}
              {selectedCategory !== "all" && (
                <span className="text-[var(--ink)] font-semibold mr-2">Category: {selectedCategory}</span>
              )}
              {searchQuery.trim() && (
                <span className="text-[var(--ink)] font-semibold mr-2">Query: "{searchQuery}"</span>
              )}
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 uppercase tracking-wider text-[var(--terra)] hover:underline font-semibold"
            >
              <X size={11} /> Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Product Grid with Staggered Entrance Animation */}
      {filteredProducts.length > 0 ? (
        <div
          key={`${selectedCategory}-${searchQuery}-${sortBy}-${gridCols}`}
          className={`grid gap-4 sm:gap-6 pt-3 transition-all duration-300 ${
            gridCols === 4
              ? "grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {filteredProducts.map((product, idx) => (
            <div
              key={product.id}
              className="animate-card-glide"
              style={{ animationDelay: `${Math.min(idx * 60, 480)}ms` }}
            >
              <ProductTile
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white/50 border border-[var(--line)] shadow-xs max-w-lg mx-auto mt-6 animate-card-glide">
          <Package className="text-[var(--muted)]/40 mb-3" size={38} />
          <h3 className="m-0 font-[family-name:var(--serif)] text-[22px] font-normal text-[var(--ink)]">
            No pieces found
          </h3>
          <p className="mt-2 text-[13px] text-[var(--muted)] font-[family-name:var(--sans)] leading-relaxed">
            {selectedCategory !== "all"
              ? `There are no products currently listed in the "${selectedCategory}" category.`
              : "No pieces match your search query."}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-5 editorial-btn editorial-btn-primary text-[10px] py-1.5 px-5"
          >
            Show All Products ({categoryCounts.all})
          </button>
        </div>
      )}

      {/* Interactive Quick View Modal (Super Unique Luxury Feature!) */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in"
          onClick={() => setQuickViewProduct(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[var(--line)] overflow-hidden p-6 sm:p-8 animate-toast-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--paper)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors z-20"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Product Image */}
              <div className="relative aspect-[4/5] w-full rounded-2xl bg-gradient-to-b from-[#faf8f4] to-[#ede7dc] border border-[rgba(28,38,34,0.06)] overflow-hidden flex items-center justify-center p-6">
                <div className="sheen-effect" />
                {quickViewProduct.image && (
                  <Image
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    fill
                    unoptimized
                    className="object-contain p-4 drop-shadow-[0_12px_22px_rgba(28,38,34,0.18)]"
                  />
                )}
              </div>

              {/* Product Quick Details */}
              <div className="flex flex-col space-y-3">
                <span className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[0.14em] text-[var(--terra)] font-semibold">
                  {quickViewProduct.category}
                </span>

                <h3 className="m-0 font-[family-name:var(--serif)] text-[22px] font-normal text-[var(--ink)] leading-snug">
                  {quickViewProduct.name}
                </h3>

                <div className="flex items-baseline gap-2.5 pt-1">
                  <span className="font-[family-name:var(--mono)] text-[20px] font-semibold text-[var(--ink)]">
                    Rs. {quickViewProduct.price.toLocaleString("en-IN")}
                  </span>
                  {quickViewProduct.compareAt && quickViewProduct.compareAt > quickViewProduct.price && (
                    <del className="font-[family-name:var(--mono)] text-[13px] text-[var(--muted)]">
                      Rs. {quickViewProduct.compareAt.toLocaleString("en-IN")}
                    </del>
                  )}
                </div>

                <p className="text-[13px] text-[var(--muted)] line-clamp-3 leading-relaxed m-0 font-[family-name:var(--sans)]">
                  {quickViewProduct.description}
                </p>

                <div className="flex items-center gap-1 text-[11px] font-[family-name:var(--mono)] text-[#e0912d] pt-1">
                  <Star size={12} fill="currentColor" />
                  <span className="font-medium">4.9</span>
                  <span className="text-[var(--muted)]">(Verified Archival Edition)</span>
                </div>

                {/* Actions in Modal */}
                <div className="pt-3 space-y-2">
                  <button
                    type="button"
                    onClick={handleModalAdd}
                    className="w-full h-[42px] rounded-xl font-[family-name:var(--mono)] text-[11px] uppercase tracking-wider font-semibold bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink)]/90 flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.99]"
                  >
                    {modalAdded ? (
                      <>
                        <Check size={14} /> Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} /> Add to Bag
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleModalBuyNow}
                    className="w-full h-[42px] rounded-xl font-[family-name:var(--mono)] text-[11px] uppercase tracking-wider font-semibold bg-[var(--terra)] text-white hover:bg-[#a64e39] flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.99]"
                  >
                    <Zap size={14} /> Buy Now (Instant Checkout)
                  </button>

                  <Link
                    href={`/products/${quickViewProduct.slug}`}
                    className="w-full h-[38px] rounded-xl font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider font-medium border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--ink)] flex items-center justify-center gap-1.5 transition-all bg-white"
                  >
                    View Full Product Page <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Micro-Toast on Add to Cart */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-toast-up flex items-center gap-3 py-3 px-4 rounded-2xl bg-[var(--ink)] text-[var(--paper)] shadow-2xl border border-white/10 font-[family-name:var(--mono)] text-[12px]">
          <div className="w-5 h-5 rounded-full bg-[#346a3a] flex items-center justify-center text-white shrink-0">
            <Check size={12} />
          </div>
          <span className="truncate max-w-[200px]">Added {toastMessage}!</span>
          <Link
            href="/cart"
            className="ml-2 px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold uppercase tracking-wider text-[10px] transition-colors shrink-0"
          >
            View Bag →
          </Link>
        </div>
      )}
    </div>
  );
}
