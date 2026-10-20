import { Heart } from "lucide-react";
import { RouteNav, RoutePage } from "@/components/store/route-page";
import { ContinueLink } from "@/components/store/product-tile";

export default function WishlistPage() {
  return (
    <>
      <RouteNav />
      <RoutePage
        eyebrow="Saved For Later"
        title="Your Wishlist"
        description="A private space to keep the artifacts that speak to you, ready when you are."
      >
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white/60 border border-[var(--line)] shadow-sm max-w-[680px] mx-auto">
          <div className="w-16 h-16 rounded-full bg-[rgba(187,98,73,0.1)] flex items-center justify-center text-[var(--terra)] mb-5">
            <Heart size={28} />
          </div>
          <h2 className="m-0 font-[family-name:var(--serif)] text-[clamp(28px,3vw,38px)] font-normal tracking-tight text-[var(--ink)]">
            Your collection is waiting to begin.
          </h2>
          <p className="max-w-[400px] mt-3 mb-6 text-[14px] leading-relaxed text-[var(--muted)]">
            Explore our crafted journals, planners, and everyday essentials. When something resonates, click the heart icon to curate your personal edit.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ContinueLink href="/products">Explore the edit</ContinueLink>
          </div>
        </div>
      </RoutePage>
    </>
  );
}
