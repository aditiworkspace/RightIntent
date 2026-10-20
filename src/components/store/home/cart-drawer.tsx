"use client";

import type { Product } from "@/lib/products";
import { ArrowRight, Check, ShoppingBag, X } from "lucide-react";
import { formatPrice } from "./format-price";

type CartDrawerProps = {
  isOpen: boolean;
  cart: Product[];
  onClose: () => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
};

export function CartDrawer({
  isOpen,
  cart,
  onClose,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-[rgba(13,18,15,0.52)] backdrop-blur-xs animate-fade-in"
          onClick={() => onClose()}
        >
          <aside
            className="absolute top-0 right-0 w-[min(450px,100%)] h-full bg-[var(--paper)] shadow-2xl flex flex-col p-6 sm:p-8 animate-slide-in"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--line)] shrink-0">
              <div>
                <p className="eyebrow m-0 mb-1 font-[family-name:var(--mono)] text-[9.5px] uppercase tracking-[0.16em] text-[var(--muted)] font-medium">
                  Your Edit
                </p>
                <h2 className="m-0 font-[family-name:var(--serif)] text-[26px] sm:text-[30px] font-normal tracking-[-0.03em] text-[var(--ink)]">
                  Shopping bag <span className="font-[family-name:var(--mono)] text-[12px] text-[var(--muted)]">({cart.length})</span>
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={() => onClose()}
                className="w-8 h-8 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--line)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Body */}
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-14 h-14 rounded-full bg-[rgba(28,38,34,0.05)] flex items-center justify-center text-[var(--muted)] mb-4">
                  <ShoppingBag size={24} />
                </div>
                <p className="m-0 font-[family-name:var(--serif)] text-[22px] text-[var(--ink)]">
                  Your bag is waiting.
                </p>
                <span className="text-[12px] text-[var(--muted)] mt-1.5 mb-6 max-w-xs font-[family-name:var(--sans)]">
                  Add something lovely to begin your ritual.
                </span>
                <button
                  type="button"
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 px-6 rounded-xl font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--terra)] transition-all shadow-xs"
                  onClick={() => onClose()}
                >
                  Keep exploring
                </button>
              </div>
            ) : (
              <>
                {/* Scrollable Items List */}
                <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-[var(--line)] pr-1">
                  {cart.map((product, index) => (
                    <div
                      className="grid grid-cols-[56px_1fr_24px] sm:grid-cols-[64px_1fr_24px] gap-3.5 items-center py-4"
                      key={`${product.id}-${index}`}
                    >
                      <div
                        className="w-14 h-16 sm:w-16 sm:h-18 rounded-lg bg-center bg-cover bg-[var(--cream)] border border-[rgba(28,38,34,0.06)] shrink-0"
                        style={{ backgroundImage: `url(${product.image})` }}
                      />
                      <div className="min-w-0">
                        <strong className="block font-[family-name:var(--serif)] text-[15px] sm:text-[16px] font-normal text-[var(--ink)] truncate">
                          {product.name}
                        </strong>
                        <span className="block font-[family-name:var(--mono)] text-[8.5px] uppercase tracking-wider text-[var(--muted)] mt-0.5">
                          {product.category}
                        </span>
                        <p className="font-[family-name:var(--mono)] text-[12px] font-semibold text-[var(--ink)] mt-1 mb-0">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${product.name}`}
                        onClick={() => onRemoveItem(index)}
                        className="text-[var(--muted)] hover:text-[var(--terra)] transition-colors p-1"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Docked Footer (Always visible & reachable) */}
                <div className="shrink-0 pt-4 border-t border-[var(--line)] pb-[calc(10px+env(safe-area-inset-bottom))] space-y-3">
                  <div className="flex justify-between items-baseline font-[family-name:var(--mono)]">
                    <span className="text-[11px] uppercase tracking-wider text-[var(--muted)]">Subtotal</span>
                    <strong className="text-[17px] font-semibold text-[var(--ink)]">
                      {formatPrice(
                        cart.reduce((sum, product) => sum + product.price, 0),
                      )}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="w-full min-h-[46px] rounded-xl font-[family-name:var(--mono)] text-[11px] uppercase tracking-wider font-semibold bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--terra)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs"
                    onClick={() => onCheckout()}
                  >
                    Continue to checkout <ArrowRight size={15} />
                  </button>

                  <p className="flex items-center justify-center gap-1.5 m-0 text-[10px] font-[family-name:var(--mono)] text-[var(--muted)] text-center">
                    <Check size={13} className="text-[#346a3a]" /> Taxes and shipping calculated at checkout
                  </p>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
