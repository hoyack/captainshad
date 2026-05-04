import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET not set" }, { status: 500 });
  }
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const stripe = getStripe();
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error("[stripe webhook] bad signature", e);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  const updateProfile = async (
    customerId: string,
    patch: {
      subscription_tier?: "free" | "pro";
      subscription_status?:
        | "inactive"
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid";
      current_period_end?: string | null;
    },
  ) => {
    await admin
      .from("user_profile")
      .update(patch)
      .eq("stripe_customer_id", customerId);
  };

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const periodEnd = sub.items?.data[0]?.current_period_end;
        await updateProfile(sub.customer as string, {
          subscription_tier: sub.status === "active" || sub.status === "trialing" ? "pro" : "free",
          subscription_status: sub.status as
            | "inactive"
            | "trialing"
            | "active"
            | "past_due"
            | "canceled"
            | "unpaid",
          current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        });
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await updateProfile(sub.customer as string, {
          subscription_tier: "free",
          subscription_status: "canceled",
          current_period_end: null,
        });
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
          await updateProfile(invoice.customer as string, {
            subscription_status: "past_due",
          });
        }
        break;
      }
    }
  } catch (e) {
    console.error("[stripe webhook] handler error", e);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
