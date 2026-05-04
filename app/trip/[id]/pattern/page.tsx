"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, RotateCcw, Share2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { PatternCardView } from "@/components/PatternCardView";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getConditionsByTrip,
  getDebriefByTrip,
  getPatternByTrip,
  getTrip,
  listCatchesByTrip,
  savePattern,
} from "@/lib/storage";
import type {
  Catch,
  Conditions,
  Debrief,
  PatternCard,
  Trip,
} from "@/lib/schemas";
import { uid } from "@/lib/utils";

export default function PatternPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tripId } = use(params);

  const [trip, setTrip] = useState<Trip | undefined>();
  const [catches, setCatches] = useState<Catch[]>([]);
  const [conditions, setConditions] = useState<Conditions | undefined>();
  const [debrief, setDebrief] = useState<Debrief | undefined>();
  const [pattern, setPattern] = useState<PatternCard | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setTrip(getTrip(tripId));
    setCatches(listCatchesByTrip(tripId));
    setConditions(getConditionsByTrip(tripId));
    setDebrief(getDebriefByTrip(tripId));
    setPattern(getPatternByTrip(tripId));
  }, [tripId]);

  const generate = async () => {
    if (!trip) return;
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch("/api/pattern-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trip, catches, conditions, debrief }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Generation failed");
      }
      const created: PatternCard = {
        ...data.pattern,
        id: pattern?.id ?? uid(),
        trip_id: tripId,
        created_at: new Date().toISOString(),
      };
      savePattern(created);
      setPattern(created);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!trip) {
    return (
      <AppShell title="Pattern" back={{ href: "/" }}>
        <Card>
          <CardHeader>
            <CardTitle>Trip not found</CardTitle>
          </CardHeader>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell title="Pattern card" back={{ href: `/trip/${tripId}` }}>
      {!pattern && !loading && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Generate a pattern card</CardTitle>
            <CardDescription>
              Captain Shad will read your catches, conditions, and debrief notes, and turn them into a reusable lesson.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-xs text-neutral-600 mb-4 space-y-1">
              <li>· {catches.length} catch{catches.length === 1 ? "" : "es"}</li>
              <li>· Conditions {conditions ? "logged" : "not yet logged"}</li>
              <li>· Debrief {debrief ? "logged" : "not yet logged"}</li>
            </ul>
            <Button onClick={generate} className="w-full" size="lg">
              <Sparkles className="h-4 w-4" /> Generate
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card className="mb-4">
          <CardContent className="py-8 text-center">
            <div className="inline-block animate-pulse">
              <Sparkles className="h-8 w-8 text-bay-500 mx-auto" />
            </div>
            <p className="mt-3 text-sm text-neutral-700">Reading your trip…</p>
            <p className="text-xs text-neutral-500 mt-1">
              This usually takes 5–20 seconds.
            </p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="py-3">
            <p className="text-sm text-red-900">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={generate}
              className="mt-2"
              disabled={loading}
            >
              <RotateCcw className="h-3 w-3" /> Try again
            </Button>
          </CardContent>
        </Card>
      )}

      {pattern && (
        <>
          <PatternCardView pattern={pattern} />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={generate} variant="outline" disabled={loading}>
              <RotateCcw className="h-4 w-4" /> Regenerate
            </Button>
            <Link href={`/trip/${tripId}/share`}>
              <Button className="w-full">
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </Link>
          </div>
        </>
      )}
    </AppShell>
  );
}
