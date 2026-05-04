"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { ChipGroup } from "@/components/ui/chip";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ACTIVITY_LEVELS,
  CLOUD_COVER,
  CONDITION_MARKERS,
  CURRENT_STRENGTHS,
  TIDE_STAGES,
  WATER_CLARITY,
  WIND_DIRECTIONS,
} from "@/lib/local-data";
import { getConditionsByTrip, saveConditions } from "@/lib/storage";
import type {
  ConditionMarker,
  Conditions,
} from "@/lib/schemas";
import { uid } from "@/lib/utils";

export default function ConditionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tripId } = use(params);
  const router = useRouter();

  const [tideStage, setTideStage] = useState("unknown");
  const [windDir, setWindDir] = useState("unknown");
  const [windSpeed, setWindSpeed] = useState("");
  const [waterClarity, setWaterClarity] = useState("unknown");
  const [cloudCover, setCloudCover] = useState("unknown");
  const [baitActivity, setBaitActivity] = useState("unknown");
  const [birdActivity, setBirdActivity] = useState("unknown");
  const [currentStrength, setCurrentStrength] = useState("unknown");
  const [markers, setMarkers] = useState<ConditionMarker[]>([]);
  const [notes, setNotes] = useState("");
  const [existingId, setExistingId] = useState<string | undefined>();

  useEffect(() => {
    const c = getConditionsByTrip(tripId);
    if (c) {
      setExistingId(c.id);
      setTideStage(c.tide_stage);
      setWindDir(c.wind_direction);
      setWindSpeed(c.wind_speed_mph?.toString() ?? "");
      setWaterClarity(c.water_clarity);
      setCloudCover(c.cloud_cover);
      setBaitActivity(c.bait_activity);
      setBirdActivity(c.bird_activity);
      setCurrentStrength(c.current_strength);
      setMarkers(c.markers);
      setNotes(c.notes ?? "");
    }
  }, [tripId]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const c: Conditions = {
      id: existingId ?? uid(),
      trip_id: tripId,
      time_observed: new Date().toISOString(),
      tide_stage: tideStage as Conditions["tide_stage"],
      wind_direction: windDir as Conditions["wind_direction"],
      wind_speed_mph: windSpeed ? Number(windSpeed) : undefined,
      water_clarity: waterClarity as Conditions["water_clarity"],
      cloud_cover: cloudCover as Conditions["cloud_cover"],
      bait_activity: baitActivity as Conditions["bait_activity"],
      bird_activity: birdActivity as Conditions["bird_activity"],
      current_strength: currentStrength as Conditions["current_strength"],
      markers,
      notes,
    };
    saveConditions(c);
    router.push(`/trip/${tripId}`);
  };

  return (
    <AppShell title="Conditions" back={{ href: `/trip/${tripId}` }}>
      <form onSubmit={submit}>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Tide & wind</CardTitle>
          </CardHeader>
          <CardContent>
            <Field label="Tide stage">
              <Select
                value={tideStage}
                onChange={(e) => setTideStage(e.target.value)}
              >
                {TIDE_STAGES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Wind direction">
                <Select
                  value={windDir}
                  onChange={(e) => setWindDir(e.target.value)}
                >
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
                  placeholder="0"
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
              <Select
                value={waterClarity}
                onChange={(e) => setWaterClarity(e.target.value)}
              >
                {WATER_CLARITY.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Cloud cover">
              <Select
                value={cloudCover}
                onChange={(e) => setCloudCover(e.target.value)}
              >
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
              <Select
                value={baitActivity}
                onChange={(e) => setBaitActivity(e.target.value)}
              >
                {ACTIVITY_LEVELS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Bird activity">
              <Select
                value={birdActivity}
                onChange={(e) => setBirdActivity(e.target.value)}
              >
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
              onChange={(v) => setMarkers(v as ConditionMarker[])}
            />
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything else worth remembering"
            />
          </CardContent>
        </Card>

        <div className="sticky bottom-0 bg-neutral-50 py-3 -mx-4 px-4 border-t border-bay-100 safe-bottom">
          <Button type="submit" size="lg" className="w-full">
            Save conditions
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
