import arcjet from "@arcjet/next";

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

export default async function handler(req, res) {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    return res.status(403).send("Forbidden");
  }

  res.status(200).send("OK");
}
