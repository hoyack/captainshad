"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, BookOpen, Users, ExternalLink, Calendar } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { TripCard } from "@/components/TripCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listTrips, listPatterns } from "@/lib/storage";
import type { PatternCard, Trip } from "@/lib/schemas";
import {
  getCurrentMonthIndex,
  getMonthCalendar,
  monthName,
  topTargetsForMonth,
} from "@/lib/fish-dataset";

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [patterns, setPatterns] = useState<PatternCard[]>([]);

  useEffect(() => {
    setTrips(listTrips());
    setPatterns(listPatterns());
  }, []);

  const patternByTrip = new Set(patterns.map((p) => p.trip_id));

  const month = getCurrentMonthIndex();
  const monthCal = getMonthCalendar(month);
  const topTargets = topTargetsForMonth(month);

  return (
    <AppShell>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-bay-900 leading-tight">
          Turn your guided trip into a fishing playbook.
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Capture conditions, generate a pattern card, share without burning a guide&apos;s spots.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Link href="/trip/new">
            <Button size="lg" className="w-full">
              <Plus className="h-4 w-4" />
              Start new trip
            </Button>
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/playbook">
              <Button variant="outline" className="w-full">
                <BookOpen className="h-4 w-4" />
                Playbook
              </Button>
            </Link>
            <Link href="/guide">
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4" />
                Guide mode
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {monthCal && (
        <section className="mb-6">
          <Card className="border-bay-200 bg-gradient-to-br from-bay-50 to-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-bay-700" />
                <CardTitle className="text-sm">In season — {monthName(month)}</CardTitle>
              </div>
              <CardDescription className="mt-1">{monthCal.pattern}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1.5">
                Top targets
              </div>
              <div className="flex flex-wrap gap-1.5">
                {topTargets.map((s) => (
                  <Badge key={s.id} variant="success">
                    {s.common_name}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 text-xs text-neutral-600">
                Water temp this month: {monthCal.water_temp_range_f[0]}°–
                {monthCal.water_temp_range_f[1]}°F
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="mb-6">
        <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
          Recent trips
        </h3>
        {trips.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">No trips yet</CardTitle>
              <CardDescription>
                Log your first guided or solo trip to get started.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-3">
            {trips.slice(0, 5).map((t) => (
              <TripCard key={t.id} trip={t} hasPattern={patternByTrip.has(t.id)} />
            ))}
          </div>
        )}
      </section>

      {patterns.length > 0 && (
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
            Saved patterns
          </h3>
          <div className="space-y-2">
            {patterns.slice(0, 3).map((p) => (
              <Link key={p.id} href={`/trip/${p.trip_id}/pattern`} className="block">
                <Card className="hover:border-bay-300 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-sm line-clamp-1">{p.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{p.summary}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Texas regulations</CardTitle>
            <CardDescription>
              Bag/length and license rules change. Always check TPWD before keeping fish.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="https://tpwd.texas.gov/regulations/outdoor-annual/fishing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-bay-700 inline-flex items-center gap-1 underline"
            >
              Open TPWD Outdoor Annual <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
