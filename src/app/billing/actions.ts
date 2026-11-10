"use server";

import { redirect } from "next/navigation";
import { getAccess } from "@/lib/access";
import { requireUser } from "@/lib/session";
import { getStripe, priceCents, siteUrl } from "@/lib/stripe";

/** Starts a Stripe Checkout session for the RunReady monthly subscription. */
export async function startCheckoutAction() {
  const user = await requireUser();
  const access = await getAccess(user);
  if (access.isPaid) redirect("/dashboard");

  const base = await siteUrl();
  let checkoutUrl: string | null = null;
  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      client_reference_id: user.id,
      customer_email: user.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: priceCents(),
            recurring: { interval: "month" },
            product_data: {
              name: "RunReady Pro",
              description: "Unlimited AI ski progression plans",
            },
          },
        },
      ],
      subscription_data: { metadata: { user_id: user.id } },
      metadata: { user_id: user.id },
      success_url: `${base}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/dashboard?checkout=cancelled`,
    });
    checkoutUrl = session.url;
  } catch (err) {
    console.error("Stripe checkout failed:", err instanceof Error ? err.message : err);
  }

  if (!checkoutUrl) redirect("/dashboard?checkout=error");
  redirect(checkoutUrl);
}
