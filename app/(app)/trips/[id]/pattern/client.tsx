"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PatternCardView } from "@/components/PatternCardView";
import type { PatternCard } from "@/lib/db/patterns";

export function PatternClient({
  tripId,
  existing,
  counts,
}: {
  tripId: string;
  existing: PatternCard | null;
  counts: { catches: number; conditions: boolean; debrief: boolean };
}) {
  const [pattern, setPattern] = useState<PatternCard | null>(existing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const generate = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch("/api/pattern-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Generation failed");
      setPattern(data.pattern);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!pattern && !loading && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Generate a pattern card</CardTitle>
            <CardDescription>
              Captain Shad reads your catches, conditions, and debrief notes,
              and turns them into a reusable lesson.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-xs text-neutral-600 mb-4 space-y-1">
              <li>· {counts.catches} catch{counts.catches === 1 ? "" : "es"}</li>
              <li>· Conditions {counts.conditions ? "logged" : "not logged"}</li>
              <li>· Debrief {counts.debrief ? "logged" : "not logged"}</li>
            </ul>
            <Button onClick={generate} className="w-full" size="lg">
              <Sparkles className="h-4 w-4" /> Generate
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card className="mb-4">
          <CardContent className="py-8 text-center">
            <div className="inline-block animate-pulse">
              <Sparkles className="h-8 w-8 text-bay-500 mx-auto" />
            </div>
            <p className="mt-3 text-sm text-neutral-700">Reading your trip…</p>
            <p className="text-xs text-neutral-500 mt-1">5–20 seconds.</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="py-3">
            <p className="text-sm text-red-900">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={generate}
              className="mt-2"
              disabled={loading}
            >
              <RotateCcw className="h-3 w-3" /> Try again
            </Button>
          </CardContent>
        </Card>
      )}

      {pattern && (
        <>
          <PatternCardView pattern={pattern} />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={generate} variant="outline" disabled={loading}>
              <RotateCcw className="h-4 w-4" /> Regenerate
            </Button>
            <Link href={`/trips/${tripId}/recap`}>
              <Button className="w-full">
                <Share2 className="h-4 w-4" /> Publish recap
              </Button>
            </Link>
          </div>
        </>
      )}
    </>
  );
}
