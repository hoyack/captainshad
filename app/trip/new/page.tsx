"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { ChipGroup } from "@/components/ui/chip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BOAT_TYPES,
  GUIDE_QUESTION_PROMPTS,
  PRE_TRIP_CHECKLIST,
  PRIVACY_OPTIONS,
  SPECIES_OPTIONS,
  TRIP_TYPES,
  WATER_BODIES,
} from "@/lib/local-data";
import { listGuides, saveTrip } from "@/lib/storage";
import {
  type GuideProfile,
  type PrivacyLevel,
  type Species,
  type Trip,
  type TripType,
  type BoatType,
} from "@/lib/schemas";
import { uid } from "@/lib/utils";

export default function NewTripPage() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState("");
  const [tripDate, setTripDate] = useState(today);
  const [tripType, setTripType] = useState<TripType>("guided");
  const [boatType, setBoatType] = useState<BoatType | "">("");
  const [waterBody, setWaterBody] = useState("redfish_bay");
  const [generalArea, setGeneralArea] = useState("Aransas Pass");
  const [launchLocation, setLaunchLocation] = useState("");
  const [guideName, setGuideName] = useState("");
  const [guideCompany, setGuideCompany] = useState("");
  const [guideProfileId, setGuideProfileId] = useState("");
  const [targetSpecies, setTargetSpecies] = useState<Species[]>(["redfish"]);
  const [privacy, setPrivacy] = useState<PrivacyLevel>("private");
  const [notes, setNotes] = useState("");

  const [guides, setGuides] = useState<GuideProfile[]>([]);

  useEffect(() => {
    setGuides(listGuides());
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const trip: Trip = {
      id: uid(),
      trip_type: tripType,
      trip_date: tripDate,
      title: title || `${waterBody} trip`,
      guide_name: guideName,
      guide_company: guideCompany,
      guide_profile_id: guideProfileId || undefined,
      general_area: generalArea,
      launch_location: launchLocation,
      water_body: waterBody,
      boat_type: boatType || undefined,
      target_species: targetSpecies,
      privacy_level: privacy,
      notes,
      created_at: now,
      updated_at: now,
    };
    saveTrip(trip);
    router.push(`/trip/${trip.id}`);
  };

  return (
    <AppShell title="New trip" back={{ href: "/" }}>
      <form onSubmit={submit}>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Trip basics</CardTitle>
          </CardHeader>
          <CardContent>
            <Field label="Trip title" hint="Optional. Short label for your records.">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Morning reds with Capt. Mike"
              />
            </Field>

            <Field label="Date" required>
              <Input
                type="date"
                value={tripDate}
                onChange={(e) => setTripDate(e.target.value)}
                required
              />
            </Field>

            <Field label="Trip type">
              <Select
                value={tripType}
                onChange={(e) => setTripType(e.target.value as TripType)}
              >
                {TRIP_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Boat / approach">
              <Select
                value={boatType}
                onChange={(e) => setBoatType(e.target.value as BoatType | "")}
              >
                <option value="">— Select —</option>
                {BOAT_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Water body">
              <Select
                value={waterBody}
                onChange={(e) => setWaterBody(e.target.value)}
              >
                {WATER_BODIES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="General area" hint="Town or region — kept for your records.">
              <Input
                value={generalArea}
                onChange={(e) => setGeneralArea(e.target.value)}
                placeholder="Aransas Pass / Port A / Rockport"
              />
            </Field>

            <Field
              label="Launch point"
              hint="Private to you. Never shared in public recaps."
            >
              <Input
                value={launchLocation}
                onChange={(e) => setLaunchLocation(e.target.value)}
                placeholder="e.g. Conn Brown Harbor"
              />
            </Field>
          </CardContent>
        </Card>

        {tripType === "guided" && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Guide</CardTitle>
              <CardDescription>
                Optional. Used in branded recaps if you turn on guide mode.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {guides.length > 0 && (
                <Field label="Link to guide profile">
                  <Select
                    value={guideProfileId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setGuideProfileId(id);
                      const g = guides.find((x) => x.id === id);
                      if (g) {
                        setGuideName(g.guide_name);
                        setGuideCompany(g.company_name);
                      }
                    }}
                  >
                    <option value="">— None —</option>
                    {guides.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.guide_name}
                        {g.company_name ? ` · ${g.company_name}` : ""}
                      </option>
                    ))}
                  </Select>
                </Field>
              )}

              <Field label="Guide name">
                <Input
                  value={guideName}
                  onChange={(e) => setGuideName(e.target.value)}
                  placeholder="e.g. Capt. Mike"
                />
              </Field>

              <Field label="Guide company">
                <Input
                  value={guideCompany}
                  onChange={(e) => setGuideCompany(e.target.value)}
                  placeholder="e.g. Coastal Bend Charters"
                />
              </Field>
            </CardContent>
          </Card>
        )}

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Target species</CardTitle>
            <CardDescription>Tap any that apply.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChipGroup
              multi
              options={SPECIES_OPTIONS}
              value={targetSpecies}
              onChange={(v) => setTargetSpecies(v as Species[])}
            />
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Default for what you share later.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {PRIVACY_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className="flex items-start gap-3 p-3 rounded-lg border border-bay-200 cursor-pointer hover:bg-bay-50"
                >
                  <input
                    type="radio"
                    name="privacy"
                    value={o.value}
                    checked={privacy === o.value}
                    onChange={() => setPrivacy(o.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-medium text-sm">{o.label}</div>
                    <div className="text-xs text-neutral-600">{o.description}</div>
                  </div>
                </label>
              ))}
            </div>
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
              placeholder="Anything to remember about the plan, questions to ask, etc."
            />
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm">Pre-trip checklist</CardTitle>
            <CardDescription>For reference — not stored.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1.5 text-neutral-700">
              {PRE_TRIP_CHECKLIST.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-bay-500">○</span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {tripType === "guided" && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm">Questions to ask the guide</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="text-sm space-y-1.5 text-neutral-700 list-decimal pl-5">
                {GUIDE_QUESTION_PROMPTS.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        <div className="sticky bottom-0 bg-neutral-50 py-3 -mx-4 px-4 border-t border-bay-100 safe-bottom">
          <Button type="submit" size="lg" className="w-full">
            Create trip
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
