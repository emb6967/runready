import "server-only";
import { ensureSchema, sql } from "./db";

/** Graders log in with this account; it always has full paid access. */
export const DEMO_EMAIL = "demo@demo.com";

/** Free accounts can generate this many plans before upgrading. */
export const FREE_PLAN_LIMIT = 1;

export type Access = {
  isPaid: boolean;
  isDemo: boolean;
  plansUsed: number;
  canGenerate: boolean;
};

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export async function getAccess(user: { id: string; email: string }): Promise<Access> {
  await ensureSchema();
  const db = sql();
  const [subs, counts] = await Promise.all([
    db`SELECT status FROM subscriptions WHERE user_id = ${user.id}`,
    db`SELECT count(*)::int AS n FROM progression_plans WHERE user_id = ${user.id}`,
  ]);

  const isDemo = user.email.toLowerCase() === DEMO_EMAIL;
  const isPaid = isDemo || ACTIVE_STATUSES.has(String(subs[0]?.status ?? ""));
  const plansUsed = Number(counts[0]?.n ?? 0);

  return { isPaid, isDemo, plansUsed, canGenerate: isPaid || plansUsed < FREE_PLAN_LIMIT };
}

export async function saveSubscription(row: {
  userId: string;
  status: string;
  customerId: string | null;
  subscriptionId: string | null;
  currentPeriodEnd: Date | null;
}) {
  await ensureSchema();
  await sql()`
    INSERT INTO subscriptions
      (user_id, status, stripe_customer_id, stripe_subscription_id, current_period_end, updated_at)
    VALUES
      (${row.userId}, ${row.status}, ${row.customerId}, ${row.subscriptionId}, ${row.currentPeriodEnd}, now())
    ON CONFLICT (user_id) DO UPDATE SET
      status = EXCLUDED.status,
      stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, subscriptions.stripe_customer_id),
      stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, subscriptions.stripe_subscription_id),
      current_period_end = EXCLUDED.current_period_end,
      updated_at = now()`;
}
