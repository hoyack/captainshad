"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, deleteClient, updateClient } from "@/lib/db/clients";

export async function createClientAction(input: {
  name: string;
  email: string;
  phone: string;
  notes: string;
  returnTo?: string;
}) {
  const c = await createClient(input);
  revalidatePath("/clients");
  if (input.returnTo) redirect(input.returnTo);
  redirect(`/clients/${c.id}`);
}

export async function updateClientAction(
  id: string,
  patch: Parameters<typeof updateClient>[1],
) {
  await updateClient(id, patch);
  revalidatePath(`/clients/${id}`);
  revalidatePath("/clients");
}

export async function deleteClientAction(id: string) {
  await deleteClient(id);
  revalidatePath("/clients");
  redirect("/clients");
}
