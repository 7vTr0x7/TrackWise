import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// API routes only, no Arcjet to reduce size
const clerk = clerkMiddleware(async (auth) => {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  return NextResponse.next();
});

export default clerk;

// Only apply to API routes
export const config = {
  matcher: ["/api/(.*)"],
};
