import type { Metadata } from "next";
import Link from "next/link";
import { FREE_PLAN_LIMIT, getAccess } from "@/lib/access";
import { ensureSchema, sql } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatPrice } from "@/lib/stripe";
import { AppHeader } from "../app-header";
import { UpgradeButton } from "../billing/upgrade-button";

export const metadata: Metadata = { title: "Dashboard | RunReady" };

// Reads the signed-in user's session cookie on every request.
export const dynamic = "force-dynamic";

const BANNERS: Record<string, { tone: string; text: string }> = {
  cancelled: { tone: "bg-ice-100 text-navy-800", text: "Checkout cancelled. You haven't been charged." },
  error: { tone: "bg-red-50 text-red-700", text: "We couldn't start checkout. Please try again in a moment." },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const user = await requireUser();
  const { checkout } = await searchParams;
  await ensureSchema();
  const [access, plans] = await Promise.all([
    getAccess(user),
    sql()`
      SELECT id, plan->>'headline' AS headline, answers->>'goal' AS goal, created_at
      FROM progression_plans WHERE user_id = ${user.id}
      ORDER BY created_at DESC LIMIT 20`,
  ]);

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const banner = checkout ? BANNERS[checkout] : undefined;

  return (
    <div className="min-h-screen bg-ice-50">
      <AppHeader isPaid={access.isPaid} />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {banner && <p className={`mb-6 rounded-lg px-4 py-3 text-sm ${banner.tone}`}>{banner.text}</p>}

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Welcome, {user.name}!</h1>
            <p className="mt-2 text-slate-600">Ready to plan your next ski day?</p>
          </div>
          {access.canGenerate && (
            <Link
              href="/plan/new"
              className="rounded-full bg-navy-900 px-6 py-3 font-semibold text-white hover:bg-navy-800"
            >
              + New progression plan
            </Link>
          )}
        </div>

        {/* Membership */}
        <section
          className={`mt-8 rounded-2xl p-6 ${access.isPaid ? "bg-navy-900 text-white" : "border border-ice-200 bg-white"}`}
        >
          {access.isPaid ? (
            <>
              <p className="text-xs font-semibold tracking-widest text-ice-300 uppercase">RunReady Pro</p>
              <h2 className="mt-1 text-xl font-semibold">You have unlimited AI progression plans</h2>
              <p className="mt-1 text-ice-100">
                {access.isDemo ? "Demo account with full paid access." : "Your subscription is active. Thanks for skiing with us!"}
              </p>
            </>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-ice-500 uppercase">Free account</p>
                <h2 className="mt-1 text-xl font-semibold text-navy-900">
                  {access.canGenerate
                    ? `Your first plan is free`
                    : "You've used your free plan"}
                </h2>
                <p className="mt-1 text-slate-600">
                  {access.plansUsed} of {FREE_PLAN_LIMIT} free plan used. Pro is {formatPrice()}/month for unlimited
                  plans, so you can build a new one after every ski day.
                </p>
              </div>
              <UpgradeButton />
            </div>
          )}
        </section>

        {/* Plans */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-navy-900">Your progression plans</h2>
          {plans.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-ice-300 bg-white p-8 text-center">
              <p className="text-slate-600">
                You haven&apos;t built a plan yet. Answer a few questions and your AI coach will map out your next ski
                days.
              </p>
              {access.canGenerate && (
                <Link
                  href="/plan/new"
                  className="mt-4 inline-block rounded-full bg-ice-400 px-6 py-3 font-semibold text-navy-950 hover:bg-ice-300"
                >
                  Build my first plan
                </Link>
              )}
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {plans.map((p) => (
                <li key={String(p.id)}>
                  <Link
                    href={`/plan/${p.id}`}
                    className="block rounded-2xl border border-ice-100 bg-white p-5 shadow-sm hover:border-ice-300"
                  >
                    <p className="font-semibold text-navy-900">{String(p.headline)}</p>
                    <p className="mt-1 text-sm text-slate-600">Goal: {String(p.goal)}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(String(p.created_at)).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Account */}
        <section className="mt-8 rounded-2xl border border-ice-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy-900">Your account</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-slate-500">Name</dt>
              <dd className="font-medium text-navy-900">{user.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Email</dt>
              <dd className="font-medium break-all text-navy-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Member since</dt>
              <dd className="font-medium text-navy-900">{memberSince}</dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}
