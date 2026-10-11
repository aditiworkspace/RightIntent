import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { OrderModel } from "@/lib/models";
import { verifyRazorpayWebhook } from "@/lib/razorpay";
import {
  measureDatabaseConnection,
  measureDatabaseQuery,
  withApiPerformance,
} from "@/lib/api-performance";

export const POST = withApiPerformance("/api/webhooks/razorpay", async (request, metrics) => {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  if (!verifyRazorpayWebhook(rawBody, signature)) return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });

  try {
    const event = JSON.parse(rawBody) as { event?: string; payload?: { payment?: { entity?: { order_id?: string; id?: string } }; order?: { entity?: { id?: string } } } };
    const razorpayOrderId = event.payload?.payment?.entity?.order_id ?? event.payload?.order?.entity?.id;
    const razorpayPaymentId = event.payload?.payment?.entity?.id;
    if (!razorpayOrderId) return NextResponse.json({ received: true });

    await measureDatabaseConnection(metrics, connectToDatabase);
    const update = event.event === "payment.captured" || event.event === "order.paid"
      ? { paymentStatus: "paid", status: "confirmed", razorpayPaymentId }
      : event.event === "payment.failed" ? { paymentStatus: "failed" } : null;
    if (update) await measureDatabaseQuery(metrics, () => OrderModel.updateOne({ razorpayOrderId }, { $set: update }));
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook processing failed", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
});
