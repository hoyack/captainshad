import Link from "next/link";
import { Fish } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({
  title,
  back,
  right,
  children,
}: {
  title?: string;
  back?: { href: string; label?: string };
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-10 bg-bay-700 text-white shadow-sm">
        <div className="container-app flex items-center justify-between py-3 gap-3">
          {back ? (
            <Link
              href={back.href}
              className="text-sm text-bay-100 hover:text-white"
            >
              ← {back.label ?? "Back"}
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Fish className="h-5 w-5" />
              <span>Captain Shad</span>
            </Link>
          )}
          {title && (
            <h1 className="text-sm font-medium truncate flex-1 text-center">
              {title}
            </h1>
          )}
          <div className="min-w-[3rem] flex justify-end">{right}</div>
        </div>
      </header>
      <main className="container-app py-4 pb-24 safe-bottom">{children}</main>
    </div>
  );
}
