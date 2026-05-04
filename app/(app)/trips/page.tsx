import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listTrips } from "@/lib/db/trips";
import { SPECIES_OPTIONS, WATER_BODIES, lookupLabel } from "@/lib/local-data";
import { formatDate } from "@/lib/utils";

export default async function TripsListPage() {
  const trips = await listTrips();

  return (
    <AppShell title="Trips">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-neutral-600">{trips.length} total</p>
        <Link href="/trips/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> New trip
          </Button>
        </Link>
      </div>
      {trips.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No trips yet</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/trips/new">
              <Button>Log your first trip</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {trips.map((t) => (
            <Link key={t.id} href={`/trips/${t.id}`}>
              <Card className="hover:border-bay-300">
                <CardContent className="py-3">
                  <div className="font-medium text-sm">{t.title}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {formatDate(t.trip_date)}
                    {t.water_body ? ` · ${lookupLabel(WATER_BODIES, t.water_body)}` : ""}
                    {t.client?.name ? ` · ${t.client.name}` : ""}
                  </div>
                  {t.target_species.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {t.target_species.slice(0, 3).map((s) => (
                        <Badge key={s} variant="default">
                          {lookupLabel(SPECIES_OPTIONS, s)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
