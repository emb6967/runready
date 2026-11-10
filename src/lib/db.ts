import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;
let schemaReady: Promise<void> | null = null;

/** SQL client for the Neon database. DATABASE_URL comes from Vercel's Neon integration. */
export function sql() {
  if (client) return client;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Missing DATABASE_URL. It's added by the Vercel–Neon integration; " +
        "run `vercel env pull .env.local --environment=preview` for local development.",
    );
  }
  client = neon(url);
  return client;
}

/**
 * Creates RunReady's own tables the first time they're needed.
 * User accounts themselves live in Neon Auth's `neon_auth` schema.
 */
export function ensureSchema() {
  schemaReady ??= (async () => {
    const db = sql();
    await db`
      CREATE TABLE IF NOT EXISTS subscriptions (
        user_id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        current_period_end TIMESTAMPTZ,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    await db`
      CREATE TABLE IF NOT EXISTS progression_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        answers JSONB NOT NULL,
        plan JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    await db`
      CREATE INDEX IF NOT EXISTS progression_plans_user_idx
        ON progression_plans (user_id, created_at DESC)`;
  })().catch((err) => {
    schemaReady = null; // retry on the next request
    throw err;
  });
  return schemaReady;
}
