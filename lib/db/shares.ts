import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { randomBytes } from "node:crypto";

export interface RecapShare {
  id: string;
  trip_id: string;
  user_id: string;
  token: string;
  view_count: number;
  last_viewed_at: string | null;
  expires_at: string | null;
  created_at: string;
}

function newToken(): string {
  return randomBytes(24).toString("base64url");
}

export async function getShareByTrip(tripId: string): Promise<RecapShare | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("recap_share")
    .select("*")
    .eq("trip_id", tripId)
    .maybeSingle();
  return (data as RecapShare | null) ?? null;
}

export async function publishShare(tripId: string): Promise<RecapShare> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // If a share already exists, return it; otherwise create.
  const existing = await getShareByTrip(tripId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("recap_share")
    .insert({ trip_id: tripId, user_id: user.id, token: newToken() })
    .select("*")
    .single();
  if (error) throw error;
  return data as RecapShare;
}

export async function revokeShare(tripId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("recap_share").delete().eq("trip_id", tripId);
  if (error) throw error;
}

export async function rotateShareToken(tripId: string): Promise<RecapShare> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("recap_share")
    .update({ token: newToken(), view_count: 0, last_viewed_at: null })
    .eq("trip_id", tripId)
    .select("*")
    .single();
  if (error) throw error;
  return data as RecapShare;
}

// Public path — used by the unauthenticated /r/[token] route.
// Uses service-role client to bypass RLS; the token IS the access control.
export async function getPublicRecapByToken(token: string) {
  const admin = createSupabaseAdminClient();
  const { data: share } = await admin
    .from("recap_share")
    .select("*")
    .eq("token", token)
    .maybeSingle();
  if (!share) return null;

  const [tripRes, profileRes, catchesRes, conditionsRes, patternRes] = await Promise.all([
    admin.from("trip").select("*, client:client_id (id, name)").eq("id", share.trip_id).single(),
    admin.from("user_profile").select("*").eq("id", share.user_id).single(),
    admin.from("catch").select("*").eq("trip_id", share.trip_id).order("time_caught"),
    admin.from("conditions").select("*").eq("trip_id", share.trip_id).maybeSingle(),
    admin.from("pattern_card").select("*").eq("trip_id", share.trip_id).maybeSingle(),
  ]);

  // Increment view stats. Awaited because Next.js cancels unawaited work when the response finalizes.
  await admin
    .from("recap_share")
    .update({
      view_count: (share.view_count ?? 0) + 1,
      last_viewed_at: new Date().toISOString(),
    })
    .eq("id", share.id);

  return {
    share: share as RecapShare,
    trip: tripRes.data,
    guide: profileRes.data,
    catches: catchesRes.data ?? [],
    conditions: conditionsRes.data,
    pattern: patternRes.data,
  };
}
