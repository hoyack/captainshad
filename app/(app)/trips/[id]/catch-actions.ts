"use server";

import { revalidatePath } from "next/cache";
import { createCatch, deleteCatch, type Catch } from "@/lib/db/catches";

export async function createCatchAction(input: Parameters<typeof createCatch>[0]): Promise<Catch> {
  const c = await createCatch(input);
  revalidatePath(`/trips/${input.trip_id}`);
  return c;
}

export async function deleteCatchAction(id: string) {
  // We don't know the trip id here without an extra query; revalidate /trips broadly.
  await deleteCatch(id);
  revalidatePath("/trips", "layout");
}
