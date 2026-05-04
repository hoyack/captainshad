import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  CatchSchema,
  ConditionsSchema,
  DebriefSchema,
  PatternCardLLMSchema,
  TripSchema,
} from "@/lib/schemas";
import { OLLAMA_MODEL, getOllamaClient, stripJsonFences } from "@/lib/ollama";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  trip: TripSchema,
  catches: z.array(CatchSchema),
  conditions: ConditionsSchema.optional(),
  debrief: DebriefSchema.optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request shape", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const userPrompt = buildUserPrompt(parsed.data);

  let client;
  try {
    client = getOllamaClient();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ollama client init failed" },
      { status: 500 },
    );
  }

  const callLLM = async (extraPreamble = "") => {
    const sys = extraPreamble ? `${SYSTEM_PROMPT}\n\n${extraPreamble}` : SYSTEM_PROMPT;
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
    console.error("[pattern-card] Ollama call failed:", e);
    return NextResponse.json(
      { error: "AI generation failed. Check OLLAMA_API_KEY and network." },
      { status: 502 },
    );
  }

  const tryParse = (s: string) => {
    const cleaned = stripJsonFences(s);
    try {
      const json = JSON.parse(cleaned);
      return PatternCardLLMSchema.safeParse(json);
    } catch {
      return null;
    }
  };

  let result = tryParse(raw);
  if (!result || !result.success) {
    console.warn("[pattern-card] First parse failed, retrying with stricter preamble");
    try {
      raw = await callLLM(
        "STRICT: Output exactly one valid JSON object matching the required shape. No markdown, no commentary.",
      );
      result = tryParse(raw);
    } catch (e) {
      console.error("[pattern-card] Retry failed:", e);
    }
  }

  if (!result || !result.success) {
    console.error("[pattern-card] Could not parse model output:", raw);
    return NextResponse.json(
      {
        error:
          "AI returned a response that didn't match the pattern-card shape. Try again.",
        raw,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ pattern: result.data });
}
