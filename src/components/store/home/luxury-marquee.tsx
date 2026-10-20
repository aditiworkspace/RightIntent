import { Sparkles } from "lucide-react";

const MARQUEE_ITEMS = [
  "Handcrafted in India",
  "100% Recycled Cotton Paper",
  "Archival Ink-Safe Binding",
  "Tools for Intentional Living",
  "Small Batch Craftsmanship",
  "Thoughtfully Packaged",
  "Designed to Age Beautifully",
];

export function LuxuryMarquee() {
  return (
    <div
      className="relative overflow-hidden py-3 bg-[var(--ink)] text-[var(--paper)] border-y border-[rgba(244,240,233,0.12)] select-none"
      aria-label="Brand highlights ticker"
    >
      <div className="flex animate-marquee">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 px-6 whitespace-nowrap font-[family-name:var(--mono)] text-[10px] uppercase tracking-[0.18em] text-[#d9ded4]"
          >
            <Sparkles size={11} className="text-[var(--terra)] shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
