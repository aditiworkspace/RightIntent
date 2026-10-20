import { Sparkles } from "lucide-react";

export function ManifestoSection() {
  return (
    <section className="py-10 sm:py-14 px-4 sm:px-[6vw] text-center scroll-reveal">
      <div className="max-w-3xl mx-auto relative rounded-3xl bg-gradient-to-b from-[#f9f6f0] to-[#f2ecdf] border border-[rgba(28,38,34,0.08)] px-6 py-9 sm:px-12 sm:py-11 shadow-xs">
        {/* Subtle decorative quotation flourish */}
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[var(--paper)] border border-[rgba(28,38,34,0.08)] flex items-center justify-center text-[var(--terra)] shadow-xs"
          aria-hidden="true"
        >
          <Sparkles size={14} />
        </div>

        <p className="eyebrow m-0 mb-3 font-[family-name:var(--mono)] text-[9.5px] uppercase tracking-[0.18em] text-[var(--muted)]">
          A different kind of everyday
        </p>

        <h2 className="m-0 font-[family-name:var(--serif)] text-[clamp(28px,3.4vw,46px)] font-normal leading-[1.12] tracking-[-0.04em] text-[var(--ink)]">
          Good things take their time.
          <br />
          <em className="text-[var(--terra)] font-style:italic">
            We think that is the point.
          </em>
        </h2>

        <div className="w-10 h-[1.5px] bg-[var(--terra)] mx-auto my-4 opacity-60" />

        <p className="max-w-[420px] mx-auto m-0 text-[13px] sm:text-[14px] leading-relaxed text-[var(--muted)] font-[family-name:var(--sans)]">
          From the first sketch to the last stitch, Right Intent is a collection of
          quiet, useful things made to bring more meaning to the everyday.
        </p>
      </div>
    </section>
  );
}
