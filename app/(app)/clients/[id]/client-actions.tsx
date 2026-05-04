"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteClientAction } from "../actions";

export function ClientDeleteButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => {
        if (!confirm("Delete this client? Their trips stay but lose the link.")) return;
        start(() => deleteClientAction(id));
      }}
      disabled={pending}
      className="text-bay-100 hover:text-white disabled:opacity-50"
      aria-label="Delete client"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
