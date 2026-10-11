"use client";

import Image from "next/image";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "./format-price";

export function ProductCard({
  product,
  saved,
  onSave,
  onAdd,
}: {
  product: Product;
  saved: boolean;
  onSave: () => void;
  onAdd: () => void;
}) {
  return (
    <article
      className={`
      [&:hover_.product-image]:[transform:translateY(-5px)]
      [&:hover_.product-image:after]:[background:rgba(28,_38,_34,_.08)]
      [&:hover_.quick-add]:[opacity:1] [&:hover_.quick-add]:[transform:translateY(0)]
    `}
    >
      <div
        className={`
          product-image [height:395px] [background-position:center] [background-size:cover]
          [position:relative] [overflow:hidden] [transition:transform_.4s_ease] [&:after]:[content:'']
          [&:after]:[position:absolute] [&:after]:[inset:0] [&:after]:[background:rgba(28,_38,_34,_0)]
          [&:after]:[transition:background_.3s_ease] max-[960px]:[height:235px]
        `}
        style={{
          backgroundColor: product.accent,
        }}
      >
        <Image
          src={product.image}
          alt=""
          fill
          sizes="(max-width: 960px) 50vw, 25vw"
          className="[object-fit:cover]"
        />
        <button
          className={`${saved ? "wish-button saved" : "wish-button"} [position:absolute] [top:15px] [right:15px] [z-index:2] [width:36px] [height:36px] [display:grid] [place-items:center] [border-radius:50%] [background:var(--paper)] [transition:color_.2s_ease] [&:hover]:[color:var(--terra)] [&.saved]:[color:var(--terra)]`}
          aria-label={
            saved
              ? `Remove ${product.name} from saved items`
              : `Save ${product.name}`
          }
          onClick={onSave}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
        {product.badge && (
          <span className="[position:absolute] [top:19px] [left:17px] [z-index:2] [font:9px_var(--mono)] [letter-spacing:.07em] [text-transform:uppercase]">
            {product.badge}
          </span>
        )}
        <button
          className={`
            quick-add [position:absolute] [left:15px] [right:15px] [bottom:15px] [z-index:2] [height:43px]
            [display:flex] [align-items:center] [justify-content:space-between] [padding:0_15px] [opacity:0]
            [transform:translateY(8px)] [color:var(--paper)] [background:var(--ink)] [font:10px_var(--mono)]
            [text-transform:uppercase] [transition:opacity_.3s_ease,_transform_.3s_ease]
            [&:focus]:[opacity:1] [&:focus]:[transform:translateY(0)] max-[960px]:[opacity:1]
            max-[960px]:[transform:none] max-[960px]:[left:8px] max-[960px]:[right:8px]
            max-[960px]:[bottom:8px] max-[960px]:[height:36px] max-[960px]:[font-size:8px]
          `}
          onClick={onAdd}
        >
          Add to bag <Plus size={15} />
        </button>
      </div>
      <div
        className={`
        [display:flex] [justify-content:space-between] [align-items:start] [margin-top:19px]
        [&_h3]:[margin:0] [&_h3]:[font:400_17px_var(--serif)] [&_strong]:[font:11px_var(--mono)]
        [&_strong]:[white-space:nowrap] max-[960px]:[display:block]
        max-[960px]:[&_strong]:[display:block] max-[960px]:[&_strong]:[margin-top:10px]
        max-[960px]:[&_h3]:[font-size:15px]
      `}
      >
        <div>
          <p className="product-category [margin:0_0_8px] [font:9px_var(--mono)] [color:var(--muted)] [letter-spacing:.1em] [text-transform:uppercase]">
            {product.category}
          </p>
          <h3>{product.name}</h3>
        </div>
        <strong>{formatPrice(product.price)}</strong>
      </div>
      <p className="[margin:8px_0_0] [color:var(--muted)] [font-size:12px] max-[960px]:[font-size:11px]">
        {product.description}
      </p>
    </article>
  );
}
