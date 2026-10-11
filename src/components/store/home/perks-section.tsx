export function PerksSection() {
  return (
<section
        className={`
        [display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:50px] [padding:100px_10vw]
        [border-bottom:1px_solid_var(--line)] [&_strong]:[display:block]
        [&_strong]:[font:21px_var(--serif)] [&_p]:[max-width:220px] [&_p]:[margin:10px_0_0]
        [&_p]:[color:var(--muted)] [&_p]:[font-size:12px] [&_p]:[line-height:1.6]
        max-[960px]:[grid-template-columns:1fr] max-[960px]:[gap:38px] max-[960px]:[padding:75px_24px]
      `}
      >
        <div>
          <span className="[display:block] [margin-bottom:37px] [font:10px_var(--mono)] [color:var(--terra)] max-[960px]:[margin-bottom:15px]">
            01
          </span>
          <strong>Made with intention</strong>
          <p>Small batches, considered materials, no shortcuts.</p>
        </div>
        <div>
          <span className="[display:block] [margin-bottom:37px] [font:10px_var(--mono)] [color:var(--terra)] max-[960px]:[margin-bottom:15px]">
            02
          </span>
          <strong>Easy, always</strong>
          <p>Free shipping over Rs. 2,000 and simple returns.</p>
        </div>
        <div>
          <span className="[display:block] [margin-bottom:37px] [font:10px_var(--mono)] [color:var(--terra)] max-[960px]:[margin-bottom:15px]">
            03
          </span>
          <strong>Here to help</strong>
          <p>Real people, thoughtful answers. hello@rightintent.world</p>
        </div>
      </section>
  );
}
