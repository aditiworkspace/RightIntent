"use client";

import Link from "next/link";
import { Check, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

  if (!order)
    return (
      <main className="[&_h1]:[margin:0] [&_h1]:[font:400_clamp(46px,_6vw,_78px)/1_var(--serif)] [&_h1]:[letter-spacing:-.06em] [min-height:80vh] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [padding:40px_20px] [text-align:center] [&>p:not(.eyebrow)]:[margin:22px_0_29px] [&>p:not(.eyebrow)]:[color:var(--muted)] [&>p:not(.eyebrow)]:[font-size:14px]">
        <LoaderCircle className="[animation:spin_1s_linear_infinite]" size={28} />
        <p>{message}</p>
        <Link href="/account/orders" className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]">
          View orders
        </Link>
      </main>
    );
  if (order.paymentStatus !== "paid")
    return (
      <main className="[&_h1]:[margin:0] [&_h1]:[font:400_clamp(46px,_6vw,_78px)/1_var(--serif)] [&_h1]:[letter-spacing:-.06em] [min-height:80vh] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [padding:40px_20px] [text-align:center] [&>p:not(.eyebrow)]:[margin:22px_0_29px] [&>p:not(.eyebrow)]:[color:var(--muted)] [&>p:not(.eyebrow)]:[font-size:14px]">
        <p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">Payment pending</p>
        <h1>We are confirming your payment.</h1>
        <p>
          Your order is saved and will update once Razorpay confirms the
          payment.
        </p>
        <Link href="/account/orders" className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]">
          View orders
        </Link>
      </main>
    );

  return (
    <main className="success-page [&_h1]:[margin:0] [&_h1]:[font:400_clamp(46px,_6vw,_78px)/1_var(--serif)] [&_h1]:[letter-spacing:-.06em] [min-height:80vh] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [padding:40px_20px] [text-align:center] [&>p:not(.eyebrow)]:[margin:22px_0_29px] [&>p:not(.eyebrow)]:[color:var(--muted)] [&>p:not(.eyebrow)]:[font-size:14px]">
      <div className="[width:70px] [height:70px] [display:grid] [place-items:center] [margin-bottom:25px] [border-radius:50%] [color:var(--paper)] [background:var(--terra)]">
        <Check size={30} />
      </div>
      <p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">Order confirmed</p>
      <h1>Thank you for your purchase.</h1>
      <p>
        Your payment was verified successfully. Order total: Rs.{" "}
        {order.totalInr.toLocaleString("en-IN")}.
      </p>
      <Link href="/products" className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]">
        Continue shopping
      </Link>
    </main>
  );
}
