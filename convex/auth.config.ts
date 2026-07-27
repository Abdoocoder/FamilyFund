import { AuthConfig } from "convex/server";

// Clerk authentication configuration
// Uses CLERK_JWT_ISSUER_DOMAIN from environment variables
// See: https://docs.convex.dev/auth/clerk
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
