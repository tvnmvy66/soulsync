import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  throw new Error(
    "CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY must both be set (see .env.example)."
  );
}

export const clerkAuth = clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
});