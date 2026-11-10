import type { Metadata } from "next";
import Link from "next/link";
import type Stripe from "stripe";
import { saveSubscription } from "@/lib/access";
import { requireUser } from "@/lib/session";
import { getStripe, periodEnd } from "@/lib/stripe";

export const metadata: Metadata = { title: "Payment complete | RunReady" };
export const dynamic = "force-dynamic";

/** Stripe sends the customer here after paying. We confirm the payment with Stripe directly. */
export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const user = await requireUser();
  const { session_id } = await searchParams;

  let confirmed = false;
  if (session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id, {
        expand: ["subscription"],
      });
      const sub = session.subscription as Stripe.Subscription | null;
      // Only trust a completed session that belongs to the signed-in user.
      if (session.client_reference_id === user.id && session.status === "complete" && sub) {
        await saveSubscription({
          userId: user.id,
          status: sub.status,
          customerId:
            typeof session.customer === "string" ? session.customer : (session.customer?.id ?? null),
          subscriptionId: sub.id,
          currentPeriodEnd: periodEnd(sub),
        });
        confirmed = ["active", "trialing"].includes(sub.status);
      }
    } catch (err) {
      console.error("Could not confirm checkout:", err instanceof Error ? err.message : err);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ice-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-navy-900">
          {confirmed ? "You're a RunReady Pro! 🎿" : "We couldn't confirm your payment"}
        </h1>
        <p className="mt-3 text-slate-600">
          {confirmed
            ? "Your subscription is active. You can now create unlimited AI progression plans."
            : "If you completed checkout, give it a moment and refresh your dashboard. You won't be charged twice."}
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-full bg-navy-900 px-6 py-3 font-semibold text-white hover:bg-navy-800"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
