import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStripe, STRIPE_PRO_PRICE_ID } from "@/lib/stripe";
import { getMyProfile, updateMyProfile } from "@/lib/db/profiles";

export async function POST() {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !STRIPE_PRO_PRICE_ID) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY and STRIPE_PRO_PRICE_ID required in .env" },
        { status: 500 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await getMyProfile();
    if (!profile) return NextResponse.json({ error: "No profile" }, { status: 400 });

    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    let customerId = profile.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      await updateMyProfile({}); // touch updated_at
      // Persist customer id (separate update because ProfileUpdate type doesn't include stripe_*)
      await supabase
        .from("user_profile")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: STRIPE_PRO_PRICE_ID, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?upgrade=success`,
      cancel_url: `${baseUrl}/settings/billing?upgrade=cancel`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[stripe/checkout]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Stripe error" },
      { status: 500 },
    );
  }
}
