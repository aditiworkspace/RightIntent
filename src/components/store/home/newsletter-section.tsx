"use client";

import { ArrowRight } from "lucide-react";

export function NewsletterSection() {
  return (
<section
        className={`
        [padding:120px_15px] [color:var(--paper)] [text-align:center] [background:var(--terra)]
        [&_.eyebrow]:[color:#f0d4c9] [&_h2]:[font-size:55px] [&_p:not(.eyebrow)]:[margin:24px_0_30px]
        [&_p:not(.eyebrow)]:[font-size:13px] [&_form]:[max-width:440px] [&_form]:[height:49px]
        [&_form]:[display:flex] [&_form]:[margin:auto] [&_form]:[background:var(--paper)]
        [&_input]:[min-width:0] [&_input]:[flex:1] [&_input]:[padding:0_17px]
        [&_input]:[color:var(--ink)] [&_input]:[border:0] [&_input]:[outline:0]
        [&_input]:[background:transparent] [&_input]:[font-size:12px] [&_.button]:[height:49px]
        max-[960px]:[padding:90px_24px] max-[960px]:[&_h2]:[font-size:47px]
        max-[960px]:[&_form]:[height:auto] max-[960px]:[&_form]:[flex-direction:column]
        max-[960px]:[&_form]:[gap:9px] max-[960px]:[&_form]:[background:transparent]
        max-[960px]:[&_input]:[height:49px] max-[960px]:[&_input]:[background:var(--paper)]
      `}
      >
        <p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">
          The Right Intent letter
        </p>
        <h2 className="[margin:0] [font:400_clamp(37px,_4vw,_60px)/1.06_var(--serif)] [letter-spacing:-.055em]">
          Good things,
          <br />
          <em className="[color:var(--terra)] [font-style:italic]">
            in your inbox.
          </em>
        </h2>
        <p>New pieces, studio notes, and a little beauty for your week.</p>
        <form onSubmit={(event) => event.preventDefault()}>
          <input
            type="email"
            aria-label="Email address"
            placeholder="Your email address"
            required
            className={`
              [min-height:44px] [padding:0_12px] [border:1px_solid_var(--line)] [border-radius:0]
              [outline-color:var(--terra)] [background:transparent] [color:var(--ink)] [font:13px_var(--sans)]
              [text-transform:none]
            `}
          />
          <button
            type="submit"
            className={`
              button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center]
              [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em]
              [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease]
              [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]
            `}
          >
            Join us <ArrowRight size={16} />
          </button>
        </form>
      </section>
  );
}
