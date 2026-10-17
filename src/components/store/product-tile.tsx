import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { AddToCartButton } from "@/components/store/add-to-cart-button";

export function ProductTile({
  product,
}: {
  product: {
    id: string;
    slug?: string;
    name: string;
    category: string;
    price: number;
    compareAt?: number;
    image: string;
    description: string;
    stock?: number;
  };
}) {
  const slug = product.slug ?? product.name.toLowerCase().replaceAll(" ", "-");
  const inStock = product.stock === undefined || product.stock > 0;

  return (
    <article className="group relative flex flex-col justify-between bg-white/70 border border-[var(--line)] rounded-xl p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-[rgba(28,38,34,0.06)] hover:border-[rgba(187,98,73,0.35)] hover:-translate-y-1">
      <div>
        <Link
          href={`/products/${slug}`}
          className="relative block aspect-[1/1.1] w-full overflow-hidden rounded-lg bg-[var(--cream)] mb-4"
          aria-label={product.name}
        >
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 960px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[rgba(244,240,233,0.92)] backdrop-blur-sm border border-[rgba(28,38,34,0.12)] font-[family-name:var(--mono)] text-[9px] uppercase tracking-wider text-[var(--ink)]">
              <Sparkles size={10} className="text-[var(--terra)]" />
              {product.category}
            </span>
          </div>

          {!inStock && (
            <div className="absolute inset-x-3 bottom-3 py-2 text-center rounded bg-[rgba(28,38,34,0.85)] text-[var(--paper)] font-[family-name:var(--mono)] text-[10px] tracking-wider uppercase backdrop-blur-sm">
              Out of stock
            </div>
          )}
        </Link>

        <div>
          <p className="font-[family-name:var(--mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--muted)] mb-1.5">
            Right Intent · Edition
          </p>
          <h2 className="m-0 font-[family-name:var(--serif)] text-[20px] sm:text-[22px] font-normal leading-[1.2] tracking-[-0.02em] text-[var(--ink)] group-hover:text-[var(--terra)] transition-colors">
            <Link href={`/products/${slug}`}>{product.name}</Link>
          </h2>
          <p className="line-clamp-2 mt-2 mb-3 text-[13px] leading-relaxed text-[var(--muted)]">
            {product.description}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-[rgba(28,38,34,0.08)] flex items-center justify-between gap-3">
        <div>
          <span className="block font-[family-name:var(--mono)] text-[13px] font-medium text-[var(--ink)]">
            Rs. {product.price.toLocaleString("en-IN")}
          </span>
          {product.compareAt && product.compareAt > product.price && (
            <del className="block font-[family-name:var(--mono)] text-[11px] text-[var(--muted)]">
              Rs. {product.compareAt.toLocaleString("en-IN")}
            </del>
          )}
        </div>
        <AddToCartButton
          product={{
            slug,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
          }}
          className="editorial-btn editorial-btn-primary min-h-[40px] px-3 text-[10px] py-1"
        />
      </div>
    </article>
  );
}

export function ContinueLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="editorial-btn editorial-btn-primary"
    >
      {children} <ArrowRight size={15} />
    </Link>
  );
}
