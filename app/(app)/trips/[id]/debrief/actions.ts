"use server";

import { revalidatePath } from "next/cache";
import { upsertDebrief, type Debrief } from "@/lib/db/debriefs";

export async function saveDebriefAction(input: Omit<Debrief, "id" | "user_id">) {
  await upsertDebrief(input);
  revalidatePath(`/trips/${input.trip_id}`);
}
