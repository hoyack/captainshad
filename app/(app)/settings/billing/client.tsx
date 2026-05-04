"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function BillingActions({ mode }: { mode: "upgrade" | "manage" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const go = async (path: string) => {
    setBusy(true);
    setError(undefined);
    try {
      const res = await fetch(path, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data?.error ?? "Failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setBusy(false);
    }
  };

  return (
    <div>
      {mode === "upgrade" ? (
        <Button onClick={() => go("/api/stripe/checkout")} disabled={busy} className="w-full">
          {busy ? "Redirecting…" : "Upgrade — $29/mo"}
        </Button>
      ) : (
        <Button
          onClick={() => go("/api/stripe/portal")}
          disabled={busy}
          variant="outline"
          className="w-full"
        >
          {busy ? "Redirecting…" : "Manage subscription"}
        </Button>
      )}
      {error && (
        <div className="mt-2 text-sm text-red-700">
          {error.includes("STRIPE")
            ? "Stripe isn't configured yet. Add STRIPE_SECRET_KEY + STRIPE_PRO_PRICE_ID to .env."
            : error}
        </div>
      )}
    </div>
  );
}
