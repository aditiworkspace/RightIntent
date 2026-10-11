import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/profile";
import { BrandLogo } from "@/components/store/brand-logo";
import { PageLoading } from "@/components/store/page-loading";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<PageLoading />}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}

async function AdminLayoutContent({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect("/login?next=/admin");
  if (profile?.role !== "admin") redirect("/unauthorized");
  return <div className="[min-height:100vh] [display:grid] [grid-template-columns:225px_1fr] [background:var(--paper)] max-[800px]:[display:block]"><aside className="[padding:34px_24px] [border-right:1px_solid_var(--line)] [background:var(--cream)] [&_nav]:[display:flex] [&_nav]:[flex-direction:column] [&_nav]:[gap:15px] [&_nav_a]:[font:11px_var(--mono)] [&_nav_a:hover]:[color:var(--terra)] max-[800px]:[padding:22px_20px] max-[800px]:[&_nav]:[flex-direction:row] max-[800px]:[&_nav]:[gap:14px] max-[800px]:[&_nav]:[overflow-x:auto] max-[800px]:[&_nav]:[padding-bottom:5px] max-[800px]:[&_nav_a]:[flex:0_0_auto] max-[800px]:[&_nav_a]:[font-size:9px]"><BrandLogo /><p className="[margin:70px_0_22px] [color:var(--muted)] [font:9px_var(--mono)] [letter-spacing:.1em] [text-transform:uppercase] max-[800px]:[margin:27px_0_14px]">Studio / Admin</p><nav><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/inventory">Inventory</Link><Link href="/admin/categories">Categories</Link><Link href="/admin/customers">Customers</Link><Link href="/admin/coupons">Coupons</Link><Link href="/admin/reviews">Reviews</Link><Link href="/admin/settings">Settings</Link></nav></aside><main className="[padding:65px_5vw] max-[800px]:[padding:48px_20px]">{children}</main></div>;
}
