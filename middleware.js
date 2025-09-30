import { clerk } from "./middleware/clerk";
import { arcjetProtect } from "./middleware/arcjet";

export default async function middleware(req) {
  const url = new URL(req.url);

  // Run Arcjet only for API routes
  if (url.pathname.startsWith("/api")) {
    const denied = await arcjetProtect(req);
    if (denied) return denied;
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
