import { db } from "@/lib/db";
import { getUserPreferences } from "@/lib/ai/memory/preferences";

export type ExecutiveMode =
  | "stabilize"
  | "recover"
  | "execute"
  | "scale"
  | "reset";

export type ExecutiveResult = {
  mode: ExecutiveMode;
  summary: string;
  directives: string[];
  risks: string[];
  reasoning: string[];
};

export async function generateExecutiveDirection(userId: string): Promise<ExecutiveResult> {
  const [tasks, goals, habits, preferences] = await Promise.all([
    db.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    db.habit.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    getUserPreferences(userId),
  ]);

  const openTasks = tasks.filter((t) => !t.done).length;
  const completedTasks = tasks.filter((t) => t.done).length;
  const highPriorityOpen = tasks.filter((t) => !t.done && t.priority === "HIGH").length;
  const weakHabits = habits.filter((h) => h.status === "WARNING" || h.streak <= 1).length;
  const strongHabits = habits.filter((h) => h.status === "GOOD" || h.status === "GREAT").length;
  const stalledGoals = goals.filter((g) => g.progress < 20).length;
  const progressingGoals = goals.filter((g) => g.progress >= 50).length;

  const risks: string[] = [];
  const reasoning: string[] = [];
  let mode: ExecutiveMode = "execute";
  let summary = "You are in execution mode for the next 7 days.";
  let directives: string[] = [
    "Protect your focus and move your most meaningful work forward.",
    "Avoid unnecessary context switching.",
  ];

  if (openTasks > 12) {
    risks.push("Too many unfinished tasks are creating overload.");
    reasoning.push("Open task count is high.");
  }

  if (highPriorityOpen >= 3) {
    risks.push("Multiple high-priority tasks are still unresolved.");
    reasoning.push("There is concentrated pressure in high-priority work.");
  }

  if (weakHabits >= 2) {
    risks.push("Routine stability is weakening.");
    reasoning.push("Multiple habits show weak consistency.");
  }

  if (stalledGoals >= 2) {
    risks.push("Several goals are not progressing.");
    reasoning.push("Goal momentum is low.");
  }

  if (openTasks > 12 && weakHabits >= 2) {
    mode = "recover";
    summary = "The next 7 days should prioritize recovery and pressure reduction.";
    directives = [
      "Do not add new commitments this week.",
      "Reduce your active task list aggressively.",
      "Restore one basic daily habit before pushing for more output.",
      "Choose lower-friction wins to regain stability.",
    ];
  } else if (openTasks > 10 || stalledGoals >= 2 || weakHabits >= 2) {
    mode = "stabilize";
    summary = "The next 7 days should focus on stabilization before expansion.";
    directives = [
      "Close open loops before starting new work.",
      "Reconnect today’s actions to one important goal.",
      "Keep your daily plan smaller than usual.",
      "Rebuild consistency before increasing ambition.",
    ];
  } else if (completedTasks >= 8 && progressingGoals >= 1 && strongHabits >= 1) {
    mode = "scale";
    summary = "You have enough stability to increase ambition over the next 7 days.";
    directives = [
      "Push one meaningful result to completion this week.",
      "Add only one new strategic initiative, not many.",
      "Use your strongest focus window for your highest-value work.",
      "Preserve what is already working while scaling output.",
    ];
  } else if (completedTasks < 3 && openTasks < 5 && stalledGoals >= 1) {
    mode = "reset";
    summary = "The next 7 days should be used to reset direction and reduce drift.";
    directives = [
      "Choose one goal that actually matters right now.",
      "Delete, defer, or archive low-value tasks.",
      "Rebuild the week around one clear direction.",
      "Stop spreading attention across too many weak priorities.",
    ];
  } else {
    mode = "execute";
    summary = "The next 7 days favor focused execution.";
    directives = [
      "Push your most meaningful work first.",
      "Keep the task list constrained and intentional.",
      "Protect consistency and avoid unnecessary overload.",
      "Use your current rhythm to make visible progress.",
    ];
  }

  if (preferences.planningMode === "gentle") {
    reasoning.push("Planning mode is gentle, so aggressive expansion should be avoided.");
    if (mode === "scale") {
      mode = "execute";
      summary = "You have momentum, but your next 7 days should stay controlled rather than aggressive.";
      directives = [
        "Advance one meaningful result without expanding too fast.",
        "Keep the number of active commitments small.",
        "Protect energy while maintaining momentum.",
      ];
    }
  }

  if (preferences.planningMode === "ambitious") {
    reasoning.push("Planning mode is ambitious, so stronger execution is acceptable if risk is controlled.");
    if (mode === "execute" && risks.length === 0) {
      mode = "scale";
      summary = "You are stable enough to increase ambition over the next 7 days.";
      directives = [
        "Push one visible, high-value outcome this week.",
        "Use stronger execution while avoiding clutter.",
        "Expand carefully, not recklessly.",
      ];
    }
  }

  if (reasoning.length === 0) {
    reasoning.push("No dominant strategic risk was detected.");
  }

  if (risks.length === 0) {
    risks.push("No major strategic risk detected.");
  }

  return {
    mode,
    summary,
    directives,
    risks,
    reasoning,
  };
}