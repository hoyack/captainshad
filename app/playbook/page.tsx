"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
import { ChipGroup } from "@/components/ui/chip";
import { listPatterns, listTrips } from "@/lib/storage";
import type { PatternCard, Trip } from "@/lib/schemas";
import { SPECIES_OPTIONS, WATER_BODIES, lookupLabel } from "@/lib/local-data";
import { formatDate } from "@/lib/utils";

export default function PlaybookPage() {
  const [patterns, setPatterns] = useState<PatternCard[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [speciesFilter, setSpeciesFilter] = useState<string[]>([]);
  const [waterFilter, setWaterFilter] = useState<string[]>([]);

  useEffect(() => {
    setPatterns(listPatterns());
    setTrips(listTrips());
  }, []);

  const tripById = useMemo(() => {
    const m = new Map<string, Trip>();
    trips.forEach((t) => m.set(t.id, t));
    return m;
  }, [trips]);

  const filtered = patterns.filter((p) => {
    if (speciesFilter.length > 0) {
      if (!p.target_species.some((s) => speciesFilter.includes(s))) return false;
    }
    if (waterFilter.length > 0) {
      const trip = tripById.get(p.trip_id);
      if (!trip || !waterFilter.includes(trip.water_body)) return false;
    }
    return true;
  });

  return (
    <AppShell title="Playbook" back={{ href: "/" }}>
      {patterns.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No patterns saved yet</CardTitle>
            <CardDescription>
              Generate a pattern card on a trip and it will live here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline">Back to home</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm">Filter by species</CardTitle>
            </CardHeader>
            <CardContent>
              <ChipGroup
                multi
                options={SPECIES_OPTIONS}
                value={speciesFilter}
                onChange={(v) => setSpeciesFilter(v as string[])}
              />
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm">Filter by water</CardTitle>
            </CardHeader>
            <CardContent>
              <ChipGroup
                multi
                options={WATER_BODIES}
                value={waterFilter}
                onChange={(v) => setWaterFilter(v as string[])}
              />
            </CardContent>
          </Card>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-6">
                No patterns match those filters.
              </p>
            ) : (
              filtered.map((p) => {
                const trip = tripById.get(p.trip_id);
                return (
                  <Link key={p.id} href={`/trip/${p.trip_id}/pattern`} className="block">
                    <Card className="hover:border-bay-300 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-base">{p.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{p.summary}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-wrap items-center gap-1.5">
                        {p.target_species.slice(0, 3).map((s) => (
                          <Badge key={s} variant="success">{s}</Badge>
                        ))}
                        {trip?.water_body && (
                          <Badge variant="default">
                            {lookupLabel(WATER_BODIES, trip.water_body)}
                          </Badge>
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
              })
            )}
          </div>
        </>
      )}
    </AppShell>
  );
}
