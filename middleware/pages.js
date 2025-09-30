import { arcjet, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Protected routes
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// Slimmed Arcjet middleware
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "DRY_RUN" }), // lighter than LIVE
    detectBot({
      mode: "DRY_RUN", // only logs
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
  ],
});

// Clerk middleware
const clerk = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }
  return NextResponse.next();
});

// Chain Arcjet + Clerk
import { createMiddleware } from "@arcjet/next";
export default createMiddleware(aj, clerk);

// Only apply to protected pages
export const config = {
  matcher: ["/dashboard(.*)", "/account(.*)", "/transaction(.*)"],
};
