import { redirect } from "next/navigation";
import { OnboardingForm } from "./form";
import { getMyProfile } from "@/lib/db/profiles";

export default async function OnboardingPage() {
  const profile = await getMyProfile();
  if (profile?.onboarded) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-app py-8">
        <h1 className="text-2xl font-bold text-bay-900">Welcome aboard</h1>
        <p className="mt-1 text-sm text-neutral-700">
          Tell us about your charter. This becomes the branding on every recap
          you send a client. You can edit any of it later.
        </p>
        <OnboardingForm
          initial={{
            guide_name: profile?.guide_name ?? "",
            company_name: profile?.company_name ?? "",
            booking_url: profile?.booking_url ?? "",
            phone: profile?.phone ?? "",
            service_area: profile?.service_area ?? ["redfish_bay"],
            target_species: profile?.target_species ?? ["redfish", "speckled_trout"],
          }}
        />
      </div>
    </div>
  );
}
