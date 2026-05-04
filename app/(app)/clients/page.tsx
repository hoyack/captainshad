import Link from "next/link";
import { Plus, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listClients } from "@/lib/db/clients";

export default async function ClientsListPage() {
  const clients = await listClients();
  return (
    <AppShell title="Clients">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-neutral-600">{clients.length} total</p>
        <Link href="/clients/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> New client
          </Button>
        </Link>
      </div>
      {clients.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No clients yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 mb-3">
              Add clients to link them to trips, see their history, and remember who fished what.
            </p>
            <Link href="/clients/new">
              <Button>Add your first client</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {clients.map((c) => (
            <Link key={c.id} href={`/clients/${c.id}`}>
              <Card className="hover:border-bay-300">
                <CardContent className="py-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-bay-50 flex items-center justify-center text-bay-700">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="text-xs text-neutral-500 truncate">
                      {[c.email, c.phone].filter(Boolean).join(" · ") || "No contact info"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
