"use client";

import {
  CatchSchema,
  ConditionsSchema,
  DebriefSchema,
  GuideProfileSchema,
  PatternCardSchema,
  TripSchema,
  type Catch,
  type Conditions,
  type Debrief,
  type GuideProfile,
  type PatternCard,
  type Trip,
} from "./schemas";
import { z } from "zod";

const KEYS = {
  trips: "captainshad:trips",
  catches: "captainshad:catches",
  conditions: "captainshad:conditions",
  debriefs: "captainshad:debriefs",
  patterns: "captainshad:patterns",
  guides: "captainshad:guides",
} as const;

function read<S extends z.ZodTypeAny>(key: string, schema: S): z.output<S>[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        const result = schema.safeParse(item);
        return result.success ? (result.data as z.output<S>) : null;
      })
      .filter((v): v is z.output<S> => v !== null);
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
}

// ---- Trips ----
export function listTrips(): Trip[] {
  return read(KEYS.trips, TripSchema).sort((a, b) =>
    b.trip_date.localeCompare(a.trip_date),
  );
}

export function getTrip(id: string): Trip | undefined {
  return listTrips().find((t) => t.id === id);
}

export function saveTrip(trip: Trip) {
  const trips = read(KEYS.trips, TripSchema);
  const idx = trips.findIndex((t) => t.id === trip.id);
  if (idx >= 0) trips[idx] = trip;
  else trips.push(trip);
  write(KEYS.trips, trips);
}

export function deleteTrip(id: string) {
  write(
    KEYS.trips,
    read(KEYS.trips, TripSchema).filter((t) => t.id !== id),
  );
  // cascade
  write(
    KEYS.catches,
    read(KEYS.catches, CatchSchema).filter((c) => c.trip_id !== id),
  );
  write(
    KEYS.conditions,
    read(KEYS.conditions, ConditionsSchema).filter((c) => c.trip_id !== id),
  );
  write(
    KEYS.debriefs,
    read(KEYS.debriefs, DebriefSchema).filter((d) => d.trip_id !== id),
  );
  write(
    KEYS.patterns,
    read(KEYS.patterns, PatternCardSchema).filter((p) => p.trip_id !== id),
  );
}

// ---- Catches ----
export function listCatchesByTrip(tripId: string): Catch[] {
  return read(KEYS.catches, CatchSchema)
    .filter((c) => c.trip_id === tripId)
    .sort((a, b) => a.time_caught.localeCompare(b.time_caught));
}

export function saveCatch(c: Catch) {
  const items = read(KEYS.catches, CatchSchema);
  const idx = items.findIndex((x) => x.id === c.id);
  if (idx >= 0) items[idx] = c;
  else items.push(c);
  write(KEYS.catches, items);
}

export function deleteCatch(id: string) {
  write(
    KEYS.catches,
    read(KEYS.catches, CatchSchema).filter((c) => c.id !== id),
  );
}

// ---- Conditions (one per trip in the prototype) ----
export function getConditionsByTrip(tripId: string): Conditions | undefined {
  return read(KEYS.conditions, ConditionsSchema).find((c) => c.trip_id === tripId);
}

export function saveConditions(c: Conditions) {
  const items = read(KEYS.conditions, ConditionsSchema).filter(
    (x) => x.trip_id !== c.trip_id,
  );
  items.push(c);
  write(KEYS.conditions, items);
}

// ---- Debriefs ----
export function getDebriefByTrip(tripId: string): Debrief | undefined {
  return read(KEYS.debriefs, DebriefSchema).find((d) => d.trip_id === tripId);
}

export function saveDebrief(d: Debrief) {
  const items = read(KEYS.debriefs, DebriefSchema).filter(
    (x) => x.trip_id !== d.trip_id,
  );
  items.push(d);
  write(KEYS.debriefs, items);
}

// ---- Pattern cards ----
export function listPatterns(): PatternCard[] {
  return read(KEYS.patterns, PatternCardSchema).sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
}

export function getPatternByTrip(tripId: string): PatternCard | undefined {
  return read(KEYS.patterns, PatternCardSchema).find((p) => p.trip_id === tripId);
}

export function savePattern(p: PatternCard) {
  const items = read(KEYS.patterns, PatternCardSchema).filter(
    (x) => x.trip_id !== p.trip_id,
  );
  items.push(p);
  write(KEYS.patterns, items);
}

export function deletePattern(id: string) {
  write(
    KEYS.patterns,
    read(KEYS.patterns, PatternCardSchema).filter((p) => p.id !== id),
  );
}

// ---- Guide profiles ----
export function listGuides(): GuideProfile[] {
  return read(KEYS.guides, GuideProfileSchema);
}

export function getGuide(id: string): GuideProfile | undefined {
  return listGuides().find((g) => g.id === id);
}

export function saveGuide(g: GuideProfile) {
  const items = read(KEYS.guides, GuideProfileSchema);
  const idx = items.findIndex((x) => x.id === g.id);
  if (idx >= 0) items[idx] = g;
  else items.push(g);
  write(KEYS.guides, items);
}

export function deleteGuide(id: string) {
  write(
    KEYS.guides,
    read(KEYS.guides, GuideProfileSchema).filter((g) => g.id !== id),
  );
}
