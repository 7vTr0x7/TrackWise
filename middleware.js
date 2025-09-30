// File: middleware.js (or middleware.ts)

import { NextResponse } from "next/server";
import { createRouteMatcher } from "@clerk/nextjs/server";

// Clerk route matcher
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// Dynamically load and run ArcJet
async function runArcJet(req) {
  const { default: arcjet, detectBot, shield } = await import("@arcjet/next");
  const plugin = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
      shield({ mode: "LIVE" }),
      detectBot({
        mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
        allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
      }),
    ],
  });
  return plugin(req);
}

// Dynamically load and run Clerk
async function runClerk(req, auth) {
  const { clerkMiddleware } = await import("@clerk/nextjs/server");
  return clerkMiddleware(async (authenticate, request) => {
    const { userId, redirectToSignIn } = await authenticate();
    if (!userId && isProtectedRoute(request)) {
      return redirectToSignIn();
    }
    return NextResponse.next();
  })(auth, req);
}

export default async function middleware(req, ev) {
  // Run Clerk first (so protected routes redirect early)
  const clerkResponse = await runClerk(req, ev);
  if (clerkResponse) return clerkResponse;

  // Otherwise run ArcJet
  return await runArcJet(req);
}

export const config = {
  matcher: [
    // Clerk-protected and ArcJet-monitored paths
    "/((?!_next|.*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
