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

export default async function middleware(req, ev) {
  // Run Clerk middleware only
  const clerkResponse = await runClerk(req, ev);
  if (clerkResponse) return clerkResponse;

  // Continue to next step (ArcJet handled in API route)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply only to HTML pages and API/trpc routes (skip assets)
    "/((?!_next/static|_next/image|.*\\.(?:css|js|png|jpg|svg|woff2?)).*)",
    "/(api|trpc)(.*)",
  ],
};
