"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createTrip, deleteTrip, updateTrip } from "@/lib/db/trips";
import { ensureCanCreateTrip } from "@/lib/billing";

export async function createTripAction(input: {
  trip_date: string;
  title: string;
  client_id: string | null;
  general_area: string;
  launch_location: string;
  water_body: string;
  boat_type: string;
  target_species: string[];
  privacy_level: "private" | "pattern_only" | "public_safe";
  notes: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: "UPGRADE_REQUIRED" | string }> {
  try {
    await ensureCanCreateTrip();
  } catch (e) {
    if (e instanceof Error && e.message === "UPGRADE_REQUIRED") {
      return { ok: false, error: "UPGRADE_REQUIRED" };
    }
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }

  try {
    const trip = await createTrip(input);
    revalidatePath("/trips");
    revalidatePath("/dashboard");
    return { ok: true, id: trip.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to create trip" };
  }
}

export async function updateTripAction(
  id: string,
  patch: Parameters<typeof updateTrip>[1],
) {
  await updateTrip(id, patch);
  revalidatePath(`/trips/${id}`);
  revalidatePath("/trips");
}

export async function deleteTripAction(id: string) {
  await deleteTrip(id);
  revalidatePath("/trips");
  revalidatePath("/dashboard");
  redirect("/trips");
}
