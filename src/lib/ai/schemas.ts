import { z } from "zod";

export const TERRAIN_OPTIONS = [
  "Green groomers",
  "Blue groomers",
  "Steeper blues",
  "Black groomers",
  "Moguls / bumps",
  "Glades / trees",
  "Ungroomed or powder",
  "Terrain park",
] as const;

export const EXPERIENCE_OPTIONS = [
  "First season",
  "2–3 seasons",
  "4–6 seasons",
  "7+ seasons",
] as const;

export const DAYS_OPTIONS = ["1–4 days", "5–10 days", "11–20 days", "20+ days"] as const;

/** What the skier tells us. Validated on the server before anything reaches the AI. */
export const AnswersSchema = z.object({
  experience: z.enum(EXPERIENCE_OPTIONS),
  daysPerSeason: z.enum(DAYS_OPTIONS),
  homeMountain: z.string().trim().min(2, "Tell us where you usually ski.").max(80),
  comfortableTerrain: z.array(z.enum(TERRAIN_OPTIONS)).min(1, "Pick at least one type of terrain."),
  lastSkiDay: z
    .string()
    .trim()
    .min(15, "Describe your last ski day in a sentence or two.")
    .max(1200),
  nervousAbout: z.string().trim().min(5, "Tell us what makes you nervous (or 'nothing').").max(800),
  goal: z.string().trim().min(5, "Tell us your goal for this season.").max(500),
  sessions: z.coerce.number().int().min(1).max(10),
});
export type Answers = z.infer<typeof AnswersSchema>;

/** The plan the AI returns, enforced with structured outputs. */
export const PlanSchema = z.object({
  headline: z.string().describe("A short, motivating title for this skier's plan"),
  currentLevel: z.string().describe("A plain-language label for their level, e.g. 'Confident blue-run skier'"),
  assessment: z
    .string()
    .describe("2-4 sentences: what their answers show about their current skiing, written to them"),
  holdingYouBack: z
    .array(
      z.object({
        issue: z.string().describe("A specific limiter, e.g. 'Leaning back on steeper pitches'"),
        explanation: z.string().describe("Why this happens and how it shows up for them"),
      }),
    )
    .describe("The 2-3 most important things limiting their progress"),
  sessions: z
    .array(
      z.object({
        session: z.number().describe("Session number, starting at 1"),
        title: z.string(),
        terrain: z.string().describe("The terrain to ski this session"),
        runsToTry: z
          .array(z.string())
          .describe("Named runs only if you are confident they exist at their mountain; otherwise describe the run type"),
        focus: z.string().describe("The one skill to focus on this session"),
        drills: z.array(
          z.object({
            name: z.string(),
            howTo: z.string().describe("Clear, step-by-step instructions a skier can follow on the hill"),
          }),
        ),
        readyToMoveOn: z.string().describe("How they'll know they're ready for the next session"),
      }),
    )
    .describe("One entry per ski session, progressing gradually toward the goal"),
  safetyNotes: z.array(z.string()).describe("2-4 short, specific safety reminders"),
  nextMilestone: z.string().describe("What to aim for after finishing this plan"),
});
export type Plan = z.infer<typeof PlanSchema>;
