import type { Metadata } from "next";
import Link from "next/link";
import { getAccess } from "@/lib/access";
import { requireUser } from "@/lib/session";
import { AppHeader } from "../../app-header";
import { UpgradeButton } from "../../billing/upgrade-button";
import { PlanForm } from "./plan-form";

export const metadata: Metadata = { title: "New progression plan | RunReady" };
export const dynamic = "force-dynamic";
// Generating a plan with the AI can take up to a minute.
export const maxDuration = 120;

export default async function NewPlanPage() {
  const user = await requireUser();
  const access = await getAccess(user);

  return (
    <div className="min-h-screen bg-ice-50">
      <AppHeader isPaid={access.isPaid} />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/dashboard" className="text-sm font-medium text-ice-500 hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-navy-900">Build your progression plan</h1>
        <p className="mt-2 text-slate-600">
          Answer honestly. The more detail you give in your own words, the more personal your plan will be.
        </p>

        {access.canGenerate ? (
          <PlanForm />
        ) : (
          <div className="mt-8 rounded-2xl border border-ice-200 bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-navy-900">You&apos;ve used your free plan</h2>
            <p className="mt-2 text-slate-600">
              Upgrade to RunReady Pro for unlimited plans, so you can build a new one after every ski day.
            </p>
            <div className="mt-6 flex justify-center">
              <UpgradeButton />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
