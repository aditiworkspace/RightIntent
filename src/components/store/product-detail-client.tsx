"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Truck,
  RotateCcw,
  Sparkles,
  Leaf,
  Check,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Star,
  Minus,
  Plus,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { ProductTile } from "@/components/store/product-tile";
import type { CatalogProduct } from "@/lib/catalog";

type ProductDetailClientProps = {
  product: CatalogProduct;
  relatedProducts?: CatalogProduct[];
};

export function ProductDetailClient({ product, relatedProducts = [] }: ProductDetailClientProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [activeTab, setActiveTab] = useState<"craft" | "specs" | "shipping">("craft");
  const [isSaved, setIsSaved] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addStatus, setAddStatus] = useState<"idle" | "loading" | "added">("idle");

  const inStock = product.stock === undefined || product.stock > 0;
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [{ id: product.id, src: product.image, alt: product.name }];
  const activeImage = galleryImages[activeImageIndex] ?? galleryImages[0];

  const hasDiscount = product.compareAt && product.compareAt > product.price;
  const savingsAmount = hasDiscount ? product.compareAt! - product.price : 0;
  const savingsPercent = hasDiscount
    ? Math.round(((product.compareAt! - product.price) / product.compareAt!) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    setAddStatus("loading");
    for (let i = 0; i < quantity; i++) {
      addItem({
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    setAddStatus("added");
    window.setTimeout(() => setAddStatus("idle"), 1500);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    router.push("/checkout");
  };

  return (
    <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-[calc(76px+env(safe-area-inset-bottom))] sm:py-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-3 mb-6 sm:mb-8 text-[11px] font-[family-name:var(--mono)] text-[var(--muted)]">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 hover:text-[var(--ink)] transition-colors shrink-0"
          >
            <ArrowLeft size={13} /> Shop
          </Link>
          <span className="text-[var(--line)]">/</span>
          <Link
            href={`/category/${product.category.toLowerCase()}`}
            className="hover:text-[var(--ink)] transition-colors truncate"
          >
            {product.category}
          </Link>
          <span className="text-[var(--line)]">/</span>
          <span className="text-[var(--ink)] truncate max-w-[180px] sm:max-w-xs">{product.name}</span>
        </div>
        <span className="hidden sm:inline uppercase tracking-wider text-[10px] text-[var(--terra)] font-medium">
          Right Intent · Official
        </span>
      </nav>

      {/* Main Grid: Gallery & Product Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Product Showcase (Compact & Proportional) */}
        <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-28">
          <div className="relative aspect-[4/5] sm:aspect-[1/1.05] max-w-[440px] mx-auto w-full overflow-hidden rounded-2xl bg-[var(--cream)]/60 border border-[rgba(28,38,34,0.08)] shadow-xs flex items-center justify-center group">
            {activeImage?.src && (
              <Image
                src={activeImage.src}
                alt={activeImage.alt || product.name}
                fill
                sizes="(max-width: 960px) 100vw, 42vw"
                priority
                unoptimized
                className="object-contain p-6 sm:p-8 transition-transform duration-500 ease-out group-hover:scale-105"
              />
            )}

            {/* Badges */}
            <div className="absolute top-3.5 left-3.5 flex gap-1.5 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[rgba(244,240,233,0.92)] backdrop-blur-md border border-[rgba(28,38,34,0.1)] font-[family-name:var(--mono)] text-[9px] uppercase tracking-wider text-[var(--ink)] shadow-xs">
                <Sparkles size={10} className="text-[var(--terra)]" />
                Original Edition
              </span>
            </div>

            {!inStock && (
              <div className="absolute inset-x-4 bottom-4 py-2 text-center rounded-lg bg-[rgba(28,38,34,0.85)] text-[var(--paper)] font-[family-name:var(--mono)] text-[10px] tracking-wider uppercase backdrop-blur-sm">
                Out of Stock
              </div>
            )}
          </div>

          {/* Thumbnail Gallery (if multiple images) */}
          {galleryImages.length > 1 && (
            <div className="flex gap-2.5 justify-center overflow-x-auto pb-1" aria-label="Product thumbnails">
              {galleryImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={activeImageIndex === index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-[var(--cream)]/40 transition-all ${
                    activeImageIndex === index
                      ? "border-[var(--terra)] ring-2 ring-[var(--terra)]/20 shadow-xs"
                      : "border-[var(--line)] hover:border-[var(--ink)]/40"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="64px"
                    unoptimized
                    className="object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Value Badges Under Gallery */}
          <div className="grid grid-cols-3 gap-2.5 pt-1 max-w-[440px] mx-auto w-full">
            <div className="p-2.5 rounded-xl bg-white/70 border border-[var(--line)] text-center shadow-xs">
              <Leaf size={15} className="mx-auto mb-1 text-[var(--terra)]" />
              <span className="block font-[family-name:var(--mono)] text-[9px] uppercase tracking-wider text-[var(--ink)] font-medium">
                FSC Certified
              </span>
              <span className="text-[10px] text-[var(--muted)]">Sustainable</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 border border-[var(--line)] text-center shadow-xs">
              <Truck size={15} className="mx-auto mb-1 text-[var(--terra)]" />
              <span className="block font-[family-name:var(--mono)] text-[9px] uppercase tracking-wider text-[var(--ink)] font-medium">
                Express Ship
              </span>
              <span className="text-[10px] text-[var(--muted)]">2-4 Days</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 border border-[var(--line)] text-center shadow-xs">
              <RotateCcw size={15} className="mx-auto mb-1 text-[var(--terra)]" />
              <span className="block font-[family-name:var(--mono)] text-[9px] uppercase tracking-wider text-[var(--ink)] font-medium">
                Easy Return
              </span>
              <span className="text-[10px] text-[var(--muted)]">7-Day Guarantee</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details, Pricing, & Action Center */}
        <div className="lg:col-span-7 flex flex-col space-y-5">
          {/* Header & Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--terra)] font-semibold">
                {product.category}
              </span>
              <span className="text-[var(--muted)] text-[10px]">·</span>
              <div className="inline-flex items-center gap-1 text-[11px] text-[#e0912d] font-medium font-[family-name:var(--mono)]">
                <Star size={12} fill="currentColor" />
                <span>4.9</span>
                <span className="text-[var(--muted)] text-[10px]">(48 reviews)</span>
              </div>
            </div>

            <h1 className="font-[family-name:var(--serif)] text-[26px] sm:text-[32px] lg:text-[36px] font-normal leading-[1.18] tracking-[-0.02em] text-[var(--ink)] m-0">
              {product.name}
            </h1>

            {/* Pricing Section (Amazon/Flipkart Style Clear Savings) */}
            <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 mt-3.5 pb-4 border-b border-[var(--line)]">
              <span className="font-[family-name:var(--mono)] text-[24px] sm:text-[26px] font-semibold text-[var(--ink)]">
                Rs. {product.price.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <>
                  <del className="font-[family-name:var(--mono)] text-[15px] text-[var(--muted)]">
                    Rs. {product.compareAt!.toLocaleString("en-IN")}
                  </del>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#eaf4eb] text-[#2d6833] border border-[#cbe6cd]">
                    Save Rs. {savingsAmount.toLocaleString("en-IN")} ({savingsPercent}% OFF)
                  </span>
                </>
              )}
              <span className="w-full text-[11px] font-[family-name:var(--mono)] text-[var(--muted)]">
                Inclusive of all taxes · Complimentary shipping on orders above ₹999
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-[14px] leading-relaxed text-[var(--muted)] font-[family-name:var(--sans)] m-0">
              {product.description}
            </p>
          </div>

          {/* Stock & Delivery Promise */}
          <div className="py-3 px-3.5 rounded-xl bg-white/80 border border-[var(--line)] flex items-center justify-between text-[11px] font-[family-name:var(--mono)]">
            <div className={`flex items-center gap-2 ${inStock ? "text-[#346a3a]" : "text-[var(--terra)]"}`}>
              <span className={`w-2 h-2 rounded-full ${inStock ? "bg-[#346a3a] animate-pulse" : "bg-[var(--terra)]"}`} />
              <span className="font-medium">{inStock ? "In stock · Ready to dispatch" : "Out of stock / Restocking shortly"}</span>
            </div>
            <span className="text-[var(--muted)] hidden sm:inline">Delivers in 2-4 business days</span>
          </div>

          {/* Quantity Selector & Action Buttons (Add to Bag + Buy Now) */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="inline-flex items-center rounded-xl border border-[var(--line)] bg-white h-[46px] px-2 shadow-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || !inStock}
                  className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-30 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-9 text-center font-[family-name:var(--mono)] text-[13px] font-medium text-[var(--ink)]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10 || !inStock}
                  className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-30 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock || addStatus === "loading"}
                className={`flex-1 h-[46px] rounded-xl px-5 font-[family-name:var(--mono)] text-[11px] uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-all shadow-xs ${
                  inStock
                    ? "bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink)]/90 active:scale-[0.99]"
                    : "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                }`}
              >
                {addStatus === "added" ? (
                  <>
                    <Check size={15} /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} /> Add to Bag
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                className={`w-[46px] h-[46px] rounded-xl border flex items-center justify-center transition-all shrink-0 shadow-xs ${
                  isSaved
                    ? "bg-[rgba(187,98,73,0.1)] border-[var(--terra)] text-[var(--terra)]"
                    : "bg-white border-[var(--line)] text-[var(--ink)] hover:border-[var(--ink)]"
                }`}
                aria-label="Save piece to wishlist"
              >
                <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Instant Buy Now Button (Amazon/Flipkart Style) */}
            {inStock && (
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-[46px] rounded-xl font-[family-name:var(--mono)] text-[11px] uppercase tracking-wider font-semibold bg-[var(--terra)] text-white hover:bg-[#a64e39] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Zap size={15} /> Buy Now (Instant Checkout)
              </button>
            )}
          </div>

          {/* Trust Guarantees Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-[var(--line)]">
            <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
              <Truck size={14} className="text-[var(--terra)] shrink-0" />
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
              <RotateCcw size={14} className="text-[var(--terra)] shrink-0" />
              <span>7-Day Return</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
              <ShieldCheck size={14} className="text-[#346a3a] shrink-0" />
              <span>100% Genuine</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
              <Sparkles size={14} className="text-[var(--terra)] shrink-0" />
              <span>Handcrafted</span>
            </div>
          </div>

          {/* Interactive Information Tabs */}
          <div className="border border-[var(--line)] rounded-xl overflow-hidden bg-white/70 shadow-xs">
            <div className="flex border-b border-[var(--line)] bg-[var(--paper)]/50">
              <button
                onClick={() => setActiveTab("craft")}
                className={`flex-1 py-2.5 px-3 text-center font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider transition-colors ${
                  activeTab === "craft"
                    ? "bg-white font-semibold text-[var(--ink)] border-b-2 border-[var(--terra)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                Craft & Intent
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`flex-1 py-2.5 px-3 text-center font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider transition-colors ${
                  activeTab === "specs"
                    ? "bg-white font-semibold text-[var(--ink)] border-b-2 border-[var(--terra)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`flex-1 py-2.5 px-3 text-center font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider transition-colors ${
                  activeTab === "shipping"
                    ? "bg-white font-semibold text-[var(--ink)] border-b-2 border-[var(--terra)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                Delivery
              </button>
            </div>

            <div className="p-4 sm:p-5 text-[13px] leading-relaxed text-[var(--muted)] font-[family-name:var(--sans)]">
              {activeTab === "craft" && (
                <div className="space-y-2">
                  <p className="m-0">
                    Engineered with intentionality in every detail. Designed to lay completely flat across your workspace for an uninterrupted creative or reflective flow.
                  </p>
                  <p className="m-0 text-[11px] font-[family-name:var(--mono)] text-[var(--ink)]">
                    ✓ Hand-bound signatures · Archival grade materials
                  </p>
                </div>
              )}
              {activeTab === "specs" && (
                <div className="space-y-2 font-[family-name:var(--mono)] text-[12px]">
                  <div className="flex justify-between py-1 border-b border-[rgba(28,38,34,0.06)]">
                    <span className="text-[var(--muted)]">SKU</span>
                    <span className="text-[var(--ink)]">{product.sku}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[rgba(28,38,34,0.06)]">
                    <span className="text-[var(--muted)]">Category</span>
                    <span className="text-[var(--ink)]">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[rgba(28,38,34,0.06)]">
                    <span className="text-[var(--muted)]">Paper</span>
                    <span className="text-[var(--ink)]">120 GSM Acid-Free</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--muted)]">Origin</span>
                    <span className="text-[var(--ink)]">Crafted in India</span>
                  </div>
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="space-y-2">
                  <p className="m-0">
                    Dispatched within 24 hours via premium express couriers. Every package is wrapped in signature paper with a complimentary intention card.
                  </p>
                  <p className="m-0 text-[11px] font-[family-name:var(--mono)] text-[var(--ink)]">
                    Free standard shipping across all Indian pincodes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Products (Amazon/Flipkart Style: "You May Also Like") */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-16 sm:mt-24 pt-12 border-t border-[var(--line)]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--terra)] font-semibold block mb-1">
                Curated Suggestions
              </span>
              <h2 className="m-0 font-[family-name:var(--serif)] text-[24px] sm:text-[30px] font-normal text-[var(--ink)]">
                You May Also Like
              </h2>
              <p className="mt-1 text-[13px] text-[var(--muted)] font-[family-name:var(--sans)] m-0">
                Other popular journals, planners, and thoughtful tools from our collection.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--terra)] hover:underline shrink-0 font-medium"
            >
              View all pieces <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductTile key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
