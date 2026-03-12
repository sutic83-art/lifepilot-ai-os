import { db } from "@/lib/db";
import { generateDecision } from "@/lib/ai/decision/decision-engine";
import { calculateEnergy } from "@/lib/ai/state/energy-engine";
import { generateGoalAlignment } from "@/lib/ai/alignment/goal-alignment";

export type TimeBlock = {
  label: string;
  durationMinutes: number;
  purpose: string;
  intensity: "low" | "medium" | "high";
};

export type TimeAllocationResult = {
  summary: string;
  recommendedDayType: "light" | "balanced" | "deep-work";
  totalPlannedMinutes: number;
  blocks: TimeBlock[];
  reasoning: string[];
};

export async function generateTimeAllocation(
  userId: string
): Promise<TimeAllocationResult> {
  const [tasks, decision, energy, alignment] = await Promise.all([
    db.task.findMany({
      where: { userId, done: false },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    generateDecision(userId),
    calculateEnergy(userId),
    generateGoalAlignment(userId),
  ]);

  const reasoning: string[] = [];
  const blocks: TimeBlock[] = [];

  let recommendedDayType: "light" | "balanced" | "deep-work" = "balanced";
  let summary = "Today should use a balanced time structure.";

  if (energy.energyLevel === "low") {
    recommendedDayType = "light";
    summary = "Today should be lighter, with shorter blocks and more recovery.";
    blocks.push(
      {
        label: "Priority block",
        durationMinutes: 45,
        purpose: "Move one important task slightly forward.",
        intensity: "medium",
      },
      {
        label: "Admin / cleanup",
        durationMinutes: 30,
        purpose: "Close small open loops and reduce clutter.",
        intensity: "low",
      },
      {
        label: "Recovery block",
        durationMinutes: 20,
        purpose: "Walk, rest, breathing, or no-screen reset.",
        intensity: "low",
      }
    );
    reasoning.push("Low energy suggests a lighter operating day.");
  } else if (
    energy.energyLevel === "high" &&
    (decision.strategy === "push_execution" ||
      decision.strategy === "focus_critical_work") &&
    alignment.alignmentScore >= 60
  ) {
    recommendedDayType = "deep-work";
    summary = "Today supports deep work and concentrated execution.";
    blocks.push(
      {
        label: "Deep work block 1",
        durationMinutes: 90,
        purpose: "Push the highest-value task early.",
        intensity: "high",
      },
      {
        label: "Deep work block 2",
        durationMinutes: 60,
        purpose: "Continue aligned work before switching context.",
        intensity: "high",
      },
      {
        label: "Light admin block",
        durationMinutes: 30,
        purpose: "Handle messages, logistics, and minor follow-ups.",
        intensity: "low",
      }
    );
    reasoning.push("High energy and strong decision signals support deep work.");
    reasoning.push("Goal alignment is strong enough to justify longer focus blocks.");
  } else {
    recommendedDayType = "balanced";
    summary = "Today should combine progress, cleanup, and controlled focus.";
    blocks.push(
      {
        label: "Focus block",
        durationMinutes: 60,
        purpose: "Advance the most meaningful current task.",
        intensity: "high",
      },
      {
        label: "Support block",
        durationMinutes: 45,
        purpose: "Handle secondary but necessary work.",
        intensity: "medium",
      },
      {
        label: "Cleanup block",
        durationMinutes: 30,
        purpose: "Reduce open loops and maintain system clarity.",
        intensity: "low",
      }
    );
    reasoning.push("Signals suggest a balanced day structure.");
  }

  if (tasks.length > 8) {
    blocks.push({
      label: "Task reduction block",
      durationMinutes: 20,
      purpose: "Defer, archive, or close stale tasks.",
      intensity: "low",
    });
    reasoning.push("Open task count is high, so cleanup time is added.");
  }

  const totalPlannedMinutes = blocks.reduce(
    (sum, block) => sum + block.durationMinutes,
    0
  );

  if (reasoning.length === 0) {
    reasoning.push("Default time allocation logic applied.");
  }

  return {
    summary,
    recommendedDayType,
    totalPlannedMinutes,
    blocks,
    reasoning,
  };
}