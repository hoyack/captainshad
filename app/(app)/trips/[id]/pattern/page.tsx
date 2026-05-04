import { AppShell } from "@/components/AppShell";
import { getTrip } from "@/lib/db/trips";
import { listCatchesByTrip } from "@/lib/db/catches";
import { getConditionsByTrip } from "@/lib/db/conditions";
import { getDebriefByTrip } from "@/lib/db/debriefs";
import { getPatternByTrip } from "@/lib/db/patterns";
import { notFound } from "next/navigation";
import { PatternClient } from "./client";

export default async function PatternPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [trip, catches, conditions, debrief, existing] = await Promise.all([
    getTrip(id),
    listCatchesByTrip(id),
    getConditionsByTrip(id),
    getDebriefByTrip(id),
    getPatternByTrip(id),
  ]);
  if (!trip) notFound();

  return (
    <AppShell title="Pattern card" back={{ href: `/trips/${id}` }}>
      <PatternClient
        tripId={id}
        existing={existing}
        counts={{
          catches: catches.length,
          conditions: !!conditions,
          debrief: !!debrief,
        }}
      />
    </AppShell>
  );
}
