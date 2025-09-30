import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Only import Arcjet dynamically inside handler to reduce bundle size
let ajMiddleware;

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

async function getArcjetMiddleware() {
  if (!ajMiddleware) {
    const {
      default: arcjet,
      detectBot,
      shield,
      createMiddleware,
    } = await import("@arcjet/next");

    ajMiddleware = createMiddleware(
      arcjet({
        key: process.env.ARCJET_KEY,
        rules: [
          shield({ mode: "LIVE" }),
          detectBot({
            mode: "LIVE",
            allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
          }),
        ],
      })
    );
  }
  return ajMiddleware;
}

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
  const aj = await getArcjetMiddleware();
  const arcjetResponse = await aj(req);
  if (arcjetResponse) return arcjetResponse;

  return clerk(req);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
