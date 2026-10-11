import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/profile";
import { RouteNav, RoutePage } from "@/components/store/route-page";
import { PageLoading } from "@/components/store/page-loading";

export default function AccountPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect("/login?next=/account");
  return (
    <>
      <RouteNav />
      <RoutePage
        eyebrow="Your Right Intent account"
        title={`Hello, ${profile?.fullName || "there"}.`}
        description="Keep track of your pieces, orders, and saved details."
      >
        <div className="[display:grid] [grid-template-columns:repeat(2,_1fr)] [gap:14px] [&_a]:[padding:25px] [&_a]:[border:1px_solid_var(--line)] [&_a:hover]:[border-color:var(--terra)] [&_strong]:[display:block] [&_strong]:[font:21px_var(--serif)] [&_span]:[display:block] [&_span]:[margin-top:8px] [&_span]:[color:var(--muted)] [&_span]:[font-size:12px] max-[800px]:[grid-template-columns:1fr]">
          <Link href="/account/orders">
            <strong>Orders</strong>
            <span>View your order history</span>
          </Link>
          <Link href="/account/profile">
            <strong>Profile</strong>
            <span>Update your personal details</span>
          </Link>
          <Link href="/account/addresses">
            <strong>Addresses</strong>
            <span>Manage shipping addresses</span>
          </Link>
          <Link href="/wishlist">
            <strong>Wishlist</strong>
            <span>Pieces you want to remember</span>
          </Link>
        </div>
      </RoutePage>
    </>
  );
}
