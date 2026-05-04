import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface UserProfile {
  id: string;
  guide_name: string;
  company_name: string;
  booking_url: string;
  phone: string;
  email: string;
  logo_url: string;
  service_area: string[];
  target_species: string[];
  privacy_defaults: {
    hide_exact_locations: boolean;
    hide_route: boolean;
    allow_pattern_summary: boolean;
  };
  onboarded: boolean;
  stripe_customer_id: string | null;
  subscription_tier: "free" | "pro";
  subscription_status:
    | "inactive"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid";
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export async function getMyProfile(): Promise<UserProfile | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", user.id)
    .single();
  return (data as UserProfile | null) ?? null;
}

export type ProfileUpdate = Partial<
  Pick<
    UserProfile,
    | "guide_name"
    | "company_name"
    | "booking_url"
    | "phone"
    | "logo_url"
    | "service_area"
    | "target_species"
    | "privacy_defaults"
    | "onboarded"
  >
>;

export async function updateMyProfile(patch: ProfileUpdate) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("user_profile")
    .update(patch)
    .eq("id", user.id);
  if (error) throw error;
}
