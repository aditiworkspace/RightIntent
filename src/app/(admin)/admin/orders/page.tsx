import Link from "next/link";
import { AdminPage } from "@/components/admin/admin-page";
import { getAdminOrders } from "@/lib/supabase/admin-data";
import { ArrowRight, Package, User, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <AdminPage
      eyebrow="Commerce"
      title="Orders"
      description="Review, process, and update customer orders and items."
    >
      <div className="w-full overflow-hidden rounded-2xl bg-white border border-[var(--line)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--paper)]/60 text-[10px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--muted)]">
                <th className="py-3.5 px-5 font-medium">Order ID & Date</th>
                <th className="py-3.5 px-5 font-medium">Customer</th>
                <th className="py-3.5 px-5 font-medium">Products Ordered</th>
                <th className="py-3.5 px-5 font-medium">Total</th>
                <th className="py-3.5 px-5 font-medium">Payment</th>
                <th className="py-3.5 px-5 font-medium">Status</th>
                <th className="py-3.5 px-5 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(28,38,34,0.06)] text-[13px]">
              {orders.length ? (
                orders.map((order) => {
                  const dateStr = order.created_at
                    ? new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recent";

                  const addr = order.shipping_address as Record<string, any> | undefined;
                  const customerName = addr?.recipientName || addr?.recipient_name;
                  const customerPhone = addr?.phone;
                  const customerCity = addr?.city ? `${addr.city}, ${addr.state || ""}` : undefined;

                  const isPaid = order.payment_status?.toLowerCase() === "paid";

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[rgba(28,38,34,0.02)] transition-colors group"
                    >
                      {/* Order ID & Date */}
                      <td className="py-4 px-5 align-top">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-[family-name:var(--mono)] font-semibold text-[13px] text-[var(--ink)] hover:text-[var(--terra)] flex items-center gap-1.5"
                        >
                          #{order.id.slice(0, 8).toUpperCase()}
                        </Link>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[var(--muted)] font-[family-name:var(--mono)]">
                          <Clock size={11} /> {dateStr}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-5 align-top">
                        <div className="font-medium text-[var(--ink)]">
                          {order.email}
                        </div>
                        {customerName && (
                          <div className="text-[11px] text-[var(--muted)] mt-0.5">
                            {customerName} {customerPhone ? `· ${customerPhone}` : ""}
                          </div>
                        )}
                        {customerCity && (
                          <div className="text-[10px] text-[var(--muted)] font-[family-name:var(--mono)] uppercase mt-0.5">
                            {customerCity}
                          </div>
                        )}
                      </td>

                      {/* Products Ordered */}
                      <td className="py-4 px-5 align-top max-w-[320px]">
                        {order.order_items && order.order_items.length > 0 ? (
                          <div className="space-y-1.5">
                            {order.order_items.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between gap-3 text-[12px] bg-[var(--paper)]/50 px-2.5 py-1.5 rounded-md border border-[rgba(28,38,34,0.05)]"
                              >
                                <span className="font-medium text-[var(--ink)] truncate">
                                  {item.product_name}
                                </span>
                                <span className="font-[family-name:var(--mono)] text-[11px] text-[var(--muted)] shrink-0">
                                  × {item.quantity} (₹{item.unit_price_inr})
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[var(--muted)] text-[11px] italic">
                            Items not recorded
                          </span>
                        )}
                      </td>

                      {/* Total */}
                      <td className="py-4 px-5 align-top font-[family-name:var(--mono)] font-semibold text-[14px] text-[var(--ink)]">
                        Rs. {order.total_inr?.toLocaleString("en-IN")}
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-5 align-top">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-[family-name:var(--mono)] uppercase tracking-wider ${
                            isPaid
                              ? "bg-[#eaf4eb] text-[#346a3a] border border-[#cbe6cd]"
                              : "bg-[#fdf3e7] text-[#a06114] border border-[#f3ddbe]"
                          }`}
                        >
                          {isPaid ? (
                            <CheckCircle2 size={11} />
                          ) : (
                            <AlertCircle size={11} />
                          )}
                          {order.payment_status}
                        </span>
                      </td>

                      {/* Order Status */}
                      <td className="py-4 px-5 align-top">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-[family-name:var(--mono)] uppercase tracking-wider ${
                            order.status === "delivered"
                              ? "bg-[#eaf4eb] text-[#346a3a]"
                              : order.status === "shipped"
                              ? "bg-[#edf2f7] text-[#2b4c7e]"
                              : order.status === "cancelled"
                              ? "bg-[#fae9e3] text-[#bd6049]"
                              : "bg-[var(--cream)]/60 text-[var(--ink)]"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 align-top text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 text-[11px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--terra)] hover:underline font-medium"
                        >
                          View Details <ArrowRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-[var(--muted)] font-[family-name:var(--mono)] text-[12px]"
                  >
                    <Package className="mx-auto mb-2 text-[var(--muted)]/50" size={28} />
                    No customer orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
