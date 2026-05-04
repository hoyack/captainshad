"use server";

import { redirect } from "next/navigation";
import { updateMyProfile } from "@/lib/db/profiles";

export async function completeOnboarding(input: {
  guide_name: string;
  company_name: string;
  booking_url: string;
  phone: string;
  service_area: string[];
  target_species: string[];
}) {
  await updateMyProfile({ ...input, onboarded: true });
  redirect("/dashboard");
}
