import "server-only";
import { createNeonAuth, type NeonAuth } from "@neondatabase/auth/next/server";

let instance: NeonAuth | null = null;

/**
 * Returns the shared Neon Auth server instance.
 *
 * Created lazily so `next build` doesn't need the secrets, and so a missing
 * variable produces a clear error instead of a cryptic one.
 * Values come from environment variables only (Vercel project settings in
 * production, `.env.local` locally) and are never hard-coded or logged.
 */
export function getAuth(): NeonAuth {
  if (instance) return instance;

  // The Vercel–Neon integration provides the Auth URL as VITE_NEON_AUTH_URL;
  // NEON_AUTH_BASE_URL is the name Neon's Next.js docs use. Accept either.
  // (VITE_ variables are not exposed to the browser in Next.js.)
  const baseUrl = process.env.NEON_AUTH_BASE_URL || process.env.VITE_NEON_AUTH_URL;
  const secret = process.env.NEON_AUTH_COOKIE_SECRET;

  const missing = [
    !baseUrl && "NEON_AUTH_BASE_URL (or VITE_NEON_AUTH_URL)",
    !secret && "NEON_AUTH_COOKIE_SECRET",
  ].filter(Boolean);
  if (missing.length > 0) {
    throw new Error(
      `Missing environment variable(s): ${missing.join(", ")}. ` +
        "Add them in Vercel → Project → Settings → Environment Variables, " +
        "then run `vercel env pull .env.local` for local development.",
    );
  }

  instance = createNeonAuth({
    baseUrl: baseUrl!,
    cookies: { secret: secret! },
  });
  return instance;
}
