import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface Conditions {
  id: string;
  trip_id: string;
  user_id: string;
  time_observed: string;
  tide_stage: string;
  wind_direction: string;
  wind_speed_mph: number | null;
  water_clarity: string;
  cloud_cover: string;
  bait_activity: string;
  bird_activity: string;
  current_strength: string;
  markers: string[];
  notes: string;
}

export async function getConditionsByTrip(tripId: string): Promise<Conditions | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("conditions")
    .select("*")
    .eq("trip_id", tripId)
    .maybeSingle();
  return (data as Conditions | null) ?? null;
}

export async function upsertConditions(input: Omit<Conditions, "id" | "user_id">) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("conditions")
    .upsert(
      {
        ...input,
        user_id: user.id,
      },
      { onConflict: "trip_id" },
    );
  if (error) throw error;
}
