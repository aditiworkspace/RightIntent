import { ArrowRight, Quote, Sparkles } from "lucide-react";

export function JournalSection() {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 min-h-[380px] bg-[#e8ded0] border-y border-[var(--line)] scroll-reveal"
      id="voice-of-ceo"
      aria-labelledby="ceo-voice-heading"
    >
      {/* Left: Founder Atelier / Workspace Visual */}
      <div
        className="relative min-h-[260px] md:min-h-full bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=85')",
        }}
        role="img"
        aria-label="Founder's desk with journal, fountain pen, and morning coffee at Right Intent atelier"
      >
        <div className="absolute inset-0 bg-black/10 backdrop-contrast-[1.05]" />
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white font-[family-name:var(--mono)] text-[8.5px] uppercase tracking-[0.2em]">
          Atelier Desk · Morning Light
        </div>
      </div>

      {/* Right: Voice of CEO / Right Intent Letter */}
      <div className="flex flex-col justify-center items-start py-8 px-6 sm:px-12 md:py-10 lg:px-16 text-[var(--ink)]">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={11} className="text-[var(--terra)]" />
          <p className="eyebrow m-0 font-[family-name:var(--mono)] text-[9.5px] uppercase tracking-[0.2em] text-[var(--terra)] font-semibold">
            Voice of CEO · Right Intent
          </p>
        </div>

        <h2
          id="ceo-voice-heading"
          className="m-0 font-[family-name:var(--serif)] text-[clamp(28px,3.2vw,42px)] font-normal leading-[1.08] tracking-[-0.04em]"
        >
          In a world of noise,
          <br />
          <em className="text-[var(--terra)] font-style:italic">
            we build for intention.
          </em>
        </h2>

        {/* Founder's Letter Quote */}
        <div className="relative my-3.5 pl-3 border-l-2 border-[var(--terra)]/60">
          <p className="max-w-[420px] m-0 text-[13px] sm:text-[13.5px] leading-relaxed text-[var(--ink)]/85 font-[family-name:var(--sans)]">
            &ldquo;Right Intent was founded on a simple conviction: the tools we touch every day quietly shape the life we create. From the paper you write on at dawn to the tactile objects on your table, everything is crafted slowly with purpose, archival honesty, and care.&rdquo;
          </p>
        </div>

        {/* CEO Signature Block */}
        <div className="pt-3 mb-4 flex items-center justify-between gap-4 w-full max-w-[420px] border-t border-[rgba(28,38,34,0.12)]">
          <div>
            <span className="block font-[family-name:var(--serif)] text-[20px] italic font-normal text-[var(--ink)] leading-tight">
              Aditi Sharma
            </span>
            <span className="block font-[family-name:var(--mono)] text-[8.5px] uppercase tracking-[0.18em] text-[var(--muted)] mt-0.5">
              Founder & CEO, Right Intent
            </span>
          </div>

          <span className="px-2.5 py-1 rounded-md bg-white/50 border border-[rgba(28,38,34,0.1)] font-[family-name:var(--mono)] text-[8px] uppercase tracking-widest text-[var(--muted)]">
            Atelier Note
          </span>
        </div>

        <a
          className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-lg border border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider hover:bg-[var(--terra)] hover:border-[var(--terra)] transition-all shadow-xs"
          href="#story"
        >
          <span>Read our story</span>
          <ArrowRight size={13} />
        </a>
      </div>
    </section>
  );
}
