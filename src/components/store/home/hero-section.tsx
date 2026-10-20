import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, PackageCheck, Sparkles, Truck } from "lucide-react";
import type { ReactNode } from "react";

// Static data lives at module scope, so it isn't re-created on every render
const FEATURES = [
  { Icon: Sparkles, lead: "Thoughtfully", rest: "designed" },
  { Icon: Truck, lead: "Ships across", rest: "India" },
  { Icon: PackageCheck, lead: "Beautiful", rest: "packaging" },
  { Icon: Heart, lead: "Small batch", rest: "made with care" },
] as const;

// The two handwritten notes share all of their styling except position/colour
function HandNote({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute z-[3] hidden font-[family-name:var(--brand-serif)] font-medium italic leading-[1.05] min-[961px]:block ${className}`}
    >
      {children}
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative block min-h-[460px] overflow-hidden max-[960px]:flex max-[960px]:min-h-0 max-[960px]:flex-col"
    >
      {/* Content column */}
      <div className="relative z-[1] flex min-h-[460px] w-[min(52%,680px)] flex-col items-start bg-[linear-gradient(90deg,rgba(244,240,233,.98)_0%,rgba(244,240,233,.94)_73%,rgba(244,240,233,0)_100%)] px-[clamp(28px,7.5vw,120px)] pb-[52px] pt-[70px] max-[960px]:min-h-0 max-[960px]:w-full max-[960px]:bg-[linear-gradient(90deg,rgba(244,240,233,.48),rgba(244,240,233,.3))] max-[960px]:px-5 max-[960px]:pb-4 max-[960px]:pt-5">
        <p className="eyebrow mb-[21px] font-[family-name:var(--mono)] text-[14px] uppercase tracking-[.14em] text-[color:var(--muted)] max-[960px]:mb-2.5 max-[960px]:text-[10px]">
          The Right Intent
        </p>

        <h1 className="m-0 font-[family-name:var(--serif)] text-[clamp(58px,5.6vw,92px)] font-normal leading-[.98] tracking-[-.06em] max-[960px]:text-[clamp(38px,10.5vw,52px)]">
          For a more
          <br />
          <em className="italic text-[color:var(--terra)]">intentional</em>
          <br />
          you.
        </h1>

        <p className="mb-[34px] mt-[30px] max-w-[380px] text-[15px] leading-[1.7] text-[color:var(--muted)] max-[960px]:mb-3.5 max-[960px]:mt-2.5 max-[960px]:max-w-[320px] max-[960px]:text-xs max-[960px]:leading-normal">
          Journals, planners and thoughtful tools to help you build with purpose.
        </p>

        <div className="flex items-center gap-[26px] max-[960px]:gap-3.5 max-[360px]:gap-2">
          <Link
            href="/products"
            className="button inline-flex min-h-[46px] items-center justify-center gap-[15px] whitespace-nowrap bg-[color:var(--ink)] px-[21px] font-[family-name:var(--mono)] text-[10px] uppercase tracking-[.08em] text-[#f4f0e9] transition-[transform,background-color] duration-[250ms] ease-[ease] hover:-translate-y-0.5 max-[960px]:min-h-10 max-[960px]:gap-2 max-[960px]:px-3 max-[960px]:text-[9px] max-[360px]:gap-[5px] max-[360px]:px-[9px]"
          >
            Explore the collection <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a
            href="#story"
            className="text-link inline-flex items-center gap-[9px] border-b border-[color:var(--ink)] pb-1.5 font-[family-name:var(--mono)] text-[10px] uppercase tracking-[.08em] max-[360px]:gap-[5px] max-[360px]:text-[9px]"
          >
            Our story <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>

        {/* Feature strip: desktop only */}
        <div className="mt-auto grid w-full max-w-[470px] grid-cols-4 gap-2 pt-[35px] text-[10px] leading-[1.35] text-[#4e554d] max-[960px]:hidden">
          {FEATURES.map(({ Icon, lead, rest }) => (
            <div
              key={lead}
              className="flex min-h-[58px] items-center gap-[9px] border border-[rgba(30,38,33,.1)] bg-white/[.34] px-[9px] py-2 shadow-[0_8px_20px_rgba(42,37,30,.045)]"
            >
              <Icon
                size={17}
                strokeWidth={1.6}
                aria-hidden="true"
                className="shrink-0 text-[color:var(--terra)]"
              />
              <p className="m-0">
                <strong className="block font-[family-name:var(--mono)] text-[10px] font-normal tracking-[.03em] text-[color:var(--ink)]">
                  {lead}
                </strong>{" "}
                {rest}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Background art */}
      <div className="absolute inset-0 bg-[color:var(--paper)]">
        <Image
          src="/aditi-hero-intent.png"
          alt="Right Intent journals and intentional living collection"
          fill
          priority
          sizes="100vw"
          className="object-contain object-right max-[960px]:object-cover max-[960px]:object-[64%_center]"
        />
        {/* Soft left-edge shade over the image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,38,33,.06),transparent_30%)]"
        />

        <HandNote className="left-[33%] top-[72px] max-w-[240px] -rotate-[5deg] text-[20px] text-[#493b31] [text-shadow:0_1px_1px_rgba(255,248,236,.55)]">
          Not just notebooks,
          <br />
          Tools for a better you.
          <svg
            aria-hidden="true"
            viewBox="0 0 58 50"
            fill="none"
            className="pointer-events-none absolute left-[50px] top-[58px] h-[42px] w-[58px] overflow-visible"
          >
            <path d="M2 1C1 14 5 27 18 35C26 40 34 40 43 39" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
            <path d="M36 32C38 35 41 38 44 39C41 41 38 43 36 46" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </HandNote>

        <HandNote className="bottom-6 right-[3%] max-w-[190px] -rotate-[7deg] text-[16px] text-[#fff6e8] [text-shadow:0_1px_2px_rgba(39,25,15,.5)]">
          Tools for
          <br />
          your everyday
          <br />
          rituals
          <svg
            aria-hidden="true"
            viewBox="0 0 48 37"
            fill="none"
            className="pointer-events-none absolute -right-6 bottom-0 h-[37px] w-12 overflow-visible"
          >
            <path d="M1 31C12 20 24 16 39 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M32 9C34 11 37 13 40 15C38 18 37 21 37 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </HandNote>
      </div>
    </section>
  );
}
