import arcjetMiddleware from "./arcjet";
import clerkMiddleware from "./clerk";
import { createMiddleware } from "@arcjet/next";

export default createMiddleware(arcjetMiddleware, clerkMiddleware);
