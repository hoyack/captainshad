import Link from "next/link";
import { Plus, Users, Sparkles, Calendar } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listTrips } from "@/lib/db/trips";
import { listPatterns } from "@/lib/db/patterns";
import { getMyProfile } from "@/lib/db/profiles";
import { getTripQuota } from "@/lib/billing";
import {
  getCurrentMonthIndex,
  getMonthCalendar,
  monthName,
  topTargetsForMonth,
} from "@/lib/fish-dataset";
import { formatDate } from "@/lib/utils";
import { SPECIES_OPTIONS, WATER_BODIES, lookupLabel } from "@/lib/local-data";

export default async function DashboardPage() {
  const [profile, trips, patterns, quota] = await Promise.all([
    getMyProfile(),
    listTrips({ limit: 5 }),
    listPatterns(),
    getTripQuota(),
  ]);

  const month = getCurrentMonthIndex();
  const monthCal = getMonthCalendar(month);
  const topTargets = topTargetsForMonth(month);

  const today = new Date().toISOString().slice(0, 10);
  const todays = trips.filter((t) => t.trip_date === today);

  const thisMonthIso = new Date().toISOString().slice(0, 7);
  const thisMonthCount = trips.filter((t) => t.trip_date.startsWith(thisMonthIso)).length;
  const patternsThisMonth = patterns.filter((p) =>
    p.created_at.startsWith(thisMonthIso),
  ).length;

  const upgradeNeeded = !quota.unlimited && quota.used >= quota.cap;
  const upgradeWarn = !quota.unlimited && quota.used >= quota.cap - 1;

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-xs text-bay-700 uppercase tracking-wide">Welcome back</p>
        <h1 className="text-xl font-bold text-bay-900">
          {profile?.guide_name || "Captain"}
        </h1>
        {profile?.company_name && (
          <p className="text-sm text-neutral-600">{profile.company_name}</p>
        )}
      </div>

      {(upgradeWarn || upgradeNeeded) && (
        <Card className="mb-4 border-amber-300 bg-amber-50">
          <CardContent className="py-3">
            <div className="text-sm font-semibold text-amber-900">
              {upgradeNeeded
                ? "You've used all 3 free trips"
                : `You've used ${quota.used} of ${quota.cap} free trips`}
            </div>
            <p className="text-xs text-amber-900 mt-1">
              Upgrade to Pro for unlimited trips, client management, and view stats on shared recaps.
            </p>
            <Link href="/pricing">
              <Button size="sm" className="mt-2">
                Upgrade — $29/mo
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Link href="/trips/new" className="block mb-6">
        <Button size="lg" className="w-full">
          <Plus className="h-4 w-4" /> Log new trip
        </Button>
      </Link>

      <section className="mb-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
          Today
        </h2>
        {todays.length === 0 ? (
          <Card>
            <CardContent className="py-4 text-sm text-neutral-500">
              No trips logged today.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {todays.map((t) => (
              <Link key={t.id} href={`/trips/${t.id}`}>
                <Card className="hover:border-bay-300">
                  <CardHeader>
                    <CardTitle className="text-sm">{t.title}</CardTitle>
                    <CardDescription>
                      {t.client?.name ? `Client: ${t.client.name}` : "Walk-on / no client linked"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
          Recent trips
        </h2>
        {trips.length === 0 ? (
          <Card>
            <CardContent className="py-4 text-sm text-neutral-500">
              No trips yet. Log your first to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {trips.slice(0, 5).map((t) => (
              <Link key={t.id} href={`/trips/${t.id}`}>
                <Card className="hover:border-bay-300">
                  <CardContent className="py-3 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">{t.title}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {formatDate(t.trip_date)}
                        {t.water_body ? ` · ${lookupLabel(WATER_BODIES, t.water_body)}` : ""}
                        {t.client?.name ? ` · ${t.client.name}` : ""}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {t.target_species.slice(0, 2).map((s) => (
                        <Badge key={s} variant="default">
                          {lookupLabel(SPECIES_OPTIONS, s)}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
          This month
        </h2>
        <Card>
          <CardContent className="py-4 grid grid-cols-3 gap-2 text-center">
            <Stat icon={<Calendar className="h-4 w-4" />} label="Trips" value={thisMonthCount} />
            <Stat icon={<Sparkles className="h-4 w-4" />} label="Patterns" value={patternsThisMonth} />
            <Stat
              icon={<Users className="h-4 w-4" />}
              label="Quota"
              value={quota.unlimited ? "∞" : `${quota.used}/${quota.cap}`}
            />
          </CardContent>
        </Card>
      </section>

      {monthCal && (
        <section>
          <Card className="border-bay-200 bg-gradient-to-br from-bay-50 to-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-bay-700" />
                <CardTitle className="text-sm">In season — {monthName(month)}</CardTitle>
              </div>
              <CardDescription className="mt-1">{monthCal.pattern}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1.5">
                Top targets
              </div>
              <div className="flex flex-wrap gap-1.5">
                {topTargets.map((s) => (
                  <Badge key={s.id} variant="success">
                    {s.common_name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </AppShell>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div>
      <div className="flex items-center justify-center gap-1 text-bay-600 mb-0.5">
        {icon}
      </div>
      <div className="text-lg font-semibold text-bay-900">{value}</div>
      <div className="text-[11px] text-neutral-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}
