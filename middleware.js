import arcjet from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Clerk-protected routes
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// Arcjet instance (only used for API)
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    { type: "shield", mode: "LIVE" },
    {
      type: "detectBot",
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
    },
  ],
});

// Clerk middleware
const clerk = clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  return NextResponse.next();
});

// Main middleware
export default async function middleware(req) {
  const url = new URL(req.url);

  // Run Arcjet only for API routes
  if (url.pathname.startsWith("/api")) {
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // Run Clerk for everything
  return clerk(req);
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API
    "/(api|trpc)(.*)",
  ],
};
