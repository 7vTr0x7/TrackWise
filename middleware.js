import { NextResponse } from "next/server";
import { createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

export async function middleware(req) {
  const url = req.nextUrl.pathname;

  // Run Arcjet only for API and general routes
  if (url.startsWith("/api") || url.startsWith("/trpc") || !url.includes(".")) {
    const arcjet = (await import("@arcjet/next")).default;
    const { detectBot, shield } = await import("@arcjet/next/rules");

    const aj = arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        shield({ mode: "LIVE" }),
        detectBot({
          mode: "LIVE",
          allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
        }),
      ],
    });

    const arcjetResponse = await aj.middleware(req);
    if (arcjetResponse) return arcjetResponse;
  }

  // Run Clerk only for protected routes
  if (isProtectedRoute(req)) {
    const { clerkMiddleware } = await import("@clerk/nextjs/server");
    const clerk = clerkMiddleware(async (auth, req) => {
      const { userId, redirectToSignIn } = await auth();
      if (!userId) return redirectToSignIn();
      return NextResponse.next();
    });

    return clerk.middleware(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/dashboard(.*)",
    "/account(.*)",
    "/transaction(.*)",
  ],
};
