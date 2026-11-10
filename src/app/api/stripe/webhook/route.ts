import type Stripe from "stripe";
import { saveSubscription } from "@/lib/access";
import { getStripe, periodEnd } from "@/lib/stripe";

/**
 * Optional: keeps subscription status in sync (renewals, cancellations, failed payments).
 * Enabled when STRIPE_WEBHOOK_SECRET is set; Stripe signs every event so it can't be faked.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook not configured", { status: 501 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = event.data.object;
    const userId = sub.metadata?.user_id;
    if (userId) {
      await saveSubscription({
        userId,
        status: event.type === "customer.subscription.deleted" ? "canceled" : sub.status,
        customerId: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
        subscriptionId: sub.id,
        currentPeriodEnd: periodEnd(sub),
      });
    }
  }

  return new Response("ok");
}
