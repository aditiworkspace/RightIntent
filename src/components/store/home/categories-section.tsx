import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/products";

export function CategoriesSection() {
  return (
<section
        className="[padding:0_5vw_140px] [background:var(--cream)] [padding-top:115px] max-[960px]:[padding:0_20px_90px] max-[960px]:[padding-top:80px]"
        id="categories"
      >
        <div
          className={`
          [display:flex] [justify-content:space-between] [align-items:end] [margin-bottom:39px]
          [&_.eyebrow]:[margin-bottom:13px] [&_h2]:[font-size:44px] max-[960px]:[align-items:start]
          max-[960px]:[flex-direction:column] max-[960px]:[gap:22px] max-[960px]:[&_h2]:[font-size:38px]
        `}
        >
          <div>
            <p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">
              Find your ritual
            </p>
            <h2 className="[margin:0] [font:400_clamp(37px,_4vw,_60px)/1.06_var(--serif)] [letter-spacing:-.055em]">
              Shop by feeling
            </h2>
          </div>
          <p className="[margin:0] [color:var(--muted)] [font-size:13px] [line-height:1.7] [text-align:right] max-[960px]:[text-align:left]">
            For slow mornings, generous tables
            <br />
            and everything in between.
          </p>
        </div>
        <div className="[display:grid] [grid-template-columns:1.15fr_.85fr_.85fr] [gap:17px] max-[960px]:[grid-template-columns:1fr] max-[960px]:[gap:11px]">
          {categories.map((category) => (
            <Link
              className={`
                [height:410px] [display:flex] [align-items:end] [background-position:center]
                [background-size:cover] [&:first-child]:[height:470px] max-[960px]:[height:300px]
                max-[960px]:[&:first-child]:[height:300px]
              `}
              href={`/category/${category.name.toLowerCase()}`}
              key={category.name}
              style={{ backgroundImage: `url(${category.image})` }}
            >
              <div
                className={`
                [width:100%] [padding:26px] [display:grid] [grid-template-columns:1fr_auto] [align-items:end]
                [color:var(--paper)] [background:linear-gradient(transparent,_rgba(18,_23,_20,_.78))]
                [&_span]:[grid-column:1_/_-1] [&_span]:[margin-bottom:8px] [&_span]:[font:9px_var(--mono)]
                [&_span]:[text-transform:uppercase] [&_strong]:[font:400_27px_var(--serif)]
              `}
              >
                <span>{category.count}</span>
                <strong>{category.name}</strong>
                <ArrowRight size={19} />
              </div>
            </Link>
          ))}
        </div>
      </section>
  );
}
