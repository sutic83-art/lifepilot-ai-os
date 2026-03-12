import { db } from "@/lib/db";
import type { FounderReportingResult } from "@/lib/types/founder-reporting";

export async function generateFounderReporting(
  userId: string
): Promise<FounderReportingResult> {
  const [tasks, goals, habits, reviews, snapshots] = await Promise.all([
    db.task.findMany({ where: { userId } }),
    db.goal.findMany({ where: { userId } }),
    db.habit.findMany({ where: { userId } }),
    db.aIReview.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.aIStateSnapshot.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

  const actionFeedback = reviews.filter((r) =>
    r.type.startsWith("action_feedback:")
  );

  const helpfulFeedbackCount = actionFeedback.filter((r) =>
    r.summary.toLowerCase().includes("helpful")
  ).length;

  const neutralFeedbackCount = actionFeedback.filter((r) =>
    r.summary.toLowerCase().includes("neutral")
  ).length;

  const unhelpfulFeedbackCount = actionFeedback.filter((r) =>
    r.summary.toLowerCase().includes("unhelpful")
  ).length;

  const signals: string[] = [];
  let systemHealth: "low" | "medium" | "high" = "medium";

  if (tasks.length > 0) {
    signals.push("User has active task usage.");
  }

  if (goals.length > 0) {
    signals.push("User has goal data.");
  }

  if (habits.length > 0) {
    signals.push("User has habit data.");
  }

  if (snapshots.length >= 3) {
    signals.push("OS state persistence is being used.");
  }

  if (actionFeedback.length >= 3) {
    signals.push("Feedback loop is active.");
  }

  if (helpfulFeedbackCount > unhelpfulFeedbackCount) {
    signals.push("Helpful feedback currently outweighs unhelpful feedback.");
  }

  const healthScore =
    (tasks.length > 0 ? 1 : 0) +
    (goals.length > 0 ? 1 : 0) +
    (habits.length > 0 ? 1 : 0) +
    (snapshots.length >= 3 ? 1 : 0) +
    (actionFeedback.length >= 3 ? 1 : 0) +
    (helpfulFeedbackCount > unhelpfulFeedbackCount ? 1 : 0);

  if (healthScore >= 5) {
    systemHealth = "high";
  } else if (healthScore <= 2) {
    systemHealth = "low";
  }

  const summary =
    systemHealth === "high"
      ? "LifePilot is showing strong operating-system usage signals."
      : systemHealth === "medium"
      ? "LifePilot shows partial OS usage, but still needs deeper behavioral adoption."
      : "LifePilot usage is still shallow and needs stronger engagement loops.";

  if (signals.length === 0) {
    signals.push("No strong usage signals detected yet.");
  }

  return {
    summary,
    totalTasks: tasks.length,
    totalGoals: goals.length,
    totalHabits: habits.length,
    totalReviews: reviews.length,
    totalSnapshots: snapshots.length,
    actionFeedbackCount: actionFeedback.length,
    helpfulFeedbackCount,
    neutralFeedbackCount,
    unhelpfulFeedbackCount,
    systemHealth,
    signals,
  };
}