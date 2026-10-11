import { ArrowRight } from "lucide-react";

export function JournalSection() {
  return (
<section
        className="[display:grid] [grid-template-columns:55%_45%] [min-height:570px] [background:#d9c8b6] max-[960px]:[display:flex] max-[960px]:[flex-direction:column]"
        id="journal"
      >
        <div
          className="[background:url('https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=85')_center/cover]"
          role="img"
          aria-label="A still life of Right Intent objects and flowers"
        />
        <div
          className={`
          [padding:10vw_8vw] [display:flex] [flex-direction:column] [align-items:flex-start]
          [justify-content:center] [&_h2]:[font-size:52px] [&_p:not(.eyebrow)]:[max-width:280px]
          [&_p:not(.eyebrow)]:[margin:28px_0] [&_p:not(.eyebrow)]:[color:var(--muted)]
          [&_p:not(.eyebrow)]:[font-size:14px] [&_p:not(.eyebrow)]:[line-height:1.7]
          max-[960px]:[&_h2]:[font-size:46px]
        `}
        >
          <p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">
            From the journal
          </p>
          <h2 className="[margin:0] [font:400_clamp(37px,_4vw,_60px)/1.06_var(--serif)] [letter-spacing:-.055em]">
            The art of
            <br />
            <em className="[color:var(--terra)] [font-style:italic]">
              setting a table.
            </em>
          </h2>
          <p>
            A few small ways to make an ordinary meal feel like an occasion,
            without waiting for one.
          </p>
          <a
            className={`
              button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center]
              [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em]
              [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease]
              [&:hover]:[transform:translateY(-2px)] [border:1px_solid_var(--ink)]
            `}
            href="#journal"
          >
            Read the note <ArrowRight size={16} />
          </a>
        </div>
      </section>
  );
}
