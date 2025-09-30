import arcjet from "@arcjet/next";
import { NextResponse } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    { type: "shield", mode: "LIVE" },
    {
      type: "detectBot",
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "GO_HTTP"],
    },
  ],
});

export async function arcjetProtect(req) {
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  return null;
}
