"use client";

import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3500);
  };

  return (
    <section className="py-9 sm:py-11 px-4 text-center bg-[var(--terra)] text-[var(--paper)] scroll-reveal">
      <div className="max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs font-[family-name:var(--mono)] text-[9px] uppercase tracking-[0.16em] text-[#faeae3] mb-3">
          <Sparkles size={10} /> The Right Intent Letter
        </div>

        <h2 className="m-0 font-[family-name:var(--serif)] text-[clamp(26px,3vw,38px)] font-normal leading-[1.1] tracking-[-0.03em] text-white">
          Good things, in your inbox.
        </h2>

        <p className="mt-2 mb-5 text-[12.5px] text-[#fbebe4] max-w-sm mx-auto font-[family-name:var(--sans)]">
          New pieces, studio notes, and a little beauty for your week.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex items-center max-w-md mx-auto rounded-xl bg-white p-1 shadow-lg"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            aria-label="Email address"
            className="flex-1 min-w-0 px-3.5 py-2 text-base sm:text-[12.5px] text-[var(--ink)] bg-transparent border-0 outline-none placeholder:text-[var(--muted)] font-[family-name:var(--sans)]"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--ink)] text-white font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider font-semibold hover:bg-[var(--ink)]/90 transition-all active:scale-95 shrink-0"
          >
            {subscribed ? (
              <>
                <Check size={13} /> Joined
              </>
            ) : (
              <>
                Join <ArrowRight size={13} />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
