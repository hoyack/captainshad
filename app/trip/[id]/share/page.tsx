"use client";

import { use, useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { getPatternByTrip, getTrip } from "@/lib/storage";
import type { PatternCard, Trip } from "@/lib/schemas";
import { WATER_BODIES, lookupLabel } from "@/lib/local-data";

function buildSocialCaption(trip: Trip, pattern?: PatternCard): string {
  const water = lookupLabel(WATER_BODIES, trip.water_body);
  const region = water ? `around ${water}` : "around Aransas Pass";

  if (pattern) {
    return `Great trip on the water ${region}. The lesson of the day: ${pattern.summary}\n\nWhat worked: ${pattern.bait_pattern} on ${pattern.tide_pattern.toLowerCase()}.\n\nNo exact spots, no guide secrets burned. Just patterns.${
      trip.guide_name ? `\n\nThanks to ${trip.guide_name} for turning a fishing trip into a real lesson.` : ""
    }`;
  }

  return `Great trip on the water ${region}. Watch the bait, respect the tide, and don't leave fish to find fish.${
    trip.guide_name ? `\n\nThanks to ${trip.guide_name} for the trip.` : ""
  }`;
}

function buildPrivateRecap(trip: Trip, pattern?: PatternCard): string {
  const lines: string[] = [];
  lines.push(`Trip: ${trip.title}`);
  lines.push(`Date: ${trip.trip_date}`);
  if (trip.water_body) lines.push(`Water: ${lookupLabel(WATER_BODIES, trip.water_body)}`);
  if (trip.launch_location) lines.push(`Launch: ${trip.launch_location}`);
  if (trip.guide_name) lines.push(`Guide: ${trip.guide_name}`);
  if (pattern) {
    lines.push("", `Pattern: ${pattern.title}`, pattern.summary);
    lines.push("", `Why it worked: ${pattern.why_it_worked}`);
    lines.push("", `Try next time: ${pattern.what_to_try_next_time}`);
  }
  return lines.join("\n");
}

export default function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tripId } = use(params);

  const [trip, setTrip] = useState<Trip | undefined>();
  const [pattern, setPattern] = useState<PatternCard | undefined>();
  const [copied, setCopied] = useState<string | undefined>();

  useEffect(() => {
    setTrip(getTrip(tripId));
    setPattern(getPatternByTrip(tripId));
  }, [tripId]);

  if (!trip) {
    return (
      <AppShell title="Share" back={{ href: "/" }}>
        <Card>
          <CardHeader>
            <CardTitle>Trip not found</CardTitle>
          </CardHeader>
        </Card>
      </AppShell>
    );
  }

  const social = buildSocialCaption(trip, pattern);
  const priv = buildPrivateRecap(trip, pattern);

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(undefined), 1500);
    } catch {
      alert("Copy failed — try selecting the text manually.");
    }
  };

  return (
    <AppShell title="Share recap" back={{ href: `/trip/${tripId}` }}>
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Public-safe caption</CardTitle>
            <PrivacyBadge level="public_safe" />
          </div>
          <CardDescription>
            No coordinates. No launch point. No guide secret spots.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea readOnly value={social} rows={9} />
          <Button
            onClick={() => copy("social", social)}
            variant="outline"
            className="mt-2 w-full"
          >
            {copied === "social" ? (
              <>
                <Check className="h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copy caption
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Private recap</CardTitle>
            <PrivacyBadge level="private" />
          </div>
          <CardDescription>
            For your own records. Includes launch point and guide name.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea readOnly value={priv} rows={10} />
          <Button
            onClick={() => copy("private", priv)}
            variant="outline"
            className="mt-2 w-full"
          >
            {copied === "private" ? (
              <>
                <Check className="h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copy private recap
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {!pattern && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-3 text-xs text-amber-900">
            Tip: generate a pattern card first for a richer share recap.
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
