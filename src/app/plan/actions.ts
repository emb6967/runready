"use server";

import { redirect } from "next/navigation";
import { getAccess } from "@/lib/access";
import { ensureSchema, sql } from "@/lib/db";
import { generatePlan, PlanGenerationError } from "@/lib/ai/plan";
import { AnswersSchema } from "@/lib/ai/schemas";
import { requireUser } from "@/lib/session";

export type PlanFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  /** Echoes the answers back so the form keeps them after an error. */
  values?: Record<string, string | string[]>;
};

export async function generatePlanAction(
  _prev: PlanFormState,
  formData: FormData,
): Promise<PlanFormState> {
  const user = await requireUser();

  const text = (key: string) => String(formData.get(key) ?? "");
  const values = {
    experience: text("experience"),
    daysPerSeason: text("daysPerSeason"),
    homeMountain: text("homeMountain"),
    comfortableTerrain: formData.getAll("comfortableTerrain").map(String),
    lastSkiDay: text("lastSkiDay"),
    nervousAbout: text("nervousAbout"),
    goal: text("goal"),
    sessions: text("sessions"),
  };
  const parsed = AnswersSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message.startsWith("Invalid") ? "Please choose an option." : issue.message;
    }
    return { error: "Please fix the highlighted answers.", fieldErrors, values };
  }

  const access = await getAccess(user);
  if (!access.canGenerate) {
    return { error: "You've used your free plan. Upgrade to RunReady Pro for unlimited plans.", values };
  }

  let planId: string;
  try {
    const plan = await generatePlan(parsed.data);
    await ensureSchema();
    const rows = await sql()`
      INSERT INTO progression_plans (user_id, answers, plan)
      VALUES (${user.id}, ${JSON.stringify(parsed.data)}::jsonb, ${JSON.stringify(plan)}::jsonb)
      RETURNING id`;
    planId = String(rows[0].id);
  } catch (err) {
    if (err instanceof PlanGenerationError) return { error: err.message, values };
    console.error("Plan generation failed:", err instanceof Error ? err.message : err);
    return { error: "Something went wrong building your plan. Please try again.", values };
  }

  redirect(`/plan/${planId}`);
}
