import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Clerk-only middleware for API routes (lighter)
const clerk = clerkMiddleware(async (auth) => {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  return NextResponse.next();
});

export default clerk;

export const config = {
  matcher: ["/api/(.*)"], // only API routes
};
