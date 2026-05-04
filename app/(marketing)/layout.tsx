import Link from "next/link";
import { Fish } from "lucide-react";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-bay-100">
        <div className="container-app flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-bay-800">
            <Fish className="h-5 w-5" />
            <span>Captain Shad</span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/pricing" className="text-bay-700 hover:text-bay-900 px-2 py-1">
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-bay-700 hover:text-bay-900 px-2 py-1"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bg-bay-600 hover:bg-bay-700 text-white rounded-lg px-3 py-1.5 font-medium"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
