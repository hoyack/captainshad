import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export async function listClients(): Promise<Client[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("client")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Client[];
}

export async function getClient(id: string): Promise<Client | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("client").select("*").eq("id", id).single();
  return (data as Client | null) ?? null;
}

export async function createClient(input: {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}): Promise<Client> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("client")
    .insert({
      user_id: user.id,
      name: input.name,
      email: input.email ?? "",
      phone: input.phone ?? "",
      notes: input.notes ?? "",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Client;
}

export async function updateClient(
  id: string,
  patch: Partial<Pick<Client, "name" | "email" | "phone" | "notes">>,
) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("client").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteClient(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("client").delete().eq("id", id);
  if (error) throw error;
}
