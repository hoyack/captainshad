import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";

// Returns the authenticated user or null. Use in Server Components.
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Server-only guard. Redirects to /login if no session.
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
