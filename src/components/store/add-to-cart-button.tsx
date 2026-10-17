"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle, ShoppingBag } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCartStore } from "@/lib/cart-store";

export function AddToCartButton({ product, className = "button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]" }: { product: { slug: string; name: string; price: number; image: string; stock?: number }; className?: string }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");

  const add = async () => {
    setStatus("loading");
    addItem(product);
    const supabase = createSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      router.push(`/login?next=/checkout&return=${encodeURIComponent(`/products/${product.slug}`)}`);
      return;
    }
    setStatus("added");
    window.setTimeout(() => setStatus("idle"), 1200);
  };

  const outOfStock = product.stock !== undefined && product.stock < 1;
  return <button className={`${className} ${outOfStock ? "out-of-stock-button" : ""}`} onClick={add} disabled={outOfStock || status === "loading"}>{outOfStock ? "Out of stock" : status === "loading" ? <LoaderCircle className="[animation:spin_1s_linear_infinite]" size={16} /> : status === "added" ? <>Added <Check size={16} /></> : <>Add to bag <ShoppingBag size={16} /></>}</button>;
}
