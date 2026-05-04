import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { OLLAMA_MODEL, getOllamaClient, stripJsonFences } from "@/lib/ollama";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";
import { PatternCardLLMSchema } from "@/lib/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTrip } from "@/lib/db/trips";
import { listCatchesByTrip } from "@/lib/db/catches";
import { getConditionsByTrip } from "@/lib/db/conditions";
import { getDebriefByTrip } from "@/lib/db/debriefs";
import { upsertPattern } from "@/lib/db/patterns";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RequestSchema = z.object({ tripId: z.string().uuid() });

export async function POST(req: NextRequest) {
  // Auth
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "tripId required" }, { status: 400 });
  }

  // Load trip + related data; RLS guarantees the row belongs to this user
  // (or trip will be null for cross-tenant attempts).
  const trip = await getTrip(parsed.data.tripId);
  if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

  const [catches, conditions, debrief] = await Promise.all([
    listCatchesByTrip(trip.id),
    getConditionsByTrip(trip.id),
    getDebriefByTrip(trip.id),
  ]);

  // Build prompt — note buildUserPrompt expects shapes with optional fields,
  // which the DB query results satisfy.
  const userPrompt = buildUserPrompt({
    trip: {
      ...trip,
      // shape glue: prompt builder expects a `trip_type` even though we removed it
      trip_type: "guided" as const,
      // and Zod-defaultable strings
      guide_name: trip.client?.name ?? "",
      guide_company: "",
      target_species: trip.target_species as never,
      privacy_level: trip.privacy_level,
    } as Parameters<typeof buildUserPrompt>[0]["trip"],
    catches: catches.map((c) => ({
      ...c,
      structure_tags: c.structure_tags as never,
      species: c.species as never,
      kept_or_released: c.kept_or_released,
    })) as Parameters<typeof buildUserPrompt>[0]["catches"],
    conditions: conditions
      ? ({
          ...conditions,
          tide_stage: conditions.tide_stage as never,
          wind_direction: conditions.wind_direction as never,
          water_clarity: conditions.water_clarity as never,
          cloud_cover: conditions.cloud_cover as never,
          bait_activity: conditions.bait_activity as never,
          bird_activity: conditions.bird_activity as never,
          current_strength: conditions.current_strength as never,
          markers: conditions.markers as never,
        } as Parameters<typeof buildUserPrompt>[0]["conditions"])
      : undefined,
    debrief: debrief ?? undefined,
  });

  let client;
  try {
    client = getOllamaClient();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ollama init failed" },
      { status: 500 },
    );
  }

  const callLLM = async (extra = "") => {
    const sys = extra ? `${SYSTEM_PROMPT}\n\n${extra}` : SYSTEM_PROMPT;
    const completion = await client.chat.completions.create({
      model: OLLAMA_MODEL,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });
    return completion.choices[0]?.message?.content ?? "";
  };

  let raw = "";
  try {
    raw = await callLLM();
  } catch (e) {
    console.error("[pattern-card] LLM call failed:", e);
    return NextResponse.json({ error: "AI generation failed" }, { status: 502 });
  }

  const tryParse = (s: string) => {
    try {
      return PatternCardLLMSchema.safeParse(JSON.parse(stripJsonFences(s)));
    } catch {
      return null;
    }
  };

  let result = tryParse(raw);
  if (!result || !result.success) {
    try {
      raw = await callLLM(
        "STRICT: Output exactly one valid JSON object matching the required shape.",
      );
      result = tryParse(raw);
    } catch (e) {
      console.error("[pattern-card] retry failed:", e);
    }
  }

  if (!result || !result.success) {
    console.error("[pattern-card] unparseable:", raw);
    return NextResponse.json(
      { error: "AI returned an unparseable response. Try again." },
      { status: 502 },
    );
  }

  // Persist
  const saved = await upsertPattern({
    trip_id: trip.id,
    title: result.data.title,
    summary: result.data.summary,
    target_species: result.data.target_species,
    tide_pattern: result.data.tide_pattern,
    wind_pattern: result.data.wind_pattern,
    structure_pattern: result.data.structure_pattern,
    bait_pattern: result.data.bait_pattern,
    presentation_pattern: result.data.presentation_pattern,
    bite_window: result.data.bite_window,
    why_it_worked: result.data.why_it_worked,
    what_to_try_next_time: result.data.what_to_try_next_time,
    confidence_score: result.data.confidence_score,
    privacy_warning: result.data.privacy_warning,
    conservation_note: result.data.conservation_note,
  });

  return NextResponse.json({ pattern: saved });
}
