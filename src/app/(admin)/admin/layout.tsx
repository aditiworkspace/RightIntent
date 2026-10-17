import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdminAccess } from "@/lib/auth/admin";
import { BrandLogo } from "@/components/store/brand-logo";
import { PageLoading } from "@/components/store/page-loading";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  FolderTree,
  Users,
  TicketPercent,
  MessageSquare,
  Settings,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<PageLoading />}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}

async function AdminLayoutContent({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const access = await getCurrentAdminAccess();
  if (!access) redirect("/login?next=/admin");
  if (!access.isAdmin) redirect("/unauthorized");

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Inventory", href: "/admin/inventory", icon: Boxes },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Coupons", href: "/admin/coupons", icon: TicketPercent },
    { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] bg-[#f9f7f2] text-[var(--ink)]">
      {/* Sidebar */}
      <aside className="p-6 md:p-8 bg-[#eee8de] border-r border-[rgba(28,38,34,0.1)] flex flex-col justify-between">
        <div>
          <div className="pb-6 border-b border-[rgba(28,38,34,0.08)]">
            <BrandLogo />
            <span className="block mt-2 font-[family-name:var(--mono)] text-[9px] uppercase tracking-[0.16em] text-[var(--terra)]">
              Studio Operations
            </span>
          </div>

          <nav className="mt-6 flex flex-col gap-1" aria-label="Admin navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-[family-name:var(--mono)] text-[12px] text-[var(--ink)] hover:bg-white/60 hover:text-[var(--terra)] transition-all"
                >
                  <Icon size={16} className="text-[var(--muted)]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[rgba(28,38,34,0.08)]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-[11px] font-[family-name:var(--mono)] text-[var(--muted)] hover:text-[var(--ink)] mb-3"
          >
            <span>View Live Storefront</span>
            <ExternalLink size={13} />
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-[family-name:var(--mono)] text-[#4f8055]">
            <span className="w-2 h-2 rounded-full bg-[#4f8055] animate-pulse" />
            <span>Supabase Engine Connected</span>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="p-6 sm:p-10 lg:p-14 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
