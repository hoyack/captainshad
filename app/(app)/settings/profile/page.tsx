import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getMyProfile } from "@/lib/db/profiles";
import { ProfileForm } from "./form";

export default async function SettingsProfilePage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/login");
  return (
    <AppShell title="Profile" back={{ href: "/settings/profile" }}>
      <ProfileForm
        initial={{
          guide_name: profile.guide_name,
          company_name: profile.company_name,
          booking_url: profile.booking_url,
          phone: profile.phone,
          logo_url: profile.logo_url,
          service_area: profile.service_area,
          target_species: profile.target_species,
          privacy_defaults: profile.privacy_defaults,
        }}
      />
    </AppShell>
  );
}
