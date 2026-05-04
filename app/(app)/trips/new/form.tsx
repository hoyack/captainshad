"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
import {
  BOAT_TYPES,
  PRIVACY_OPTIONS,
  SPECIES_OPTIONS,
  WATER_BODIES,
} from "@/lib/local-data";
import { createTripAction } from "../actions";

export function NewTripForm({
  clients,
  quota,
}: {
  clients: { id: string; name: string }[];
  quota: { tier: "free" | "pro"; used: number; cap: number; unlimited: boolean };
}) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState("");
  const [tripDate, setTripDate] = useState(today);
  const [clientId, setClientId] = useState<string>("");
  const [boatType, setBoatType] = useState("");
  const [waterBody, setWaterBody] = useState("redfish_bay");
  const [generalArea, setGeneralArea] = useState("Aransas Pass");
  const [launchLocation, setLaunchLocation] = useState("");
  const [targetSpecies, setTargetSpecies] = useState<string[]>(["redfish"]);
  const [privacy, setPrivacy] = useState<"private" | "pattern_only" | "public_safe">("private");
  const [notes, setNotes] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const upgradeBlocked = !quota.unlimited && quota.used >= quota.cap;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    start(async () => {
      const res = await createTripAction({
        trip_date: tripDate,
        title: title || `${tripDate} trip`,
        client_id: clientId || null,
        general_area: generalArea,
        launch_location: launchLocation,
        water_body: waterBody,
        boat_type: boatType,
        target_species: targetSpecies,
        privacy_level: privacy,
        notes,
      });
      if (!res.ok) {
        setError(
          res.error === "UPGRADE_REQUIRED"
            ? "Free tier limit reached — upgrade to Pro for unlimited trips."
            : res.error,
        );
        return;
      }
      router.push(`/trips/${res.id}`);
      router.refresh();
    });
  };

  if (upgradeBlocked) {
    return (
      <Card className="border-amber-300 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-900">Free tier limit reached</CardTitle>
          <CardDescription className="text-amber-900">
            You've used all {quota.cap} free trips. Upgrade to Pro for unlimited trips, client list, and recap view stats.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Link href="/pricing" className="flex-1">
            <Button className="w-full">Upgrade — $29/mo</Button>
          </Link>
          <Link href="/trips" className="flex-1">
            <Button variant="outline" className="w-full">Back to trips</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={submit}>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Trip basics</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Title" hint="Optional. e.g. 'Morning reds with the Smiths'">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>

          <Field label="Date" required>
            <Input
              type="date"
              value={tripDate}
              onChange={(e) => setTripDate(e.target.value)}
              required
            />
          </Field>

          <Field
            label="Client"
            hint={
              clients.length === 0
                ? "Walk-on for now — add clients in /clients"
                : "Linked clients can be reused across trips"
            }
          >
            <div className="flex gap-2">
              <Select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="flex-1"
              >
                <option value="">— Walk-on / no client —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
              <Link
                href={`/clients/new?return=${encodeURIComponent("/trips/new")}`}
                className="shrink-0 px-3 h-11 rounded-lg border border-bay-200 bg-white text-sm text-bay-700 hover:bg-bay-50 inline-flex items-center"
              >
                + New
              </Link>
            </div>
          </Field>

          <Field label="Boat / approach">
            <Select value={boatType} onChange={(e) => setBoatType(e.target.value)}>
              <option value="">— Select —</option>
              {BOAT_TYPES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Water body">
            <Select value={waterBody} onChange={(e) => setWaterBody(e.target.value)}>
              {WATER_BODIES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="General area" hint="Town or region">
            <Input
              value={generalArea}
              onChange={(e) => setGeneralArea(e.target.value)}
              placeholder="Aransas Pass / Port A / Rockport"
            />
          </Field>

          <Field
            label="Launch point"
            hint="Private to you. Never shown in client recap."
          >
            <Input
              value={launchLocation}
              onChange={(e) => setLaunchLocation(e.target.value)}
              placeholder="e.g. Conn Brown Harbor"
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Target species</CardTitle>
        </CardHeader>
        <CardContent>
          <ChipGroup
            multi
            options={SPECIES_OPTIONS}
            value={targetSpecies}
            onChange={(v) => setTargetSpecies(v as string[])}
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
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
                  onChange={() => setPrivacy(o.value as typeof privacy)}
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
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-900 mb-3">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating…" : "Create trip"}
      </Button>
    </form>
  );
}
