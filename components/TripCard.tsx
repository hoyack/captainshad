import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { PrivacyBadge } from "./PrivacyBadge";
import type { Trip } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";
import { SPECIES_OPTIONS, WATER_BODIES, lookupLabel } from "@/lib/local-data";

export function TripCard({ trip, hasPattern }: { trip: Trip; hasPattern?: boolean }) {
  return (
    <Link href={`/trip/${trip.id}`} className="block">
      <Card className="hover:border-bay-300 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
            <PrivacyBadge level={trip.privacy_level} />
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            {formatDate(trip.trip_date)}
            {trip.water_body ? ` · ${lookupLabel(WATER_BODIES, trip.water_body)}` : ""}
            {trip.guide_name ? ` · w/ ${trip.guide_name}` : ""}
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1.5">
          {trip.target_species.slice(0, 3).map((s) => (
            <Badge key={s} variant="default">
              {lookupLabel(SPECIES_OPTIONS, s)}
            </Badge>
          ))}
          {hasPattern && <Badge variant="success">Pattern saved</Badge>}
          {trip.trip_type === "guided" && <Badge variant="sand">Guided</Badge>}
        </CardContent>
      </Card>
    </Link>
  );
}
