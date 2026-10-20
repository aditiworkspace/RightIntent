export function PerksSection() {
  return (
    <section className="py-8 sm:py-10 px-4 sm:px-[6vw] border-b border-[var(--line)] bg-[#faf8f4] scroll-reveal">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        <div className="flex items-start gap-4">
          <span className="font-[family-name:var(--mono)] text-[12px] font-semibold text-[var(--terra)] shrink-0 pt-0.5">
            01
          </span>
          <div>
            <strong className="block font-[family-name:var(--serif)] text-[18px] text-[var(--ink)] font-normal leading-snug">
              Made with intention
            </strong>
            <p className="mt-1 m-0 text-[12px] text-[var(--muted)] leading-relaxed font-[family-name:var(--sans)]">
              Small batches, considered materials, and honest Indian craftsmanship.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="font-[family-name:var(--mono)] text-[12px] font-semibold text-[var(--terra)] shrink-0 pt-0.5">
            02
          </span>
          <div>
            <strong className="block font-[family-name:var(--serif)] text-[18px] text-[var(--ink)] font-normal leading-snug">
              Easy & reliable delivery
            </strong>
            <p className="mt-1 m-0 text-[12px] text-[var(--muted)] leading-relaxed font-[family-name:var(--sans)]">
              Free shipping across India on orders over Rs. 999. Seamless returns.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="font-[family-name:var(--mono)] text-[12px] font-semibold text-[var(--terra)] shrink-0 pt-0.5">
            03
          </span>
          <div>
            <strong className="block font-[family-name:var(--serif)] text-[18px] text-[var(--ink)] font-normal leading-snug">
              Here to help
            </strong>
            <p className="mt-1 m-0 text-[12px] text-[var(--muted)] leading-relaxed font-[family-name:var(--sans)]">
              Real makers, thoughtful answers. Write to us at hello@rightintent.world
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
