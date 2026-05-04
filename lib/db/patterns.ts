import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PatternCard {
  id: string;
  trip_id: string;
  user_id: string;
  title: string;
  summary: string;
  target_species: string[];
  tide_pattern: string;
  wind_pattern: string;
  structure_pattern: string;
  bait_pattern: string;
  presentation_pattern: string;
  bite_window: string;
  why_it_worked: string;
  what_to_try_next_time: string;
  confidence_score: number;
  privacy_warning: string;
  conservation_note: string;
  created_at: string;
}

export async function listPatterns(): Promise<PatternCard[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pattern_card")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PatternCard[];
}

export async function getPatternByTrip(tripId: string): Promise<PatternCard | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("pattern_card")
    .select("*")
    .eq("trip_id", tripId)
    .maybeSingle();
  return (data as PatternCard | null) ?? null;
}

export async function upsertPattern(input: Omit<PatternCard, "id" | "user_id" | "created_at">) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("pattern_card")
    .upsert({ ...input, user_id: user.id }, { onConflict: "trip_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data as PatternCard;
}
