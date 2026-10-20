import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/profile";
import { getCurrentAdminAccess } from "@/lib/auth/admin";
import { RouteNav, RoutePage } from "@/components/store/route-page";
import { PageLoading } from "@/components/store/page-loading";
import {
  Package,
  User,
  MapPin,
  Heart,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { LogoutButton } from "@/components/account/logout-button";

export default function AccountPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect("/login?next=/account");
  const adminAccess = await getCurrentAdminAccess();

  const links = [
    ...(adminAccess?.isAdmin
      ? [
          {
            title: "Studio Admin",
            description: "Manage products, inventory, orders, and studio settings.",
            href: "/admin",
            icon: Sparkles,
            badge: "Admin",
          },
        ]
      : []),
    {
      title: "Order History",
      description: "Track current dispatches and review previous purchases.",
      href: "/account/orders",
      icon: Package,
      badge: "Orders",
    },
    {
      title: "Saved Addresses",
      description: "Manage default shipping destinations across India.",
      href: "/account/addresses",
      icon: MapPin,
      badge: "Shipping",
    },
    {
      title: "Personal Profile",
      description: "Edit your name, primary email, and preferences.",
      href: "/account/profile",
      icon: User,
      badge: "Account",
    },
    {
      title: "Curated Wishlist",
      description: "Browse artifacts and intentional tools saved for later.",
      href: "/wishlist",
      icon: Heart,
      badge: "Curated",
    },
  ];

  return (
    <>
      <RouteNav />
      <RoutePage
        eyebrow="Member Studio"
        title={`Welcome back, ${profile?.fullName || "Seeker"}.`}
        description="Your dedicated space for tracking shipments, saved delivery destinations, and intentional items."
      >
        {/* User Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-[var(--line)] shadow-sm mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center font-[family-name:var(--serif)] text-[18px]">
              {(profile?.fullName || user.email || "R").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-[var(--ink)] text-[15px]">
                  {profile?.fullName || "Account Member"}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[rgba(187,98,73,0.1)] text-[var(--terra)] font-[family-name:var(--mono)] text-[9px] uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <p className="font-[family-name:var(--mono)] text-[11px] text-[var(--muted)] m-0">
                {user.email || user.phone || "Active Session"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[rgba(28,38,34,0.06)]">
            <LogoutButton />
            <Link
              href="/products"
              className="editorial-btn editorial-btn-primary min-h-[40px] px-4 text-[10px]"
            >
              Shop Edit <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group p-6 sm:p-8 rounded-2xl bg-white/80 border border-[var(--line)] hover:border-[var(--terra)] hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--cream)]/60 text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] flex items-center justify-center transition-colors">
                      <Icon size={18} />
                    </div>
                    <span className="font-[family-name:var(--mono)] text-[10px] uppercase tracking-wider text-[var(--muted)]">
                      {item.badge}
                    </span>
                  </div>
                  <strong className="block font-[family-name:var(--serif)] text-[22px] font-normal text-[var(--ink)] mb-1.5 group-hover:text-[var(--terra)] transition-colors">
                    {item.title}
                  </strong>
                  <span className="block text-[13px] leading-relaxed text-[var(--muted)]">
                    {item.description}
                  </span>
                </div>
                <div className="pt-6 mt-4 border-t border-[rgba(28,38,34,0.06)] flex items-center justify-between text-[11px] font-[family-name:var(--mono)] text-[var(--ink)] uppercase tracking-wider">
                  <span>Enter section</span>
                  <ArrowRight
                    size={13}
                    className="transform group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </RoutePage>
    </>
  );
}
