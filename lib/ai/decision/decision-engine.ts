import { db } from "@/lib/db";
import { getUserPreferences } from "@/lib/ai/memory/preferences";

export type DecisionResult = {
  strategy: string;
  primaryAction: string;
  secondaryAction: string;
  riskLevel: "low" | "medium" | "high";
  reasoning: string[];
};

export async function generateDecision(userId: string): Promise<DecisionResult> {
  const [tasks, goals, habits, preferences] = await Promise.all([
    db.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    db.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    db.habit.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    getUserPreferences(userId),
  ]);

  const openTasks = tasks.filter((t) => !t.done).length;
  const completedTasks = tasks.filter((t) => t.done).length;
  const highPriorityOpen = tasks.filter(
    (t) => !t.done && t.priority === "HIGH"
  ).length;
  const weakHabits = habits.filter(
    (h) => h.status === "WARNING" || h.streak <= 1
  ).length;
  const lowProgressGoals = goals.filter((g) => g.progress < 30).length;

  const reasoning: string[] = [];
  let strategy = "maintain_momentum";
  let primaryAction = "Continue steady work on current priorities.";
  let secondaryAction = "Protect focus and avoid unnecessary switching.";
  let riskLevel: "low" | "medium" | "high" = "low";

  if (openTasks > 10) {
    strategy = "reduce_overload";
    primaryAction = "Close or defer old open tasks before adding new work.";
    secondaryAction = "Work from a shorter task list today.";
    riskLevel = "high";
    reasoning.push("User has too many open tasks.");
  }

  if (highPriorityOpen >= 3 && strategy !== "reduce_overload") {
    strategy = "focus_critical_work";
    primaryAction = "Start with the most important high-priority task.";
    secondaryAction = "Protect the first focus block from distraction.";
    riskLevel = "medium";
    reasoning.push("Multiple high-priority tasks are still open.");
  }

  if (weakHabits >= 2 && strategy === "maintain_momentum") {
    strategy = "restore_stability";
    primaryAction = "Rebuild one small daily habit before increasing workload.";
    secondaryAction = "Reduce task ambition until routine improves.";
    riskLevel = "medium";
    reasoning.push("Habit consistency is slipping.");
  }

  if (lowProgressGoals >= 2 && strategy === "maintain_momentum") {
    strategy = "reconnect_goals";
    primaryAction = "Choose one goal and align today’s actions with it.";
    secondaryAction = "Avoid busywork that does not move a real goal.";
    riskLevel = "medium";
    reasoning.push("Several goals have low progress.");
  }

  if (completedTasks >= 5 && openTasks <= 5 && strategy === "maintain_momentum") {
    strategy = "push_execution";
    primaryAction = "Use your momentum to complete one meaningful task today.";
    secondaryAction = "Keep your list small and execution focused.";
    riskLevel = "low";
    reasoning.push("Recent execution suggests stable momentum.");
  }

  if (preferences.planningMode === "gentle") {
    reasoning.push("Planning mode is gentle, so the decision should stay conservative.");
    if (riskLevel === "high") {
      secondaryAction = "Reduce task volume aggressively and protect recovery.";
    }
  }

  if (preferences.planningMode === "ambitious") {
    reasoning.push("Planning mode is ambitious, so stronger execution is acceptable.");
    if (strategy === "maintain_momentum") {
      strategy = "push_execution";
      primaryAction = "Push one high-value result early in the day.";
      secondaryAction = "Use ambition, but avoid creating unnecessary overload.";
    }
  }

  if (reasoning.length === 0) {
    reasoning.push("No major risk signals detected.");
  }

  return {
    strategy,
    primaryAction,
    secondaryAction,
    riskLevel,
    reasoning,
  };
}