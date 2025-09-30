// Root-level middleware.js for Vercel Edge
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API
    "/(api|trpc)(.*)",
  ],
};

export default async function middleware(req) {
  const url = new URL(req.url);

  // Simple redirect example for protected pages
  if (
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/account") ||
    url.pathname.startsWith("/transaction")
  ) {
    const res = await fetch(`${url.origin}/api/check-auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathname: url.pathname }),
    });

    const data = await res.json();
    if (!data.authorized) {
      return Response.redirect(`${url.origin}/sign-in`);
    }
  }

  // Lightweight Arcjet check via server API
  if (url.pathname.startsWith("/api")) {
    const res = await fetch(`${url.origin}/api/arcjet-protect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathname: url.pathname }),
    });

    if (res.status === 403) {
      return new Response("Forbidden", { status: 403 });
    }
  }

  return Response.next();
}
