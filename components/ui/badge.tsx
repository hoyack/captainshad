import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border",
  {
    variants: {
      variant: {
        default: "bg-bay-50 text-bay-800 border-bay-200",
        muted: "bg-neutral-100 text-neutral-700 border-neutral-200",
        warn: "bg-amber-50 text-amber-800 border-amber-200",
        success: "bg-emerald-50 text-emerald-800 border-emerald-200",
        sand: "bg-sand-100 text-sand-300 border-sand-200",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
