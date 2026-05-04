import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface Catch {
  id: string;
  trip_id: string;
  user_id: string;
  species: string;
  time_caught: string;
  approx_length_inches: number | null;
  approx_weight_lbs: number | null;
  kept_or_released: "kept" | "released" | "unknown";
  bait_or_lure: string;
  presentation: string;
  structure_tags: string[];
  water_depth_ft: number | null;
  photo_url: string | null;
  notes: string;
}

export async function listCatchesByTrip(tripId: string): Promise<Catch[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("catch")
    .select("*")
    .eq("trip_id", tripId)
    .order("time_caught", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Catch[];
}

export async function createCatch(input: {
  trip_id: string;
  species: string;
  time_caught: string;
  approx_length_inches?: number | null;
  approx_weight_lbs?: number | null;
  kept_or_released?: Catch["kept_or_released"];
  bait_or_lure?: string;
  presentation?: string;
  structure_tags?: string[];
  water_depth_ft?: number | null;
  photo_url?: string | null;
  notes?: string;
}): Promise<Catch> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("catch")
    .insert({
      user_id: user.id,
      trip_id: input.trip_id,
      species: input.species,
      time_caught: input.time_caught,
      approx_length_inches: input.approx_length_inches ?? null,
      approx_weight_lbs: input.approx_weight_lbs ?? null,
      kept_or_released: input.kept_or_released ?? "released",
      bait_or_lure: input.bait_or_lure ?? "",
      presentation: input.presentation ?? "",
      structure_tags: input.structure_tags ?? [],
      water_depth_ft: input.water_depth_ft ?? null,
      photo_url: input.photo_url ?? null,
      notes: input.notes ?? "",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Catch;
}

export async function deleteCatch(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("catch").delete().eq("id", id);
  if (error) throw error;
}
