"use server";

import { revalidatePath } from "next/cache";
import { updateMyProfile, type ProfileUpdate } from "@/lib/db/profiles";

export async function saveProfileAction(patch: ProfileUpdate) {
  await updateMyProfile(patch);
  revalidatePath("/settings/profile");
  revalidatePath("/dashboard");
}
