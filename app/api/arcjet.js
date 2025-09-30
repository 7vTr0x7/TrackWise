// File: pages/api/arcjet.js

import { NextResponse } from "next/server";

export default async function handler(req, res) {
  // Dynamically import ArcJet for shielding
  const { default: arcjet, detectBot, shield } = await import("@arcjet/next");
  const plugin = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
      shield({ mode: "LIVE" }),
      detectBot({
        mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
        allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
      }),
    ],
  });

  // Delegate the request to ArcJet
  const edgeResponse = await plugin(req);
  // Convert Edge Response to Next.js response
  edgeResponse.headers.forEach((value, key) => res.setHeader(key, value));
  res.status(edgeResponse.status);
  res.send(await edgeResponse.text());
}
