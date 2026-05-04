"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { ChipGroup } from "@/components/ui/chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ACTIVITY_LEVELS,
  CLOUD_COVER,
  CONDITION_MARKERS,
  CURRENT_STRENGTHS,
  TIDE_STAGES,
  WATER_CLARITY,
  WIND_DIRECTIONS,
} from "@/lib/local-data";
import { saveConditionsAction } from "./actions";
import type { Conditions } from "@/lib/db/conditions";

export function ConditionsForm({
  tripId,
  initial,
}: {
  tripId: string;
  initial?: Conditions;
}) {
  const router = useRouter();
  const [tide, setTide] = useState(initial?.tide_stage ?? "unknown");
  const [windDir, setWindDir] = useState(initial?.wind_direction ?? "unknown");
  const [windSpeed, setWindSpeed] = useState(initial?.wind_speed_mph?.toString() ?? "");
  const [waterClarity, setWaterClarity] = useState(initial?.water_clarity ?? "unknown");
  const [cloudCover, setCloudCover] = useState(initial?.cloud_cover ?? "unknown");
  const [baitActivity, setBaitActivity] = useState(initial?.bait_activity ?? "unknown");
  const [birdActivity, setBirdActivity] = useState(initial?.bird_activity ?? "unknown");
  const [currentStrength, setCurrentStrength] = useState(initial?.current_strength ?? "unknown");
  const [markers, setMarkers] = useState<string[]>(initial?.markers ?? []);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    start(async () => {
      try {
        await saveConditionsAction({
          trip_id: tripId,
          time_observed: new Date().toISOString(),
          tide_stage: tide,
          wind_direction: windDir,
          wind_speed_mph: windSpeed ? Number(windSpeed) : null,
          water_clarity: waterClarity,
          cloud_cover: cloudCover,
          bait_activity: baitActivity,
          bird_activity: birdActivity,
          current_strength: currentStrength,
          markers,
          notes,
        });
        router.push(`/trips/${tripId}`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <form onSubmit={submit}>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Tide & wind</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Tide stage">
            <Select value={tide} onChange={(e) => setTide(e.target.value)}>
              {TIDE_STAGES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Wind direction">
              <Select value={windDir} onChange={(e) => setWindDir(e.target.value)}>
                {WIND_DIRECTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Wind speed (mph)">
              <Input
                type="number"
                inputMode="numeric"
                value={windSpeed}
                onChange={(e) => setWindSpeed(e.target.value)}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Water & sky</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Water clarity">
            <Select value={waterClarity} onChange={(e) => setWaterClarity(e.target.value)}>
              {WATER_CLARITY.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Cloud cover">
            <Select value={cloudCover} onChange={(e) => setCloudCover(e.target.value)}>
              {CLOUD_COVER.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Current strength">
            <Select
              value={currentStrength}
              onChange={(e) => setCurrentStrength(e.target.value)}
            >
              {CURRENT_STRENGTHS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Bait activity">
            <Select value={baitActivity} onChange={(e) => setBaitActivity(e.target.value)}>
              {ACTIVITY_LEVELS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Bird activity">
            <Select value={birdActivity} onChange={(e) => setBirdActivity(e.target.value)}>
              {ACTIVITY_LEVELS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>One-tap markers</CardTitle>
        </CardHeader>
        <CardContent>
          <ChipGroup
            multi
            options={CONDITION_MARKERS}
            value={markers}
            onChange={(v) => setMarkers(v as string[])}
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-900 mb-3">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Save conditions"}
      </Button>
    </form>
  );
}
