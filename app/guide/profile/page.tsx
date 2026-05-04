"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
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
import { SPECIES_OPTIONS, WATER_BODIES } from "@/lib/local-data";
import { saveGuide } from "@/lib/storage";
import type { GuideProfile, Species } from "@/lib/schemas";
import { uid } from "@/lib/utils";

export default function GuideProfilePage() {
  const router = useRouter();

  const [guideName, setGuideName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [serviceArea, setServiceArea] = useState<string[]>([
    "redfish_bay",
    "aransas_bay",
  ]);
  const [targetSpecies, setTargetSpecies] = useState<Species[]>([
    "redfish",
    "speckled_trout",
  ]);
  const [hideExact, setHideExact] = useState(true);
  const [hideRoute, setHideRoute] = useState(true);
  const [allowPattern, setAllowPattern] = useState(true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const g: GuideProfile = {
      id: uid(),
      guide_name: guideName,
      company_name: companyName,
      service_area: serviceArea,
      target_species: targetSpecies,
      booking_url: bookingUrl,
      phone,
      email,
      logo_url: logoUrl,
      privacy_defaults: {
        hide_exact_locations: hideExact,
        hide_route: hideRoute,
        allow_pattern_summary: allowPattern,
      },
      created_at: new Date().toISOString(),
    };
    saveGuide(g);
    router.push("/guide");
  };

  return (
    <AppShell title="Guide profile" back={{ href: "/guide" }}>
      <form onSubmit={submit}>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Field label="Guide name" required>
              <Input
                value={guideName}
                onChange={(e) => setGuideName(e.target.value)}
                required
                placeholder="Capt. Mike Smith"
              />
            </Field>
            <Field label="Company name">
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Coastal Bend Charters"
              />
            </Field>
            <Field label="Booking URL">
              <Input
                value={bookingUrl}
                onChange={(e) => setBookingUrl(e.target.value)}
                placeholder="https://example.com/book"
                type="url"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="361-555-0100"
                  type="tel"
                />
              </Field>
              <Field label="Email">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="capt@example.com"
                  type="email"
                />
              </Field>
            </div>
            <Field label="Logo URL" hint="Optional. Square image works best.">
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://…/logo.png"
                type="url"
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
              onChange={(v) => setTargetSpecies(v as Species[])}
            />
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Privacy defaults</CardTitle>
            <CardDescription>
              Applied to every branded recap. Override per trip if needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <label className="flex items-start gap-3 p-3 rounded-lg border border-bay-200 mb-2 cursor-pointer hover:bg-bay-50">
              <input
                type="checkbox"
                checked={hideExact}
                onChange={(e) => setHideExact(e.target.checked)}
                className="mt-0.5"
              />
              <div>
                <div className="font-medium text-sm">Hide exact locations</div>
                <div className="text-xs text-neutral-600">
                  Show general area only — no launch point.
                </div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 rounded-lg border border-bay-200 mb-2 cursor-pointer hover:bg-bay-50">
              <input
                type="checkbox"
                checked={hideRoute}
                onChange={(e) => setHideRoute(e.target.checked)}
                className="mt-0.5"
              />
              <div>
                <div className="font-medium text-sm">Hide route</div>
                <div className="text-xs text-neutral-600">
                  Don&apos;t expose where you ran the boat between stops.
                </div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 rounded-lg border border-bay-200 cursor-pointer hover:bg-bay-50">
              <input
                type="checkbox"
                checked={allowPattern}
                onChange={(e) => setAllowPattern(e.target.checked)}
                className="mt-0.5"
              />
              <div>
                <div className="font-medium text-sm">Allow pattern summary</div>
                <div className="text-xs text-neutral-600">
                  Include the AI pattern card in the recap.
                </div>
              </div>
            </label>
          </CardContent>
        </Card>

        <div className="sticky bottom-0 bg-neutral-50 py-3 -mx-4 px-4 border-t border-bay-100 safe-bottom">
          <Button type="submit" size="lg" className="w-full">
            Save profile
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
