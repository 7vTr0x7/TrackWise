import { NextResponse } from "next/server";
import { createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

export async function middleware(req) {
  const url = req.nextUrl.pathname;

  // ARCJET: Only load when needed
  if (
    url.startsWith("/api") ||
    url.startsWith("/trpc") ||
    (!url.includes(".") &&
      !url.startsWith("/dashboard") &&
      !url.startsWith("/account") &&
      !url.startsWith("/transaction"))
  ) {
    const arcjetModule = await import("@arcjet/next");
    const arcjet = arcjetModule.default;
    const { detectBot, shield } = arcjetModule;

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

  // CLERK: Only load for protected routes
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
