import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/profile";
import { RouteNav, RoutePage } from "@/components/store/route-page";
import { ProfileForm } from "@/components/account/profile-form";
import { PageLoading } from "@/components/store/page-loading";

export default function ProfilePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <ProfileContent />
    </Suspense>
  );
}

async function ProfileContent() {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect("/login?next=/account/profile");
  return <><RouteNav /><RoutePage eyebrow="Account / Profile" title="Your details" description="Your identity is secured by Supabase Auth and your profile is stored in MongoDB."><ProfileForm email={user.email || ""} fullName={profile?.fullName || ""} /></RoutePage></>;
}
