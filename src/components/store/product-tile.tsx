import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AddToCartButton } from "@/components/store/add-to-cart-button";

export function ProductTile({ product }: { product: { id: string; slug?: string; name: string; category: string; price: number; image: string; description: string } }) {
  const slug = product.slug ?? product.name.toLowerCase().replaceAll(" ", "-");
  return <article className="[&_h2]:[margin:0] [&_h2]:[font-size:23px] [&_p:not(.product-category)]:[margin:9px_0_14px] [&_p:not(.product-category)]:[color:var(--muted)] [&_p:not(.product-category)]:[font-size:12px] [&_strong]:[display:block] [&_strong]:[font:11px_var(--mono)] [&_.button]:[margin-top:18px] max-[960px]:[&_h2]:[font-size:18px]"><Link href={`/products/${slug}`} className="[display:block] [position:relative] [aspect-ratio:1_/_1.16] [margin-bottom:20px] [background-color:var(--cream)]" aria-label={product.name}>{product.image && <Image src={product.image} alt="" fill sizes="(max-width: 960px) 50vw, 33vw" className="[object-fit:cover]" />}</Link><div><p className="product-category [margin:0_0_8px] [font:9px_var(--mono)] [color:var(--muted)] [letter-spacing:.1em] [text-transform:uppercase]">{product.category}</p><h2 className="[margin:0] [font:400_clamp(37px,_4vw,_60px)/1.06_var(--serif)] [letter-spacing:-.055em]">{product.name}</h2><p>{product.description}</p><strong>Rs. {product.price.toLocaleString("en-IN")}</strong><AddToCartButton product={{ slug, name: product.name, price: product.price, image: product.image }} className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [border:1px_solid_var(--ink)]" /></div></article>;
}

export function ContinueLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]">{children} <ArrowRight size={16} /></Link>;
}
