import { ArrowRight, Sparkles } from "lucide-react";

export function StorySection() {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 min-h-[420px] scroll-reveal"
      id="story"
      aria-labelledby="story-heading"
    >
      <div
        className="min-h-[260px] md:min-h-full bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=85')",
        }}
        role="img"
        aria-label="Hands shaping a handcrafted ceramic object"
      />
      <div className="flex flex-col justify-center items-start py-9 px-6 sm:px-12 md:py-12 lg:px-16 bg-[var(--ink)] text-[var(--paper)]">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={11} className="text-[var(--terra)]" />
          <p className="eyebrow m-0 font-[family-name:var(--mono)] text-[9.5px] tracking-[0.16em] uppercase text-[#aab5a9]">
            Right Intent / Noun
          </p>
        </div>

        <h2
          id="story-heading"
          className="m-0 font-[family-name:var(--serif)] text-[clamp(28px,3.2vw,44px)] font-normal leading-[1.08] tracking-[-0.04em]"
        >
          For the things
          <br />
          <em className="text-[var(--terra)] font-style:italic">
            that make a place.
          </em>
        </h2>

        <p className="max-w-[400px] my-4 text-[13px] sm:text-[13.5px] leading-relaxed text-[#bac0b7] font-[family-name:var(--sans)]">
          Named for the boundless sky, Right Intent is an invitation to make space
          for beauty in its most honest form. We work with makers who care
          about the marks of the hand, natural materials, and objects that get
          better with use.
        </p>

        <a
          className="inline-flex items-center gap-2 font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--paper)] border-b border-[var(--paper)] pb-1 hover:text-[var(--terra)] hover:border-[var(--terra)] transition-colors mb-6"
          href="#journal"
        >
          <span>Read our story</span>
          <ArrowRight size={13} />
        </a>

        <div className="pt-4 border-t border-white/10 text-[13px] font-[family-name:var(--serif)] text-[#e2e5dc]">
          Right Intent, always
          <span className="block font-[family-name:var(--mono)] text-[8.5px] text-[#aab5a9] tracking-[0.12em] uppercase mt-0.5">
            Made in India
          </span>
        </div>
      </div>
    </section>
  );
}
