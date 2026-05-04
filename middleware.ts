import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase session cookie on every request and applies
// auth-gating redirects for the authenticated app shell.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Always refresh — required by @supabase/ssr.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/r/") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/api/stripe/webhook");
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/trips") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/playbook") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/onboarding");

  // Authed users hitting login/signup → bounce to dashboard
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthed users hitting app routes → bounce to login
  if (!user && isAppRoute) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Authed users that haven't onboarded yet → push to /onboarding
  // (skip if already there or hitting auth/callback)
  if (user && isAppRoute && pathname !== "/onboarding") {
    const { data: profile } = await supabase
      .from("user_profile")
      .select("onboarded")
      .eq("id", user.id)
      .single();
    if (profile && !profile.onboarded) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  void isPublic; // silence unused-but-documented marker
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.json|.*\\.(?:png|jpg|jpeg|gif|webp|svg)$).*)",
  ],
};
