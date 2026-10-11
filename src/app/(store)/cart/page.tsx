"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { RouteNav, RoutePage } from "@/components/store/route-page";
import { useCartStore } from "@/lib/cart-store";

export default function CartPage() {
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
  return (
    <>
      <RouteNav />
      <RoutePage
        eyebrow="Your edit"
        title="Shopping bag"
        description="Review your pieces before choosing delivery and payment."
      >
        {items.length === 0 ? (
          <div className="[min-height:350px] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [padding:40px] [text-align:center] [background:var(--cream)] [&_h2]:[margin:20px_0_5px] [&_h2]:[font-size:30px] [&_p]:[margin:0_0_25px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px]">
            <ShoppingBag size={32} />
            <h2 className="[margin:0] [font:400_clamp(37px,_4vw,_60px)/1.06_var(--serif)] [letter-spacing:-.055em]">
              Your bag is waiting.
            </h2>
            <p>Add something lovely to get started.</p>
            <Link
              className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]"
              href="/products"
            >
              Keep exploring <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="[display:grid] [grid-template-columns:minmax(0,_1.35fr)_minmax(280px,_.65fr)] [gap:7vw] [align-items:start] max-[960px]:[display:block]">
            <div className="[border-top:1px_solid_var(--line)]">
              {items.map((item) => (
                <article
                  className="[display:grid] [grid-template-columns:150px_minmax(0,_1fr)_28px] [gap:24px] [align-items:center] [padding:22px_0] [border-bottom:1px_solid_var(--line)] [&_h2]:[margin:0] [&_h2]:[font-size:clamp(24px,_2.3vw,_36px)] [&>div:nth-child(2)>p:not(.product-category)]:[margin:10px_0_18px] [&>div:nth-child(2)>p:not(.product-category)]:[font:12px_var(--mono)] [&>button]:[width:28px] [&>button]:[height:28px] [&>button]:[display:grid] [&>button]:[place-items:center] [&>button]:[color:var(--muted)] [&>button:hover]:[color:var(--terra)] max-[960px]:[grid-template-columns:92px_minmax(0,_1fr)_24px] max-[960px]:[gap:14px] max-[960px]:[&_h2]:[font-size:22px]"
                  key={item.slug}
                >
                  <div
                    className="[width:150px] [aspect-ratio:1_/_1.12] [background-color:var(--cream)] [background-position:center] [background-size:cover] max-[960px]:[width:92px]"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div>
                    <p className="product-category [margin:0_0_8px] [font:9px_var(--mono)] [color:var(--muted)] [letter-spacing:.1em] [text-transform:uppercase]">
                      Right Intent / {item.slug}
                    </p>
                    <h2 className="[margin:0] [font:400_clamp(37px,_4vw,_60px)/1.06_var(--serif)] [letter-spacing:-.055em]">
                      {item.name}
                    </h2>
                    <p>Rs. {item.price.toLocaleString("en-IN")}</p>
                    <div className="[display:inline-flex] [align-items:center] [gap:16px] [padding:7px_10px] [border:1px_solid_var(--line)] [font:12px_var(--mono)] [&_button]:[width:20px] [&_button]:[height:20px] [&_button]:[display:grid] [&_button]:[place-items:center] [&_button:hover]:[color:var(--terra)]">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity - 1)
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity + 1)
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.slug)}
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>
            <aside className="[padding:30px] [background:var(--cream)] [&_h2]:[font-size:30px] max-[960px]:[margin-top:55px]">
              <p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">
                Summary
              </p>
              <div className="[display:flex] [justify-content:space-between] [align-items:baseline] [gap:20px] [padding:10px_0] [border-bottom:1px_solid_rgba(28,_38,_34,_.12)] [font:12px/1.4_var(--mono)] [&_span]:[min-width:0] [&_strong]:[flex:0_0_auto] [&_strong]:[white-space:nowrap]">
                <span>Subtotal</span>
                <strong>Rs. {subtotal.toLocaleString("en-IN")}</strong>
              </div>
              <p>Shipping and discounts are calculated securely at checkout.</p>
              <Link
                className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)] [width:100%]"
                href="/checkout"
              >
                Continue to checkout <ArrowRight size={16} />
              </Link>
            </aside>
          </div>
        )}
      </RoutePage>
    </>
  );
}
