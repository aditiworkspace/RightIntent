import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/profile";
import { RouteNav, RoutePage } from "@/components/store/route-page";
import { AddressManager } from "@/components/account/address-manager";
import { connectToDatabase } from "@/lib/mongodb";
import { AddressModel } from "@/lib/models";
import { PageLoading } from "@/components/store/page-loading";

export default function AddressesPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <AddressesContent />
    </Suspense>
  );
}

async function AddressesContent() {
  const { user } = await getCurrentProfile();
  if (!user) redirect("/login?next=/account/addresses");
  await connectToDatabase();
  const addresses = await AddressModel.find({ authUserId: user.id })
    .select(
      "_id recipientName phone houseNumber streetArea city state pincode landmark isDefault",
    )
    .sort({ isDefault: -1, createdAt: -1 })
    .lean();
  const initialAddresses = addresses.map((address) => ({
    ...address,
    _id: String(address._id),
  }));
  return (
    <>
      <RouteNav />
      <RoutePage
        eyebrow="Account / Addresses"
        title="Shipping addresses"
        description="Add, review, and remove saved delivery addresses."
      >
        <AddressManager initialAddresses={initialAddresses} />
      </RoutePage>
    </>
  );
}
