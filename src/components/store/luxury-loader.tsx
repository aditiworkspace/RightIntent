"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function LuxuryLoader({ isFullPage = true }: { isFullPage?: boolean }) {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const start = Date.now();
    const duration = 1200; // 1.2s smooth luxury pacing

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden flex flex-col items-center justify-center select-none text-[var(--ink)] ${
        isFullPage
          ? "min-h-screen fixed inset-0 z-[100] bg-[#faf8f4]"
          : "min-h-[65vh] py-16 bg-[#faf8f4]"
      }`}
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #ffffff 0%, #faf6ef 55%, #f2eae0 100%)",
      }}
      role="status"
      aria-label="Loading Right Intent"
    >
      {/* Precision Hairline Architectural Folio Marks */}
      {isFullPage && (
        <div
          className="absolute inset-4 sm:inset-8 border border-[rgba(28,38,34,0.08)] rounded-2xl pointer-events-none"
          aria-hidden="true"
        >
          {/* Subtle corner crosshairs */}
          <span className="absolute -top-1.5 -left-1.5 text-[rgba(28,38,34,0.3)] font-mono text-[10px] leading-none">+</span>
          <span className="absolute -top-1.5 -right-1.5 text-[rgba(28,38,34,0.3)] font-mono text-[10px] leading-none">+</span>
          <span className="absolute -bottom-1.5 -left-1.5 text-[rgba(28,38,34,0.3)] font-mono text-[10px] leading-none">+</span>
          <span className="absolute -bottom-1.5 -right-1.5 text-[rgba(28,38,34,0.3)] font-mono text-[10px] leading-none">+</span>

          {/* Architectural Folio Labels */}
          <div className="hidden sm:flex justify-between items-center p-4 text-[8.5px] font-[family-name:var(--mono)] tracking-[0.24em] uppercase text-[var(--muted)] opacity-70">
            <span>01 / Right Intent</span>
            <span>Archival Living · Atelier</span>
          </div>
          <div className="hidden sm:flex justify-between items-center p-4 absolute bottom-0 inset-x-0 text-[8.5px] font-[family-name:var(--mono)] tracking-[0.24em] uppercase text-[var(--muted)] opacity-70">
            <span>Handmade with care in India</span>
            <span>MMXXVI · Edition I</span>
          </div>
        </div>
      )}

      {/* Atmospheric Warm Golden Ambient Light */}
      <div
        className="absolute w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] rounded-full bg-[radial-gradient(circle,rgba(214,175,55,0.16)_0%,rgba(187,98,73,0.06)_45%,transparent_70%)] animate-candle-glow pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Minimalist Haute-Couture Showcase */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-lg">
        {/* The Golden RI Crest (Clean, unencumbered by spinners) */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-5 flex items-center justify-center animate-emblem-float">
          <Image
            src="/right-intent-gold-logo.png"
            alt="Right Intent"
            fill
            priority
            className="object-contain drop-shadow-[0_12px_24px_rgba(28,38,34,0.14)] drop-shadow-[0_2px_8px_rgba(187,98,73,0.12)]"
          />
        </div>

        {/* Brand Wordmark with Smooth Letter-Spacing Expansion */}
        <h1 className="m-0 font-[family-name:var(--serif)] text-[22px] sm:text-[28px] font-normal uppercase text-[var(--ink)] animate-tracking-expand leading-none">
          Right Intent
        </h1>

        {/* Minimalist Subtitle */}
        <p className="mt-2.5 mb-5 font-[family-name:var(--mono)] text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[var(--terra)] font-light">
          Build with purpose
        </p>

        {/* The 1px Hairline Golden Progress Track */}
        <div className="relative w-48 sm:w-60 h-[1.5px] bg-[rgba(28,38,34,0.08)] rounded-full overflow-hidden my-1">
          <div
            className="h-full bg-gradient-to-r from-[var(--terra)] via-[#d4af37] to-[var(--terra)] rounded-full transition-all duration-150 ease-out shadow-[0_0_8px_rgba(187,98,73,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Haute Couture Numeric Counter */}
        <div className="flex items-center justify-center gap-3 mt-3 font-[family-name:var(--mono)] text-[10px] tracking-[0.24em] text-[var(--muted)]">
          <span className="text-[var(--terra)] font-medium">
            {progress < 10 ? `00${progress}` : progress < 100 ? `0${progress}` : progress}%
          </span>
          <span className="opacity-40">/</span>
          <span className="opacity-60 text-[9px]">100%</span>
        </div>

        {/* Quiet Brand Manifesto Line */}
        <p className="mt-4 m-0 font-[family-name:var(--sans)] text-[12px] text-[var(--muted)] tracking-wide font-light">
          Objects and tools to bring meaning to the everyday.
        </p>
      </div>
    </div>
  );
}
