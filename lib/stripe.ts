import Stripe from "stripe";

export const PLAN = {
  free: {
    id: "free" as const,
    name: "Free",
    priceMonthly: 0,
    tripCap: 3,
    features: [
      "Up to 3 trips",
      "AI-generated pattern cards",
      "Public share links",
    ],
  },
  pro: {
    id: "pro" as const,
    name: "Pro",
    priceMonthly: 29,
    tripCap: Infinity,
    features: [
      "Unlimited trips",
      "Client list + history",
      "Share-link view stats",
      "Priority AI generation",
    ],
  },
};

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
