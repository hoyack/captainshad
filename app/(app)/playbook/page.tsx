import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listPatterns } from "@/lib/db/patterns";
import { listTrips } from "@/lib/db/trips";
import { SPECIES_OPTIONS, WATER_BODIES, lookupLabel } from "@/lib/local-data";
import { formatDate } from "@/lib/utils";

export default async function PlaybookPage() {
  const [patterns, trips] = await Promise.all([listPatterns(), listTrips()]);
  const tripById = new Map(trips.map((t) => [t.id, t]));

  return (
    <AppShell title="Playbook">
      <p className="text-sm text-neutral-600 mb-3">
        {patterns.length} pattern{patterns.length === 1 ? "" : "s"} saved across all your trips.
      </p>
      {patterns.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No patterns yet</CardTitle>
            <CardDescription>
              Generate a pattern card on a trip and it shows up here for easy reference.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-2">
          {patterns.map((p) => {
            const trip = tripById.get(p.trip_id);
            return (
              <Link key={p.id} href={`/trips/${p.trip_id}/pattern`}>
                <Card className="hover:border-bay-300">
                  <CardHeader>
                    <CardTitle className="text-base line-clamp-1">{p.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{p.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center gap-1.5">
                    {p.target_species.slice(0, 3).map((s) => (
                      <Badge key={s} variant="success">
                        {lookupLabel(SPECIES_OPTIONS, s) || s}
                      </Badge>
                    ))}
                    {trip?.water_body && (
                      <Badge>{lookupLabel(WATER_BODIES, trip.water_body)}</Badge>
                    )}
                    {trip && (
                      <span className="text-xs text-neutral-500 ml-auto">
                        {formatDate(trip.trip_date)}
                      </span>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
