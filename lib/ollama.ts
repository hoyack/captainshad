import OpenAI from "openai";

export function getOllamaClient() {
  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OLLAMA_API_KEY is not set. Add it to .env (see .env.example).",
    );
  }
  return new OpenAI({
    apiKey,
    baseURL: process.env.OLLAMA_BASE_URL ?? "https://ollama.com/v1",
  });
}

export const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "gemma4:31b";

// Ollama wraps JSON-mode responses in markdown fences sometimes. Strip them.
export function stripJsonFences(s: string): string {
  let out = s.trim();
  if (out.startsWith("```")) {
    out = out.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  }
  // Some models emit a trailing comma + extra prose; cut to outermost {...}
  const first = out.indexOf("{");
  const last = out.lastIndexOf("}");
  if (first >= 0 && last > first) {
    out = out.slice(first, last + 1);
  }
  return out.trim();
}
