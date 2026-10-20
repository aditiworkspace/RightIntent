import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { categories } from "@/lib/products";

export function CategoriesSection() {
  return (
    <section
      className="py-10 sm:py-14 px-4 sm:px-[5vw] bg-[var(--cream)] border-y border-[var(--line)] scroll-reveal"
      id="categories"
      aria-labelledby="categories-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-3 border-b border-[rgba(28,38,34,0.06)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--terra)]" />
            <p className="m-0 font-[family-name:var(--mono)] text-[10px] tracking-[0.14em] uppercase text-[var(--muted)] font-semibold">
              Find your ritual
            </p>
          </div>
          <h2
            id="categories-heading"
            className="m-0 font-[family-name:var(--serif)] text-[clamp(28px,3.2vw,42px)] font-normal leading-[1.08] tracking-[-0.04em] text-[var(--ink)]"
          >
            Shop by feeling
          </h2>
        </div>
        <p className="m-0 text-[var(--muted)] text-[12px] sm:text-[13px] leading-relaxed sm:text-right max-w-[280px] font-[family-name:var(--sans)]">
          For slow mornings, generous tables and everything in between.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 stagger-children is-revealed">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/products?category=${category.name.toLowerCase()}`}
            className="group relative h-[210px] sm:h-[250px] rounded-2xl overflow-hidden shadow-xs border border-[rgba(28,38,34,0.08)] flex items-end transition-all duration-400 hover:shadow-lg hover:-translate-y-1"
            style={{
              backgroundImage: `url(${category.image})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,23,20,0.85)] via-[rgba(18,23,20,0.3)] to-transparent transition-opacity duration-300 group-hover:opacity-90" />

            {/* Bottom Content */}
            <div className="relative z-10 w-full p-4 sm:p-5 flex items-end justify-between text-[var(--paper)]">
              <div>
                <span className="inline-flex items-center gap-1 font-[family-name:var(--mono)] text-[9px] uppercase tracking-wider text-[#d2baa7] mb-1">
                  <Sparkles size={9} /> {category.count}
                </span>
                <strong className="block font-[family-name:var(--serif)] text-[22px] sm:text-[24px] font-normal leading-tight group-hover:text-[#f4d4be] transition-colors">
                  {category.name}
                </strong>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 group-hover:bg-[var(--terra)] group-hover:border-[var(--terra)] transition-all">
                <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
