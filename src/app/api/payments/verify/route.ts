import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { OrderModel, ProductModel, ProfileModel } from "@/lib/models";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  measureAuthentication,
  measureDatabaseConnection,
  measureDatabaseQuery,
  withApiPerformance,
} from "@/lib/api-performance";

export const POST = withApiPerformance("/api/payments/verify", async (request, metrics) => {
  try {
    const body = await request.json() as { orderId?: string; razorpayOrderId?: string; razorpayPaymentId?: string; razorpaySignature?: string; amount?: number };
    if (!body.orderId || !Types.ObjectId.isValid(body.orderId) || !body.razorpayOrderId || !body.razorpayPaymentId || !body.razorpaySignature) {
      return NextResponse.json({ error: "Payment details are incomplete." }, { status: 400 });
    }
    if (!verifyRazorpaySignature(body.razorpayOrderId, body.razorpayPaymentId, body.razorpaySignature)) {
      return NextResponse.json({ error: "Payment signature verification failed." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await measureAuthentication(metrics, () => supabase.auth.getUser());
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    await measureDatabaseConnection(metrics, connectToDatabase);
    const [order, profile] = await Promise.all([
      measureDatabaseQuery(metrics, () => OrderModel.findOne({ _id: body.orderId, razorpayOrderId: body.razorpayOrderId })),
      measureDatabaseQuery(metrics, () => ProfileModel.findOne({ authUserId: user.id }).select("_id").lean()),
    ]);
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (!profile || String(order.userId) !== String(profile._id)) {
      return NextResponse.json({ error: "You cannot verify this order." }, { status: 403 });
    }
    if (body.amount !== order.totalInr * 100) {
      return NextResponse.json({ error: "Payment amount does not match the order." }, { status: 400 });
    }
    if (order.paymentStatus === "paid") return NextResponse.json({ ok: true, orderId: String(order._id) });

    const orderItems = order.items as unknown as Array<{ productId: Types.ObjectId; quantity: number }>;
    const updates = orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.productId, stock: { $gte: item.quantity } },
        update: { $inc: { stock: -item.quantity } },
      },
    }));
    const stockResult = await measureDatabaseQuery(metrics, () => ProductModel.bulkWrite(updates));
    if (stockResult.modifiedCount !== updates.length) return NextResponse.json({ error: "Stock changed while payment was processing. Contact support." }, { status: 409 });

    order.paymentStatus = "paid";
    order.status = "confirmed";
    order.razorpayPaymentId = body.razorpayPaymentId;
    await measureDatabaseQuery(metrics, () => order.save());
    return NextResponse.json({ ok: true, orderId: String(order._id) });
  } catch (error) {
    console.error("Razorpay payment verification failed", error);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
});
