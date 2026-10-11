import { Heart } from "lucide-react";
import { RouteNav, RoutePage } from "@/components/store/route-page";
import { ContinueLink } from "@/components/store/product-tile";

export default function WishlistPage() {
  return <><RouteNav /><RoutePage eyebrow="Saved for later" title="Your wishlist" description="Save pieces you love and come back to them when the time is right."><div className="[min-height:350px] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [padding:40px] [text-align:center] [background:var(--cream)] [&_h2]:[margin:20px_0_5px] [&_h2]:[font-size:30px] [&_p]:[margin:0_0_25px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px]"><Heart size={32} /><h2 className="[margin:0] [font:400_clamp(37px,_4vw,_60px)/1.06_var(--serif)] [letter-spacing:-.055em]">Nothing saved yet.</h2><p>There is always room for one more beautiful thing.</p><ContinueLink href="/products">Explore the edit</ContinueLink></div></RoutePage></>;
}
