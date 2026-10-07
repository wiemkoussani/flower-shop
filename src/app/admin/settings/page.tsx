import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-3xl">Site settings</h1>
      <p className="mt-2 text-sm text-muted">
        Announcement bar, brand, hero, phone, email, WhatsApp and social links.
      </p>
      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
