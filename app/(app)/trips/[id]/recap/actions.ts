"use server";

import { revalidatePath } from "next/cache";
import {
  publishShare,
  revokeShare,
  rotateShareToken,
} from "@/lib/db/shares";

export async function publishShareAction(tripId: string) {
  const share = await publishShare(tripId);
  revalidatePath(`/trips/${tripId}/recap`);
  return share;
}

export async function rotateShareAction(tripId: string) {
  const share = await rotateShareToken(tripId);
  revalidatePath(`/trips/${tripId}/recap`);
  return share;
}

export async function revokeShareAction(tripId: string) {
  await revokeShare(tripId);
  revalidatePath(`/trips/${tripId}/recap`);
}
