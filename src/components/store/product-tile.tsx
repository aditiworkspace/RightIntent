"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Star, Eye, Heart } from "lucide-react";
import { AddToCartButton } from "@/components/store/add-to-cart-button";

export function ProductTile({
  product,
  onQuickView,
}: {
  product: {
    id: string;
    slug?: string;
    name: string;
    category: string;
    subcategory?: string;
    price: number;
    compareAt?: number;
    image: string;
    description: string;
    stock?: number;
  };
  onQuickView?: (product: any) => void;
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const slug = product.slug ?? product.name.toLowerCase().replaceAll(" ", "-");
  const inStock = product.stock === undefined || product.stock > 0;

  const hasDiscount = product.compareAt && product.compareAt > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAt! - product.price) / product.compareAt!) * 100)
    : 0;

  return (
    <article className="group relative flex flex-col justify-between bg-white rounded-2xl border border-[rgba(28,38,34,0.08)] p-3 sm:p-4 transition-all duration-400 ease-out hover:shadow-[0_20px_35px_-8px_rgba(28,38,34,0.12)] hover:border-[rgba(187,98,73,0.35)] hover:-translate-y-1.5">
      <div>
        {/* Image Showcase Container with Studio Depth & Sunlight Sheen */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#faf8f4] via-[#f5f1e8] to-[#ede7dc] border border-[rgba(28,38,34,0.05)] mb-3 group/img flex items-center justify-center p-3 sm:p-4">
          {/* Subtle Sunlight Sheen Effect across the cover on hover */}
          <div className="sheen-effect" />

          <Link
            href={`/products/${slug}`}
            className="absolute inset-0 z-0 flex items-center justify-center"
            aria-label={product.name}
          >
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain p-3 sm:p-4 transition-all duration-500 ease-out group-hover:scale-106 group-hover:-translate-y-1 drop-shadow-[0_10px_18px_rgba(28,38,34,0.12)] group-hover:drop-shadow-[0_16px_26px_rgba(28,38,34,0.18)]"
              />
            )}
          </Link>

          {/* Badges on Image (Top-Left) */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-[rgba(28,38,34,0.08)] font-[family-name:var(--mono)] text-[9px] uppercase tracking-wider text-[var(--ink)] shadow-xs">
              <Sparkles size={9} className="text-[var(--terra)]" />
              {product.category}
            </span>
            {hasDiscount && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#eaf4eb] text-[#2d6833] border border-[#cbe6cd] font-[family-name:var(--mono)] text-[9px] font-semibold tracking-wider uppercase shadow-xs">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist Heart Button (Top-Right) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className={`absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
              isWishlisted
                ? "bg-white text-[var(--terra)] border-[var(--terra)] shadow-xs animate-heart-pop"
                : "bg-white/80 text-[var(--muted)] border-[rgba(28,38,34,0.08)] hover:text-[var(--ink)] hover:bg-white"
            }`}
            aria-label="Wishlist"
          >
            <Heart size={13} fill={isWishlisted ? "currentColor" : "none"} />
          </button>

          {/* Quick View Button on Hover */}
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="absolute bottom-2.5 inset-x-4 z-20 hidden sm:flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[rgba(28,38,34,0.1)] text-[var(--ink)] font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider font-medium shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[var(--ink)] hover:text-white"
            >
              <Eye size={12} /> Quick View
            </button>
          )}

          {!inStock && (
            <div className="absolute inset-x-2.5 bottom-2.5 py-1.5 text-center rounded-lg bg-[rgba(28,38,34,0.85)] text-[var(--paper)] font-[family-name:var(--mono)] text-[9px] tracking-wider uppercase backdrop-blur-sm z-10 pointer-events-none">
              Out of stock
            </div>
          )}
        </div>

        {/* Product Meta */}
        <div>
          <p className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[0.14em] text-[var(--terra)] font-semibold mb-1 truncate">
            {product.subcategory
              ? `${product.category} · ${product.subcategory}`
              : product.category}
          </p>

          <h2 className="m-0 font-[family-name:var(--serif)] text-[16px] sm:text-[17px] font-normal leading-[1.25] tracking-[-0.01em] text-[var(--ink)] group-hover:text-[var(--terra)] transition-colors line-clamp-1">
            <Link href={`/products/${slug}`}>{product.name}</Link>
          </h2>

          <p className="line-clamp-1 mt-1 mb-2 text-[12px] leading-relaxed text-[var(--muted)] font-[family-name:var(--sans)]">
            {product.description}
          </p>

          <div className="flex items-center gap-1 mb-3 text-[11px] font-[family-name:var(--mono)] text-[#e0912d]">
            <Star size={11} fill="currentColor" />
            <span className="font-medium">4.9</span>
            <span className="text-[var(--muted)] text-[10px]">(Verified)</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Add to Bag */}
      <div className="pt-2.5 border-t border-[rgba(28,38,34,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="shrink-0">
          <span className="block font-[family-name:var(--mono)] text-[14px] font-semibold text-[var(--ink)] leading-none">
            Rs. {product.price.toLocaleString("en-IN")}
          </span>
          {hasDiscount && (
            <del className="block font-[family-name:var(--mono)] text-[10px] text-[var(--muted)] mt-0.5">
              Rs. {product.compareAt!.toLocaleString("en-IN")}
            </del>
          )}
        </div>

        <AddToCartButton
          product={{
            slug,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
          }}
          className="editorial-btn editorial-btn-primary w-full sm:w-auto min-h-[36px] px-3 text-[9px] py-1 rounded-lg"
        />
      </div>
    </article>
  );
}

export function ContinueLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="editorial-btn editorial-btn-primary"
    >
      {children} <ArrowRight size={15} />
    </Link>
  );
}
