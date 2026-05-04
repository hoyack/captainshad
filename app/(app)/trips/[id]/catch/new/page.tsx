import { AppShell } from "@/components/AppShell";
import { NewCatchForm } from "./form";

export default async function NewCatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AppShell title="Quick catch" back={{ href: `/trips/${id}` }}>
      <NewCatchForm tripId={id} />
    </AppShell>
  );
}
