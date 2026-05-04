import { AppShell } from "@/components/AppShell";
import { getConditionsByTrip } from "@/lib/db/conditions";
import { ConditionsForm } from "./form";

export default async function ConditionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const existing = await getConditionsByTrip(id);
  return (
    <AppShell title="Conditions" back={{ href: `/trips/${id}` }}>
      <ConditionsForm tripId={id} initial={existing ?? undefined} />
    </AppShell>
  );
}
