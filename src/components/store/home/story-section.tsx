import { ArrowRight } from "lucide-react";

export function StorySection() {
  return (
<section
        className="[display:grid] [grid-template-columns:1fr_1fr] [min-height:690px] max-[960px]:[display:flex] max-[960px]:[flex-direction:column]"
        id="story"
      >
        <div
          className="[background:url('https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=85')_center/cover] max-[960px]:[min-height:390px]"
          role="img"
          aria-label="Hands shaping a handcrafted ceramic object"
        />
        <div
          className={`
          [display:flex] [flex-direction:column] [align-items:flex-start] [justify-content:center]
          [padding:10vw] [background:var(--ink)] [color:var(--paper)] [&_.eyebrow]:[color:#aab5a9]
          [&_h2]:[font-size:53px] [&_p:not(.eyebrow)]:[max-width:360px]
          [&_p:not(.eyebrow)]:[margin:32px_0] [&_p:not(.eyebrow)]:[color:#bac0b7]
          [&_p:not(.eyebrow)]:[font-size:14px] [&_p:not(.eyebrow)]:[line-height:1.8]
          [&_.text-link]:[border-color:var(--paper)] max-[960px]:[padding:75px_24px]
          max-[960px]:[&_h2]:[font-size:46px]
        `}
        >
          <p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">
            Right Intent / noun
          </p>
          <h2 className="[margin:0] [font:400_clamp(37px,_4vw,_60px)/1.06_var(--serif)] [letter-spacing:-.055em]">
            For the things
            <br />
            <em className="[color:var(--terra)] [font-style:italic]">
              that make a place.
            </em>
          </h2>
          <p>
            Named for the boundless sky, Right Intent is an invitation to make space
            for beauty in its most honest form. We work with makers who care
            about the marks of the hand, natural materials, and objects that get
            better with use.
          </p>
          <a
            className={`
              text-link [display:inline-flex] [align-items:center] [gap:9px] [font:10px_var(--mono)]
              [text-transform:uppercase] [letter-spacing:.08em] [border-bottom:1px_solid_var(--ink)]
              [padding-bottom:6px]
            `}
            href="#journal"
          >
            Read our story <ArrowRight size={15} />
          </a>
          <div
            className={`
            [margin-top:75px] [font:16px_var(--serif)] [line-height:1.4] [&_span]:[font:9px_var(--mono)]
            [&_span]:[color:#aab5a9] [&_span]:[text-transform:uppercase] [&_span]:[letter-spacing:.1em]
          `}
          >
            Right Intent, always
            <br />
            <span>Made in India</span>
          </div>
        </div>
      </section>
  );
}
