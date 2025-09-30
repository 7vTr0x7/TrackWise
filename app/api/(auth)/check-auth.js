import { clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  // You can get the Clerk session here safely on the server
  const { userId } = req.body; // Or use cookies from request

  if (!userId) {
    return res.status(200).json({ authorized: false });
  }

  res.status(200).json({ authorized: true });
}
