import { Calendar, ExternalLink, MapPin, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { PatternCardView } from "./PatternCardView";
import {
  SPECIES_OPTIONS,
  TIDE_STAGES,
  WATER_BODIES,
  WATER_CLARITY,
  lookupLabel,
} from "@/lib/local-data";
import { formatDate } from "@/lib/utils";

export interface RecapViewProps {
  trip: {
    id: string;
    title: string;
    trip_date: string;
    water_body: string;
    launch_location: string;
    target_species: string[];
    privacy_level: string;
  };
  guide: {
    guide_name: string;
    company_name: string;
    booking_url: string;
    logo_url: string;
    privacy_defaults: {
      hide_exact_locations: boolean;
      hide_route: boolean;
      allow_pattern_summary: boolean;
    };
  };
  catches: {
    id: string;
    species: string;
    photo_url: string | null;
  }[];
  conditions: {
    tide_stage: string;
    wind_direction: string;
    wind_speed_mph: number | null;
    water_clarity: string;
  } | null;
  pattern: React.ComponentProps<typeof PatternCardView>["pattern"] | null;
  // Resolved photo URLs (signed) keyed by catch id; provided by the caller because
  // signing differs depending on whether we're running server-side (admin client)
  // or rendering in a guide-only authed context.
  photoUrls: Record<string, string>;
}

export function RecapView({
  trip,
  guide,
  catches,
  conditions,
  pattern,
  photoUrls,
}: RecapViewProps) {
  const privacy = guide.privacy_defaults;
  const speciesCounts = new Map<string, number>();
  catches.forEach((c) =>
    speciesCounts.set(c.species, (speciesCounts.get(c.species) ?? 0) + 1),
  );
  const photos = catches.filter((c) => c.photo_url && photoUrls[c.id]);

  return (
    <div>
      <Card className="mb-4 border-bay-300 bg-gradient-to-br from-bay-50 to-white">
        <CardContent className="py-4 flex items-center gap-3">
          {guide.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={guide.logo_url}
              alt=""
              className="h-12 w-12 rounded-lg object-cover bg-white border border-bay-200"
            />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-bay-600 text-white flex items-center justify-center font-semibold">
              {guide.guide_name.charAt(0) || "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-bay-900">
              {guide.guide_name || "Your captain"}
            </div>
            {guide.company_name && (
              <div className="text-xs text-neutral-600">{guide.company_name}</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{trip.title}</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(trip.trip_date)}
            </span>
            {trip.water_body && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {lookupLabel(WATER_BODIES, trip.water_body)}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium text-neutral-700 mb-2">
            Species caught
          </div>
          {speciesCounts.size === 0 ? (
            <p className="text-sm text-neutral-500">No catches logged.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {Array.from(speciesCounts.entries()).map(([species, count]) => (
                <Badge key={species} variant="success">
                  {count} × {lookupLabel(SPECIES_OPTIONS, species)}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {photos.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((c) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={c.id}
                  src={photoUrls[c.id]}
                  alt=""
                  className="aspect-square w-full object-cover rounded-md bg-neutral-100"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {conditions && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Day&apos;s conditions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div>
              <span className="text-neutral-500">Tide:</span>{" "}
              {lookupLabel(TIDE_STAGES, conditions.tide_stage)}
            </div>
            <div>
              <span className="text-neutral-500">Wind:</span>{" "}
              {conditions.wind_direction}
              {conditions.wind_speed_mph
                ? ` · ${conditions.wind_speed_mph} mph`
                : ""}
            </div>
            <div>
              <span className="text-neutral-500">Water:</span>{" "}
              {lookupLabel(WATER_CLARITY, conditions.water_clarity)}
            </div>
          </CardContent>
        </Card>
      )}

      {!privacy.hide_exact_locations && trip.launch_location && (
        <Card className="mb-4">
          <CardContent className="py-3 text-sm">
            <span className="text-neutral-500">Launch:</span> {trip.launch_location}
          </CardContent>
        </Card>
      )}

      {privacy.allow_pattern_summary && pattern && (
        <section className="mb-4">
          <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
            What you learned
          </h3>
          <PatternCardView pattern={pattern} />
        </section>
      )}

      {guide.booking_url && (
        <Card className="mb-4 bg-bay-700 text-white border-bay-700">
          <CardHeader>
            <CardTitle className="text-base text-white">Book again</CardTitle>
            <CardDescription className="text-bay-100">
              Same water, more lessons.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <a href={guide.booking_url} target="_blank" rel="noopener noreferrer">
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-bay-50 hover:bg-bay-100 text-bay-800 px-3 h-10 text-sm font-medium">
                <ExternalLink className="h-4 w-4" /> Book
              </button>
            </a>
            <a href={guide.booking_url} target="_blank" rel="noopener noreferrer">
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-bay-50 hover:bg-bay-100 text-bay-800 px-3 h-10 text-sm font-medium">
                <Star className="h-4 w-4" /> Leave review
              </button>
            </a>
          </CardContent>
        </Card>
      )}

      <Card className="mb-4">
        <CardContent className="py-3 text-xs text-neutral-600">
          Always check{" "}
          <a
            href="https://tpwd.texas.gov/regulations/outdoor-annual/fishing"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            TPWD
          </a>{" "}
          for current regulations before keeping fish.
        </CardContent>
      </Card>
    </div>
  );
}
