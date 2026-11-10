import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth/server";
import { signOutAction } from "../auth/actions";

export const metadata: Metadata = { title: "Dashboard | RunReady" };

// Reads the signed-in user's session cookie on every request.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { data: session } = await getAuth().getSession();
  if (!session?.user) redirect("/auth/sign-in");

  const { user } = session;
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-ice-50">
      <header className="bg-navy-950 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="font-semibold">
            Run<span className="text-ice-300">Ready</span>
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium hover:bg-white/10"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-navy-900">Welcome, {user.name}!</h1>
        <p className="mt-2 text-slate-600">You&apos;re logged in to your RunReady account.</p>

        <section className="mt-8 rounded-2xl border border-ice-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy-900">Your account</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
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
            <div>
              <dt className="text-sm text-slate-500">Email verified</dt>
              <dd className="font-medium text-navy-900">{user.emailVerified ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-6 rounded-2xl border border-dashed border-ice-300 bg-white p-6">
          <span className="inline-block rounded-full bg-navy-900 px-3 py-1 text-xs font-semibold text-ice-200">
            Coming soon
          </span>
          <h2 className="mt-3 text-lg font-semibold text-navy-900">Your AI progression plan</h2>
          <p className="mt-1 text-slate-600">
            Soon you&apos;ll answer a few questions about your skiing here and get a personalized plan.
          </p>
        </section>
      </main>
    </div>
  );
}
