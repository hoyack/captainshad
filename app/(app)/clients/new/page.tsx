import { AppShell } from "@/components/AppShell";
import { NewClientForm } from "./form";

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{ return?: string }>;
}) {
  const sp = await searchParams;
  return (
    <AppShell title="New client" back={{ href: sp.return ?? "/clients" }}>
      <NewClientForm returnTo={sp.return} />
    </AppShell>
  );
}
