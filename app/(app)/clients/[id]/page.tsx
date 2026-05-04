import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Phone, Trash2, Calendar } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getClient } from "@/lib/db/clients";
import { listTrips } from "@/lib/db/trips";
import { formatDate } from "@/lib/utils";
import { ClientDeleteButton } from "./client-actions";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  const allTrips = await listTrips();
  const clientTrips = allTrips.filter((t) => t.client_id === id);

  return (
    <AppShell title={client.name} back={{ href: "/clients" }} right={<ClientDeleteButton id={id} />}>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{client.name}</CardTitle>
          <CardDescription className="space-y-1">
            {client.email && (
              <a
                href={`mailto:${client.email}`}
                className="flex items-center gap-1 text-bay-700 hover:text-bay-900"
              >
                <Mail className="h-3 w-3" /> {client.email}
              </a>
            )}
            {client.phone && (
              <a
                href={`tel:${client.phone}`}
                className="flex items-center gap-1 text-bay-700 hover:text-bay-900"
              >
                <Phone className="h-3 w-3" /> {client.phone}
              </a>
            )}
          </CardDescription>
        </CardHeader>
        {client.notes && (
          <CardContent className="text-sm text-neutral-700 whitespace-pre-line">
            {client.notes}
          </CardContent>
        )}
      </Card>

      <Link href={`/trips/new`} className="block mb-4">
        <Button className="w-full">Log a new trip with {client.name.split(" ")[0]}</Button>
      </Link>

      <section>
        <h3 className="text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide">
          Trip history ({clientTrips.length})
        </h3>
        {clientTrips.length === 0 ? (
          <Card>
            <CardContent className="py-3 text-sm text-neutral-500">
              No trips with this client yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {clientTrips.map((t) => (
              <Link key={t.id} href={`/trips/${t.id}`}>
                <Card className="hover:border-bay-300">
                  <CardContent className="py-3 flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-bay-600 shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{t.title}</div>
                      <div className="text-xs text-neutral-500">
                        {formatDate(t.trip_date)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
