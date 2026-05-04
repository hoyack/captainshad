import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface Debrief {
  id: string;
  trip_id: string;
  user_id: string;
  main_pattern: string;
  why_this_area: string;
  what_changed: string;
  bite_turn_on: string;
  bite_shut_off: string;
  what_guide_looked_for: string;
  what_guide_avoided: string;
  try_tomorrow: string;
  practice_for_next: string;
}

export async function getDebriefByTrip(tripId: string): Promise<Debrief | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("debrief")
    .select("*")
    .eq("trip_id", tripId)
    .maybeSingle();
  return (data as Debrief | null) ?? null;
}

export async function upsertDebrief(input: Omit<Debrief, "id" | "user_id">) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("debrief")
    .upsert({ ...input, user_id: user.id }, { onConflict: "trip_id" });
  if (error) throw error;
}
