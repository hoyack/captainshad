import { PLAN } from "./stripe";
import { countTrips } from "./db/trips";
import { getMyProfile } from "./db/profiles";

export type Tier = "free" | "pro";

export function isPro(profile: { subscription_tier: Tier; subscription_status: string }): boolean {
  return (
    profile.subscription_tier === "pro" &&
    (profile.subscription_status === "active" || profile.subscription_status === "trialing")
  );
}

// Server-side gate. Throws an Error with a recognizable message that the caller
// can convert into an UpgradeBanner when blocking trip creation.
export async function ensureCanCreateTrip(): Promise<void> {
  const profile = await getMyProfile();
  if (!profile) throw new Error("Not authenticated");
  if (isPro(profile)) return;
  const used = await countTrips();
  if (used >= PLAN.free.tripCap) {
    const err = new Error("UPGRADE_REQUIRED");
    err.name = "UpgradeRequired";
    throw err;
  }
}

export async function getTripQuota(): Promise<{
  tier: Tier;
  used: number;
  cap: number;
  unlimited: boolean;
}> {
  const profile = await getMyProfile();
  const used = profile ? await countTrips() : 0;
  const tier: Tier = profile?.subscription_tier ?? "free";
  const pro = profile ? isPro(profile) : false;
  return {
    tier: pro ? "pro" : "free",
    used,
    cap: pro ? Infinity : PLAN.free.tripCap,
    unlimited: pro,
  };
}
