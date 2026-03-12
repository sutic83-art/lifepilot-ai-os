import { db } from "@/lib/db";
import { getUserOnboarding } from "@/lib/ai/onboarding/onboarding";

export type GoalAlignmentResult = {
  summary: string;
  alignmentScore: number;
  primaryGoal: string;
  alignedTasks: string[];
  misalignedTasks: string[];
  busyworkSignals: string[];
  nextAdjustments: string[];
};

function normalize(text: string | null | undefined) {
  return (text || "").toLowerCase().trim();
}

function taskMatchesGoal(taskTitle: string, taskCategory: string, primaryGoal: string, focusArea: string) {
  const t = normalize(taskTitle);
  const c = normalize(taskCategory);
  const g = normalize(primaryGoal);
  const f = normalize(focusArea);

  if (!g) return false;

  const goalWords = g.split(/\s+/).filter((w) => w.length > 3);
  const focusWords = [f];

  return (
    goalWords.some((word) => t.includes(word) || c.includes(word)) ||
    focusWords.some((word) => word && (t.includes(word) || c.includes(word)))
  );
}

export async function generateGoalAlignment(userId: string): Promise<GoalAlignmentResult> {
  const [tasks, goals, onboarding] = await Promise.all([
    db.task.findMany({
      where: { userId, done: false },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    db.goal.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    getUserOnboarding(userId),
  ]);

  const primaryGoal =
    onboarding?.primaryGoal ||
    goals[0]?.title ||
    "No primary goal defined yet";

  const focusArea = onboarding?.focusArea || goals[0]?.area || "";

  const alignedTasks: string[] = [];
  const misalignedTasks: string[] = [];
  const busyworkSignals: string[] = [];
  const nextAdjustments: string[] = [];

  for (const task of tasks) {
    const aligned = taskMatchesGoal(task.title, task.category, primaryGoal, focusArea);

    if (aligned) {
      alignedTasks.push(task.title);
    } else {
      misalignedTasks.push(task.title);
    }
  }

  const total = tasks.length || 1;
  const alignmentScore = Math.max(
    0,
    Math.min(100, Math.round((alignedTasks.length / total) * 100))
  );

  if (misalignedTasks.length >= alignedTasks.length && tasks.length > 0) {
    busyworkSignals.push("A large share of active tasks does not clearly support the primary goal.");
  }

  if (alignedTasks.length === 0 && tasks.length > 0) {
    busyworkSignals.push("No open tasks appear clearly connected to the primary goal.");
  }

  if (tasks.length > 8 && alignmentScore < 50) {
    busyworkSignals.push("Task volume is high while alignment is low.");
  }

  if (alignmentScore >= 70) {
    nextAdjustments.push("Keep current task selection close to the primary goal.");
  } else if (alignmentScore >= 40) {
    nextAdjustments.push("Reduce side work and move 1–2 tasks closer to the main goal.");
  } else {
    nextAdjustments.push("Rebuild the active task list around the main goal.");
    nextAdjustments.push("Archive, defer, or downgrade low-alignment tasks.");
  }

  if (!onboarding?.primaryGoal) {
    nextAdjustments.push("Set a clearer primary goal in onboarding for stronger alignment.");
  }

  const summary =
    alignmentScore >= 70
      ? "Your active work is mostly aligned with your main goal."
      : alignmentScore >= 40
      ? "Your system is partially aligned, but still diluted by side work."
      : "Your active system appears weakly aligned with your main goal.";

  if (busyworkSignals.length === 0) {
    busyworkSignals.push("No strong busywork signal detected.");
  }

  return {
    summary,
    alignmentScore,
    primaryGoal,
    alignedTasks: alignedTasks.slice(0, 8),
    misalignedTasks: misalignedTasks.slice(0, 8),
    busyworkSignals,
    nextAdjustments,
  };
}