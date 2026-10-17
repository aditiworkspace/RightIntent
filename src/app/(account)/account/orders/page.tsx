import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/profile";
import { RouteNav, RoutePage } from "@/components/store/route-page";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { OrderModel } from "@/lib/models";
import { PageLoading } from "@/components/store/page-loading";
import { Package, ArrowRight, ArrowLeft, Clock, CheckCircle } from "lucide-react";

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
        .select("_id status totalInr createdAt paymentStatus items")
        .sort({ createdAt: -1 })
        .lean()
    : [];

  return (
    <>
      <RouteNav />
      <RoutePage
        eyebrow="Account / Orders"
        title="Your Orders"
        description="Comprehensive history of your pieces, tracking statuses, and official receipts."
      >
        <div className="mb-6">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 font-[family-name:var(--mono)] text-[11px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <ArrowLeft size={13} /> Back to dashboard
          </Link>
        </div>

        {orders.length ? (
          <div className="grid gap-4">
            {orders.map((order) => {
              const dateStr = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recent";
              const isPaid = order.paymentStatus === "paid";

              return (
                <div
                  key={String(order._id)}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-[var(--line)] shadow-sm hover:border-[var(--terra)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--cream)]/60 text-[var(--ink)] flex items-center justify-center shrink-0">
                      <Package size={20} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="font-[family-name:var(--mono)] text-[14px] text-[var(--ink)]">
                          Order #{String(order._id).slice(-8).toUpperCase()}
                        </strong>
                        <span
                          className={`px-2 py-0.5 rounded-full font-[family-name:var(--mono)] text-[9px] uppercase tracking-wider ${
                            isPaid
                              ? "bg-[rgba(79,128,85,0.1)] text-[#4f8055]"
                              : "bg-[rgba(187,98,73,0.1)] text-[var(--terra)]"
                          }`}
                        >
                          {isPaid ? "Payment Verified" : order.status}
                        </span>
                      </div>
                      <p className="font-[family-name:var(--sans)] text-[13px] text-[var(--muted)] m-0 mt-1">
                        Placed on {dateStr} · Standard Surface Delivery
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[rgba(28,38,34,0.06)]">
                    <div className="text-left sm:text-right">
                      <span className="block font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--muted)]">
                        Total Amount
                      </span>
                      <strong className="font-[family-name:var(--mono)] text-[15px] text-[var(--ink)]">
                        Rs. {order.totalInr.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <Link
                      href={`/account/orders/${order._id}`}
                      className="editorial-btn editorial-btn-secondary min-h-[38px] px-3 text-[10px]"
                    >
                      Details <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="min-h-[360px] flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-white border border-[var(--line)] max-w-lg mx-auto">
            <Package size={32} className="text-[var(--muted)] mb-3" />
            <h2 className="m-0 font-[family-name:var(--serif)] text-[26px] font-normal text-[var(--ink)]">
              No orders placed yet.
            </h2>
            <p className="max-w-[320px] mt-2 mb-6 text-[13px] text-[var(--muted)]">
              When you purchase our journals or tools, track their dispatch and delivery timeline here.
            </p>
            <Link href="/products" className="editorial-btn editorial-btn-primary">
              Explore the collection
            </Link>
          </div>
        )}
      </RoutePage>
    </>
  );
}
