"use server";

import { revalidatePath } from "next/cache";
import { upsertConditions, type Conditions } from "@/lib/db/conditions";

export async function saveConditionsAction(input: Omit<Conditions, "id" | "user_id">) {
  await upsertConditions(input);
  revalidatePath(`/trips/${input.trip_id}`);
}
