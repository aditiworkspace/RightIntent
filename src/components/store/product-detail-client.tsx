"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Layers,
  Leaf,
} from "lucide-react";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import type { CatalogProduct } from "@/lib/catalog";

export function ProductDetailClient({ product }: { product: CatalogProduct }) {
  const [activeTab, setActiveTab] = useState<"craft" | "shipping" | "materials">("craft");
  const [isSaved, setIsSaved] = useState(false);

  const inStock = product.stock === undefined || product.stock > 0;

  return (
    <div className="max-w-[1360px] mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-16">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-8 sm:mb-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 font-[family-name:var(--mono)] text-[11px] tracking-[0.1em] uppercase text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft size={14} /> Back to shop
        </Link>
        <span className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
          Right Intent · {product.category}
        </span>
      </div>

      {/* Main Grid: Gallery & Product Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Product Showcase */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-[1/1.08] w-full overflow-hidden rounded-2xl bg-[var(--cream)] border border-[rgba(28,38,34,0.08)] shadow-sm">
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 960px) 100vw, 55vw"
                priority
                className="object-cover"
              />
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(244,240,233,0.92)] backdrop-blur-md border border-[rgba(28,38,34,0.1)] font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--ink)]">
                <Sparkles size={11} className="text-[var(--terra)]" />
                Original Edition
              </span>
            </div>
          </div>

          {/* Value Badges Under Gallery */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white/70 border border-[var(--line)] text-center">
              <Leaf size={16} className="mx-auto mb-1 text-[var(--terra)]" />
              <span className="block font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--ink)]">
                FSC Certified
              </span>
              <span className="text-[11px] text-[var(--muted)]">Sustainably sourced</span>
            </div>
            <div className="p-3 rounded-xl bg-white/70 border border-[var(--line)] text-center">
              <Truck size={16} className="mx-auto mb-1 text-[var(--terra)]" />
              <span className="block font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--ink)]">
                Express India
              </span>
              <span className="text-[11px] text-[var(--muted)]">2-5 business days</span>
            </div>
            <div className="p-3 rounded-xl bg-white/70 border border-[var(--line)] text-center">
              <RotateCcw size={16} className="mx-auto mb-1 text-[var(--terra)]" />
              <span className="block font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--ink)]">
                Care Guarantee
              </span>
              <span className="text-[11px] text-[var(--muted)]">7-day replacement</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Details, & Action Center */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="pb-6 border-b border-[var(--line)]">
            <p className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--terra)] mb-2">
              {product.category}
            </p>
            <h1 className="font-[family-name:var(--serif)] text-[clamp(34px,3.8vw,52px)] font-normal leading-[1.08] tracking-[-0.03em] text-[var(--ink)] m-0">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="font-[family-name:var(--mono)] text-[22px] font-medium text-[var(--ink)]">
                Rs. {product.price.toLocaleString("en-IN")}
              </span>
              {product.compareAt && product.compareAt > product.price && (
                <del className="font-[family-name:var(--mono)] text-[15px] text-[var(--muted)]">
                  Rs. {product.compareAt.toLocaleString("en-IN")}
                </del>
              )}
              <span className="text-[11px] font-[family-name:var(--mono)] text-[var(--muted)]">
                (Inclusive of all taxes)
              </span>
            </div>
          </div>

          {/* Description & Narrative */}
          <div className="py-6 border-b border-[var(--line)]">
            <p className="text-[15px] leading-[1.75] text-[var(--muted)] font-[family-name:var(--sans)] m-0">
              {product.description}
            </p>
          </div>

          {/* Stock & Delivery Promise */}
          <div className="py-5 border-b border-[var(--line)] flex items-center justify-between text-[11px] font-[family-name:var(--mono)]">
            <div className="flex items-center gap-2 text-[#4f8055]">
              <span className="w-2 h-2 rounded-full bg-[#4f8055] animate-pulse" />
              <span>{inStock ? "In stock & ready to ship" : "Restocking shortly"}</span>
            </div>
            <span className="text-[var(--muted)]">Ships in protective archival sleeve</span>
          </div>

          {/* Purchase Actions */}
          <div className="py-6 flex items-center gap-3">
            <div className="flex-1">
              <AddToCartButton
                product={{
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  stock: product.stock,
                }}
                className="editorial-btn editorial-btn-primary w-full min-h-[52px] text-[12px]"
              />
            </div>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`w-[52px] h-[52px] rounded-lg border flex items-center justify-center transition-all ${
                isSaved
                  ? "bg-[rgba(187,98,73,0.1)] border-[var(--terra)] text-[var(--terra)]"
                  : "border-[var(--line)] text-[var(--ink)] hover:border-[var(--ink)]"
              }`}
              aria-label="Save piece to wishlist"
            >
              <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Interactive Editorial Accordion Tabs */}
          <div className="mt-4 border border-[var(--line)] rounded-xl overflow-hidden bg-white/50">
            <div className="flex border-b border-[var(--line)] bg-[rgba(28,38,34,0.02)]">
              <button
                onClick={() => setActiveTab("craft")}
                className={`flex-1 py-3 px-3 text-center font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider transition-colors ${
                  activeTab === "craft"
                    ? "bg-white font-medium text-[var(--ink)] border-b-2 border-[var(--terra)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                Craft & Intent
              </button>
              <button
                onClick={() => setActiveTab("materials")}
                className={`flex-1 py-3 px-3 text-center font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider transition-colors ${
                  activeTab === "materials"
                    ? "bg-white font-medium text-[var(--ink)] border-b-2 border-[var(--terra)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`flex-1 py-3 px-3 text-center font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider transition-colors ${
                  activeTab === "shipping"
                    ? "bg-white font-medium text-[var(--ink)] border-b-2 border-[var(--terra)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                Delivery
              </button>
            </div>

            <div className="p-5 text-[13px] leading-relaxed text-[var(--muted)] font-[family-name:var(--sans)]">
              {activeTab === "craft" && (
                <div className="space-y-3">
                  <p className="m-0">
                    Engineered with intentionality in every detail. Designed to lay completely flat across your workspace for an uninterrupted creative or reflective flow.
                  </p>
                  <p className="m-0 text-[12px] font-[family-name:var(--mono)] text-[var(--ink)]">
                    ✓ Hand-bound signatures · Archival binding
                  </p>
                </div>
              )}
              {activeTab === "materials" && (
                <div className="space-y-2 font-[family-name:var(--mono)] text-[12px]">
                  <div className="flex justify-between py-1 border-b border-[rgba(28,38,34,0.06)]">
                    <span className="text-[var(--muted)]">Paper Quality</span>
                    <span className="text-[var(--ink)]">120 GSM Acid-Free Mil-Spec</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[rgba(28,38,34,0.06)]">
                    <span className="text-[var(--muted)]">Cover</span>
                    <span className="text-[var(--ink)]">Hardbound Linen Finish</span>
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
                  <p className="m-0 text-[12px] font-[family-name:var(--mono)] text-[var(--ink)]">
                    Free standard shipping across all Indian pincodes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
