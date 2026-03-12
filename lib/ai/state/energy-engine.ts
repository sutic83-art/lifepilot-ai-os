import { db } from "@/lib/db";

export type EnergyResult = {
  energyLevel: "low" | "medium" | "high";
  signals: string[];
  recommendation: string;
};

export async function calculateEnergy(userId: string): Promise<EnergyResult> {
  const [tasks, habits, goals] = await Promise.all([
    db.task.findMany({
      where: { userId, done: false },
    }),
    db.habit.findMany({
      where: { userId },
    }),
    db.goal.findMany({
      where: { userId },
    }),
  ]);

  const openTasks = tasks.length;
  const highPriorityTasks = tasks.filter((t) => t.priority === "HIGH").length;
  const weakHabits = habits.filter(
    (h) => h.status === "WARNING" || h.streak <= 1
  ).length;
  const stalledGoals = goals.filter((g) => g.progress < 20).length;

  const signals: string[] = [];
  let energyLevel: "low" | "medium" | "high" = "medium";
  let recommendation = "Maintain a steady pace.";

  if (openTasks > 10) {
    signals.push("Too many open tasks");
  }

  if (highPriorityTasks >= 3) {
    signals.push("Multiple high-priority tasks");
  }

  if (weakHabits >= 2) {
    signals.push("Habit stability is weak");
  }

  if (stalledGoals >= 2) {
    signals.push("Several goals show low momentum");
  }

  const stressScore =
    (openTasks > 10 ? 2 : 0) +
    (highPriorityTasks >= 3 ? 2 : 0) +
    (weakHabits >= 2 ? 1 : 0) +
    (stalledGoals >= 2 ? 1 : 0);

  if (stressScore >= 4) {
    energyLevel = "low";
    recommendation =
      "Reduce workload today and focus on one meaningful result only.";
  } else if (stressScore >= 2) {
    energyLevel = "medium";
    recommendation =
      "Keep your task list short and protect your focus blocks.";
  } else {
    energyLevel = "high";
    recommendation =
      "You appear stable enough for stronger execution today.";
  }

  if (signals.length === 0) {
    signals.push("No major energy drains detected");
  }

  return {
    energyLevel,
    signals,
    recommendation,
  };
}