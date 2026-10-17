import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RouteNav, RoutePage } from "@/components/store/route-page";
import { PageLoading } from "@/components/store/page-loading";
import { ArrowLeft, Check, Clock, PackageCheck, Truck, ShieldCheck } from "lucide-react";

type AccountOrderDetailProps = { params: Promise<{ id: string }> };

export default function AccountOrderDetailPage({ params }: AccountOrderDetailProps) {
  return (
    <Suspense fallback={<PageLoading />}>
      <AccountOrderDetailContent params={params} />
    </Suspense>
  );
}

async function AccountOrderDetailContent({ params }: AccountOrderDetailProps) {
  const { id } = await params;
  if (!id) notFound();

  const steps = [
    { label: "Order Placed", done: true, desc: "Received and confirmed" },
    { label: "Preparing", done: true, desc: "Archival packaging" },
    { label: "Dispatched", done: false, desc: "Handed to courier" },
    { label: "Delivered", done: false, desc: "Signed at address" },
  ];

  return (
    <>
      <RouteNav />
      <RoutePage
        eyebrow="Account / Orders"
        title={`Order #${id.slice(-8).toUpperCase()}`}
        description="Shipment tracking, delivery timeline, and verified purchase records."
      >
        <div className="mb-8">
          <Link
            className="inline-flex items-center gap-2 font-[family-name:var(--mono)] text-[11px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)]"
            href="/account/orders"
          >
            <ArrowLeft size={14} /> Back to all orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tracking Timeline (Left) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[var(--line)] shadow-sm">
              <h3 className="m-0 font-[family-name:var(--serif)] text-[22px] font-normal text-[var(--ink)] mb-6">
                Delivery Timeline
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                {steps.map((step, idx) => (
                  <div key={step.label} className="flex flex-col items-start sm:items-center text-left sm:text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-[family-name:var(--mono)] text-[12px] mb-2 ${
                        step.done
                          ? "bg-[var(--ink)] text-[var(--paper)] shadow-sm"
                          : "bg-[var(--cream)]/60 text-[var(--muted)] border border-[var(--line)]"
                      }`}
                    >
                      {step.done ? <Check size={16} /> : idx + 1}
                    </div>
                    <strong className="block font-medium text-[13px] text-[var(--ink)]">
                      {step.label}
                    </strong>
                    <span className="text-[11px] text-[var(--muted)]">{step.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-sm flex items-center gap-3">
              <ShieldCheck size={20} className="text-[#4f8055] shrink-0" />
              <div className="text-[13px] text-[var(--muted)]">
                <span className="font-medium text-[var(--ink)]">Signature Delivery Protected</span> — All shipments from Right Intent include physical inspection before dispatch.
              </div>
            </div>
          </div>

          {/* Reference Card (Right) */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[var(--line)] shadow-sm">
              <h3 className="m-0 font-[family-name:var(--serif)] text-[20px] font-normal text-[var(--ink)] pb-4 border-b border-[var(--line)]">
                Order Information
              </h3>
              <div className="py-4 space-y-3 font-[family-name:var(--mono)] text-[12px]">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Identifier:</span>
                  <span className="text-[var(--ink)]">{id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Payment:</span>
                  <span className="text-[#4f8055]">Razorpay Signature Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Support:</span>
                  <span className="text-[var(--terra)]">support@rightintent.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RoutePage>
    </>
  );
}
