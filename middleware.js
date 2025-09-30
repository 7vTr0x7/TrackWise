import arcjetMiddleware from "./middleware/arcjet";
import clerkMiddleware from "./middleware/clerk";
import { createMiddleware } from "@arcjet/next";

export default createMiddleware(arcjetMiddleware, clerkMiddleware);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
