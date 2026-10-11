"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products, type Product } from "@/lib/products";
import { ProductCard } from "./product-card";

type FeaturedProductsProps = {
  saved: string[];
  onToggleSaved: (id: string) => void;
  onAddToCart: (product: Product) => void;
};

export function FeaturedProducts({
  saved,
  onToggleSaved,
  onAddToCart,
}: FeaturedProductsProps) {
  return (
<section
        className="[padding:0_5vw_140px] max-[960px]:[padding:0_20px_90px]"
        id="shop"
      >
        <div
          className={`
          [display:flex] [justify-content:space-between] [align-items:end] [margin-bottom:39px]
          [&_.eyebrow]:[margin-bottom:13px] [&_h2]:[font-size:44px] max-[960px]:[align-items:start]
          max-[960px]:[flex-direction:column] max-[960px]:[gap:22px] max-[960px]:[&_h2]:[font-size:38px]
        `}
        >
          <div>
            <p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">
              The edit
            </p>
            <h2 className="[margin:0] [font:400_clamp(37px,_4vw,_60px)/1.06_var(--serif)] [letter-spacing:-.055em]">
              Made for living
            </h2>
          </div>
          <Link
            className={`
              text-link [display:inline-flex] [align-items:center] [gap:9px] [font:10px_var(--mono)]
              [text-transform:uppercase] [letter-spacing:.08em] [border-bottom:1px_solid_var(--ink)]
              [padding-bottom:6px]
            `}
            href="/products"
          >
            View all pieces <ArrowRight size={15} />
          </Link>
        </div>
        <div className="[display:grid] [grid-template-columns:repeat(4,_1fr)] [gap:17px] max-[960px]:[grid-template-columns:repeat(2,_1fr)] max-[960px]:[gap:22px_11px]">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              saved={saved.includes(product.id)}
              onSave={() => onToggleSaved(product.id)}
              onAdd={() => onAddToCart(product)}
            />
          ))}
        </div>
      </section>
  );
}
