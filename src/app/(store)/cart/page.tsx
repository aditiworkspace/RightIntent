"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  Truck,
  ArrowLeft
} from "lucide-react";
import { RouteNav, RoutePage } from "@/components/store/route-page";
import { useCartStore } from "@/lib/cart-store";
import { useMounted } from "@/lib/use-mounted";

export default function CartPage() {
  const mounted = useMounted();

  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100),
  );
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (!mounted) {
    return (
      <>
        <RouteNav />
        <RoutePage eyebrow="Your Cart" title="Shopping Bag" description="Loading your selected pieces...">
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--terra)] border-t-transparent animate-spin" />
          </div>
        </RoutePage>
      </>
    );
  }

  return (
    <>
      <RouteNav />
      <RoutePage
        eyebrow="Your Curated Bag"
        title="Shopping Bag"
        description="Review your chosen tools and journals before moving forward to delivery."
      >
        {items.length === 0 ? (
          <div className="min-h-[420px] flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white/70 border border-[var(--line)] shadow-sm max-w-[640px] mx-auto">
            <div className="w-16 h-16 rounded-full bg-[rgba(28,38,34,0.05)] flex items-center justify-center text-[var(--muted)] mb-5">
              <ShoppingBag size={28} />
            </div>
            <h2 className="m-0 font-[family-name:var(--serif)] text-[clamp(28px,3.5vw,36px)] font-normal tracking-tight text-[var(--ink)]">
              Your bag is currently empty.
            </h2>
            <p className="max-w-[380px] mt-3 mb-6 text-[14px] leading-relaxed text-[var(--muted)]">
              Begin your practice with our physical stationery, structured habit planners, or thoughtful accessories.
            </p>
            <Link
              href="/products"
              className="editorial-btn editorial-btn-primary"
            >
              Explore the collection <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Items List (Left Column) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Free Shipping Meter */}
              <div className="p-4 rounded-xl bg-white/80 border border-[var(--line)]">
                <div className="flex items-center justify-between text-[11px] font-[family-name:var(--mono)] mb-2">
                  <span className="flex items-center gap-1.5 text-[var(--ink)] font-medium">
                    <Truck size={14} className="text-[var(--terra)]" />
                    {remainingForFreeShipping === 0
                      ? "You unlocked complimentary standard shipping!"
                      : `Add Rs. ${remainingForFreeShipping.toLocaleString("en-IN")} more for complimentary shipping`}
                  </span>
                  <span className="text-[var(--muted)]">{progressToFreeShipping}%</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--cream)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--terra)] rounded-full transition-all duration-500"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="border border-[var(--line)] rounded-xl bg-white/70 divide-y divide-[var(--line)] overflow-hidden">
                {items.map((item) => (
                  <div
                    key={item.slug}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-white/90"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden bg-[var(--cream)]/60 shrink-0 border border-[rgba(28,38,34,0.06)]">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-1.5"
                          />
                        )}
                      </div>
                      <div>
                        <span className="block font-[family-name:var(--mono)] text-[9px] uppercase tracking-wider text-[var(--muted)] mb-1">
                          Right Intent
                        </span>
                        <h3 className="m-0 font-[family-name:var(--serif)] text-[18px] sm:text-[20px] font-normal text-[var(--ink)]">
                          <Link href={`/products/${item.slug}`}>{item.name}</Link>
                        </h3>
                        <p className="font-[family-name:var(--mono)] text-[13px] font-medium text-[var(--ink)] mt-1.5 mb-0">
                          Rs. {item.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0">
                      {/* Quantity Selector */}
                      <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--paper)] text-[12px] font-[family-name:var(--mono)]">
                        <button
                          onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                          className="hover:text-[var(--terra)] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-5 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                          className="hover:text-[var(--terra)] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="block font-[family-name:var(--mono)] text-[14px] font-medium text-[var(--ink)]">
                          Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={() => removeItem(item.slug)}
                          className="text-[11px] font-[family-name:var(--mono)] text-[var(--muted)] hover:text-[var(--terra)] transition-colors inline-flex items-center gap-1 mt-1"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  <ArrowLeft size={13} /> Continue shopping
                </Link>
                <span className="text-[11px] font-[family-name:var(--mono)] text-[var(--muted)]">
                  {items.length} {items.length === 1 ? "distinct item" : "distinct items"}
                </span>
              </div>
            </div>

            {/* Order Summary (Right Column) */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[var(--line)] shadow-sm sticky top-28">
                <h3 className="m-0 font-[family-name:var(--serif)] text-[22px] font-normal text-[var(--ink)] pb-4 border-b border-[var(--line)]">
                  Order Summary
                </h3>

                <div className="space-y-3 py-5 text-[13px] font-[family-name:var(--sans)] border-b border-[var(--line)]">
                  <div className="flex justify-between text-[var(--muted)]">
                    <span>Subtotal</span>
                    <span className="font-[family-name:var(--mono)] text-[var(--ink)]">
                      Rs. {subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--muted)]">
                    <span>Shipping</span>
                    <span className="font-[family-name:var(--mono)] text-[#4f8055]">
                      {remainingForFreeShipping === 0 ? "FREE" : "Rs. 99"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--muted)]">
                    <span>Tax Estimate (GST)</span>
                    <span className="font-[family-name:var(--mono)] text-[var(--ink)]">
                      Included
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline py-5 border-b border-[var(--line)]">
                  <div>
                    <span className="block font-[family-name:var(--serif)] text-[20px] text-[var(--ink)]">
                      Estimated Total
                    </span>
                    <span className="text-[11px] text-[var(--muted)]">
                      Final total calculated during checkout
                    </span>
                  </div>
                  <span className="font-[family-name:var(--mono)] text-[22px] font-medium text-[var(--ink)]">
                    Rs. {(subtotal + (remainingForFreeShipping === 0 ? 0 : 99)).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="pt-6 space-y-3">
                  <Link
                    href="/checkout"
                    className="editorial-btn editorial-btn-primary w-full min-h-[50px] text-[12px]"
                  >
                    Proceed to checkout <ArrowRight size={15} />
                  </Link>

                  <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-[family-name:var(--mono)] text-[var(--muted)] uppercase tracking-wider">
                    <ShieldCheck size={14} className="text-[#4f8055]" />
                    <span>256-Bit SSL Encrypted Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </RoutePage>
    </>
  );
}
