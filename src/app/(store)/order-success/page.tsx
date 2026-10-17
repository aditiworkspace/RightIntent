"use client";

import Link from "next/link";
import { Check, LoaderCircle, ArrowRight, Package, Calendar, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RouteNav } from "@/components/store/route-page";

type OrderState = { paymentStatus: string; status: string; totalInr: number };

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<OrderState | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const message = !orderId
    ? "The order reference is missing."
    : errorMessage || "Confirming your payment...";

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${encodeURIComponent(orderId)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Unable to confirm this order.");
        setOrder(data.order);
      })
      .catch((error: unknown) =>
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to confirm this order.",
        ),
      );
  }, [orderId]);

  return (
    <>
      <RouteNav />
      <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        {!order ? (
          <div className="text-center p-8 rounded-2xl bg-white border border-[var(--line)] shadow-sm max-w-md w-full">
            <LoaderCircle className="animate-spin mx-auto text-[var(--terra)] mb-4" size={32} />
            <p className="text-[14px] text-[var(--muted)] mb-6">{message}</p>
            <Link href="/account/orders" className="editorial-btn editorial-btn-primary">
              View your orders
            </Link>
          </div>
        ) : order.paymentStatus !== "paid" ? (
          <div className="text-center p-8 sm:p-12 rounded-2xl bg-white border border-[var(--line)] shadow-sm max-w-lg w-full">
            <div className="w-14 h-14 rounded-full bg-[rgba(187,98,73,0.1)] text-[var(--terra)] flex items-center justify-center mx-auto mb-5">
              <Package size={26} />
            </div>
            <span className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--terra)]">
              Payment In Progress
            </span>
            <h1 className="font-[family-name:var(--serif)] text-[clamp(28px,3vw,38px)] font-normal text-[var(--ink)] mt-2 mb-3">
              We are confirming your payment.
            </h1>
            <p className="text-[14px] leading-relaxed text-[var(--muted)] mb-8">
              Your order reference is saved. The status will automatically reflect once Razorpay reconciliation completes.
            </p>
            <Link href="/account/orders" className="editorial-btn editorial-btn-primary">
              Go to order history <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="text-center p-8 sm:p-14 rounded-3xl bg-white border border-[var(--line)] shadow-xl max-w-xl w-full">
            <div className="w-16 h-16 rounded-full bg-[#4f8055] text-white flex items-center justify-center mx-auto mb-6 shadow-md shadow-[#4f8055]/20">
              <Check size={32} strokeWidth={2.5} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(79,128,85,0.1)] text-[#4f8055] font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider mb-4">
              <Sparkles size={11} /> Order Confirmed & Paid
            </div>

            <h1 className="font-[family-name:var(--serif)] text-[clamp(32px,4vw,44px)] font-normal text-[var(--ink)] m-0">
              Thank you for your order.
            </h1>
            <p className="mt-3 text-[14px] text-[var(--muted)] leading-relaxed max-w-md mx-auto">
              Your intentional tools are now being carefully packed and prepared for dispatch.
            </p>

            <div className="my-8 p-5 rounded-xl bg-[var(--cream)]/40 border border-[var(--line)] text-left space-y-2.5 font-[family-name:var(--mono)] text-[12px]">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Order Reference:</span>
                <span className="font-medium text-[var(--ink)]">
                  #{orderId?.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Amount Settled:</span>
                <span className="font-medium text-[var(--ink)]">
                  Rs. {order.totalInr.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Estimated Dispatch:</span>
                <span className="font-medium text-[var(--ink)]">Within 24 business hours</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/products" className="editorial-btn editorial-btn-primary">
                Continue browsing <ArrowRight size={14} />
              </Link>
              <Link href="/account/orders" className="editorial-btn editorial-btn-secondary">
                View in orders
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
