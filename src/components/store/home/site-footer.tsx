import { ArrowRight, Gem, Heart, Mail, Star, Truck, Users } from "lucide-react";
import { BrandLogo } from "@/components/store/brand-logo";

const footerLinks = [
  { heading: "Shop", links: ["Shop all", "New arrivals", "Best sellers", "Collections", "Gift sets"] },
  { heading: "About", links: ["Our story", "Our values", "Craftsmanship", "Sustainability", "Journal"] },
  { heading: "Help", links: ["Shipping & returns", "Payments", "Track your order", "FAQs", "Contact us"] },
];

const communityStats = [
  { value: "1000+", label: "Happy builders", icon: Users },
  { value: "4.9 ★", label: "Average rating", icon: Star },
  { value: "20K+", label: "Community strong", icon: Heart },
  { value: "India", label: "Ships across", icon: Truck },
];

const socialChannels = [
  {
    label: "Instagram",
    path: "M7.8 2h8.4A5.81 5.81 0 0 1 22 7.8v8.4a5.81 5.81 0 0 1-5.8 5.8H7.8A5.81 5.81 0 0 1 2 16.2V7.8A5.81 5.81 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7.25A4.75 4.75 0 1 1 12 16.75 4.75 4.75 0 0 1 12 7.25Zm0 2A2.75 2.75 0 1 0 12 14.75 2.75 2.75 0 0 0 12 9.25Z",
  },
  {
    label: "Twitter",
    path: "M17.63 3h3.17l-6.92 7.91L22 21h-6.35l-4.97-6.5L5 21H1.82l7.4-8.46L1.45 3h6.51l4.49 5.93L17.63 3Zm-1.11 16.22h1.76L7 4.69H5.11l11.41 14.53Z",
  },
  {
    label: "YouTube",
    path: "M21.58 7.19a2.74 2.74 0 0 0-1.93-1.94C17.95 4.8 12 4.8 12 4.8s-5.95 0-7.65.45a2.74 2.74 0 0 0-1.93 1.94A28.55 28.55 0 0 0 2 12a28.55 28.55 0 0 0 .42 4.81 2.74 2.74 0 0 0 1.93 1.94c1.7.45 7.65.45 7.65.45s5.95 0 7.65-.45a2.74 2.74 0 0 0 1.93-1.94A28.55 28.55 0 0 0 22 12a28.55 28.55 0 0 0-.42-4.81ZM10 15.2V8.8l5.2 3.2L10 15.2Z",
  },
  {
    label: "Facebook",
    path: "M14.2 8.2V6.75c0-.7.35-1.05 1.13-1.05H17V2.4c-.74-.1-1.48-.16-2.23-.16-2.27 0-3.82 1.38-3.82 3.9V8.2H8.38v3.68h2.57V22h4.01V11.88h2.73l.43-3.68H14.2Z",
  },
  {
    label: "LinkedIn",
    path: "M6.94 8.97H3.25V20h3.69V8.97ZM5.09 3.5A2.14 2.14 0 1 0 5.1 7.78 2.14 2.14 0 0 0 5.09 3.5ZM20.75 20h-3.68v-5.36c0-1.28-.02-2.92-1.78-2.92-1.78 0-2.05 1.39-2.05 2.82V20H9.56V8.97h3.53v1.51h.05a3.87 3.87 0 0 1 3.48-1.91c3.72 0 4.41 2.45 4.41 5.64V20h-.28Z",
  },
];

