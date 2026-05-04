import { createClient } from "@supabase/supabase-js";

// Service-role client. Bypasses RLS — only use in server-only code paths
// (Server Actions / Route Handlers) where the access pattern itself
// enforces authorization (e.g. fetching a public recap by token).
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
