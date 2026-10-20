import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, User, MapPin, CreditCard, ShieldCheck } from "lucide-react";
import { AdminPage } from "@/components/admin/admin-page";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  
  let order: any = null;

  // 1. Fetch from Supabase
  if (id.length > 24) {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(product_name, sku, quantity, unit_price_inr)")
      .eq("id", id)
      .maybeSingle();
    order = data;
  }

  // 2. Fallback to MongoDB if not in Supabase or if order_items are empty
  if (!order || !order.order_items?.length) {
    try {
      const { connectToDatabase } = await import("@/lib/mongodb");
      const { OrderModel } = await import("@/lib/models");
      const { Types } = await import("mongoose");
      await connectToDatabase();

      const mongoOrder = Types.ObjectId.isValid(id)
        ? await OrderModel.findById(id).lean()
        : order
        ? await OrderModel.findOne({ email: order.email, totalInr: order.total_inr }).sort({ createdAt: -1 }).lean()
        : null;

      if (mongoOrder) {
        if (!order) {
          order = {
            id: String(mongoOrder._id),
            email: mongoOrder.email,
            status: mongoOrder.status || "confirmed",
            payment_status: mongoOrder.paymentStatus || "paid",
            total_inr: mongoOrder.totalInr,
            subtotal_inr: mongoOrder.subtotalInr,
            discount_inr: mongoOrder.discountInr || 0,
            shipping_inr: mongoOrder.shippingInr || 0,
            shipping_address: mongoOrder.shippingAddress,
            order_items: (mongoOrder.items || []).map((it: any) => ({
              product_name: it.productName || "Product",
              sku: it.sku || "SKU",
              quantity: it.quantity || 1,
              unit_price_inr: it.unitPriceInr || 0,
            })),
          };
        } else if (!order.order_items?.length && mongoOrder.items?.length) {
          order.order_items = mongoOrder.items.map((it: any) => ({
            product_name: it.productName || "Product",
            sku: it.sku || "SKU",
            quantity: it.quantity || 1,
            unit_price_inr: it.unitPriceInr || 0,
          }));
          if (!order.shipping_address && mongoOrder.shippingAddress) {
            order.shipping_address = mongoOrder.shippingAddress;
          }

          // Backfill Supabase order_items table in background
          void supabase.from("order_items").insert(
            order.order_items.map((it: any) => ({
              order_id: order.id,
              product_name: it.product_name,
              sku: it.sku,
              quantity: it.quantity,
              unit_price_inr: it.unit_price_inr,
            }))
          );
        }
      }
    } catch (e) {
      console.error("MongoDB order detail fetch error:", e);
    }
  }

  if (!order) notFound();

  const addr = (order.shipping_address ?? {}) as Record<string, any>;
  const recipientName = addr.recipientName || addr.recipient_name || "Customer";
  const phone = addr.phone || addr.contact;
  const addressLine = [
    addr.houseNumber || addr.line_one || "",
    addr.streetArea || addr.line_two || "",
    addr.city || "",
    addr.state || "",
    addr.pincode || addr.postal_code || "",
  ].filter(Boolean).join(", ");

  const isPaid = order.payment_status?.toLowerCase() === "paid";

  return (
    <AdminPage
      eyebrow={`Order / #${order.id.slice(0, 8).toUpperCase()}`}
      title="Order Details"
      description="Comprehensive customer, address, payment, and item details."
    >
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 font-[family-name:var(--mono)] text-[11px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)]"
        >
          <ArrowLeft size={13} /> Back to orders
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Shipping Details */}
        <div className="border border-[var(--line)] rounded-2xl p-6 bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-[family-name:var(--mono)] text-[11px] uppercase tracking-wider text-[var(--terra)]">
            <User size={14} /> Customer & Delivery Address
          </div>
          <div>
            <p className="font-medium text-[16px] text-[var(--ink)] m-0">
              {recipientName}
            </p>
            <p className="text-[13px] text-[var(--muted)] m-0 mt-1">
              Email: <strong className="text-[var(--ink)]">{order.email}</strong>
            </p>
            {phone && (
              <p className="text-[13px] text-[var(--muted)] m-0 mt-1">
                Phone: <strong className="text-[var(--ink)]">{phone}</strong>
              </p>
            )}
          </div>
          <div className="pt-3 border-t border-[rgba(28,38,34,0.06)]">
            <div className="flex items-start gap-2 text-[13px] text-[var(--ink)]">
              <MapPin size={16} className="text-[var(--muted)] shrink-0 mt-0.5" />
              <span>{addressLine || "No delivery address specified."}</span>
            </div>
          </div>
        </div>

        {/* Fulfillment & Payment Status */}
        <div className="border border-[var(--line)] rounded-2xl p-6 bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-[family-name:var(--mono)] text-[11px] uppercase tracking-wider text-[var(--terra)]">
            <CreditCard size={14} /> Fulfillment & Payment
          </div>
          <div>
            <label className="block text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)] mb-2">
              Update Order Status
            </label>
            <OrderStatusSelect orderId={order.id} current={order.status} />
          </div>
          <div className="pt-3 border-t border-[rgba(28,38,34,0.06)] flex items-center justify-between">
            <span className="text-[12px] text-[var(--muted)]">Payment Status:</span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider ${
                isPaid
                  ? "bg-[#eaf4eb] text-[#346a3a] border border-[#cbe6cd]"
                  : "bg-[#fdf3e7] text-[#a06114] border border-[#f3ddbe]"
              }`}
            >
              {order.payment_status}
            </span>
          </div>
        </div>
      </div>

      {/* Ordered Products Section */}
      <div className="mt-8 border border-[var(--line)] rounded-2xl p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 font-[family-name:var(--mono)] text-[11px] uppercase tracking-wider text-[var(--terra)] mb-4">
          <Package size={14} /> Ordered Products ({order.order_items?.length || 0})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--line)] text-[10px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)]">
                <th className="py-2.5">Product Name</th>
                <th className="py-2.5">SKU</th>
                <th className="py-2.5 text-right">Quantity</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(28,38,34,0.06)]">
              {order.order_items?.length ? (
                order.order_items.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="py-3.5 font-medium text-[var(--ink)]">
                      {item.product_name}
                    </td>
                    <td className="py-3.5 font-[family-name:var(--mono)] text-[var(--muted)]">
                      {item.sku}
                    </td>
                    <td className="py-3.5 text-right font-[family-name:var(--mono)] font-medium">
                      × {item.quantity}
                    </td>
                    <td className="py-3.5 text-right font-[family-name:var(--mono)] text-[var(--muted)]">
                      Rs. {item.unit_price_inr?.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 text-right font-[family-name:var(--mono)] font-semibold text-[var(--ink)]">
                      Rs. {(item.unit_price_inr * item.quantity).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[var(--muted)] italic">
                    No items recorded for this order.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Order Summary Totals */}
        <div className="mt-6 pt-6 border-t border-[var(--line)] flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-[13px]">
            <div className="flex justify-between text-[var(--muted)]">
              <span>Subtotal:</span>
              <span className="font-[family-name:var(--mono)] text-[var(--ink)]">
                Rs. {(order.subtotal_inr || order.total_inr)?.toLocaleString("en-IN")}
              </span>
            </div>
            {order.discount_inr > 0 && (
              <div className="flex justify-between text-[#346a3a]">
                <span>Discount:</span>
                <span className="font-[family-name:var(--mono)]">
                  -Rs. {order.discount_inr?.toLocaleString("en-IN")}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[var(--muted)]">
              <span>Shipping:</span>
              <span className="font-[family-name:var(--mono)] text-[#346a3a]">
                {order.shipping_inr ? `Rs. ${order.shipping_inr}` : "FREE"}
              </span>
            </div>
            <div className="pt-2 border-t border-[var(--line)] flex justify-between text-[16px] font-semibold text-[var(--ink)]">
              <span>Grand Total:</span>
              <span className="font-[family-name:var(--mono)]">
                Rs. {order.total_inr?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
