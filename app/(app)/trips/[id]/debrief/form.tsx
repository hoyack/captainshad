"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Debrief } from "@/lib/db/debriefs";
import { saveDebriefAction } from "./actions";

const FIELDS: { key: keyof Omit<Debrief, "id" | "trip_id" | "user_id">; label: string; hint?: string }[] = [
  { key: "main_pattern", label: "Main pattern of the day", hint: "Your one-line read." },
  { key: "why_this_area", label: "Why did this area produce?" },
  { key: "what_changed", label: "What changed during the day?" },
  { key: "bite_turn_on", label: "When did the bite turn on?" },
  { key: "bite_shut_off", label: "When did the bite shut off?" },
  { key: "what_guide_looked_for", label: "What did you look for before stopping?" },
  { key: "what_guide_avoided", label: "What did you avoid?" },
  { key: "try_tomorrow", label: "What would you try tomorrow?" },
  { key: "practice_for_next", label: "What should the client practice for next time?" },
];

export function DebriefForm({
  tripId,
  initial,
}: {
  tripId: string;
  initial?: Debrief;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({
    main_pattern: initial?.main_pattern ?? "",
    why_this_area: initial?.why_this_area ?? "",
    what_changed: initial?.what_changed ?? "",
    bite_turn_on: initial?.bite_turn_on ?? "",
    bite_shut_off: initial?.bite_shut_off ?? "",
    what_guide_looked_for: initial?.what_guide_looked_for ?? "",
    what_guide_avoided: initial?.what_guide_avoided ?? "",
    try_tomorrow: initial?.try_tomorrow ?? "",
    practice_for_next: initial?.practice_for_next ?? "",
  });
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    start(async () => {
      try {
        await saveDebriefAction({
          trip_id: tripId,
          main_pattern: values.main_pattern,
          why_this_area: values.why_this_area,
          what_changed: values.what_changed,
          bite_turn_on: values.bite_turn_on,
          bite_shut_off: values.bite_shut_off,
          what_guide_looked_for: values.what_guide_looked_for,
          what_guide_avoided: values.what_guide_avoided,
          try_tomorrow: values.try_tomorrow,
          practice_for_next: values.practice_for_next,
        });
        router.push(`/trips/${tripId}`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <form onSubmit={submit}>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Capture the lesson</CardTitle>
          <CardDescription>
            Skip what you don&apos;t remember — the AI works with whatever you give it.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="mb-4">
        <CardContent className="pt-4">
          {FIELDS.map((f) => (
            <Field key={f.key} label={f.label} hint={f.hint}>
              <Textarea
                value={values[f.key] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.key]: e.target.value }))
                }
                rows={2}
              />
            </Field>
          ))}
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-900 mb-3">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Save debrief"}
      </Button>
    </form>
  );
}
