"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteGuide, listGuides, listTrips } from "@/lib/storage";
import type { GuideProfile, Trip } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

export default function GuideHomePage() {
  const [guides, setGuides] = useState<GuideProfile[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);

  const refresh = () => {
    setGuides(listGuides());
    setTrips(listTrips().filter((t) => t.trip_type === "guided"));
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AppShell title="Guide mode" back={{ href: "/" }}>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Branded client recaps</CardTitle>
          <CardDescription>
            Create a guide profile, then send clients a polished post-trip recap that respects your privacy controls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/guide/profile">
            <Button className="w-full">
              <Plus className="h-4 w-4" />
              {guides.length === 0 ? "Create guide profile" : "Add guide profile"}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {guides.length > 0 && (
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
            Guide profiles
          </h3>
          <div className="space-y-2">
            {guides.map((g) => (
              <Card key={g.id}>
                <CardContent className="py-3 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{g.guide_name}</div>
                    {g.company_name && (
                      <div className="text-xs text-neutral-500">
                        {g.company_name}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {g.privacy_defaults.hide_exact_locations && (
                        <Badge variant="muted">Spots hidden</Badge>
                      )}
                      {g.privacy_defaults.hide_route && (
                        <Badge variant="muted">Route hidden</Badge>
                      )}
                      {g.privacy_defaults.allow_pattern_summary && (
                        <Badge variant="success">Pattern summary on</Badge>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Delete this guide profile?")) {
                        deleteGuide(g.id);
                        refresh();
                      }
                    }}
                    className="text-neutral-400 hover:text-red-600 p-2"
                    aria-label="Delete guide"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {trips.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
            Recent guided trips
          </h3>
          <div className="space-y-2">
            {trips.slice(0, 5).map((t) => (
              <Link key={t.id} href={`/guide/recap/${t.id}`} className="block">
                <Card className="hover:border-bay-300">
                  <CardContent className="py-3">
                    <div className="font-medium text-sm">{t.title}</div>
                    <div className="text-xs text-neutral-500">
                      {formatDate(t.trip_date)}
                      {t.guide_name ? ` · ${t.guide_name}` : ""}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
