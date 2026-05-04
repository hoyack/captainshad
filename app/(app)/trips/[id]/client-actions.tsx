"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteTripAction } from "../actions";
import { deleteCatchAction } from "./catch-actions";

export function DeleteTripButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => {
        if (!confirm("Delete this trip and all its data?")) return;
        start(() => deleteTripAction(id));
      }}
      disabled={pending}
      className="text-bay-100 hover:text-white disabled:opacity-50"
      aria-label="Delete trip"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

export function DeleteCatchButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => {
        if (!confirm("Delete this catch?")) return;
        start(() => deleteCatchAction(id));
      }}
      disabled={pending}
      className="text-neutral-400 hover:text-red-600 disabled:opacity-50"
      aria-label="Delete catch"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
