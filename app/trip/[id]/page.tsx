"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Plus,
  Cloud,
  MessageSquare,
  Sparkles,
  Share2,
  Image as ImageIcon,
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
import {
  deleteCatch,
  deleteTrip,
  getConditionsByTrip,
  getDebriefByTrip,
  getPatternByTrip,
  getTrip,
  listCatchesByTrip,
} from "@/lib/storage";
import {
  type Catch,
  type Conditions,
  type Debrief,
  type PatternCard,
  type Trip,
} from "@/lib/schemas";
import {
  SPECIES_OPTIONS,
  STRUCTURE_OPTIONS,
  TIDE_STAGES,
  WATER_BODIES,
  WATER_CLARITY,
  lookupLabel,
} from "@/lib/local-data";
import { formatDate, formatTime } from "@/lib/utils";

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | undefined>();
  const [catches, setCatches] = useState<Catch[]>([]);
  const [conditions, setConditions] = useState<Conditions | undefined>();
  const [debrief, setDebrief] = useState<Debrief | undefined>();
  const [pattern, setPattern] = useState<PatternCard | undefined>();

  const refresh = () => {
    setTrip(getTrip(id));
    setCatches(listCatchesByTrip(id));
    setConditions(getConditionsByTrip(id));
    setDebrief(getDebriefByTrip(id));
    setPattern(getPatternByTrip(id));
  };

  useEffect(() => {
    refresh();
  }, [id]);

  if (!trip) {
    return (
      <AppShell title="Trip" back={{ href: "/" }}>
        <Card>
          <CardHeader>
            <CardTitle>Trip not found</CardTitle>
            <CardDescription>
              It may have been deleted on this device.
            </CardDescription>
          </CardHeader>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={trip.title}
      back={{ href: "/" }}
      right={
        <button
          onClick={() => {
            if (confirm("Delete this trip and all its data?")) {
              deleteTrip(trip.id);
              router.push("/");
            }
          }}
          className="text-bay-100 hover:text-white"
          aria-label="Delete trip"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      }
    >
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
                {trip.guide_name ? ` · w/ ${trip.guide_name}` : ""}
              </CardDescription>
            </div>
            <PrivacyBadge level={trip.privacy_level} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1.5">
          {trip.target_species.map((s) => (
            <Badge key={s}>{lookupLabel(SPECIES_OPTIONS, s)}</Badge>
          ))}
          {trip.trip_type === "guided" && <Badge variant="sand">Guided</Badge>}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Link href={`/trip/${id}/catch/new`}>
          <Button variant="primary" className="w-full">
            <Plus className="h-4 w-4" /> Add catch
          </Button>
        </Link>
        <Link href={`/trip/${id}/conditions`}>
          <Button variant="outline" className="w-full">
            <Cloud className="h-4 w-4" />
            {conditions ? "Edit conditions" : "Log conditions"}
          </Button>
        </Link>
        <Link href={`/trip/${id}/debrief`}>
          <Button variant="outline" className="w-full">
            <MessageSquare className="h-4 w-4" />
            {debrief ? "Edit debrief" : "Run debrief"}
          </Button>
        </Link>
        <Link href={`/trip/${id}/pattern`}>
          <Button variant={pattern ? "outline" : "primary"} className="w-full">
            <Sparkles className="h-4 w-4" />
            {pattern ? "View pattern" : "Generate pattern"}
          </Button>
        </Link>
      </div>

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
                  {c.photo_data_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.photo_data_url}
                      alt=""
                      className="h-16 w-16 rounded-lg object-cover bg-neutral-100"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-bay-50 flex items-center justify-center text-bay-300">
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
                  <button
                    onClick={() => {
                      if (confirm("Delete this catch?")) {
                        deleteCatch(c.id);
                        refresh();
                      }
                    }}
                    className="text-neutral-400 hover:text-red-600"
                    aria-label="Delete catch"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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

      <div className="grid grid-cols-2 gap-2">
        <Link href={`/trip/${id}/share`}>
          <Button variant="ghost" className="w-full">
            <Share2 className="h-4 w-4" /> Share recap
          </Button>
        </Link>
        {trip.trip_type === "guided" && (
          <Link href={`/guide/recap/${id}`}>
            <Button variant="ghost" className="w-full">
              Guide recap
            </Button>
          </Link>
        )}
      </div>
    </AppShell>
  );
}
