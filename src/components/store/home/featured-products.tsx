"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ShoppingBag, Sparkles, Star, X, Zap } from "lucide-react";
import type { Product } from "@/lib/products";
import type { CatalogProduct } from "@/lib/catalog";
import { useCartStore } from "@/lib/cart-store";
import { ProductCard } from "./product-card";

type FeaturedProductsProps = {
  products: CatalogProduct[];
  saved: string[];
  onToggleSaved: (id: string) => void;
  onAddToCart: (product: Product) => void;
};

export function FeaturedProducts({
  products,
  saved,
  onToggleSaved,
  onAddToCart,
}: FeaturedProductsProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState<CatalogProduct | null>(null);
  const [modalAdded, setModalAdded] = useState(false);

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Filtered list
  const filtered = useMemo(() => {
    if (selectedCategory === "all") return products.slice(0, 8);
    return products
      .filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase())
      .slice(0, 8);
  }, [products, selectedCategory]);

  const handleModalAdd = () => {
    if (!quickViewProduct) return;
    onAddToCart(quickViewProduct);
    setModalAdded(true);
    setTimeout(() => {
      setModalAdded(false);
      setQuickViewProduct(null);
    }, 1200);
  };

  const handleModalBuyNow = () => {
    if (!quickViewProduct) return;
    const slug = quickViewProduct.slug ?? quickViewProduct.name.toLowerCase().replaceAll(" ", "-");
    addItem({
      slug,
      name: quickViewProduct.name,
      price: quickViewProduct.price,
      image: quickViewProduct.image,
    });
    setQuickViewProduct(null);
    router.push("/checkout");
  };

  return (
    <section
      className="py-10 sm:py-14 px-4 sm:px-[5vw] scroll-reveal"
      id="shop"
      aria-labelledby="featured-heading"
    >
      {/* Header & Category Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7 pb-4 border-b border-[rgba(28,38,34,0.08)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--terra)]" />
            <p className="m-0 font-[family-name:var(--mono)] text-[10px] tracking-[0.14em] uppercase text-[var(--muted)] font-semibold">
              The Edit · Handcrafted Collection
            </p>
          </div>
          <h2
            id="featured-heading"
            className="m-0 font-[family-name:var(--serif)] text-[clamp(28px,3.2vw,44px)] font-normal leading-[1.08] tracking-[-0.04em] text-[var(--ink)]"
          >
            Made for living
          </h2>
        </div>

        {/* Quick in-page category filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0" aria-label="Filter featured products">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`shrink-0 px-3 py-1.5 rounded-full font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-wider transition-all duration-200 border ${
              selectedCategory === "all"
                ? "bg-[var(--ink)] text-white border-[var(--ink)] shadow-xs font-semibold"
                : "bg-white/80 text-[var(--muted)] border-[rgba(28,38,34,0.1)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
            }`}
          >
            All ({categoryCounts.all ?? 0})
          </button>
          {categories.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-wider transition-all duration-200 border ${
                  isSelected
                    ? "bg-[var(--ink)] text-white border-[var(--ink)] shadow-xs font-semibold"
                    : "bg-white/80 text-[var(--muted)] border-[rgba(28,38,34,0.1)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}

          <Link
            className="hidden sm:inline-flex items-center gap-1.5 ml-2 font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--ink)] border-b border-[var(--ink)] pb-0.5 hover:text-[var(--terra)] hover:border-[var(--terra)] transition-colors"
            href="/products"
          >
            <span>All Pieces</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 stagger-children is-revealed">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            saved={saved.includes(product.id)}
            onSave={() => onToggleSaved(product.id)}
            onAdd={() => onAddToCart(product)}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        ))}
      </div>

      {/* Bottom Link for Mobile */}
      <div className="sm:hidden text-center mt-6">
        <Link
          className="inline-flex items-center gap-2 font-[family-name:var(--mono)] text-[11px] uppercase tracking-wider text-[var(--ink)] border-b border-[var(--ink)] pb-1"
          href="/products"
        >
          <span>View all {products.length} pieces</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setQuickViewProduct(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-[rgba(28,38,34,0.1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--line)] flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
              {/* Product Image */}
              <div className="relative aspect-[4/3] sm:aspect-[4/5] max-h-[220px] sm:max-h-none w-full rounded-2xl bg-gradient-to-b from-[#faf8f4] to-[#ede7dc] border border-[rgba(28,38,34,0.06)] overflow-hidden flex items-center justify-center p-4 sm:p-5">
                <div className="sheen-effect" />
                {quickViewProduct.image && (
                  <Image
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    fill
                    unoptimized
                    className="object-contain p-3 drop-shadow-[0_12px_22px_rgba(28,38,34,0.16)]"
                  />
                )}
              </div>

              {/* Product Quick Details */}
              <div className="flex flex-col space-y-2.5">
                <span className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[0.14em] text-[var(--terra)] font-semibold">
                  {quickViewProduct.category}
                </span>

                <h3 className="m-0 font-[family-name:var(--serif)] text-[20px] sm:text-[22px] font-normal text-[var(--ink)] leading-snug">
                  {quickViewProduct.name}
                </h3>

                <div className="flex items-baseline gap-2 pt-0.5">
                  <span className="font-[family-name:var(--mono)] text-[18px] font-semibold text-[var(--ink)]">
                    Rs. {quickViewProduct.price.toLocaleString("en-IN")}
                  </span>
                  {quickViewProduct.compareAt && quickViewProduct.compareAt > quickViewProduct.price && (
                    <del className="font-[family-name:var(--mono)] text-[12px] text-[var(--muted)]">
                      Rs. {quickViewProduct.compareAt.toLocaleString("en-IN")}
                    </del>
                  )}
                </div>

                <p className="text-[12px] text-[var(--muted)] line-clamp-3 leading-relaxed m-0 font-[family-name:var(--sans)]">
                  {quickViewProduct.description}
                </p>

                <div className="flex items-center gap-1 text-[11px] font-[family-name:var(--mono)] text-[#e0912d] pt-0.5">
                  <Star size={11} fill="currentColor" />
                  <span className="font-medium">4.9</span>
                  <span className="text-[var(--muted)] text-[10px]">(Verified Archival Edition)</span>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleModalAdd}
                    className="w-full h-[40px] rounded-xl font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-wider font-semibold bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink)]/90 flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.99]"
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
                    className="w-full h-[40px] rounded-xl font-[family-name:var(--mono)] text-[10.5px] uppercase tracking-wider font-semibold bg-[var(--terra)] text-white hover:bg-[#a64e39] flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.99]"
                  >
                    <Zap size={14} /> Buy Now (Instant Checkout)
                  </button>

                  <Link
                    href={`/products/${quickViewProduct.slug ?? quickViewProduct.name.toLowerCase().replaceAll(" ", "-")}`}
                    className="w-full h-[36px] rounded-xl font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider font-medium border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--ink)] flex items-center justify-center gap-1.5 transition-all bg-white"
                  >
                    View Full Product Page <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
