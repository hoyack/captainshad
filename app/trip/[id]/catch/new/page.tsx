"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
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
import { saveCatch } from "@/lib/storage";
import type { Catch, Species, StructureTag } from "@/lib/schemas";
import { fromDatetimeLocal, toDatetimeLocal, uid } from "@/lib/utils";
import { fileToDownscaledDataUrl } from "@/lib/photo";

export default function NewCatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tripId } = use(params);
  const router = useRouter();

  const [species, setSpecies] = useState<Species>("redfish");
  const [timeCaught, setTimeCaught] = useState(toDatetimeLocal());
  const [length, setLength] = useState("");
  const [keptOrReleased, setKeptOrReleased] = useState<
    "kept" | "released" | "unknown"
  >("released");
  const [bait, setBait] = useState("");
  const [presentation, setPresentation] = useState("");
  const [structureTags, setStructureTags] = useState<StructureTag[]>([]);
  const [depth, setDepth] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>();
  const [notes, setNotes] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);

  const handlePhoto = async (file?: File) => {
    if (!file) return;
    setPhotoLoading(true);
    try {
      setPhotoDataUrl(await fileToDownscaledDataUrl(file));
    } catch (e) {
      console.error(e);
      alert("Could not read that photo.");
    } finally {
      setPhotoLoading(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const c: Catch = {
      id: uid(),
      trip_id: tripId,
      species,
      time_caught: fromDatetimeLocal(timeCaught),
      approx_length_inches: length ? Number(length) : undefined,
      kept_or_released: keptOrReleased,
      bait_or_lure: bait,
      presentation,
      structure_tags: structureTags,
      water_depth_ft: depth ? Number(depth) : undefined,
      photo_data_url: photoDataUrl,
      notes,
    };
    saveCatch(c);
    router.push(`/trip/${tripId}`);
  };

  return (
    <AppShell title="Quick catch" back={{ href: `/trip/${tripId}` }}>
      <form onSubmit={submit}>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>What did you catch?</CardTitle>
          </CardHeader>
          <CardContent>
            <Field label="Species" required>
              <Select
                value={species}
                onChange={(e) => setSpecies(e.target.value as Species)}
              >
                {SPECIES_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Time caught" hint="Defaults to right now. Edit if you're logging after the fact.">
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  value={timeCaught}
                  onChange={(e) => setTimeCaught(e.target.value)}
                  className="flex-1"
                  required
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
                  placeholder="e.g. 22"
                />
              </Field>
              <Field label="Depth (ft)">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  placeholder="e.g. 3"
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
                    className={`h-10 rounded-lg text-sm font-medium border transition-colors ${
                      keptOrReleased === v
                        ? "bg-bay-600 text-white border-bay-600"
                        : "bg-white text-neutral-700 border-bay-200 hover:bg-bay-50"
                    }`}
                  >
                    {v === "released"
                      ? "Released"
                      : v === "kept"
                      ? "Kept"
                      : "Unknown"}
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
            <CardDescription>Where the fish actually came from.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChipGroup
              multi
              options={STRUCTURE_OPTIONS}
              value={structureTags}
              onChange={(v) => setStructureTags(v as StructureTag[])}
            />
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Photo</CardTitle>
            <CardDescription>Optional. Stored locally only.</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handlePhoto(e.target.files?.[0])}
              className="block w-full text-sm"
            />
            {photoLoading && (
              <p className="mt-2 text-xs text-neutral-500">Processing…</p>
            )}
            {photoDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoDataUrl}
                alt=""
                className="mt-3 w-full max-h-64 object-cover rounded-lg"
              />
            )}
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
              placeholder="Anything noteworthy"
            />
          </CardContent>
        </Card>

        <div className="sticky bottom-0 bg-neutral-50 py-3 -mx-4 px-4 border-t border-bay-100 safe-bottom">
          <Button type="submit" size="lg" className="w-full">
            Save catch
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
