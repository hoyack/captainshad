"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { ChipGroup } from "@/components/ui/chip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignOutButton } from "@/components/AppNav";
import { SPECIES_OPTIONS, WATER_BODIES } from "@/lib/local-data";
import { saveProfileAction } from "./actions";

interface PrivacyDefaults {
  hide_exact_locations: boolean;
  hide_route: boolean;
  allow_pattern_summary: boolean;
}

export function ProfileForm({
  initial,
}: {
  initial: {
    guide_name: string;
    company_name: string;
    booking_url: string;
    phone: string;
    logo_url: string;
    service_area: string[];
    target_species: string[];
    privacy_defaults: PrivacyDefaults;
  };
}) {
  const [guideName, setGuideName] = useState(initial.guide_name);
  const [companyName, setCompanyName] = useState(initial.company_name);
  const [bookingUrl, setBookingUrl] = useState(initial.booking_url);
  const [phone, setPhone] = useState(initial.phone);
  const [logoUrl, setLogoUrl] = useState(initial.logo_url);
  const [serviceArea, setServiceArea] = useState<string[]>(initial.service_area);
  const [targetSpecies, setTargetSpecies] = useState<string[]>(initial.target_species);
  const [hideExact, setHideExact] = useState(initial.privacy_defaults.hide_exact_locations);
  const [hideRoute, setHideRoute] = useState(initial.privacy_defaults.hide_route);
  const [allowPattern, setAllowPattern] = useState(initial.privacy_defaults.allow_pattern_summary);
  const [pending, start] = useTransition();
  const [info, setInfo] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setInfo(undefined);
    start(async () => {
      try {
        await saveProfileAction({
          guide_name: guideName,
          company_name: companyName,
          booking_url: bookingUrl,
          phone,
          logo_url: logoUrl,
          service_area: serviceArea,
          target_species: targetSpecies,
          privacy_defaults: {
            hide_exact_locations: hideExact,
            hide_route: hideRoute,
            allow_pattern_summary: allowPattern,
          },
        });
        setInfo("Saved");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <form onSubmit={submit}>
      <div className="flex justify-between items-center mb-3">
        <Link href="/settings/billing" className="text-sm text-bay-700 hover:text-bay-900 underline">
          Billing →
        </Link>
        <SignOutButton />
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Guide name" required>
            <Input value={guideName} onChange={(e) => setGuideName(e.target.value)} required />
          </Field>
          <Field label="Company name">
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </Field>
          <Field label="Booking link">
            <Input
              type="url"
              value={bookingUrl}
              onChange={(e) => setBookingUrl(e.target.value)}
              placeholder="https://..."
            />
          </Field>
          <Field label="Phone">
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <Field label="Logo URL" hint="Optional. Square image works best.">
            <Input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Service area</CardTitle>
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
          <CardTitle>Privacy defaults</CardTitle>
          <CardDescription>Applied to every recap you publish.</CardDescription>
        </CardHeader>
        <CardContent>
          {[
            {
              v: hideExact,
              set: setHideExact,
              label: "Hide exact locations",
              desc: "Show general area only — no launch point.",
            },
            {
              v: hideRoute,
              set: setHideRoute,
              label: "Hide route",
              desc: "Don't expose where you ran the boat.",
            },
            {
              v: allowPattern,
              set: setAllowPattern,
              label: "Include pattern summary",
              desc: "Show the AI lesson on the recap.",
            },
          ].map((c, i) => (
            <label
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg border border-bay-200 mb-2 last:mb-0 cursor-pointer hover:bg-bay-50"
            >
              <input
                type="checkbox"
                checked={c.v}
                onChange={(e) => c.set(e.target.checked)}
                className="mt-0.5"
              />
              <div>
                <div className="font-medium text-sm">{c.label}</div>
                <div className="text-xs text-neutral-600">{c.desc}</div>
              </div>
            </label>
          ))}
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-900 mb-3">
          {error}
        </div>
      )}
      {info && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-900 mb-3">
          {info}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
