"use client";

import { createSupabaseBrowserClient } from "./supabase/client";

const MAX_DIM = 1024;
const QUALITY = 0.82;

async function downscale(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res, "image/jpeg", QUALITY),
  );
  if (!blob) throw new Error("Failed to encode JPEG");
  return blob;
}

// Uploads to Supabase Storage in the catches bucket at {user_id}/{trip_id}/{catch_id}.jpg
// Returns the storage path which is rendered later via signed URLs.
export async function uploadCatchPhoto(args: {
  file: File;
  tripId: string;
  catchId: string;
}): Promise<string> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const blob = await downscale(args.file);
  const path = `${user.id}/${args.tripId}/${args.catchId}.jpg`;
  const { error } = await supabase.storage
    .from("catches")
    .upload(path, blob, { contentType: "image/jpeg", upsert: true });
  if (error) throw error;
  return path;
}

export async function getCatchPhotoSignedUrl(path: string): Promise<string | null> {
  const supabase = createSupabaseBrowserClient();
  const { data } = await supabase.storage.from("catches").createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}
