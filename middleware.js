import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only import Arcjet dynamically to save bundle size
let aj;
async function getArcjet() {
  if (!aj) {
    const arcjetModule = await import("@arcjet/next");
    aj = arcjetModule.default({
      key: process.env.ARCJET_KEY,
      rules: [
        arcjetModule.shield({ mode: "DRY_RUN" }), // DRY_RUN reduces size
        arcjetModule.detectBot({
          mode: "DRY_RUN",
          allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
        }),
      ],
    });
  }
  return aj;
}

// Protected routes for Clerk
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// Clerk middleware
const clerk = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }
  return NextResponse.next();
});

// Combined middleware
export default async function middleware(req) {
  const arcjetMiddleware = await getArcjet();
  const arcjetResponse = await arcjetMiddleware(req);
  if (arcjetResponse) return arcjetResponse;

  return clerk(req);
}

// Run on all routes except static assets, but always on APIs
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
