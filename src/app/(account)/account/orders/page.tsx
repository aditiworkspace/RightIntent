import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/profile";
import { RouteNav, RoutePage } from "@/components/store/route-page";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { OrderModel } from "@/lib/models";
import { PageLoading } from "@/components/store/page-loading";

export default function AccountOrdersPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <AccountOrdersContent />
    </Suspense>
  );
}

async function AccountOrdersContent() {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect("/login?next=/account/orders");
  await connectToDatabase();
  const orders = profile
    ? await OrderModel.find({ userId: profile._id })
        .select("_id status totalInr createdAt")
        .sort({ createdAt: -1 })
        .lean()
    : [];
  return (
    <>
      <RouteNav />
      <RoutePage
        eyebrow="Account / Orders"
        title="Your orders"
        description="Order history and payment status."
      >
        {orders.length ? (
          <div className="[display:grid] [grid-template-columns:repeat(2,_1fr)] [gap:14px] [&_a]:[padding:25px] [&_a]:[border:1px_solid_var(--line)] [&_a:hover]:[border-color:var(--terra)] [&_strong]:[display:block] [&_strong]:[font:21px_var(--serif)] [&_span]:[display:block] [&_span]:[margin-top:8px] [&_span]:[color:var(--muted)] [&_span]:[font-size:12px] max-[800px]:[grid-template-columns:1fr]">
            {orders.map((order) => (
              <Link
                key={String(order._id)}
                href={`/account/orders/${order._id}`}
              >
                <strong>
                  Order #{String(order._id).slice(-8).toUpperCase()}
                </strong>
                <span>
                  {order.status} · Rs. {order.totalInr.toLocaleString("en-IN")}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="[min-height:350px] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [padding:40px] [text-align:center] [background:var(--cream)] [&_h2]:[margin:20px_0_5px] [&_h2]:[font-size:30px] [&_p]:[margin:0_0_25px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px]">
            <h2 className="[margin:0] [font:400_clamp(37px,_4vw,_60px)/1.06_var(--serif)] [letter-spacing:-.055em]">
              No orders yet.
            </h2>
            <p>Your next favourite piece is waiting.</p>
          </div>
        )}
      </RoutePage>
    </>
  );
}
