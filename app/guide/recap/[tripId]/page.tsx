"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ExternalLink, MapPin, Star } from "lucide-react";
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
import { PatternCardView } from "@/components/PatternCardView";
import {
  getConditionsByTrip,
  getGuide,
  getPatternByTrip,
  getTrip,
  listCatchesByTrip,
  listGuides,
} from "@/lib/storage";
import type {
  Catch,
  Conditions,
  GuideProfile,
  PatternCard,
  Trip,
} from "@/lib/schemas";
import {
  SPECIES_OPTIONS,
  TIDE_STAGES,
  WATER_BODIES,
  WATER_CLARITY,
  lookupLabel,
} from "@/lib/local-data";
import { formatDate } from "@/lib/utils";

export default function GuideRecapPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);

  const [trip, setTrip] = useState<Trip | undefined>();
  const [catches, setCatches] = useState<Catch[]>([]);
  const [conditions, setConditions] = useState<Conditions | undefined>();
  const [pattern, setPattern] = useState<PatternCard | undefined>();
  const [guide, setGuide] = useState<GuideProfile | undefined>();

  useEffect(() => {
    const t = getTrip(tripId);
    setTrip(t);
    setCatches(listCatchesByTrip(tripId));
    setConditions(getConditionsByTrip(tripId));
    setPattern(getPatternByTrip(tripId));
    if (t?.guide_profile_id) {
      setGuide(getGuide(t.guide_profile_id));
    } else {
      // fall back to first guide profile if any
      const guides = listGuides();
      if (guides.length > 0) setGuide(guides[0]);
    }
  }, [tripId]);

  if (!trip) {
    return (
      <AppShell title="Guide recap" back={{ href: "/guide" }}>
        <Card>
          <CardHeader>
            <CardTitle>Trip not found</CardTitle>
          </CardHeader>
        </Card>
      </AppShell>
    );
  }

  const privacy = guide?.privacy_defaults ?? {
    hide_exact_locations: true,
    hide_route: true,
    allow_pattern_summary: true,
  };

  const catchesWithPhotos = catches.filter((c) => c.photo_data_url);
  const speciesCounts = new Map<string, number>();
  catches.forEach((c) =>
    speciesCounts.set(c.species, (speciesCounts.get(c.species) ?? 0) + 1),
  );

  return (
    <AppShell title="Client recap" back={{ href: "/guide" }}>
      {guide && (
        <Card className="mb-4 border-bay-300 bg-gradient-to-br from-bay-50 to-white">
          <CardContent className="py-4 flex items-center gap-3">
            {guide.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={guide.logo_url}
                alt=""
                className="h-12 w-12 rounded-lg object-cover bg-white border border-bay-200"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-bay-600 text-white flex items-center justify-center font-semibold">
                {guide.guide_name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-bay-900">{guide.guide_name}</div>
              {guide.company_name && (
                <div className="text-xs text-neutral-600">{guide.company_name}</div>
              )}
            </div>
            <PrivacyBadge level="public_safe" />
          </CardContent>
        </Card>
      )}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{trip.title}</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(trip.trip_date)}
            </span>
            {trip.water_body && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {lookupLabel(WATER_BODIES, trip.water_body)}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium text-neutral-700 mb-2">
            Species caught
          </div>
          {speciesCounts.size === 0 ? (
            <p className="text-sm text-neutral-500">No catches logged.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {Array.from(speciesCounts.entries()).map(([species, count]) => (
                <Badge key={species} variant="success">
                  {count} × {lookupLabel(SPECIES_OPTIONS, species)}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {catchesWithPhotos.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {catchesWithPhotos.map((c) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={c.id}
                  src={c.photo_data_url}
                  alt=""
                  className="aspect-square w-full object-cover rounded-md bg-neutral-100"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {conditions && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Day&apos;s conditions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
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
          </CardContent>
        </Card>
      )}

      {!privacy.hide_exact_locations && trip.launch_location && (
        <Card className="mb-4">
          <CardContent className="py-3 text-sm">
            <span className="text-neutral-500">Launch:</span>{" "}
            {trip.launch_location}
          </CardContent>
        </Card>
      )}

      {privacy.allow_pattern_summary && pattern && (
        <section className="mb-4">
          <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
            What you learned
          </h3>
          <PatternCardView pattern={pattern} />
        </section>
      )}

      {!pattern && (
        <Card className="mb-4 border-amber-200 bg-amber-50">
          <CardContent className="py-3 text-xs text-amber-900">
            No pattern card yet. <Link href={`/trip/${trip.id}/pattern`} className="underline">Generate one</Link> to enrich this recap.
          </CardContent>
        </Card>
      )}

      <Card className="mb-4 bg-bay-700 text-white border-bay-700">
        <CardHeader>
          <CardTitle className="text-base text-white">Book again</CardTitle>
          <CardDescription className="text-bay-100">
            Same water, more lessons.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          {guide?.booking_url ? (
            <a href={guide.booking_url} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" className="w-full">
                <ExternalLink className="h-4 w-4" /> Book
              </Button>
            </a>
          ) : (
            <Button variant="secondary" className="w-full" disabled>
              Booking link not set
            </Button>
          )}
          <a
            href={
              guide?.booking_url
                ? guide.booking_url
                : "https://www.google.com/search?q=fishing+guide+review"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" className="w-full">
              <Star className="h-4 w-4" /> Leave review
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="py-3 text-xs text-neutral-600 space-y-1">
          <div>
            Privacy applied:{" "}
            {[
              privacy.hide_exact_locations && "spots hidden",
              privacy.hide_route && "route hidden",
              privacy.allow_pattern_summary
                ? "pattern summary shown"
                : "pattern hidden",
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>
          <div>
            Always check{" "}
            <a
              href="https://tpwd.texas.gov/regulations/outdoor-annual/fishing"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              TPWD
            </a>{" "}
            for current regulations before keeping fish.
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
