import { NextResponse } from "next/server";

async function getArcjet() {
  const arcjetModule = await import("@arcjet/next");
  const { default: arcjet, detectBot, shield } = arcjetModule;
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
}

export default async function middleware(req) {
  const middlewareFn = await getArcjet();
  return middlewareFn(req);
}

export const config = {
  matcher: [
    // Run ArcJet on all non-static, non-internal pages
    "/((?!_next|.*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico)).*)",
  ],
};
