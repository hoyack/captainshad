"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDebriefByTrip, saveDebrief } from "@/lib/storage";
import type { Debrief } from "@/lib/schemas";
import { uid } from "@/lib/utils";

const FIELDS: {
  key: keyof Omit<Debrief, "id" | "trip_id">;
  label: string;
  hint?: string;
}[] = [
  {
    key: "main_pattern",
    label: "What did the guide say was the main pattern?",
    hint: "Their one-line read on what was working today.",
  },
  {
    key: "why_this_area",
    label: "Why did this area produce?",
  },
  {
    key: "what_changed",
    label: "What changed during the day?",
  },
  {
    key: "bite_turn_on",
    label: "When did the bite turn on?",
  },
  {
    key: "bite_shut_off",
    label: "When did the bite shut off?",
  },
  {
    key: "what_guide_looked_for",
    label: "What did the guide look for before stopping?",
    hint: "Bait, slicks, mud, water color, etc.",
  },
  {
    key: "what_guide_avoided",
    label: "What did the guide avoid?",
  },
  {
    key: "try_tomorrow",
    label: "What would the guide try tomorrow?",
  },
  {
    key: "practice_for_next",
    label: "What should you practice before fishing alone?",
  },
];

export default function DebriefPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tripId } = use(params);
  const router = useRouter();

  const [values, setValues] = useState<Record<string, string>>({});
  const [existingId, setExistingId] = useState<string | undefined>();

  useEffect(() => {
    const d = getDebriefByTrip(tripId);
    if (d) {
      setExistingId(d.id);
      setValues({
        main_pattern: d.main_pattern,
        why_this_area: d.why_this_area,
        what_changed: d.what_changed,
        bite_turn_on: d.bite_turn_on,
        bite_shut_off: d.bite_shut_off,
        what_guide_looked_for: d.what_guide_looked_for,
        what_guide_avoided: d.what_guide_avoided,
        try_tomorrow: d.try_tomorrow,
        practice_for_next: d.practice_for_next,
      });
    }
  }, [tripId]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const d: Debrief = {
      id: existingId ?? uid(),
      trip_id: tripId,
      main_pattern: values.main_pattern ?? "",
      why_this_area: values.why_this_area ?? "",
      what_changed: values.what_changed ?? "",
      bite_turn_on: values.bite_turn_on ?? "",
      bite_shut_off: values.bite_shut_off ?? "",
      what_guide_looked_for: values.what_guide_looked_for ?? "",
      what_guide_avoided: values.what_guide_avoided ?? "",
      try_tomorrow: values.try_tomorrow ?? "",
      practice_for_next: values.practice_for_next ?? "",
    };
    saveDebrief(d);
    router.push(`/trip/${tripId}`);
  };

  return (
    <AppShell title="Guide debrief" back={{ href: `/trip/${tripId}` }}>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Capture the lesson</CardTitle>
          <CardDescription>
            Skip what you don&apos;t remember — the AI works with whatever you give it.
          </CardDescription>
        </CardHeader>
      </Card>
      <form onSubmit={submit}>
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

        <div className="sticky bottom-0 bg-neutral-50 py-3 -mx-4 px-4 border-t border-bay-100 safe-bottom">
          <Button type="submit" size="lg" className="w-full">
            Save debrief
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
