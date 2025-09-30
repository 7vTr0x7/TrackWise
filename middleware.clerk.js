import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Apply Clerk auth to all app pages and API/trpc routes
    "/((?!_next|.*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico)).*)",
    "/(api|trpc)(.*)",
  ],
};
