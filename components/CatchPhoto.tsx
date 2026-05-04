"use client";

import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { getCatchPhotoSignedUrl } from "@/lib/photo";

// Renders a Supabase Storage path as a thumbnail by signing the URL on demand.
export function CatchPhoto({ path, className = "" }: { path: string; className?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getCatchPhotoSignedUrl(path)
      .then((u) => {
        if (alive) setUrl(u);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [path]);

  if (loading) {
    return (
      <div className={`h-16 w-16 rounded-lg bg-neutral-100 shrink-0 animate-pulse ${className}`} />
    );
  }
  if (!url) {
    return (
      <div className={`h-16 w-16 rounded-lg bg-bay-50 flex items-center justify-center text-bay-300 shrink-0 ${className}`}>
        <ImageIcon className="h-6 w-6" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      className={`h-16 w-16 rounded-lg object-cover bg-neutral-100 shrink-0 ${className}`}
    />
  );
}
