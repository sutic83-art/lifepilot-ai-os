import { db } from "@/lib/db";

export type BurnoutResult = {
  burnoutRisk: "low" | "medium" | "high";
  reasons: string[];
  recommendation: string;
};

export async function calculateBurnoutRisk(userId: string): Promise<BurnoutResult> {
  const [tasks, habits, goals] = await Promise.all([
    db.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.habit.findMany({
      where: { userId },
    }),
    db.goal.findMany({
      where: { userId },
    }),
  ]);

  const openTasks = tasks.filter((t) => !t.done).length;
  const finishedTasks = tasks.filter((t) => t.done).length;
  const warningHabits = habits.filter(
    (h) => h.status === "WARNING" || h.streak <= 1
  ).length;
  const stuckGoals = goals.filter((g) => g.progress < 20).length;

  const reasons: string[] = [];
  let burnoutRisk: "low" | "medium" | "high" = "low";
  let recommendation = "Current system does not show strong burnout signals.";

  const riskScore =
    (openTasks > 12 ? 2 : 0) +
    (finishedTasks < 3 ? 1 : 0) +
    (warningHabits >= 2 ? 2 : 0) +
    (stuckGoals >= 2 ? 1 : 0);

  if (openTasks > 12) {
    reasons.push("Too many unfinished obligations.");
  }

  if (finishedTasks < 3) {
    reasons.push("Low recent completion may indicate overload.");
  }

  if (warningHabits >= 2) {
    reasons.push("Routine stability is dropping.");
  }

  if (stuckGoals >= 2) {
    reasons.push("Several goals are stalled.");
  }

  if (riskScore >= 4) {
    burnoutRisk = "high";
    recommendation =
      "Stop adding pressure. Reduce commitments and stabilize routines first.";
  } else if (riskScore >= 2) {
    burnoutRisk = "medium";
    recommendation =
      "Watch your workload and simplify the next few days.";
  } else {
    burnoutRisk = "low";
    recommendation =
      "You do not currently show strong burnout patterns.";
  }

  if (reasons.length === 0) {
    reasons.push("No strong burnout reasons detected.");
  }

  return {
    burnoutRisk,
    reasons,
    recommendation,
  };
}