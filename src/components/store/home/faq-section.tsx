"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(0);
  return (
<section className="[display:grid] [grid-template-columns:38%_62%] [padding:130px_12vw] [gap:10vw] max-[960px]:[display:block] max-[960px]:[padding:90px_24px]">
        <div>
          <p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">
            Questions, answered
          </p>
          <h2 className="[margin:0] [font:400_clamp(37px,_4vw,_60px)/1.06_var(--serif)] [letter-spacing:-.055em]">
            A little clarity.
          </h2>
        </div>
        <div className="[border-top:1px_solid_var(--line)] max-[960px]:[margin-top:55px]">
          {[
            "Where do you ship?",
            "How long will my order take?",
            "Can I return or exchange an item?",
            "How do I care for my Right Intent pieces?",
          ].map((question, index) => (
            <div
              className={`${activeFaq === index ? "faq-item active" : "faq-item"} [border-bottom:1px_solid_var(--line)] [&_button]:[width:100%] [&_button]:[display:flex] [&_button]:[justify-content:space-between] [&_button]:[padding:23px_0] [&_button]:[text-align:left] [&_button]:[font:15px_var(--serif)] [&_p]:[max-width:480px] [&_p]:[margin:-5px_0_25px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_p]:[line-height:1.7]`}
              key={question}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
              >
                <span>{question}</span>
                {activeFaq === index ? <Minus size={18} /> : <Plus size={18} />}
              </button>
              {activeFaq === index && (
                <p>
                  {
                    [
                      "We currently ship across India. International shipping is coming soon.",
                      "Most orders arrive within 3-5 business days. We will send tracking as soon as your order leaves us.",
                      "Yes. Reach out within 7 days of delivery and we will take care of the rest.",
                      "Each product arrives with a care card. When in doubt, use less water and more love.",
                    ][index]
                  }
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
  );
}
