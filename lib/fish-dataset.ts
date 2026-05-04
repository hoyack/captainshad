import dataset from "./data/fish-dataset.json";

// Mirrors the shape in lib/data/fish-dataset.json.
export interface FishSpecies {
  id: string;
  common_name: string;
  alternative_names?: string[];
  scientific_name?: string;
  category: "inshore" | "nearshore" | "offshore";
  months_present: number[];
  peak_months: number[];
  best_months?: Record<string, number[]>;
  habitat: string[];
  notes: string;
  regulations?: {
    bag_limit?: string;
    size_limit?: string;
    season_closure?: string;
    special_rules?: string;
  };
}

export interface MonthlyCalendarEntry {
  month: string;
  top_targets: string[];
  notes: string;
  water_temp_range_f: [number, number];
  pattern: string;
}

export interface FishDataset {
  metadata: {
    region: string;
    locations: string[];
    state: string;
    water_type: string;
    dataset_version: string;
    last_updated: string;
    disclaimer: string;
  };
  species: FishSpecies[];
  monthly_calendar: Record<string, MonthlyCalendarEntry>;
  environmental_triggers: {
    water_temperature: Record<string, string>;
    tide_patterns: Record<string, string>;
    weather_patterns: Record<string, string>;
  };
  regulations_summary: Record<string, unknown>;
}

const DATASET = dataset as unknown as FishDataset;

const SPECIES_BY_ID = new Map<string, FishSpecies>(
  DATASET.species.map((s) => [s.id, s]),
);

// Map our existing app species enum values to dataset IDs where they don't match exactly.
// Anything not listed here is assumed to map 1:1.
const APP_TO_DATASET: Record<string, string> = {
  gafftop: "gafftopsail_catfish",
  // "hardhead" and "other" have no dataset entry → resolveSpecies returns undefined.
};

export function getDataset(): FishDataset {
  return DATASET;
}

export function getAllSpecies(): FishSpecies[] {
  return DATASET.species;
}

export function resolveSpecies(appSpeciesId: string): FishSpecies | undefined {
  const datasetId = APP_TO_DATASET[appSpeciesId] ?? appSpeciesId;
  return SPECIES_BY_ID.get(datasetId);
}

export function getMonthCalendar(monthIndex: number): MonthlyCalendarEntry | undefined {
  // monthIndex: 1–12
  return DATASET.monthly_calendar[String(monthIndex)];
}

export function getCurrentMonthIndex(date: Date = new Date()): number {
  return date.getMonth() + 1;
}

export function isInSeason(speciesId: string, monthIndex: number): boolean {
  const sp = resolveSpecies(speciesId);
  if (!sp) return true; // unknown species → don't warn
  return sp.months_present.includes(monthIndex);
}

export function isPeakSeason(speciesId: string, monthIndex: number): boolean {
  const sp = resolveSpecies(speciesId);
  if (!sp) return false;
  return sp.peak_months.includes(monthIndex);
}

export function topTargetsForMonth(monthIndex: number): FishSpecies[] {
  const cal = getMonthCalendar(monthIndex);
  if (!cal) return [];
  return cal.top_targets
    .map((id) => SPECIES_BY_ID.get(id))
    .filter((s): s is FishSpecies => Boolean(s));
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function monthName(monthIndex: number): string {
  return MONTH_NAMES[monthIndex - 1] ?? "";
}
