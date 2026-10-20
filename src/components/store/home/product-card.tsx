"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, Heart, Plus, Sparkles, Star } from "lucide-react";
import type { Product } from "@/lib/products";
import type { CatalogProduct } from "@/lib/catalog";
import { formatPrice } from "./format-price";

interface ProductCardProps {
  product: Product | CatalogProduct;
  saved: boolean;
  onSave: () => void;
  onAdd: () => void;
  onQuickView?: (product: any) => void;
}

export function ProductCard({
  product,
  saved,
  onSave,
  onAdd,
  onQuickView,
}: ProductCardProps) {
  const catProd = product as CatalogProduct;
  const slug = catProd.slug ?? product.name.toLowerCase().replaceAll(" ", "-");
  const inStock = product.stock === undefined || product.stock > 0;

  const compareAt = (product as any).compareAt;
  const hasDiscount = compareAt && compareAt > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAt - product.price) / compareAt) * 100)
    : 0;

  return (
    <article className="group relative flex flex-col justify-between bg-white rounded-2xl border border-[rgba(28,38,34,0.08)] p-3 sm:p-3.5 transition-all duration-350 ease-out hover:shadow-[0_18px_32px_-6px_rgba(28,38,34,0.12)] hover:border-[rgba(187,98,73,0.35)] hover:-translate-y-1.5">
      <div>
        {/* Studio Pedestal Image Frame */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#faf8f4] via-[#f5f1e8] to-[#ede7dc] border border-[rgba(28,38,34,0.05)] mb-2.5 flex items-center justify-center p-3">
          {/* Sunlight sheen foil shimmer on hover */}
          <div className="sheen-effect" />

          {/* Product Image Link */}
          <Link
            href={`/products/${slug}`}
            className="absolute inset-0 z-0 flex items-center justify-center"
            aria-label={product.name}
          >
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized
                className="object-contain p-2.5 sm:p-3 transition-transform duration-500 ease-out group-hover:scale-106 group-hover:-translate-y-1 drop-shadow-[0_8px_16px_rgba(28,38,34,0.12)] group-hover:drop-shadow-[0_14px_22px_rgba(28,38,34,0.18)]"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[var(--cream)]">
                <span className="font-[family-name:var(--serif)] text-[16px] text-[var(--ink)] opacity-60 font-normal">
                  {product.name}
                </span>
                <span className="mt-1 font-[family-name:var(--mono)] text-[8px] uppercase tracking-widest text-[var(--muted)]">
                  Right Intent · Studio
                </span>
              </div>
            )}
          </Link>

          {/* Category & Discount Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-[rgba(28,38,34,0.08)] font-[family-name:var(--mono)] text-[8.5px] uppercase tracking-wider text-[var(--ink)] shadow-2xs">
              <Sparkles size={8} className="text-[var(--terra)]" />
              {product.category}
            </span>
            {hasDiscount && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#eaf4eb] text-[#2d6833] border border-[#cbe6cd] font-[family-name:var(--mono)] text-[8.5px] font-semibold tracking-wider uppercase shadow-2xs">
                Save {discountPercent}%
              </span>
            )}
            {product.badge && !hasDiscount && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[var(--terra)] text-white font-[family-name:var(--mono)] text-[8.5px] tracking-wider uppercase shadow-2xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSave();
            }}
            className={`absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
              saved
                ? "bg-white text-[var(--terra)] border-[var(--terra)] shadow-2xs animate-heart-pop"
                : "bg-white/85 text-[var(--muted)] border-[rgba(28,38,34,0.08)] hover:text-[var(--ink)] hover:bg-white"
            }`}
            aria-label={saved ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
          >
            <Heart size={13} fill={saved ? "currentColor" : "none"} />
          </button>

          {/* Quick View Button on Desktop Hover */}
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="absolute bottom-2 inset-x-3 z-20 hidden sm:flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/95 backdrop-blur-md border border-[rgba(28,38,34,0.1)] text-[var(--ink)] font-[family-name:var(--mono)] text-[9.5px] uppercase tracking-wider font-medium shadow-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[var(--ink)] hover:text-white"
            >
              <Eye size={12} /> Quick View
            </button>
          )}

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-x-2 bottom-2 py-1 text-center rounded-md bg-[rgba(28,38,34,0.85)] text-[var(--paper)] font-[family-name:var(--mono)] text-[8.5px] tracking-wider uppercase backdrop-blur-sm z-10 pointer-events-none">
              Out of stock
            </div>
          )}
        </div>

        {/* Product Information */}
        <div>
          <p className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--terra)] font-semibold mb-0.5 truncate">
            {(product as any).subcategory
              ? `${product.category} · ${(product as any).subcategory}`
              : product.category}
          </p>

          <h3 className="m-0 font-[family-name:var(--serif)] text-[16px] font-normal leading-[1.25] text-[var(--ink)] group-hover:text-[var(--terra)] transition-colors line-clamp-1">
            <Link href={`/products/${slug}`}>{product.name}</Link>
          </h3>

          <p className="line-clamp-1 mt-0.5 mb-1.5 text-[11.5px] leading-relaxed text-[var(--muted)] font-[family-name:var(--sans)]">
            {product.description}
          </p>

          <div className="flex items-center gap-1 mb-2 text-[10.5px] font-[family-name:var(--mono)] text-[#e0912d]">
            <Star size={10} fill="currentColor" />
            <span className="font-medium">4.9</span>
            <span className="text-[var(--muted)] text-[9.5px]">(Verified)</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Add to Bag */}
      <div className="pt-2 border-t border-[rgba(28,38,34,0.06)] flex items-center justify-between gap-2">
        <div className="shrink-0 flex items-baseline gap-1.5">
          <strong className="font-[family-name:var(--mono)] text-[13px] font-semibold text-[var(--ink)]">
            {formatPrice(product.price)}
          </strong>
          {hasDiscount && (
            <del className="font-[family-name:var(--mono)] text-[10.5px] text-[var(--muted)]">
              {formatPrice(compareAt)}
            </del>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdd();
          }}
          disabled={!inStock}
          className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-[var(--ink)] text-[var(--paper)] font-[family-name:var(--mono)] text-[9.5px] uppercase tracking-wider transition-all duration-200 hover:bg-[var(--terra)] hover:shadow-xs active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Plus size={12} strokeWidth={2.2} />
          <span>Add</span>
        </button>
      </div>
    </article>
  );
}
