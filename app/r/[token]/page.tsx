import { notFound } from "next/navigation";
import Link from "next/link";
import { Fish } from "lucide-react";
import { getPublicRecapByToken } from "@/lib/db/shares";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { RecapView } from "@/components/RecapView";

export const dynamic = "force-dynamic";

export default async function PublicRecapPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getPublicRecapByToken(token);
  if (!data || !data.trip || !data.guide) notFound();

  // Sign storage URLs server-side using the admin client.
  const admin = createSupabaseAdminClient();
  const photoUrls: Record<string, string> = {};
  await Promise.all(
    data.catches
      .filter((c) => c.photo_url)
      .map(async (c) => {
        const { data: signed } = await admin.storage
          .from("catches")
          .createSignedUrl(c.photo_url as string, 3600);
        if (signed?.signedUrl) photoUrls[c.id] = signed.signedUrl;
      }),
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-bay-100">
        <div className="container-app flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-bay-800">
            <Fish className="h-5 w-5" />
            <span>Captain Shad</span>
          </Link>
          <span className="text-xs text-neutral-500">Trip recap</span>
        </div>
      </header>
      <main className="container-app py-4">
        <RecapView
          trip={{
            id: data.trip.id,
            title: data.trip.title,
            trip_date: data.trip.trip_date,
            water_body: data.trip.water_body,
            launch_location: data.trip.launch_location,
            target_species: data.trip.target_species ?? [],
            privacy_level: data.trip.privacy_level,
          }}
          guide={{
            guide_name: data.guide.guide_name,
            company_name: data.guide.company_name,
            booking_url: data.guide.booking_url,
            logo_url: data.guide.logo_url,
            privacy_defaults: data.guide.privacy_defaults,
          }}
          catches={data.catches.map((c) => ({
            id: c.id,
            species: c.species,
            photo_url: c.photo_url,
          }))}
          conditions={
            data.conditions
              ? {
                  tide_stage: data.conditions.tide_stage,
                  wind_direction: data.conditions.wind_direction,
                  wind_speed_mph: data.conditions.wind_speed_mph,
                  water_clarity: data.conditions.water_clarity,
                }
              : null
          }
          pattern={data.pattern}
          photoUrls={photoUrls}
        />
      </main>
    </div>
  );
}
