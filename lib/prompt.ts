// Spec §16 prompt template, parameterized.
// Augmented with the Aransas Bay system fish dataset so the LLM is grounded in
// authoritative seasonal/habitat/regulation facts instead of training memory.

import type { Catch, Conditions, Debrief, Trip } from "./schemas";
import {
  ACTIVITY_LEVELS,
  CLOUD_COVER,
  CURRENT_STRENGTHS,
  SPECIES_OPTIONS,
  STRUCTURE_OPTIONS,
  TIDE_STAGES,
  WATER_BODIES,
  WATER_CLARITY,
  lookupLabel,
} from "./local-data";
import {
  getDataset,
  getMonthCalendar,
  resolveSpecies,
  monthName,
} from "./fish-dataset";

const SYSTEM_PROMPT = `You are Captain Shad, a coastal fishing trip debrief assistant focused on Aransas Pass, Port Aransas, Redfish Bay, Lydia Ann Channel, Corpus Christi Bay, Aransas Bay, and Rockport.

Your job is to convert a fishing trip log into a privacy-safe fishing pattern card.

Rules:
- Do not reveal exact GPS coordinates.
- Do not encourage users to expose guide spots.
- Focus on species behavior, structure, tide, wind, water clarity, bait, and presentation.
- Keep tone helpful, specific, and grounded in the data provided. Do not invent details that contradict the trip log.
- Always include a conservation note pointing the angler at TPWD for current regulations.

Respond with a single valid JSON object — no markdown fences, no commentary, no prose outside the JSON.

Required JSON shape:
{
  "title": string,
  "summary": string,
  "target_species": string[],
  "tide_pattern": string,
  "wind_pattern": string,
  "structure_pattern": string,
  "bait_pattern": string,
  "presentation_pattern": string,
  "bite_window": string,
  "why_it_worked": string,
  "what_to_try_next_time": string,
  "confidence_score": number,        // 0.0–1.0 based on how much data was present
  "privacy_warning": string,          // remind user not to publicly post exact spots
  "conservation_note": string         // mention TPWD bag/length checks
}`;

export function buildUserPrompt({
  trip,
  catches,
  conditions,
  debrief,
}: {
  trip: Trip;
  catches: Catch[];
  conditions?: Conditions;
  debrief?: Debrief;
}): string {
  const tripBlock = {
    date: trip.trip_date,
    type: trip.trip_type,
    title: trip.title,
    general_area: trip.general_area || "(not provided)",
    water_body: lookupLabel(WATER_BODIES, trip.water_body) || "(not provided)",
    boat_type: trip.boat_type ?? "(not provided)",
    target_species: trip.target_species,
    guide_name: trip.guide_name || "(not applicable)",
    notes: trip.notes || "",
  };

  const catchBlock = catches.map((c) => ({
    species: lookupLabel(SPECIES_OPTIONS, c.species),
    time: c.time_caught,
    approx_length_in: c.approx_length_inches,
    kept_or_released: c.kept_or_released,
    bait_or_lure: c.bait_or_lure,
    presentation: c.presentation,
    structure: c.structure_tags.map((s) => lookupLabel(STRUCTURE_OPTIONS, s)),
    notes: c.notes,
  }));

  const conditionsBlock = conditions
    ? {
        tide_stage: lookupLabel(TIDE_STAGES, conditions.tide_stage),
        wind_direction: conditions.wind_direction,
        wind_speed_mph: conditions.wind_speed_mph,
        water_clarity: lookupLabel(WATER_CLARITY, conditions.water_clarity),
        cloud_cover: lookupLabel(CLOUD_COVER, conditions.cloud_cover),
        bait_activity: lookupLabel(ACTIVITY_LEVELS, conditions.bait_activity),
        bird_activity: lookupLabel(ACTIVITY_LEVELS, conditions.bird_activity),
        current_strength: lookupLabel(CURRENT_STRENGTHS, conditions.current_strength),
        markers: conditions.markers,
        notes: conditions.notes,
      }
    : "(not recorded)";

  const debriefBlock = debrief
    ? {
        main_pattern: debrief.main_pattern,
        why_this_area: debrief.why_this_area,
        what_changed: debrief.what_changed,
        bite_turn_on: debrief.bite_turn_on,
        bite_shut_off: debrief.bite_shut_off,
        what_guide_looked_for: debrief.what_guide_looked_for,
        what_guide_avoided: debrief.what_guide_avoided,
        try_tomorrow: debrief.try_tomorrow,
        practice_for_next: debrief.practice_for_next,
      }
    : "(not recorded)";

  // ---- Reference facts pulled from the bundled Aransas Bay dataset ----
  const tripMonth = (() => {
    const d = new Date(trip.trip_date);
    return Number.isNaN(d.getTime()) ? new Date().getMonth() + 1 : d.getMonth() + 1;
  })();

  const monthCal = getMonthCalendar(tripMonth);

  // Pull dataset entries for every species the angler interacted with (target + caught).
  const allSpeciesIds = Array.from(
    new Set([...trip.target_species, ...catches.map((c) => c.species)]),
  );
  const speciesFacts = allSpeciesIds
    .map((id) => {
      const sp = resolveSpecies(id);
      if (!sp) return null;
      return {
        id: sp.id,
        common_name: sp.common_name,
        category: sp.category,
        in_season_this_month: sp.months_present.includes(tripMonth),
        peak_this_month: sp.peak_months.includes(tripMonth),
        peak_months: sp.peak_months,
        habitat: sp.habitat,
        notes: sp.notes,
        regulations: sp.regulations,
      };
    })
    .filter(Boolean);

  const triggers = getDataset().environmental_triggers;

  const referenceBlock = {
    month: monthName(tripMonth),
    monthly_calendar: monthCal
      ? {
          top_targets: monthCal.top_targets,
          water_temp_range_f: monthCal.water_temp_range_f,
          notes: monthCal.notes,
          pattern: monthCal.pattern,
        }
      : "(no calendar entry)",
    species_facts: speciesFacts,
    tide_pattern_reference: triggers.tide_patterns,
    water_temperature_reference: triggers.water_temperature,
    weather_pattern_reference: triggers.weather_patterns,
  };

  return `Trip data:
${JSON.stringify(tripBlock, null, 2)}

Catch data (${catches.length} catches):
${JSON.stringify(catchBlock, null, 2)}

Conditions:
${JSON.stringify(conditionsBlock, null, 2)}

Guide debrief notes:
${JSON.stringify(debriefBlock, null, 2)}

Reference data — Aransas Bay system, authoritative. Use these facts (especially seasonal timing, habitat, and species-specific regulations) instead of relying on general training knowledge:
${JSON.stringify(referenceBlock, null, 2)}

When writing the conservation_note, prefer the species-specific bag/size limits from the reference data over a generic TPWD reminder. Still mention TPWD as the authoritative source.

Generate the pattern card JSON now.`;
}

export { SYSTEM_PROMPT };
