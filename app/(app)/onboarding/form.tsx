"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { ChipGroup } from "@/components/ui/chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SPECIES_OPTIONS, WATER_BODIES } from "@/lib/local-data";
import { completeOnboarding } from "./actions";

export function OnboardingForm({
  initial,
}: {
  initial: {
    guide_name: string;
    company_name: string;
    booking_url: string;
    phone: string;
    service_area: string[];
    target_species: string[];
  };
}) {
  const [guideName, setGuideName] = useState(initial.guide_name);
  const [companyName, setCompanyName] = useState(initial.company_name);
  const [bookingUrl, setBookingUrl] = useState(initial.booking_url);
  const [phone, setPhone] = useState(initial.phone);
  const [serviceArea, setServiceArea] = useState<string[]>(initial.service_area);
  const [targetSpecies, setTargetSpecies] = useState<string[]>(initial.target_species);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    start(async () => {
      try {
        await completeOnboarding({
          guide_name: guideName,
          company_name: companyName,
          booking_url: bookingUrl,
          phone,
          service_area: serviceArea,
          target_species: targetSpecies,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={submit} className="mt-6">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Your name (or captain name)" required>
            <Input
              value={guideName}
              onChange={(e) => setGuideName(e.target.value)}
              required
              placeholder="e.g. Capt. Mike Smith"
            />
          </Field>
          <Field label="Company / charter name">
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Coastal Bend Charters"
            />
          </Field>
          <Field label="Booking link" hint="Where clients re-book. Shown on every recap.">
            <Input
              type="url"
              value={bookingUrl}
              onChange={(e) => setBookingUrl(e.target.value)}
              placeholder="https://example.com/book"
            />
          </Field>
          <Field label="Phone">
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="361-555-0100"
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Where do you fish?</CardTitle>
        </CardHeader>
        <CardContent>
          <ChipGroup
            multi
            options={WATER_BODIES}
            value={serviceArea}
            onChange={(v) => setServiceArea(v as string[])}
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Primary target species</CardTitle>
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

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-900 mb-3">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Finish setup"}
      </Button>
    </form>
  );
}
