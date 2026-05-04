import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface Trip {
  id: string;
  user_id: string;
  client_id: string | null;
  trip_date: string;
  title: string;
  general_area: string;
  launch_location: string;
  water_body: string;
  boat_type: string;
  target_species: string[];
  privacy_level: "private" | "pattern_only" | "public_safe";
  status: "scheduled" | "in_progress" | "completed" | "archived";
  notes: string;
  created_at: string;
  updated_at: string;
}

export type TripWithClient = Trip & {
  client: { id: string; name: string; email: string; phone: string } | null;
};

export async function listTrips(opts?: {
  limit?: number;
  status?: Trip["status"];
}): Promise<TripWithClient[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("trip")
    .select("*, client:client_id (id, name, email, phone)")
    .order("trip_date", { ascending: false });
  if (opts?.status) query = query.eq("status", opts.status);
  if (opts?.limit) query = query.limit(opts.limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as TripWithClient[];
}

export async function countTrips(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("trip")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function getTrip(id: string): Promise<TripWithClient | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("trip")
    .select("*, client:client_id (id, name, email, phone)")
    .eq("id", id)
    .single();
  return (data as unknown as TripWithClient | null) ?? null;
}

export async function createTrip(input: {
  trip_date: string;
  title: string;
  client_id?: string | null;
  general_area?: string;
  launch_location?: string;
  water_body?: string;
  boat_type?: string;
  target_species?: string[];
  privacy_level?: Trip["privacy_level"];
  status?: Trip["status"];
  notes?: string;
}): Promise<Trip> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("trip")
    .insert({
      user_id: user.id,
      client_id: input.client_id ?? null,
      trip_date: input.trip_date,
      title: input.title,
      general_area: input.general_area ?? "",
      launch_location: input.launch_location ?? "",
      water_body: input.water_body ?? "",
      boat_type: input.boat_type ?? "",
      target_species: input.target_species ?? [],
      privacy_level: input.privacy_level ?? "private",
      status: input.status ?? "completed",
      notes: input.notes ?? "",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Trip;
}

export async function updateTrip(
  id: string,
  patch: Partial<Omit<Trip, "id" | "user_id" | "created_at" | "updated_at">>,
) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("trip").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteTrip(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("trip").delete().eq("id", id);
  if (error) throw error;
}
