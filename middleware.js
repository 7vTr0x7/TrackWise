// middleware.js
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const { userId, redirectToSignIn } = auth();
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }
  return;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:css|js|png|jpg|svg|woff2?)).*)",
    "/(api|trpc)(.*)",
  ],
};
