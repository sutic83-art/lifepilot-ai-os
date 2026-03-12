import { db } from "@/lib/db";
import { generateDecision } from "@/lib/ai/decision/decision-engine";
import { calculateBurnoutRisk } from "@/lib/ai/state/burnout-engine";

export type ActionProposal = {
  type: "create_focus_task" | "create_recovery_habit" | "create_reset_task";
  title: string;
  description: string;
  reason: string;
};

export async function generateActionProposals(userId: string): Promise<ActionProposal[]> {
  const [decision, burnout] = await Promise.all([
    generateDecision(userId),
    calculateBurnoutRisk(userId),
  ]);

  const actions: ActionProposal[] = [];

  if (decision.strategy === "focus_critical_work" || decision.strategy === "push_execution") {
    actions.push({
      type: "create_focus_task",
      title: "Deep focus block",
      description: "Work 60–90 min on the highest-value task without distraction.",
      reason: "Decision Engine recommends concentrated execution.",
    });
  }

  if (decision.strategy === "reduce_overload" || decision.strategy === "reconnect_goals") {
    actions.push({
      type: "create_reset_task",
      title: "Close old open loops",
      description: "Review open tasks and close, defer, or archive low-value items.",
      reason: "System detected overload or drift in priorities.",
    });
  }

  if (burnout.burnoutRisk === "medium" || burnout.burnoutRisk === "high") {
    actions.push({
      type: "create_recovery_habit",
      title: "Daily recovery block",
      description: "10–20 min walk, pause, breathing, or no-screen reset each day.",
      reason: "Burnout engine detected overload risk.",
    });
  }

  if (actions.length === 0) {
    actions.push({
      type: "create_focus_task",
      title: "Small forward step",
      description: "Choose one meaningful task and move it forward today.",
      reason: "No urgent correction needed, but consistent progress is useful.",
    });
  }

  return actions;
}

export async function executeAction(userId: string, action: ActionProposal) {
  if (action.type === "create_focus_task" || action.type === "create_reset_task") {
    const task = await db.task.create({
      data: {
        title: action.title,
        description: action.description,
        category: "AI_ACTION",
        priority: action.type === "create_focus_task" ? "HIGH" : "MEDIUM",
        done: false,
        userId,
      },
    });

    return {
      success: true,
      created: "task",
      item: task,
    };
  }

  if (action.type === "create_recovery_habit") {
    const habit = await db.habit.create({
      data: {
        title: action.title,
        streak: 0,
        status: "GOOD",
        userId,
      },
    });

    return {
      success: true,
      created: "habit",
      item: habit,
    };
  }

  return {
    success: false,
    created: null,
    item: null,
  };
}