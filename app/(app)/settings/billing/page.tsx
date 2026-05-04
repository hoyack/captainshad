import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMyProfile } from "@/lib/db/profiles";
import { getTripQuota } from "@/lib/billing";
import { PLAN } from "@/lib/stripe";
import { BillingActions } from "./client";

export default async function BillingPage() {
  const [profile, quota] = await Promise.all([getMyProfile(), getTripQuota()]);
  const isPro = quota.unlimited;

  return (
    <AppShell title="Billing" back={{ href: "/settings/profile" }}>
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current plan</CardTitle>
            <Badge variant={isPro ? "success" : "muted"}>
              {isPro ? "Pro" : "Free"}
            </Badge>
          </div>
          <CardDescription>
            {isPro
              ? `Renews ${profile?.current_period_end ? new Date(profile.current_period_end).toLocaleDateString() : "—"}`
              : `Used ${quota.used} of ${quota.cap} free trips`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPro ? (
            <BillingActions mode="manage" />
          ) : (
            <>
              <p className="text-sm text-neutral-700 mb-3">
                Upgrade to Pro for unlimited trips, client management, and recap view stats.
              </p>
              <BillingActions mode="upgrade" />
            </>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Pro includes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-neutral-700 space-y-1.5">
            {PLAN.pro.features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="text-bay-600">✓</span> {f}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-semibold text-bay-900">
            ${PLAN.pro.priceMonthly}/month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-3 text-xs text-neutral-600">
          See <Link href="/pricing" className="underline">/pricing</Link> for details.
        </CardContent>
      </Card>
    </AppShell>
  );
}
