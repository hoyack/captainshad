"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [info, setInfo] = useState<string | undefined>();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setInfo(undefined);
    setBusy(true);

    const supabase = createSupabaseBrowserClient();
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        // With email confirmations disabled, signUp returns a session immediately.
        // If a hosted project re-enables confirmations later, fall back to the
        // "check your inbox" message instead of leaving the user staring at a spinner.
        if (data.session) {
          router.push(next);
          router.refresh();
        } else {
          setInfo("Check your inbox to confirm your email, then sign in.");
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        router.push(next);
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-app py-10 max-w-sm">
      <h1 className="text-2xl font-bold text-bay-900 text-center mb-6">
        {mode === "signup" ? "Create your account" : "Welcome back"}
      </h1>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" required>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Password" required hint={mode === "signup" ? "At least 6 characters" : undefined}>
          <Input
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </Field>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-900">
            {error}
          </div>
        )}
        {info && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-900">
            {info}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? "…" : mode === "signup" ? "Create account" : "Sign in"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-center text-neutral-600">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-bay-700 underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="text-bay-700 underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
