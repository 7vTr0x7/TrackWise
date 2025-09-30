// File: middleware.js

import { NextResponse } from "next/server";
import { createRouteMatcher } from "@clerk/nextjs/server";

// Clerk route matcher
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// Dynamically load and run Clerk
async function runClerk(req, ev) {
  const { clerkMiddleware } = await import("@clerk/nextjs/server");
  const handler = clerkMiddleware(async (authenticate, request) => {
    const { userId, redirectToSignIn } = await authenticate();
    if (!userId && isProtectedRoute(request)) {
      return redirectToSignIn();
    }
    return NextResponse.next();
  });
  return handler(ev, req);
}

// Dynamically load minimal ArcJet pieces via subpath imports
async function runArcJet(req) {
  const arcjet = (await import("@arcjet/next/dist/edge")).default;
  const { detectBot } = await import("@arcjet/next/dist/middleware/detectBot");
  const { shield } = await import("@arcjet/next/dist/middleware/shield");
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

export default async function middleware(req, ev) {
  // Run Clerk middleware first
  const clerkResponse = await runClerk(req, ev);
  if (clerkResponse) return clerkResponse;

  // Then run ArcJet bot-shielding
  return await runArcJet(req);
}

export const config = {
  matcher: [
    // Only apply to HTML pages and API/trpc routes, skip static assets
    "/((?!_next/static|_next/image|.*\\.(?:css|js|png|jpg|svg|woff2?)).*)",
    "/(api|trpc)(.*)",
  ],
};
