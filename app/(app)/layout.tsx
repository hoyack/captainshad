import { requireUser } from "@/lib/auth";

// Auth gate for the entire authenticated app surface.
// The redirect-when-unauth + onboarding-required logic lives in middleware.ts;
// this layout is a defense-in-depth check.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <>{children}</>;
}
