import type { DraftDailyPlan, UserContext } from "./types";
import { getUserPreferences } from "./memory/preferences";

export async function generateDailyPlan(
  context: UserContext
): Promise<DraftDailyPlan> {
  const preferences = await getUserPreferences(context.userId);

  const priorities: string[] = [];
  const risks = [...context.risks];

  if (preferences.planningMode === "gentle") {
    priorities.push("Choose only 1–2 essential tasks today.");
    if (context.highPriorityTasks > 0) {
      priorities.push("Finish one important task and protect your energy.");
    }
  }

  if (preferences.planningMode === "balanced") {
    if (context.highPriorityTasks > 0) {
      priorities.push("Focus on high priority tasks first.");
    }
    if (context.openTasks > 6) {
      priorities.push("Reduce the open task list before adding more.");
    }
  }

  if (preferences.planningMode === "ambitious") {
    priorities.push("Push your most important task early.");
    if (context.highPriorityTasks > 0) {
      priorities.push("Complete at least 2 high-value tasks today.");
    }
    if (context.openTasks > 8) {
      risks.push("Ambitious mode may create overload with too many open tasks.");
    }
  }

  if (priorities.length === 0) {
    priorities.push("Maintain steady progress on current tasks.");
  }

  let summary = "Focus on a small number of meaningful tasks today.";

  if (preferences.planningMode === "gentle") {
    summary = "Today should feel lighter, calmer, and easier to complete.";
  }

  if (preferences.planningMode === "ambitious") {
    summary = "Today is optimized for stronger execution and forward movement.";
  }

  return {
    summary,
    priorities,
    risks,
  };
}