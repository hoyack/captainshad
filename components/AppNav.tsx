"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Fish, Users, BookOpen, Settings, LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/trips", label: "Trips", icon: Fish },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/playbook", label: "Playbook", icon: BookOpen },
  { href: "/settings/profile", label: "Settings", icon: Settings, prefix: "/settings" },
];

export function AppNav() {
  const pathname = usePathname();

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav className="sticky bottom-0 inset-x-0 z-10 bg-white border-t border-bay-100 safe-bottom">
      <div className="container-app grid grid-cols-5 gap-1 py-2">
        {items.map(({ href, label, icon: Icon, prefix }) => {
          const active = prefix
            ? pathname.startsWith(prefix)
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center text-[10px] gap-0.5 py-1 rounded-md",
                active ? "text-bay-700 font-semibold" : "text-neutral-500",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
      <button
        onClick={signOut}
        aria-label="Sign out"
        className="hidden"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </nav>
  );
}

export function SignOutButton() {
  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };
  return (
    <button
      onClick={signOut}
      className="text-sm text-bay-700 hover:text-bay-900 inline-flex items-center gap-1"
    >
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}
