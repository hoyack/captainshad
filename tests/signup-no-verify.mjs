// Verifies that signup returns a session immediately (no email confirmation required).
//
// Run with: node --env-file=.env tests/signup-no-verify.mjs
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) {
  console.error(
    "Missing env vars. Run with: node --env-file=.env tests/signup-no-verify.mjs",
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
const cli = createClient(SUPABASE_URL, ANON_KEY);

const email = `noverify+${Date.now()}@captainshad.test`;
const password = "test1234";

const { data, error } = await cli.auth.signUp({ email, password });
if (error) {
  console.log("✗ signUp error:", error.message);
  process.exit(1);
}

console.log("user.id:", data.user?.id);
console.log("user.email_confirmed_at:", data.user?.email_confirmed_at ?? "(not set)");
console.log("session:", data.session ? "present (immediate sign-in)" : "missing (would need email confirm)");

if (!data.session) {
  console.log("\n✗ FAIL: signup returned no session — email confirmation still required.");
  await admin.auth.admin.deleteUser(data.user.id).catch(() => {});
  process.exit(1);
}

// Prove the session works by reading from a protected table immediately
const { data: profile, error: pErr } = await cli
  .from("user_profile")
  .select("id, email, onboarded")
  .eq("id", data.user.id)
  .single();
if (pErr) {
  console.log("✗ FAIL: signed in but cannot read own profile:", pErr.message);
  process.exit(1);
}

console.log("\n✓ Signup → session → authed read all worked in one shot:");
console.log("  profile.email:", profile.email);
console.log("  profile.onboarded:", profile.onboarded);

await admin.auth.admin.deleteUser(data.user.id).catch(() => {});
console.log("\n✓ PASS — registration without email verification works end-to-end.");
