import { AppShell } from "@/components/AppShell";
import { getDebriefByTrip } from "@/lib/db/debriefs";
import { DebriefForm } from "./form";

export default async function DebriefPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const existing = await getDebriefByTrip(id);
  return (
    <AppShell title="Debrief" back={{ href: `/trips/${id}` }}>
      <DebriefForm tripId={id} initial={existing ?? undefined} />
    </AppShell>
  );
}
