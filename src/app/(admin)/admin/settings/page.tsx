import { AdminPage } from "@/components/admin/admin-page";
import { getSiteSettings } from "@/lib/supabase/admin-data";
import { SettingsForm } from "@/components/admin/settings-form";
export default async function AdminSettingsPage() { const settings = await getSiteSettings(); return <AdminPage eyebrow="Studio / CMS" title="Website settings" description="Control the live storefront without code changes."><SettingsForm initial={settings as Record<string, unknown>} /></AdminPage>; }
