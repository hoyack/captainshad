"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Chip({
  active,
  onToggle,
  children,
  className,
}: {
  active: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors active:scale-[0.97]",
        active
          ? "bg-bay-600 text-white border-bay-600"
          : "bg-white text-neutral-700 border-bay-200 hover:bg-bay-50",
        className,
      )}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export function ChipGroup({
  options,
  value,
  onChange,
  multi = false,
}: {
  options: { value: string; label: string }[];
  value: string | string[];
  onChange: (next: string | string[]) => void;
  multi?: boolean;
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <Chip
            key={opt.value}
            active={active}
            onToggle={() => {
              if (multi) {
                const next = active
                  ? selected.filter((v) => v !== opt.value)
                  : [...selected, opt.value];
                onChange(next);
              } else {
                onChange(active ? "" : opt.value);
              }
            }}
          >
            {opt.label}
          </Chip>
        );
      })}
    </div>
  );
}
