import Link from "next/link";
import { ArrowRight } from "lucide-react";

const RITUALS = [
  {
    tag: "PLAN",
    title: "Planners & to-do lists",
    href: "/products?category=carry",
    img: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=240&q=80",
    bg: "#d8c6aa",
  },
  {
    tag: "REFLECT",
    title: "Journals & prompts",
    href: "/products?category=trade",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=240&q=80",
    bg: "#e0c9bf",
  },
  {
    tag: "THE CHALLENGE",
    title: "Intelligent Trader",
    href: "#intelligent-trader",
    img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=240&q=80",
    bg: "#2d302c",
  },
  {
    tag: "BUILD",
    title: "Habit trackers & kits",
    href: "/products?category=textiles",
    img: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=240&q=80",
    bg: "#d7c6a8",
  },
  {
    tag: "GIFT",
    title: "Curated gift sets",
    href: "/products",
    img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=240&q=80",
    bg: "#b98e64",
  },
];

export function IntentionRail() {
  return (
    <section
      className="scroll-reveal bg-[#f7ead8] border-b border-[var(--line)] py-3 px-4 sm:px-[4vw]"
      aria-label="Shop by intention"
    >
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-2.5 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible sm:gap-3 pb-1 sm:pb-0">
        {RITUALS.map((ritual, idx) => (
          <Link
            key={ritual.tag}
            href={ritual.href}
            className={`group relative flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 hover:bg-white/60 hover:shadow-xs hover:-translate-y-0.5 ${
              idx < RITUALS.length - 1 ? "lg:border-r lg:border-[rgba(28,38,34,0.12)] pr-4" : ""
            }`}
          >
            {/* Thumbnail */}
            <div
              className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundImage: `url('${ritual.img}')`,
                backgroundColor: ritual.bg,
              }}
            />

            {/* Details */}
            <div className="min-w-0 flex-1">
              <span className="block font-[family-name:var(--mono)] text-[8.5px] uppercase tracking-[0.16em] text-[var(--terra)] font-semibold mb-0.5">
                {ritual.tag}
              </span>
              <strong className="block font-[family-name:var(--serif)] text-[14px] leading-tight text-[var(--ink)] font-normal group-hover:text-[var(--terra)] transition-colors truncate">
                {ritual.title}
              </strong>
            </div>

            {/* Arrow Icon */}
            <div className="w-6 h-6 rounded-full border border-[rgba(28,38,34,0.25)] flex items-center justify-center shrink-0 text-[var(--ink)] opacity-60 group-hover:opacity-100 group-hover:border-[var(--terra)] group-hover:text-[var(--terra)] transition-all">
              <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
