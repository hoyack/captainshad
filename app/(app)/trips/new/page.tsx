import { AppShell } from "@/components/AppShell";
import { listClients } from "@/lib/db/clients";
import { getTripQuota } from "@/lib/billing";
import { NewTripForm } from "./form";

export default async function NewTripPage() {
  const [clients, quota] = await Promise.all([listClients(), getTripQuota()]);
  return (
    <AppShell title="New trip" back={{ href: "/trips" }}>
      <NewTripForm
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
        quota={quota}
      />
    </AppShell>
  );
}
