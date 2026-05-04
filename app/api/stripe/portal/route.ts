import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { getMyProfile } from "@/lib/db/profiles";

export async function POST() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY required" }, { status: 500 });
    }
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await getMyProfile();
    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: "No customer record" }, { status: 400 });
    }

    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${baseUrl}/settings/billing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[stripe/portal]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Stripe error" },
      { status: 500 },
    );
  }
}
