// Hardcoded Aransas Pass / Coastal Bend content from spec §5, §7, §9.4.

import type {
  BoatType,
  ConditionMarker,
  Species,
  StructureTag,
  TripType,
} from "./schemas";

export const WATER_BODIES: { value: string; label: string }[] = [
  { value: "redfish_bay", label: "Redfish Bay" },
  { value: "lydia_ann_channel", label: "Lydia Ann Channel" },
  { value: "corpus_christi_bay", label: "Corpus Christi Bay" },
  { value: "aransas_bay", label: "Aransas Bay" },
  { value: "copano_bay", label: "Copano Bay" },
  { value: "port_a_jetties", label: "Port Aransas jetties" },
  { value: "rockport_fulton", label: "Rockport / Fulton" },
  { value: "estes_flats", label: "Estes Flats" },
  { value: "south_bay", label: "South Bay" },
  { value: "st_charles_bay", label: "St. Charles Bay" },
  { value: "other", label: "Other / off the map" },
];

export const SPECIES_OPTIONS: { value: Species; label: string }[] = [
  { value: "redfish", label: "Redfish" },
  { value: "speckled_trout", label: "Speckled trout" },
  { value: "flounder", label: "Flounder" },
  { value: "black_drum", label: "Black drum" },
  { value: "sheepshead", label: "Sheepshead" },
  { value: "mangrove_snapper", label: "Mangrove snapper" },
  { value: "spanish_mackerel", label: "Spanish mackerel" },
  { value: "pompano", label: "Pompano" },
  { value: "jack_crevalle", label: "Jack crevalle" },
  { value: "hardhead", label: "Hardhead (nuisance)" },
  { value: "gafftop", label: "Gafftop (nuisance)" },
  { value: "other", label: "Other" },
];

export const STRUCTURE_OPTIONS: { value: StructureTag; label: string }[] = [
  { value: "grass_flat", label: "Grass flat" },
  { value: "grass_edge", label: "Grass edge" },
  { value: "oyster_reef", label: "Oyster reef" },
  { value: "shell_bottom", label: "Shell bottom" },
  { value: "sand_pocket", label: "Sand pocket" },
  { value: "mud_bottom", label: "Mud bottom" },
  { value: "potholes", label: "Potholes" },
  { value: "marsh_drain", label: "Marsh drain" },
  { value: "channel_edge", label: "Channel edge" },
  { value: "current_seam", label: "Current seam" },
  { value: "jetty_rocks", label: "Jetty rocks" },
  { value: "dock_lights", label: "Dock lights" },
  { value: "bridge_piling", label: "Bridge piling" },
  { value: "deep_cut", label: "Deep cut" },
  { value: "spoil_island", label: "Spoil island" },
  { value: "shoreline_grass", label: "Shoreline grass" },
  { value: "mangrove_edge", label: "Mangrove edge" },
  { value: "drain", label: "Drain" },
];

export const CONDITION_MARKERS: { value: ConditionMarker; label: string }[] = [
  { value: "birds_working", label: "Birds working" },
  { value: "bait_present", label: "Bait present" },
  { value: "nervous_bait", label: "Nervous bait" },
  { value: "slicks", label: "Slicks" },
  { value: "mud_boils", label: "Mud boils" },
  { value: "tailing_reds", label: "Tailing reds" },
];

export const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: "guided", label: "Guided" },
  { value: "solo", label: "Solo" },
  { value: "group", label: "Group" },
  { value: "scouting", label: "Scouting" },
];

export const BOAT_TYPES: { value: BoatType; label: string }[] = [
  { value: "bay_boat", label: "Bay boat" },
  { value: "flats_boat", label: "Flats boat" },
  { value: "kayak", label: "Kayak" },
  { value: "wade", label: "Wade fishing" },
  { value: "jetty", label: "Jetty" },
  { value: "nearshore", label: "Nearshore" },
  { value: "offshore", label: "Offshore" },
];

export const TIDE_STAGES = [
  { value: "incoming", label: "Incoming" },
  { value: "outgoing", label: "Outgoing" },
  { value: "high", label: "High slack" },
  { value: "low", label: "Low slack" },
  { value: "slack", label: "Slack" },
  { value: "unknown", label: "Not sure" },
];

export const WIND_DIRECTIONS = [
  "N",
  "NE",
  "E",
  "SE",
  "S",
  "SW",
  "W",
  "NW",
  "unknown",
].map((v) => ({ value: v, label: v === "unknown" ? "Not sure" : v }));

export const WATER_CLARITY = [
  { value: "clear", label: "Clear" },
  { value: "slightly_stained", label: "Slightly stained" },
  { value: "stained", label: "Stained" },
  { value: "muddy", label: "Muddy" },
  { value: "unknown", label: "Not sure" },
];

export const CLOUD_COVER = [
  { value: "clear", label: "Clear" },
  { value: "partly_cloudy", label: "Partly cloudy" },
  { value: "overcast", label: "Overcast" },
  { value: "stormy", label: "Stormy" },
  { value: "unknown", label: "Not sure" },
];

export const ACTIVITY_LEVELS = [
  { value: "none", label: "None" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "unknown", label: "Not sure" },
];

export const CURRENT_STRENGTHS = [
  { value: "none", label: "None" },
  { value: "weak", label: "Weak" },
  { value: "moderate", label: "Moderate" },
  { value: "strong", label: "Strong" },
  { value: "unknown", label: "Not sure" },
];

export const PRE_TRIP_CHECKLIST = [
  "Fishing license + saltwater endorsement",
  "Polarized sunglasses",
  "Hat",
  "Sunscreen",
  "Soft cooler",
  "Motion sickness meds (if needed)",
  "Non-marking shoes",
  "Water",
  "Camera / phone",
  "Cash tip for guide",
  "Questions written down for the guide",
];

export const GUIDE_QUESTION_PROMPTS = [
  "What pattern are we fishing today?",
  "What made you choose this area?",
  "What tide stage matters most right now?",
  "What are you looking for in the water?",
  "What bait or lure matches today's conditions?",
  "What would change if the wind shifted?",
  "What should I try next time if I fish alone?",
];

export const PRIVACY_OPTIONS = [
  {
    value: "private",
    label: "Private",
    description: "Visible only to me. Exact spot pins kept.",
  },
  {
    value: "pattern_only",
    label: "Pattern only",
    description: "No map, no spot — just conditions, structure, lessons.",
  },
  {
    value: "public_safe",
    label: "Public-safe",
    description: "Shareable. No coordinates. No sensitive spot details.",
  },
] as const;

export function lookupLabel<T extends { value: string; label: string }>(
  options: readonly T[],
  value: string | undefined,
): string {
  if (!value) return "";
  return options.find((o) => o.value === value)?.label ?? value;
}
