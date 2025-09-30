import { NextResponse } from "next/server";

// Import only needed ArcJet features
import createMiddleware from "@arcjet/next/createMiddleware";
import detectBot from "@arcjet/next/detectBot";
import shield from "@arcjet/next/shield";

// Import only needed Clerk features
import { clerkMiddleware } from "@clerk/nextjs/server";
import createRouteMatcher from "@clerk/nextjs/server/createRouteMatcher";

// Match protected routes
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// Lazy-load ArcJet configuration
const arcjetMiddleware = async () => {
  const { default: arcjet } = await import("@arcjet/next");
  return arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
      shield({ mode: "LIVE" }),
      detectBot({
        mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
        allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
      }),
    ],
  });
};

// Clerk middleware
const clerk = clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }
  return NextResponse.next();
});

// Compose and export middleware
export default createMiddleware(async () => await arcjetMiddleware(), clerk);

export const config = {
  matcher: [
    // Run on all non-static, non‐internal routes
    "/((?!_next|.*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API and tRPC
    "/(api|trpc)(.*)",
  ],
};
