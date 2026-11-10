"use client";

import { useActionState } from "react";
import { DAYS_OPTIONS, EXPERIENCE_OPTIONS, TERRAIN_OPTIONS } from "@/lib/ai/schemas";
import { generatePlanAction, type PlanFormState } from "../actions";

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-navy-900 placeholder:text-slate-400 focus:border-ice-500 focus:ring-2 focus:ring-ice-200 focus:outline-none";

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-sm text-red-600">{message}</p> : null;
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-ice-100 bg-white p-6 shadow-sm">
      <legend className="sr-only">{title}</legend>
      <h2 className="text-lg font-semibold text-navy-900">{title}</h2>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </fieldset>
  );
}

export function PlanForm() {
  const [state, formAction, pending] = useActionState<PlanFormState, FormData>(generatePlanAction, {});
  const v = state.values ?? {};
  const e = state.fieldErrors ?? {};
  const str = (k: string) => (typeof v[k] === "string" ? (v[k] as string) : undefined);
  const terrain = Array.isArray(v.comfortableTerrain) ? v.comfortableTerrain : [];

  return (
    // The key remounts the fields after an error so they show the skier's previous answers.
    <form action={formAction} className="mt-8 space-y-6" key={JSON.stringify(v)}>
      <Section title="Your skiing background">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-navy-900">
            How long have you been skiing?
            <select name="experience" defaultValue={str("experience") ?? ""} className={input} required>
              <option value="" disabled>
                Choose one
              </option>
              {EXPERIENCE_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <FieldError message={e.experience} />
          </label>
          <label className="block text-sm font-medium text-navy-900">
            Days you ski per season
            <select name="daysPerSeason" defaultValue={str("daysPerSeason") ?? ""} className={input} required>
              <option value="" disabled>
                Choose one
              </option>
              {DAYS_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <FieldError message={e.daysPerSeason} />
          </label>
        </div>
        <label className="block text-sm font-medium text-navy-900">
          Where do you usually ski?
          <input
            name="homeMountain"
            defaultValue={str("homeMountain")}
            className={input}
            placeholder="e.g. Blue Knob, PA or Killington, VT"
            maxLength={80}
            required
          />
          <FieldError message={e.homeMountain} />
        </label>
      </Section>

      <Section title="Your comfort zone" hint="Check every type of terrain you can ski comfortably today.">
        <div className="grid gap-2 sm:grid-cols-2">
          {TERRAIN_OPTIONS.map((t) => (
            <label
              key={t}
              className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-navy-900 has-[:checked]:border-ice-400 has-[:checked]:bg-ice-50"
            >
              <input
                type="checkbox"
                name="comfortableTerrain"
                value={t}
                defaultChecked={terrain.includes(t)}
                className="size-4 accent-sky-500"
              />
              {t}
            </label>
          ))}
        </div>
        <FieldError message={e.comfortableTerrain} />
        <label className="block text-sm font-medium text-navy-900">
          Describe your last ski day. What went well, and what felt hard?
          <textarea
            name="lastSkiDay"
            defaultValue={str("lastSkiDay")}
            rows={4}
            maxLength={1200}
            className={input}
            placeholder="e.g. I cruised the blues all morning, but on the steeper blue my skis kept getting away from me and I ended up in the back seat..."
            required
          />
          <FieldError message={e.lastSkiDay} />
        </label>
        <label className="block text-sm font-medium text-navy-900">
          What terrain or situations make you nervous, and why?
          <textarea
            name="nervousAbout"
            defaultValue={str("nervousAbout")}
            rows={3}
            maxLength={800}
            className={input}
            placeholder="e.g. Moguls. I don't know where to turn and I feel out of control."
            required
          />
          <FieldError message={e.nervousAbout} />
        </label>
      </Section>

      <Section title="Your goal">
        <label className="block text-sm font-medium text-navy-900">
          What do you want to be able to do by the end of this season?
          <textarea
            name="goal"
            defaultValue={str("goal")}
            rows={2}
            maxLength={500}
            className={input}
            placeholder="e.g. Ski my first black run with linked, controlled turns."
            required
          />
          <FieldError message={e.goal} />
        </label>
        <label className="block text-sm font-medium text-navy-900">
          How many ski days do you have for this plan?
          <select name="sessions" defaultValue={str("sessions") ?? "4"} className={input}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "day" : "days"}
              </option>
            ))}
          </select>
          <FieldError message={e.sessions} />
        </label>
      </Section>

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-navy-900 px-6 py-4 text-lg font-semibold text-white hover:bg-navy-800 disabled:opacity-70"
      >
        {pending ? "Your AI coach is building your plan… (about 30–60 seconds)" : "Build my plan"}
      </button>
    </form>
  );
}
