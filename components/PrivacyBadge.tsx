import { Lock, Eye, Globe } from "lucide-react";
import type { PrivacyLevel } from "@/lib/schemas";
import { Badge } from "./ui/badge";

export function PrivacyBadge({ level }: { level: PrivacyLevel }) {
  if (level === "private") {
    return (
      <Badge variant="muted" className="gap-1">
        <Lock className="h-3 w-3" /> Private
      </Badge>
    );
  }
  if (level === "pattern_only") {
    return (
      <Badge variant="default" className="gap-1">
        <Eye className="h-3 w-3" /> Pattern only
      </Badge>
    );
  }
  return (
    <Badge variant="success" className="gap-1">
      <Globe className="h-3 w-3" /> Public-safe
    </Badge>
  );
}
