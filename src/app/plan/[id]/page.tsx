import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccess } from "@/lib/access";
import { ensureSchema, sql } from "@/lib/db";
import { AnswersSchema, PlanSchema } from "@/lib/ai/schemas";
import { requireUser } from "@/lib/session";
import { AppHeader } from "../../app-header";

export const metadata: Metadata = { title: "Your progression plan | RunReady" };
export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  await ensureSchema();
  // Only the plan's owner can see it.
  const [rows, access] = await Promise.all([
    sql()`SELECT answers, plan, created_at FROM progression_plans WHERE id = ${id} AND user_id = ${user.id}`,
    getAccess(user),
  ]);
  if (rows.length === 0) notFound();

  const plan = PlanSchema.safeParse(rows[0].plan);
  const answers = AnswersSchema.safeParse(rows[0].answers);
  if (!plan.success) notFound();
  const p = plan.data;

  return (
    <div className="min-h-screen bg-ice-50">
      <AppHeader isPaid={access.isPaid} />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/dashboard" className="text-sm font-medium text-ice-500 hover:underline">
          ← Back to dashboard
        </Link>

        <section className="mt-4 rounded-2xl bg-navy-900 p-8 text-white">
          <p className="text-xs font-semibold tracking-widest text-ice-300 uppercase">Your progression plan</p>
          <h1 className="mt-2 text-3xl font-bold">{p.headline}</h1>
          <p className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-sm text-ice-100">
            Current level: <span className="font-semibold text-white">{p.currentLevel}</span>
          </p>
          <p className="mt-4 text-ice-100">{p.assessment}</p>
          {answers.success && (
            <p className="mt-4 text-sm text-ice-200">
              Goal: <span className="text-white">{answers.data.goal}</span> · Home mountain:{" "}
              <span className="text-white">{answers.data.homeMountain}</span>
            </p>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-ice-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-navy-900">What&apos;s holding you back</h2>
          <ul className="mt-4 space-y-4">
            {p.holdingYouBack.map((h) => (
              <li key={h.issue}>
                <p className="font-semibold text-navy-900">{h.issue}</p>
                <p className="mt-1 text-slate-600">{h.explanation}</p>
              </li>
            ))}
          </ul>
        </section>

        <h2 className="mt-10 text-2xl font-bold text-navy-900">Your sessions</h2>
        <ol className="mt-4 space-y-5">
          {p.sessions.map((s) => (
            <li key={s.session} className="rounded-2xl border border-ice-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="rounded-full bg-ice-100 px-3 py-1 text-xs font-bold text-navy-800">
                  Day {s.session}
                </span>
                <h3 className="text-lg font-semibold text-navy-900">{s.title}</h3>
              </div>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Terrain</dt>
                  <dd className="mt-1 text-navy-900">{s.terrain}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Focus</dt>
                  <dd className="mt-1 text-navy-900">{s.focus}</dd>
                </div>
              </dl>
              {s.runsToTry.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Runs to try</p>
                  <ul className="mt-1 list-disc pl-5 text-navy-900">
                    {s.runsToTry.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4 space-y-3">
                {s.drills.map((d) => (
                  <div key={d.name} className="rounded-xl bg-ice-50 p-4">
                    <p className="font-semibold text-navy-900">Drill: {d.name}</p>
                    <p className="mt-1 text-slate-700">{d.howTo}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-600">
                <span className="font-semibold text-navy-900">Ready to move on when: </span>
                {s.readyToMoveOn}
              </p>
            </li>
          ))}
        </ol>

        <section className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="font-semibold text-navy-900">Stay safe</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
              {p.safetyNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-ice-200 bg-white p-6">
            <h2 className="font-semibold text-navy-900">Next milestone</h2>
            <p className="mt-2 text-slate-700">{p.nextMilestone}</p>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-slate-500">
          AI-generated coaching. Always ski within your ability, follow posted signs, and consider a lesson with a
          certified instructor.
        </p>
      </main>
    </div>
  );
}
