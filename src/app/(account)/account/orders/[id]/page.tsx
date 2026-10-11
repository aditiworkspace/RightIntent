import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RouteNav, RoutePage } from "@/components/store/route-page";
import { PageLoading } from "@/components/store/page-loading";

type AccountOrderDetailProps = { params: Promise<{ id: string }> };

export default function AccountOrderDetailPage({ params }: AccountOrderDetailProps) {
  return (
    <Suspense fallback={<PageLoading />}>
      <AccountOrderDetailContent params={params} />
    </Suspense>
  );
}

async function AccountOrderDetailContent({ params }: AccountOrderDetailProps) {
  const { id } = await params;
  if (!id) notFound();
  return <><RouteNav /><RoutePage eyebrow={`Order / ${id}`} title="Order details" description="Your order status and items will be loaded from Supabase here."><div className="order-timeline"><span className="active">Order placed</span><span>Confirmed</span><span>Shipped</span><span>Delivered</span></div><Link className="[display:inline-flex] [align-items:center] [gap:8px] [margin-bottom:55px] [font:10px_var(--mono)] [text-transform:uppercase]" href="/account/orders">Back to orders</Link></RoutePage></>;
}
