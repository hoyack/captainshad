import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Plus,
  Cloud,
  MessageSquare,
  Sparkles,
  Share2,
  ImageIcon,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { getTrip } from "@/lib/db/trips";
import { listCatchesByTrip } from "@/lib/db/catches";
import { getConditionsByTrip } from "@/lib/db/conditions";
import { getDebriefByTrip } from "@/lib/db/debriefs";
import { getPatternByTrip } from "@/lib/db/patterns";
import {
  SPECIES_OPTIONS,
  STRUCTURE_OPTIONS,
  TIDE_STAGES,
  WATER_BODIES,
  WATER_CLARITY,
  lookupLabel,
} from "@/lib/local-data";
import { formatDate, formatTime } from "@/lib/utils";
import { CatchPhoto } from "@/components/CatchPhoto";
import { DeleteTripButton, DeleteCatchButton } from "./client-actions";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTrip(id);
  if (!trip) notFound();

  const [catches, conditions, debrief, pattern] = await Promise.all([
    listCatchesByTrip(id),
    getConditionsByTrip(id),
    getDebriefByTrip(id),
    getPatternByTrip(id),
  ]);

  return (
    <AppShell title={trip.title} back={{ href: "/trips" }} right={<DeleteTripButton id={trip.id} />}>
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle>{trip.title}</CardTitle>
              <CardDescription>
                {formatDate(trip.trip_date)}
                {trip.water_body
                  ? ` · ${lookupLabel(WATER_BODIES, trip.water_body)}`
                  : ""}
                {trip.client?.name ? ` · ${trip.client.name}` : ""}
              </CardDescription>
            </div>
            <PrivacyBadge level={trip.privacy_level} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1.5">
          {trip.target_species.map((s) => (
            <Badge key={s}>{lookupLabel(SPECIES_OPTIONS, s)}</Badge>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Link href={`/trips/${id}/catch/new`}>
          <Button className="w-full">
            <Plus className="h-4 w-4" /> Add catch
          </Button>
        </Link>
        <Link href={`/trips/${id}/conditions`}>
          <Button variant="outline" className="w-full">
            <Cloud className="h-4 w-4" />
            {conditions ? "Edit conditions" : "Log conditions"}
          </Button>
        </Link>
        <Link href={`/trips/${id}/debrief`}>
          <Button variant="outline" className="w-full">
            <MessageSquare className="h-4 w-4" />
            {debrief ? "Edit debrief" : "Run debrief"}
          </Button>
        </Link>
        <Link href={`/trips/${id}/pattern`}>
          <Button variant={pattern ? "outline" : "primary"} className="w-full">
            <Sparkles className="h-4 w-4" />
            {pattern ? "View pattern" : "Generate pattern"}
          </Button>
        </Link>
      </div>

      <Link href={`/trips/${id}/recap`} className="block mb-6">
        <Button variant="primary" className="w-full" size="lg">
          <Share2 className="h-4 w-4" /> Publish client recap
        </Button>
      </Link>

      <section className="mb-6">
        <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
          Catches ({catches.length})
        </h3>
        {catches.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-sm text-neutral-500">
              No catches logged yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {catches.map((c) => (
              <Card key={c.id}>
                <CardContent className="flex gap-3 items-start py-3">
                  {c.photo_url ? (
                    <CatchPhoto path={c.photo_url} />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-bay-50 flex items-center justify-center text-bay-300 shrink-0">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-sm">
                        {lookupLabel(SPECIES_OPTIONS, c.species)}
                        {c.approx_length_inches
                          ? ` · ${c.approx_length_inches}"`
                          : ""}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {formatTime(c.time_caught)}
                      </div>
                    </div>
                    <div className="text-xs text-neutral-600 mt-0.5">
                      {c.bait_or_lure || "—"}
                      {c.kept_or_released ? ` · ${c.kept_or_released}` : ""}
                    </div>
                    {c.structure_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {c.structure_tags.map((s) => (
                          <Badge key={s} variant="muted" className="text-[10px]">
                            {lookupLabel(STRUCTURE_OPTIONS, s)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <DeleteCatchButton id={c.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {conditions && (
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
            Conditions
          </h3>
          <Card>
            <CardContent className="py-3 text-sm space-y-1">
              <div>
                <span className="text-neutral-500">Tide:</span>{" "}
                {lookupLabel(TIDE_STAGES, conditions.tide_stage)}
              </div>
              <div>
                <span className="text-neutral-500">Wind:</span>{" "}
                {conditions.wind_direction}
                {conditions.wind_speed_mph
                  ? ` · ${conditions.wind_speed_mph} mph`
                  : ""}
              </div>
              <div>
                <span className="text-neutral-500">Water:</span>{" "}
                {lookupLabel(WATER_CLARITY, conditions.water_clarity)}
              </div>
              {conditions.markers.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {conditions.markers.map((m) => (
                    <Badge key={m} variant="default">
                      {m.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </AppShell>
  );
}