export function SiteFooter() {
  return (
    <footer className="[position:relative] [overflow:hidden] [background:#0d241b] [color:#f4f0e9] max-[960px]:[padding-bottom:calc(76px_+_env(safe-area-inset-bottom))]">
      <div className="[height:2px] [background:linear-gradient(90deg,_#b65f3a,_#d78353,_#b65f3a)]" />
      <div className="[position:absolute] [left:-46px] [bottom:74px] [width:185px] [height:270px] [border:1px_solid_rgba(178,_171,_113,_.28)] [border-radius:48%_52%_0_0] [opacity:.35] [transform:rotate(27deg)]" />
      <div className="[position:absolute] [right:-72px] [bottom:-100px] [width:260px] [height:220px] [border:1px_solid_rgba(210,_114,_72,_.4)] [border-radius:65%_35%_0_0] [transform:rotate(-17deg)]" />

      <div className="[position:relative] [z-index:1] [padding:24px_3vw_0] max-[960px]:[padding:18px_20px_0]">
        <section className="[display:grid] [grid-template-columns:repeat(4,_1fr)] [border:1px_solid_rgba(204,_170,_116,_.22)] [border-radius:18px] [background:rgba(18,_39,_29,_.8)] [overflow:hidden] max-[960px]:[grid-template-columns:repeat(2,_1fr)] max-[960px]:[border-radius:14px]" aria-label="Right Intent community">
          {communityStats.map(({ value, label, icon: Icon }, index) => (
            <div className={`[display:flex] [align-items:center] [justify-content:center] [gap:14px] [min-height:96px] [padding:16px] ${index !== communityStats.length - 1 ? "[border-right:1px_solid_rgba(244,_240,_233,_.18)]" : ""} max-[900px]:[gap:10px] max-[900px]:[padding:12px] max-[960px]:[min-height:78px] max-[520px]:[justify-content:flex-start] ${index < 2 ? "max-[960px]:[border-bottom:1px_solid_rgba(244,_240,_233,_.18)]" : ""} ${index % 2 === 1 ? "max-[960px]:[border-right:0]" : ""}`} key={label}>
              <span className="[display:grid] [place-items:center] [width:56px] [height:56px] [flex:0_0_auto] [border-radius:50%] [background:linear-gradient(135deg,_rgba(174,_95,_53,_.62),_rgba(99,_64,_38,_.68))] [border:1px_solid_rgba(225,_168,_112,_.25)] [color:#f5ba8b] max-[900px]:[width:48px] max-[900px]:[height:48px] max-[520px]:[width:40px] max-[520px]:[height:40px]">
                <Icon size={23} strokeWidth={1.55} className="max-[900px]:[width:20px] max-[520px]:[width:17px]" aria-hidden="true" />
              </span>
              <p className="[margin:0]">
                <strong className="[display:block] [font:400_25px/1_var(--serif)] [color:#f5f0e5] max-[900px]:[font-size:22px] max-[520px]:[font-size:18px]">{value}</strong>
                <span className="[display:block] [margin-top:6px] [font:15px/1.2_var(--serif)] [color:#b9d0c6] max-[900px]:[font-size:13px] max-[520px]:[font-size:12px]">{label}</span>
              </p>
            </div>
          ))}
        </section>

        <div className="[display:grid] [grid-template-columns:minmax(250px,_.9fr)_1.7fr_minmax(300px,_1fr)] [gap:3.5vw] [padding:52px_6vw_38px] max-[1180px]:[grid-template-columns:minmax(230px,_.85fr)_1.55fr] max-[1180px]:[gap:4vw] max-[960px]:[display:block] max-[960px]:[padding:24px_4px_20px]">
          <div className="[max-width:285px]">
            <BrandLogo href="#top" />
            <span className="[display:block] [margin-top:10px] [font:8px_var(--mono)] [letter-spacing:.3em] [text-transform:uppercase] [color:#d8dfd3]">Objects with a purpose</span>
            <div className="[width:30px] [height:2px] [margin:16px_0_20px] [background:var(--terra)]" />
            <p className="[margin:0] [font:17px/1.55_var(--serif)] [color:#e2e5dc] max-[960px]:[font-size:16px]">Objects with a little soul.<br />Made in India, sent with care.</p>
            <div className="[display:flex] [flex-wrap:nowrap] [gap:8px] [margin-top:18px]">
              {socialChannels.map(({ label, path }) => (
                <a className="[display:grid] [place-items:center] [width:34px] [height:34px] [flex:0_0_34px] [border:1px_solid_rgba(225,_200,_159,_.55)] [border-radius:50%] [color:#f4f0e9] [transition:background_.2s_ease,_color_.2s_ease] hover:[background:#d0774d] hover:[color:#10251b] max-[520px]:[width:32px] max-[520px]:[height:32px] max-[520px]:[flex-basis:32px]" href="#top" aria-label={label} key={label}>
                  <svg className="[width:14px] [height:14px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <nav className="[display:grid] [grid-template-columns:repeat(3,_max-content)] [justify-content:space-between] [gap:clamp(34px,_5vw,_78px)] [padding-left:4vw] [border-left:1px_solid_rgba(244,_240,_233,_.18)] max-[1180px]:[padding-left:3vw] max-[960px]:[margin-top:22px] max-[960px]:[padding:20px_0_0] max-[960px]:[border-top:1px_solid_rgba(244,_240,_233,_.18)] max-[960px]:[border-left:0] max-[640px]:[grid-template-columns:repeat(3,_1fr)] max-[640px]:[gap:18px] max-[430px]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] max-[430px]:[gap:10px]">
            {footerLinks.map((group) => <div className="[min-width:112px] max-[640px]:[min-width:0]" key={group.heading}><h2 className="[margin:0_0_17px] [font:11px_var(--mono)] [letter-spacing:.16em] [text-transform:uppercase] [color:#f5efe4] after:[content:''] after:[display:block] after:[width:28px] after:[height:2px] after:[margin-top:9px] after:[background:var(--terra)] max-[960px]:[margin-bottom:12px] max-[960px]:[font-size:10px]">{group.heading}</h2><div className="[display:flex] [flex-direction:column] [gap:10px] max-[960px]:[gap:8px]">{group.links.map((link) => <a className="[font:14px/1.2_var(--serif)] [white-space:nowrap] [color:#d9ded4] [transition:color_.2s_ease] hover:[color:#e58a5c] max-[640px]:[font-size:12px] max-[430px]:[white-space:normal] max-[430px]:[font-size:11px]" href="#top" key={link}>{link}</a>)}</div></div>)}
          </nav>

          <section className="[border-left:1px_solid_rgba(244,_240,_233,_.18)] [padding-left:3.5vw] max-[1180px]:[grid-column:1_/_-1] max-[1180px]:[margin-top:8px] max-[1180px]:[padding:26px_0_0] max-[1180px]:[border-top:1px_solid_rgba(244,_240,_233,_.18)] max-[1180px]:[border-left:0] max-[960px]:[margin-top:20px] max-[960px]:[padding:20px_0_0]">
            <h2 className="[margin:0] [font:14px_var(--serif)] [letter-spacing:.12em] [text-transform:uppercase] [color:#eeb68c]">Stay connected</h2>
            <div className="[width:34px] [height:2px] [margin:12px_0] [background:var(--terra)] max-[960px]:[margin:8px_0]" />
            <p className="[max-width:330px] [margin:0] [font:15px/1.5_var(--serif)] [color:#c9d6ce]">Subscribe to get updates on new collections, exclusive offers and more.</p>
            <form className="[display:flex] [align-items:center] [gap:10px] [max-width:360px] [height:48px] [margin-top:20px] [padding:4px_5px_4px_16px] [border:1px_solid_rgba(225,_200,_159,_.46)] [border-radius:999px] max-[960px]:[margin-top:14px]" action="#"><Mail size={17} className="[color:#ecc399]" strokeWidth={1.5} aria-hidden="true" /><input className="[min-width:0] [flex:1] [border:0] [outline:0] [background:transparent] [color:#f4f0e9] [font:13px_var(--serif)] placeholder:[color:#8fa198]" type="email" placeholder="Enter your email" aria-label="Email address" /><button className="[display:grid] [place-items:center] [width:38px] [height:38px] [border:0] [border-radius:50%] [background:var(--terra)] [color:#fff4e7] [transition:transform_.2s_ease] hover:[transform:translateX(2px)]" type="submit" aria-label="Subscribe"><ArrowRight size={18} aria-hidden="true" /></button></form>
          </section>
        </div>

        <div className="[display:grid] [grid-template-columns:1fr_auto_1fr] [align-items:center] [gap:20px] [padding:22px_8px_25px] [border-top:1px_solid_rgba(244,_240,_233,_.28)] [color:#c2cabe] [font:10px_var(--mono)] [letter-spacing:.12em] [text-transform:uppercase] max-[960px]:[grid-template-columns:1fr] max-[960px]:[gap:10px] max-[960px]:[padding:16px_8px_18px] max-[960px]:[text-align:center]"><span>© 2026 Right Intent Home. All rights reserved.</span><span className="[display:flex] [align-items:center] [justify-content:center] [gap:12px] [color:#ded0b9]"><Gem size={17} aria-hidden="true" /> Crafted with care in India</span><span className="[text-align:right] max-[960px]:[text-align:center]">Privacy / Terms</span></div>
      </div>
    </footer>
  );
}
