import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertTriangle, Fish, Wind, Layers, Anchor, Clock, Lightbulb, ShieldAlert } from "lucide-react";
import type { PatternCard } from "@/lib/schemas";

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div className="flex gap-3 py-2 border-b border-neutral-100 last:border-0">
      <div className="text-bay-600 mt-0.5">{icon}</div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wide text-neutral-500">
          {label}
        </div>
        <div className="text-sm text-neutral-900">{value}</div>
      </div>
    </div>
  );
}

export function PatternCardView({ pattern }: { pattern: PatternCard }) {
  const confidencePct = Math.round((pattern.confidence_score ?? 0) * 100);
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-lg">{pattern.title}</CardTitle>
              <CardDescription className="mt-1">{pattern.summary}</CardDescription>
            </div>
            <Badge variant="default">{confidencePct}% confident</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {pattern.target_species.map((s) => (
              <Badge key={s} variant="success">{s}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conditions that mattered</CardTitle>
        </CardHeader>
        <CardContent>
          <Row icon={<Clock className="h-4 w-4" />} label="Tide" value={pattern.tide_pattern} />
          <Row icon={<Wind className="h-4 w-4" />} label="Wind" value={pattern.wind_pattern} />
          <Row icon={<Layers className="h-4 w-4" />} label="Structure" value={pattern.structure_pattern} />
          <Row icon={<Fish className="h-4 w-4" />} label="Bait" value={pattern.bait_pattern} />
          <Row icon={<Anchor className="h-4 w-4" />} label="Presentation" value={pattern.presentation_pattern} />
          <Row icon={<Clock className="h-4 w-4" />} label="Bite window" value={pattern.bite_window} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-bay-600" />
            Why it worked
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-800 whitespace-pre-line">
            {pattern.why_it_worked}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Try next time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-800 whitespace-pre-line">
            {pattern.what_to_try_next_time}
          </p>
        </CardContent>
      </Card>

      {pattern.privacy_warning && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-3 flex gap-2 items-start">
            <ShieldAlert className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-900">{pattern.privacy_warning}</p>
          </CardContent>
        </Card>
      )}

      {pattern.conservation_note && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="py-3 flex gap-2 items-start">
            <AlertTriangle className="h-4 w-4 text-emerald-700 mt-0.5 shrink-0" />
            <p className="text-xs text-emerald-900">{pattern.conservation_note}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
