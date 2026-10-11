"use client";

import type { Product } from "@/lib/products";
import { ArrowRight, Check, ShoppingBag, X } from "lucide-react";
import { formatPrice } from "./format-price";

type CartDrawerProps = { isOpen: boolean; cart: Product[]; onClose: () => void; onRemoveItem: (index: number) => void; onCheckout: () => void };

export function CartDrawer({ isOpen, cart, onClose, onRemoveItem, onCheckout }: CartDrawerProps) {
  return <>
    {isOpen && (
        <div
          className="[position:fixed] [inset:0] [z-index:10] [background:rgba(13,_18,_15,_.48)] [animation:fade-in_.2s_ease]"
          onClick={() => onClose()}
        >
          <aside
            className="[position:absolute] [top:0] [right:0] [width:min(450px,_100%)] [height:100%] [padding:39px] [background:var(--paper)] [animation:slide-in_.3s_ease] max-[960px]:[padding:28px_22px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="[display:flex] [justify-content:space-between] [&_.eyebrow]:[margin-bottom:10px] [&_h2]:[font-size:30px] [&_h2_span]:[color:var(--muted)] [&_h2_span]:[font:12px_var(--mono)]">
              <div>
                <p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">
                  Your edit
                </p>
                <h2 className="[margin:0] [font:400_clamp(37px,_4vw,_60px)/1.06_var(--serif)] [letter-spacing:-.055em]">
                  Shopping bag <span>({cart.length})</span>
                </h2>
              </div>
              <button
                aria-label="Close cart"
                onClick={() => onClose()}
              >
                <X size={21} />
              </button>
            </div>
            {cart.length === 0 ? (
              <div
                className={`
                [display:flex] [flex-direction:column] [align-items:center] [justify-content:center]
                [height:60%] [text-align:center] [&_p]:[margin:21px_0_6px] [&_p]:[font:25px_var(--serif)]
                [&_span]:[color:var(--muted)] [&_span]:[font-size:12px] [&_.button]:[margin-top:26px]
              `}
              >
                <ShoppingBag size={30} />
                <p>Your bag is waiting.</p>
                <span>Add something lovely to get started.</span>
                <button
                  className={`
                    button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center]
                    [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em]
                    [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease]
                    [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]
                  `}
                  onClick={() => onClose()}
                >
                  Keep exploring
                </button>
              </div>
            ) : (
              <>
                <div className="[margin-top:50px] [border-top:1px_solid_var(--line)]">
                  {cart.map((product, index) => (
                    <div
                      className={`
                        [display:grid] [grid-template-columns:62px_1fr_20px] [gap:15px] [align-items:center]
                        [padding:17px_0] [border-bottom:1px_solid_var(--line)] [&_strong]:[display:block]
                        [&_strong]:[font:15px_var(--serif)] [&_span]:[display:block] [&_span]:[margin:4px_0]
                        [&_span]:[color:var(--muted)] [&_span]:[font:9px_var(--mono)]
                        [&_span]:[text-transform:uppercase] [&_p]:[display:block] [&_p]:[margin:8px_0_0]
                        [&_p]:[font:11px_var(--mono)]
                      `}
                      key={`${product.id}-${index}`}
                    >
                      <div
                        className="[width:62px] [height:72px] [background-position:center] [background-size:cover]"
                        style={{ backgroundImage: `url(${product.image})` }}
                      />
                      <div>
                        <strong>{product.name}</strong>
                        <span>{product.category}</span>
                        <p>{formatPrice(product.price)}</p>
                      </div>
                      <button
                        aria-label={`Remove ${product.name}`}
                        onClick={() => onRemoveItem(index)}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="[display:flex] [justify-content:space-between] [margin:28px_0_20px] [font:12px_var(--mono)]">
                  <span>Subtotal</span>
                  <strong>
                    {formatPrice(
                      cart.reduce((sum, product) => sum + product.price, 0),
                    )}
                  </strong>
                </div>
                <button
                  className={`
                    button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center]
                    [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em]
                    [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease]
                    [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)] [width:100%]
                  `}
                  onClick={() => onCheckout()}
                >
                  Continue to checkout <ArrowRight size={16} />
                </button>
                <p className="[display:flex] [align-items:center] [justify-content:center] [gap:6px] [color:var(--muted)] [font:10px_var(--mono)]">
                  <Check size={14} /> Taxes and shipping calculated at checkout
                </p>
              </>
            )}
          </aside>
        </div>
      )}
  </>;
}
