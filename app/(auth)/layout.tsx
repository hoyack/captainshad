import Link from "next/link";
import { Fish } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-bay-100 bg-white">
        <div className="container-app py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-bay-800">
            <Fish className="h-5 w-5" />
            <span>Captain Shad</span>
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
