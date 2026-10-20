"use client";

import { useState } from "react";
import { Minus, Plus, Sparkles } from "lucide-react";

const FAQS = [
  {
    q: "Where do you ship?",
    a: "We currently ship across all major pin codes in India. Express shipping typically arrives within 3-5 business days.",
  },
  {
    q: "How long will my order take?",
    a: "Orders placed before 2 PM IST are processed the same day. Tracking details are automatically emailed and messaged to you.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "Yes. Reach out within 7 days of delivery and our support team will coordinate an easy return or exchange.",
  },
  {
    q: "How do I care for my Right Intent pieces?",
    a: "Each notebook and journal is crafted with archival-grade paper and bound with cotton/linen cloth. Store in a dry, calm space.",
  },
];

export function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-[6vw] max-w-6xl mx-auto scroll-reveal">
      <div className="grid grid-cols-1 md:grid-cols-[35%_65%] gap-6 md:gap-12 items-start">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={11} className="text-[var(--terra)]" />
            <p className="eyebrow m-0 font-[family-name:var(--mono)] text-[9.5px] uppercase tracking-[0.16em] text-[var(--muted)] font-semibold">
              Questions, answered
            </p>
          </div>
          <h2 className="m-0 font-[family-name:var(--serif)] text-[clamp(28px,3.2vw,40px)] font-normal leading-[1.08] tracking-[-0.04em] text-[var(--ink)]">
            A little clarity.
          </h2>
          <p className="mt-3 text-[12.5px] text-[var(--muted)] leading-relaxed max-w-[260px] font-[family-name:var(--sans)]">
            Everything you need to know about our craft, orders, and delivery.
          </p>
        </div>

        <div className="border-t border-[var(--line)]">
          {FAQS.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={faq.q}
                className="border-b border-[var(--line)] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between py-4 text-left font-[family-name:var(--serif)] text-[16px] text-[var(--ink)] hover:text-[var(--terra)] transition-colors cursor-pointer"
                >
                  <span className="font-normal">{faq.q}</span>
                  <div
                    className={`w-6 h-6 rounded-full border border-[rgba(28,38,34,0.15)] flex items-center justify-center shrink-0 ml-4 transition-transform duration-200 ${
                      isOpen ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "text-[var(--ink)]"
                    }`}
                  >
                    {isOpen ? <Minus size={12} /> : <Plus size={12} />}
                  </div>
                </button>
                {isOpen && (
                  <p className="m-0 pb-4 text-[12.5px] leading-relaxed text-[var(--muted)] font-[family-name:var(--sans)] animate-fade-in max-w-xl">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
