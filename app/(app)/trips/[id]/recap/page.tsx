import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getTrip } from "@/lib/db/trips";
import { getShareByTrip } from "@/lib/db/shares";
import { RecapClient } from "./client";
import { headers } from "next/headers";

export default async function RecapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTrip(id);
  if (!trip) notFound();
  const share = await getShareByTrip(id);

  // Build absolute origin for share URLs.
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;

  return (
    <AppShell title="Client recap" back={{ href: `/trips/${id}` }}>
      <RecapClient
        tripId={id}
        tripTitle={trip.title}
        origin={origin}
        initialShare={share}
      />
    </AppShell>
  );
}
