"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { ChipGroup } from "@/components/ui/chip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SPECIES_OPTIONS, STRUCTURE_OPTIONS } from "@/lib/local-data";
import { uploadCatchPhoto } from "@/lib/photo";
import { fromDatetimeLocal, toDatetimeLocal, uid } from "@/lib/utils";
import { createCatchAction } from "../../catch-actions";

export function NewCatchForm({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [species, setSpecies] = useState("redfish");
  const [timeCaught, setTimeCaught] = useState(toDatetimeLocal());
  const [length, setLength] = useState("");
  const [keptOrReleased, setKeptOrReleased] = useState<"kept" | "released" | "unknown">(
    "released",
  );
  const [bait, setBait] = useState("");
  const [presentation, setPresentation] = useState("");
  const [structureTags, setStructureTags] = useState<string[]>([]);
  const [depth, setDepth] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    start(async () => {
      try {
        // Pre-generate the catch id so we can use it in the photo storage path before insert.
        const catchId = uid();
        let photoPath: string | undefined;
        if (file) {
          photoPath = await uploadCatchPhoto({ file, tripId, catchId });
        }
        await createCatchAction({
          trip_id: tripId,
          species,
          time_caught: fromDatetimeLocal(timeCaught),
          approx_length_inches: length ? Number(length) : null,
          kept_or_released: keptOrReleased,
          bait_or_lure: bait,
          presentation,
          structure_tags: structureTags,
          water_depth_ft: depth ? Number(depth) : null,
          photo_url: photoPath ?? null,
          notes,
        });
        router.push(`/trips/${tripId}`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={submit}>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>What did you catch?</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Species" required>
            <Select value={species} onChange={(e) => setSpecies(e.target.value)}>
              {SPECIES_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Time caught" hint="Defaults to right now.">
            <div className="flex gap-2">
              <Input
                type="datetime-local"
                value={timeCaught}
                onChange={(e) => setTimeCaught(e.target.value)}
                required
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => setTimeCaught(toDatetimeLocal())}
                className="shrink-0 px-3 h-11 rounded-lg border border-bay-200 bg-white text-sm text-bay-700 hover:bg-bay-50"
              >
                Now
              </button>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Length (inches)">
              <Input
                type="number"
                inputMode="numeric"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="22"
              />
            </Field>
            <Field label="Depth (ft)">
              <Input
                type="number"
                inputMode="numeric"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                placeholder="3"
              />
            </Field>
          </div>

          <Field label="Kept or released?">
            <div className="grid grid-cols-3 gap-2">
              {(["released", "kept", "unknown"] as const).map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setKeptOrReleased(v)}
                  className={`h-10 rounded-lg text-sm font-medium border ${
                    keptOrReleased === v
                      ? "bg-bay-600 text-white border-bay-600"
                      : "bg-white text-neutral-700 border-bay-200 hover:bg-bay-50"
                  }`}
                >
                  {v[0].toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Bait or lure">
            <Input
              value={bait}
              onChange={(e) => setBait(e.target.value)}
              placeholder="e.g. live shrimp under popping cork"
            />
          </Field>

          <Field label="Presentation">
            <Input
              value={presentation}
              onChange={(e) => setPresentation(e.target.value)}
              placeholder="e.g. slow drift along grass edge"
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <ChipGroup
            multi
            options={STRUCTURE_OPTIONS}
            value={structureTags}
            onChange={(v) => setStructureTags(v as string[])}
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Photo</CardTitle>
          <CardDescription>Optional. Stored in your private bucket.</CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />
          {file && (
            <p className="mt-2 text-xs text-neutral-500">
              {file.name} — will downscale and upload on save.
            </p>
          )}
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
        {pending ? "Saving…" : "Save catch"}
      </Button>
    </form>
  );
}
