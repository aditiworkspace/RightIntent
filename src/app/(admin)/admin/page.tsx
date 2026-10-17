import { AdminPage } from "@/components/admin/admin-page";
import { getAdminStats } from "@/lib/supabase/admin-data";
import { TrendingUp, ShoppingBag, Package, AlertTriangle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    {
      label: "Gross Revenue",
      value: `Rs. ${stats.revenue.toLocaleString("en-IN")}`,
      note: "Total lifetime volume",
      icon: TrendingUp,
      href: "/admin/orders",
      color: "text-[#4f8055]",
    },
    {
      label: "Customer Orders",
      value: stats.orders,
      note: "All completed checkouts",
      icon: ShoppingBag,
      href: "/admin/orders",
      color: "text-[var(--ink)]",
    },
    {
      label: "Catalog Items",
      value: stats.products,
      note: `${stats.published} active & live`,
      icon: Package,
      href: "/admin/products",
      color: "text-[var(--ink)]",
    },
    {
      label: "Low Stock Alert",
      value: stats.lowStock,
      note: stats.lowStock > 0 ? "Replenishment required" : "Inventory healthy",
      icon: AlertTriangle,
      href: "/admin/inventory",
      color: stats.lowStock > 0 ? "text-[var(--terra)]" : "text-[#4f8055]",
    },
  ];

  return (
    <AdminPage
      eyebrow="Studio / Overview"
      title="Studio Operations"
      description="Monitor live orders, active catalog listings, and inventory health in real-time."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="p-6 rounded-2xl bg-white border border-[var(--line)] shadow-sm hover:border-[var(--terra)] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--muted)]">
                    {card.label}
                  </span>
                  <div className={`p-2 rounded-lg bg-[var(--paper)] ${card.color}`}>
                    <Icon size={16} />
                  </div>
                </div>
                <strong className="block font-[family-name:var(--serif)] text-[30px] font-normal text-[var(--ink)]">
                  {card.value}
                </strong>
              </div>
              <div className="mt-4 pt-3 border-t border-[rgba(28,38,34,0.06)] flex items-center justify-between text-[11px] font-[family-name:var(--mono)] text-[var(--muted)]">
                <span>{card.note}</span>
                <ArrowUpRight size={13} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-white border border-[var(--line)] shadow-sm">
        <span className="text-[10px] font-[family-name:var(--mono)] uppercase tracking-wider text-[var(--terra)]">
          Real-time Engine
        </span>
        <h3 className="font-[family-name:var(--serif)] text-[22px] font-normal text-[var(--ink)] mt-1 mb-2">
          Connected Backend Architecture
        </h3>
        <p className="text-[13px] text-[var(--muted)] leading-relaxed max-w-2xl m-0">
          Your product catalog, customer identity verification, and inventory thresholds are securely enforced using Supabase Auth with Row-Level Security and MongoDB persistence.
        </p>
      </div>
    </AdminPage>
  );
}
