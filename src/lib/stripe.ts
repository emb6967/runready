import "server-only";
import Stripe from "stripe";
import { headers } from "next/headers";

let client: Stripe | null = null;

/** Stripe client. STRIPE_SECRET_KEY lives only in Vercel environment variables. */
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
  client ??= new Stripe(key);
  return client;
}

/** Monthly price in cents. $9.99 by default; set STRIPE_PRICE_CENTS=100 for a $1 test. */
export function priceCents() {
  const n = Number(process.env.STRIPE_PRICE_CENTS ?? 999);
  return Number.isInteger(n) && n >= 50 ? n : 999;
}

export function formatPrice(cents = priceCents()) {
  return `$${(cents / 100).toFixed(2)}`;
}

/** The site's own URL (works on localhost, preview and production deployments). */
export async function siteUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Period end lives on the subscription item in current Stripe API versions. */
export function periodEnd(sub: Stripe.Subscription): Date | null {
  const ts = sub.items?.data?.[0]?.current_period_end;
  return typeof ts === "number" ? new Date(ts * 1000) : null;
}
