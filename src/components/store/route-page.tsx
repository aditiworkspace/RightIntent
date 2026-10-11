import { AnnouncementBar } from "@/components/store/home/announcement-bar";
import { SiteHeader } from "@/components/store/home/site-header";

export function RoutePage({ eyebrow, title, description, children, className = "" }: { eyebrow: string; title: string; description?: string; children?: React.ReactNode; className?: string }) {
  return <main className={`[max-width:1240px] [margin:auto] [padding:100px_5vw_140px] max-[960px]:[padding:70px_20px_calc(88px_+_env(safe-area-inset-bottom))] ${className}`}><div className="[max-width:650px] [margin-bottom:65px] [&_h1]:[margin:0] [&_h1]:[font:400_clamp(46px,_6vw,_78px)/1_var(--serif)] [&_h1]:[letter-spacing:-.06em] [&>p:last-child]:[max-width:390px] [&>p:last-child]:[margin:25px_0_0] [&>p:last-child]:[color:var(--muted)] [&>p:last-child]:[font-size:14px] [&>p:last-child]:[line-height:1.7]"><p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">{eyebrow}</p><h1>{title}</h1>{description && <p>{description}</p>}</div>{children}</main>;
}

export function RouteNav() {
  return <div className="[position:sticky] [top:0] [z-index:50]"><AnnouncementBar /><SiteHeader cartCount={0} savedCount={0} /></div>;
}
