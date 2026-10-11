import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Heart } from "lucide-react";
import { notFound } from "next/navigation";
import { getCatalogProduct, getCatalogProducts } from "@/lib/catalog";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import type { Metadata } from "next";

export async function generateStaticParams() { return (await getCatalogProducts()).map((product) => ({ slug: product.slug })); }

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();
  return <main className="[max-width:1240px] [margin:auto] [padding:100px_5vw_140px] max-[960px]:[padding:70px_20px_90px]"><Link className="[display:inline-flex] [align-items:center] [gap:8px] [margin-bottom:55px] [font:10px_var(--mono)] [text-transform:uppercase]" href="/products"><ArrowLeft size={15} /> Back to shop</Link><div className="[display:grid] [grid-template-columns:1.1fr_.9fr] [gap:9vw] [align-items:start] max-[960px]:[display:block]"><div className="[position:relative] [aspect-ratio:1_/_1.1]">{product.image && <Image src={product.image} alt={product.name} fill sizes="(max-width: 960px) 90vw, 55vw" preload className="[object-fit:cover]" />}</div><div className="[&_h1]:[margin:0] [&_h1]:[font:400_clamp(46px,_6vw,_78px)/1_var(--serif)] [&_h1]:[letter-spacing:-.06em] [&_h1]:[font-size:57px] [padding-top:6vw] [&>p:not(.eyebrow):not(.detail-price):not(.stock)]:[max-width:380px] [&>p:not(.eyebrow):not(.detail-price):not(.stock)]:[color:var(--muted)] [&>p:not(.eyebrow):not(.detail-price):not(.stock)]:[font-size:14px] [&>p:not(.eyebrow):not(.detail-price):not(.stock)]:[line-height:1.8] [&>p:not(.eyebrow):not(.detail-price):not(.stock)]:[margin:28px_0] max-[960px]:[padding-top:55px] max-[960px]:[&_h1]:[font-size:48px]"><p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">{product.category}</p><h1>{product.name}</h1><p className="detail-price [font:14px_var(--mono)] [&_del]:[margin-left:13px] [&_del]:[color:var(--muted)] [&_del]:[font-size:11px]">Rs. {product.price.toLocaleString("en-IN")}{product.compareAt && <del>Rs. {product.compareAt.toLocaleString("en-IN")}</del>}</p><p>{product.description}</p><div className="[height:1px] [margin:30px_0] [background:var(--line)]" /><p className="stock [display:flex] [align-items:center] [gap:8px] [color:var(--muted)] [font:10px_var(--mono)]"><Check size={15} /> {product.stock > 0 ? "In stock and ready to ship" : "Availability confirmed at checkout"}</p><div className="[display:flex] [gap:10px] [margin-top:30px]"><AddToCartButton product={{ slug: product.slug, name: product.name, price: product.price, image: product.image }} /><button className="[width:46px] [display:grid] [place-items:center] [border:1px_solid_var(--line)]" aria-label="Save product"><Heart size={19} /></button></div><div className="[margin-top:55px] [border-top:1px_solid_var(--line)] [&_p]:[padding:14px_0] [&_p]:[margin:0] [&_p]:[border-bottom:1px_solid_var(--line)] [&_p]:[color:var(--muted)] [&_p]:[font-size:12px] [&_p]:[line-height:1.6] [&_strong]:[display:block] [&_strong]:[color:var(--ink)] [&_strong]:[font:11px_var(--mono)]"><p><strong>Made with intention</strong> Small batch production and considered materials.</p><p><strong>Arrives with care</strong> Wrapped thoughtfully and shipped across India.</p></div></div></div></main>;
}
