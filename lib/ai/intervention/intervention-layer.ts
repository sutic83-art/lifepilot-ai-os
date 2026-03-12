import { calculateBurnoutRisk } from "@/lib/ai/state/burnout-engine";
import { calculateEnergy } from "@/lib/ai/state/energy-engine";
import { generateDecision } from "@/lib/ai/decision/decision-engine";
import { generatePersonalPolicy } from "@/lib/ai/policy/personal-policy";
import { generateTrendIntelligence } from "@/lib/ai/trends/trend-intelligence";
import { generateGoalAlignment } from "@/lib/ai/alignment/goal-alignment";

export type InterventionResult = {
  interventionNeeded: boolean;
  interventionLevel: "none" | "soft" | "moderate" | "strong";
  interventionType:
    | "none"
    | "nudge"
    | "correction"
    | "protective"
    | "reset";
  headline: string;
  message: string;
  actions: string[];
  reasoning: string[];
};

export async function generateIntervention(
  userId: string
): Promise<InterventionResult> {
  const [burnout, energy, decision, policy, trends, alignment] =
    await Promise.all([
      calculateBurnoutRisk(userId),
      calculateEnergy(userId),
      generateDecision(userId),
      generatePersonalPolicy(userId),
      generateTrendIntelligence(userId),
      generateGoalAlignment(userId),
    ]);

  let interventionNeeded = false;
  let interventionLevel: "none" | "soft" | "moderate" | "strong" = "none";
  let interventionType: "none" | "nudge" | "correction" | "protective" | "reset" =
    "none";
  let headline = "No intervention needed.";
  let message = "The system does not detect a strong need to interrupt or correct your flow.";
  const actions: string[] = [];
  const reasoning: string[] = [];

  if (burnout.burnoutRisk === "high" || energy.energyLevel === "low") {
    interventionNeeded = true;
    interventionLevel = "strong";
    interventionType = "protective";
    headline = "Protect energy now.";
    message =
      "The system detects elevated strain. Lower pressure and reduce commitments before pushing further.";
    actions.push(
      "Cut active workload for today.",
      "Do not add new commitments.",
      "Use smaller, lower-friction wins.",
      "Schedule recovery before deep work."
    );
    reasoning.push("High burnout risk or low energy requires protective intervention.");
  } else if (trends.direction === "declining" && alignment.alignmentScore < 50) {
    interventionNeeded = true;
    interventionLevel = "strong";
    interventionType = "reset";
    headline = "Reset direction.";
    message =
      "The system detects declining trend and weak alignment. Continuing as-is will likely create drift.";
    actions.push(
      "Rebuild the active task list around the main goal.",
      "Archive low-alignment tasks.",
      "Choose one primary direction for the next few days."
    );
    reasoning.push("Declining trend plus low alignment suggests reset is needed.");
  } else if (
    decision.strategy === "reduce_overload" ||
    decision.strategy === "reconnect_goals"
  ) {
    interventionNeeded = true;
    interventionLevel = "moderate";
    interventionType = "correction";
    headline = "Correct the operating path.";
    message =
      "The system detects overload or drift. A targeted correction is more useful than more effort.";
    actions.push(
      "Reduce stale open loops.",
      "Reconnect today’s work with the primary goal.",
      "Avoid side work until the core system is cleaner."
    );
    reasoning.push("Decision engine indicates correction is more useful than raw execution.");
  } else if (
    policy.profile === "gentle_rebuilder" ||
    trends.energyTrend === "declining"
  ) {
    interventionNeeded = true;
    interventionLevel = "soft";
    interventionType = "nudge";
    headline = "Use a gentler operating day.";
    message =
      "The system suggests a softer adjustment before strain becomes a bigger problem.";
    actions.push(
      "Use a smaller daily plan.",
      "Prefer one meaningful win over many small wins.",
      "Protect energy during the next work block."
    );
    reasoning.push("Policy or energy trend suggests early soft intervention.");
  }

  if (!interventionNeeded) {
    if (energy.energyLevel === "high" && burnout.burnoutRisk === "low") {
      reasoning.push("System looks stable enough to avoid interruption.");
    } else {
      reasoning.push("No dominant intervention trigger detected.");
    }
  }

  if (actions.length === 0) {
    actions.push("Continue with the current plan.");
  }

  return {
    interventionNeeded,
    interventionLevel,
    interventionType,
    headline,
    message,
    actions,
    reasoning,
  };
}