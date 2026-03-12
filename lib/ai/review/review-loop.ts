import { db } from "@/lib/db";

export type ReviewSummary = {
  completedTasks: number;
  openTasks: number;
  healthyHabits: number;
  weakHabits: number;
  summary: string;
  recommendation: string;
};

export type ReviewFeedbackInput = {
  userId: string;
  actionType: string;
  outcome: "helpful" | "neutral" | "unhelpful";
  note?: string;
};

export async function generateReviewSummary(userId: string): Promise<ReviewSummary> {
  const [tasks, habits] = await Promise.all([
    db.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.habit.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const completedTasks = tasks.filter((t) => t.done).length;
  const openTasks = tasks.filter((t) => !t.done).length;

  const healthyHabits = habits.filter(
    (h) => h.status === "GOOD" || h.status === "GREAT"
  ).length;

  const weakHabits = habits.filter(
    (h) => h.status === "WARNING" || h.streak <= 1
  ).length;

  let summary = "System state is stable.";
  let recommendation = "Continue with measured execution.";

  if (openTasks > completedTasks && openTasks > 8) {
    summary = "Open workload is dominating completed work.";
    recommendation = "Reduce new commitments and close older loops first.";
  } else if (completedTasks >= 5 && openTasks <= 5) {
    summary = "Execution momentum is healthy.";
    recommendation = "Preserve your current rhythm and protect focus.";
  }

  if (weakHabits >= 2) {
    recommendation =
      "Reinforce one small routine before increasing pressure.";
  }

  return {
    completedTasks,
    openTasks,
    healthyHabits,
    weakHabits,
    summary,
    recommendation,
  };
}

export async function saveReviewFeedback(input: ReviewFeedbackInput) {
  return db.aIReview.create({
    data: {
      userId: input.userId,
      type: `action_feedback:${input.actionType}`,
      summary: `Outcome marked as ${input.outcome}`,
      mainBlocker: input.outcome === "unhelpful" ? (input.note || "Action did not help enough.") : null,
      bestPattern: input.outcome === "helpful" ? (input.note || "Action appears useful.") : null,
      nextAdvice:
        input.outcome === "helpful"
          ? "Use similar actions again when signals match."
          : input.outcome === "neutral"
          ? "Collect more evidence before repeating this action."
          : "Adjust future action proposals more conservatively.",
    },
  });
}