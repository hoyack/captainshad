import { z } from "zod";

export const SpeciesSchema = z.enum([
  "redfish",
  "speckled_trout",
  "flounder",
  "black_drum",
  "sheepshead",
  "mangrove_snapper",
  "spanish_mackerel",
  "pompano",
  "jack_crevalle",
  "hardhead",
  "gafftop",
  "other",
]);
export type Species = z.infer<typeof SpeciesSchema>;

export const StructureTagSchema = z.enum([
  "grass_flat",
  "grass_edge",
  "oyster_reef",
  "shell_bottom",
  "sand_pocket",
  "mud_bottom",
  "potholes",
  "marsh_drain",
  "channel_edge",
  "current_seam",
  "jetty_rocks",
  "dock_lights",
  "bridge_piling",
  "deep_cut",
  "spoil_island",
  "shoreline_grass",
  "mangrove_edge",
  "drain",
]);
export type StructureTag = z.infer<typeof StructureTagSchema>;

export const ConditionMarkerSchema = z.enum([
  "birds_working",
  "bait_present",
  "nervous_bait",
  "slicks",
  "mud_boils",
  "tailing_reds",
]);
export type ConditionMarker = z.infer<typeof ConditionMarkerSchema>;

export const PrivacyLevelSchema = z.enum(["private", "pattern_only", "public_safe"]);
export type PrivacyLevel = z.infer<typeof PrivacyLevelSchema>;

export const TripTypeSchema = z.enum([
  "guided",
  "solo",
  "group",
  "scouting",
]);
export type TripType = z.infer<typeof TripTypeSchema>;

export const BoatTypeSchema = z.enum([
  "bay_boat",
  "flats_boat",
  "kayak",
  "wade",
  "jetty",
  "nearshore",
  "offshore",
]);
export type BoatType = z.infer<typeof BoatTypeSchema>;

export const TripSchema = z.object({
  id: z.string(),
  trip_type: TripTypeSchema,
  trip_date: z.string(),
  title: z.string(),
  guide_name: z.string().optional().default(""),
  guide_company: z.string().optional().default(""),
  guide_profile_id: z.string().optional(),
  general_area: z.string().optional().default(""),
  launch_location: z.string().optional().default(""),
  water_body: z.string().optional().default(""),
  boat_type: BoatTypeSchema.optional(),
  target_species: z.array(SpeciesSchema).default([]),
  privacy_level: PrivacyLevelSchema.default("private"),
  notes: z.string().optional().default(""),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Trip = z.infer<typeof TripSchema>;

export const CatchSchema = z.object({
  id: z.string(),
  trip_id: z.string(),
  species: SpeciesSchema,
  time_caught: z.string(),
  approx_length_inches: z.number().optional(),
  approx_weight_lbs: z.number().optional(),
  kept_or_released: z.enum(["kept", "released", "unknown"]).default("released"),
  bait_or_lure: z.string().optional().default(""),
  presentation: z.string().optional().default(""),
  structure_tags: z.array(StructureTagSchema).default([]),
  water_depth_ft: z.number().optional(),
  photo_data_url: z.string().optional(),
  notes: z.string().optional().default(""),
});
export type Catch = z.infer<typeof CatchSchema>;

export const ConditionsSchema = z.object({
  id: z.string(),
  trip_id: z.string(),
  time_observed: z.string(),
  tide_stage: z.enum(["incoming", "outgoing", "high", "low", "slack", "unknown"]).default("unknown"),
  wind_direction: z.enum(["N", "NE", "E", "SE", "S", "SW", "W", "NW", "unknown"]).default("unknown"),
  wind_speed_mph: z.number().optional(),
  water_clarity: z.enum(["clear", "slightly_stained", "stained", "muddy", "unknown"]).default("unknown"),
  cloud_cover: z.enum(["clear", "partly_cloudy", "overcast", "stormy", "unknown"]).default("unknown"),
  bait_activity: z.enum(["none", "low", "medium", "high", "unknown"]).default("unknown"),
  bird_activity: z.enum(["none", "low", "medium", "high", "unknown"]).default("unknown"),
  current_strength: z.enum(["none", "weak", "moderate", "strong", "unknown"]).default("unknown"),
  markers: z.array(ConditionMarkerSchema).default([]),
  notes: z.string().optional().default(""),
});
export type Conditions = z.infer<typeof ConditionsSchema>;

export const DebriefSchema = z.object({
  id: z.string(),
  trip_id: z.string(),
  main_pattern: z.string().default(""),
  why_this_area: z.string().default(""),
  what_changed: z.string().default(""),
  bite_turn_on: z.string().default(""),
  bite_shut_off: z.string().default(""),
  what_guide_looked_for: z.string().default(""),
  what_guide_avoided: z.string().default(""),
  try_tomorrow: z.string().default(""),
  practice_for_next: z.string().default(""),
});
export type Debrief = z.infer<typeof DebriefSchema>;

export const PatternCardSchema = z.object({
  id: z.string(),
  trip_id: z.string(),
  title: z.string(),
  summary: z.string(),
  target_species: z.array(z.string()),
  tide_pattern: z.string(),
  wind_pattern: z.string(),
  structure_pattern: z.string(),
  bait_pattern: z.string(),
  presentation_pattern: z.string(),
  bite_window: z.string(),
  why_it_worked: z.string(),
  what_to_try_next_time: z.string(),
  confidence_score: z.number(),
  privacy_warning: z.string(),
  conservation_note: z.string(),
  created_at: z.string(),
});
export type PatternCard = z.infer<typeof PatternCardSchema>;

// Subset returned from the LLM (no id/trip_id/created_at — those are added server-side)
export const PatternCardLLMSchema = PatternCardSchema.omit({
  id: true,
  trip_id: true,
  created_at: true,
});
export type PatternCardLLM = z.infer<typeof PatternCardLLMSchema>;

export const GuideProfileSchema = z.object({
  id: z.string(),
  guide_name: z.string(),
  company_name: z.string().default(""),
  service_area: z.array(z.string()).default([]),
  target_species: z.array(SpeciesSchema).default([]),
  booking_url: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().default(""),
  logo_url: z.string().default(""),
  privacy_defaults: z.object({
    hide_exact_locations: z.boolean().default(true),
    hide_route: z.boolean().default(true),
    allow_pattern_summary: z.boolean().default(true),
  }),
  created_at: z.string(),
});
export type GuideProfile = z.infer<typeof GuideProfileSchema>;
