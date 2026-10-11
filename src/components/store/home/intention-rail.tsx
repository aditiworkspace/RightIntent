import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function IntentionRail() {
  return (
<section
        className={`
          [display:grid] [grid-template-columns:repeat(5,_1fr)] [min-height:300px] [padding:14px_3.5vw]
          [background:#f7ead8] [border-bottom:1px_solid_var(--line)] [&_a]:[display:grid]
          [&_a]:[grid-template-columns:minmax(0,_1fr)_auto] [&_a]:[align-content:center]
          [&_a]:[align-items:center] [&_a]:[gap:6px_12px] [&_a]:[padding:16px_26px]
          [&_a]:[border-right:1px_solid_rgba(28,_38,_34,_.13)] [&_a:last-child]:[border-right:0]
          [&_i]:[grid-column:1] [&_i]:[grid-row:1] [&_i]:[width:100px] [&_i]:[height:100px]
          [&_i]:[border-radius:12px] [&_span]:[grid-column:1] [&_span]:[color:var(--terra)]
          [&_span]:[font:9px_var(--mono)] [&_span]:[letter-spacing:.16em]
          [&_strong]:[grid-column:1] [&_strong]:[font:400_17px/1.12_var(--serif)]
          [&_svg]:[grid-column:2] [&_svg]:[grid-row:3] [&_svg]:[align-self:center] [&_svg]:[width:27px]
          [&_svg]:[height:27px] [&_svg]:[padding:6px] [&_svg]:[border:1px_solid_rgba(28,_38,_34,_.3)]
          [&_svg]:[border-radius:50%] max-[960px]:[grid-template-columns:repeat(2,_1fr)]
          max-[960px]:[min-height:0] max-[960px]:[padding:10px_12px]
          max-[960px]:[&_a]:[min-height:115px] max-[960px]:[&_a]:[padding:14px_12px]
          max-[960px]:[&_a]:[grid-template-columns:62px_1fr_auto]
          max-[960px]:[&_i]:[grid-column:1] max-[960px]:[&_i]:[grid-row:1_/_span_2]
          max-[960px]:[&_i]:[width:62px] max-[960px]:[&_i]:[height:64px]
          max-[960px]:[&_span]:[grid-column:2] max-[960px]:[&_strong]:[grid-column:2]
          max-[960px]:[&_svg]:[grid-column:3] max-[960px]:[&_svg]:[grid-row:1_/_span_2]
          max-[960px]:[&_a:nth-child(2n)]:[border-right:0] max-[960px]:[&_strong]:[font-size:15px]
          [&_.rail-thumb]:[border-radius:11px] [&_.rail-thumb]:[background-position:center]
          [&_.rail-thumb]:[background-size:cover]
          [&_.rail-thumb]:[box-shadow:0_6px_12px_rgba(42,_35,_25,_.12)]
          max-[960px]:[display:flex] max-[960px]:[overflow-x:auto] max-[960px]:[scroll-snap-type:x_mandatory]
          max-[960px]:[overscroll-behavior-x:contain] max-[960px]:[scrollbar-width:none]
          max-[960px]:[padding:10px_14px] max-[960px]:[gap:8px]
          max-[960px]:[&::-webkit-scrollbar]:[display:none]
          max-[960px]:[&_a]:[width:248px] max-[960px]:[&_a]:[min-width:248px]
          max-[960px]:[&_a]:[min-height:92px] max-[960px]:[&_a]:[scroll-snap-align:start]
          max-[960px]:[&_a]:[border-right:1px_solid_rgba(28,_38,_34,_.13)]
          max-[960px]:[&_a:last-child]:[border-right:0]
          max-[960px]:[&_i]:[width:58px] max-[960px]:[&_i]:[height:58px]
          max-[960px]:[&_strong]:[font-size:14px]
        `}
        aria-label="Shop by intention"
      >
        <Link href="/category/objects">
          <i className="rail-thumb [background-image:url('https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=240&q=80')] [background-color:#d8c6aa]" />
          <span>PLAN</span>
          <strong>
            Planners &<br />
            to-do lists
          </strong>
          <ArrowRight size={15} />
        </Link>
        <Link href="/category/objects">
          <i className="rail-thumb [background-image:url('https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=240&q=80')] [background-color:#e0c9bf]" />
          <span>REFLECT</span>
          <strong>
            Journals &<br />
            guided prompts
          </strong>
          <ArrowRight size={15} />
        </Link>
        <Link href="/category/objects">
          <i className="rail-thumb [background-image:url('https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=240&q=80')] [background-color:#2d302c]" />
          <span>THE CHALLENGE</span>
          <strong>
            Intelligent Trader
            <br />
            100-day journal
          </strong>
          <ArrowRight size={15} />
        </Link>
        <Link href="/category/objects">
          <i className="rail-thumb [background-image:url('https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=240&q=80')] [background-color:#d7c6a8]" />
          <span>BUILD</span>
          <strong>
            Habit trackers
            <br />& challenge kits
          </strong>
          <ArrowRight size={15} />
        </Link>
        <Link href="/products">
          <i className="rail-thumb [background-image:url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=240&q=80')] [background-color:#b98e64]" />
          <span>GIFT</span>
          <strong>
            New year &<br />
            curated boxes
          </strong>
          <ArrowRight size={15} />
        </Link>
      </section>
  );
}
