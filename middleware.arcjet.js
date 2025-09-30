import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }), // Protection for content and security
    detectBot({
      mode: "LIVE", // Can switch to DRY_RUN for logging only
      allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"], // Whitelisted bots
    }),
  ],
});

export default createMiddleware(aj);

export const config = {
  matcher: [
    // Run Arcjet on all pages except static assets and Next internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)", // Run on API routes
  ],
};
