"use client";

import { useState, useTransition } from "react";
import { Copy, Check, RotateCcw, Trash2, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  publishShareAction,
  revokeShareAction,
  rotateShareAction,
} from "./actions";
import type { RecapShare } from "@/lib/db/shares";
import { formatDate, formatTime } from "@/lib/utils";

export function RecapClient({
  tripId,
  tripTitle,
  origin,
  initialShare,
}: {
  tripId: string;
  tripTitle: string;
  origin: string;
  initialShare: RecapShare | null;
}) {
  const [share, setShare] = useState<RecapShare | null>(initialShare);
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const url = share ? `${origin}/r/${share.token}` : "";

  const publish = () =>
    start(async () => {
      try {
        const s = await publishShareAction(tripId);
        setShare(s);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      }
    });

  const rotate = () =>
    start(async () => {
      if (!confirm("Rotate the link? The current URL will stop working.")) return;
      const s = await rotateShareAction(tripId);
      setShare(s);
    });

  const revoke = () =>
    start(async () => {
      if (!confirm("Revoke the share link? This permanently removes access.")) return;
      await revokeShareAction(tripId);
      setShare(null);
    });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Copy failed — select the URL manually.");
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Branded recap for {tripTitle}</CardTitle>
          <CardDescription>
            One link with your branding, photos, lesson, and rebook CTA. Send to
            your client via text or email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!share ? (
            <Button onClick={publish} size="lg" className="w-full" disabled={pending}>
              {pending ? "Publishing…" : "Publish recap"}
            </Button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5 uppercase tracking-wide">
                  Share URL
                </label>
                <div className="flex gap-2">
                  <Input value={url} readOnly className="text-xs" />
                  <Button onClick={copy} variant="outline" size="md" className="shrink-0">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-neutral-700">
                <Eye className="h-4 w-4 text-bay-600" />
                <div>
                  <span className="font-semibold">{share.view_count}</span> view{share.view_count === 1 ? "" : "s"}
                  {share.last_viewed_at && (
                    <span className="text-xs text-neutral-500 ml-2">
                      last {formatDate(share.last_viewed_at)} {formatTime(share.last_viewed_at)}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4" /> Preview
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={rotate}
                  disabled={pending}
                >
                  <RotateCcw className="h-4 w-4" /> Rotate
                </Button>
                <Button
                  variant="danger"
                  onClick={revoke}
                  disabled={pending}
                >
                  <Trash2 className="h-4 w-4" /> Revoke
                </Button>
              </div>
            </div>
          )}
          {error && (
            <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-900">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-3 text-xs text-neutral-600">
          The recap respects your privacy defaults — exact spots and route stay private even when this URL is shared. Edit defaults in Settings → Profile.
        </CardContent>
      </Card>
    </>
  );
}
