"use client";

import { useState } from "react";
import { Check, LoaderCircle, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export function AddToCartButton({
  product,
  className = "button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]",
}: {
  product: {
    slug: string;
    name: string;
    price: number;
    image: string;
    stock?: number;
  };
  className?: string;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");

  const add = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus("loading");
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setStatus("added");
    window.setTimeout(() => setStatus("idle"), 1400);
  };

  const outOfStock = product.stock !== undefined && product.stock < 1;

  return (
    <button
      type="button"
      className={`${className} ${outOfStock ? "out-of-stock-button" : ""}`}
      onClick={add}
      disabled={outOfStock || status === "loading"}
    >
      {outOfStock ? (
        "Out of stock"
      ) : status === "loading" ? (
        <LoaderCircle className="animate-spin" size={14} />
      ) : status === "added" ? (
        <>
          <span>Added</span> <Check size={14} />
        </>
      ) : (
        <>
          <span>Add</span>
          <span className="hidden sm:inline">&nbsp;to bag</span>
          <ShoppingBag size={14} className="shrink-0" />
        </>
      )}
    </button>
  );
}
