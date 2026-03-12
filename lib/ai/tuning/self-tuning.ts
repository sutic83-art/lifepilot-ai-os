import { generateAdaptiveLearning } from "@/lib/ai/learning/adaptive-learning";
import { calculateBurnoutRisk } from "@/lib/ai/state/burnout-engine";
import { calculateEnergy } from "@/lib/ai/state/energy-engine";
import { generatePersonalPolicy } from "@/lib/ai/policy/personal-policy";

export type SelfTuningResult = {
  adjustedPlanningIntensity: "low" | "medium" | "high";
  adjustedInterventionStyle: "soft" | "balanced" | "strong";
  systemMode: "protect" | "stabilize" | "execute" | "push";
  summary: string;
  adjustments: string[];
  reasoning: string[];
};

export async function generateSelfTuning(userId: string): Promise<SelfTuningResult> {
  const [learning, burnout, energy, policy] = await Promise.all([
    generateAdaptiveLearning(userId),
    calculateBurnoutRisk(userId),
    calculateEnergy(userId),
    generatePersonalPolicy(userId),
  ]);

  let adjustedPlanningIntensity: "low" | "medium" | "high" = policy.planningIntensity;
  let adjustedInterventionStyle: "soft" | "balanced" | "strong" = policy.interventionStyle;
  let systemMode: "protect" | "stabilize" | "execute" | "push" = "execute";
  let summary = "System stays near current policy defaults.";
  const adjustments: string[] = [];
  const reasoning: string[] = [];

  const strongNegative = learning.patterns.filter((p) => p.score <= -2).length;
  const strongPositive = learning.patterns.filter((p) => p.score >= 3).length;

  if (burnout.burnoutRisk === "high" || energy.energyLevel === "low") {
    adjustedPlanningIntensity = "low";
    adjustedInterventionStyle = "soft";
    systemMode = "protect";
    summary = "System reduces pressure to protect energy and lower burnout risk.";
    adjustments.push("Lower planning intensity.");
    adjustments.push("Use softer interventions.");
    reasoning.push("High burnout risk or low energy detected.");
  } else if (burnout.burnoutRisk === "medium" || energy.energyLevel === "medium") {
    adjustedPlanningIntensity = "medium";
    adjustedInterventionStyle = "balanced";
    systemMode = "stabilize";
    summary = "System keeps a controlled pace and avoids unnecessary pressure.";
    adjustments.push("Keep planning moderate.");
    adjustments.push("Use balanced interventions.");
    reasoning.push("Medium system strain suggests controlled execution.");
  }

  if (strongPositive > 0 && burnout.burnoutRisk === "low" && energy.energyLevel === "high") {
    adjustedPlanningIntensity = "high";
    adjustedInterventionStyle = "strong";
    systemMode = "push";
    summary = "System increases ambition because signals suggest stable upward capacity.";
    adjustments.push("Increase planning intensity.");
    adjustments.push("Allow stronger execution prompts.");
    reasoning.push("Repeated positive feedback supports stronger execution.");
  }

  if (strongNegative > 0 && systemMode !== "protect") {
    adjustedPlanningIntensity = "low";
    adjustedInterventionStyle = "balanced";
    systemMode = "stabilize";
    summary = "System reduces aggressiveness because some action patterns are not working well.";
    adjustments.push("Reduce ineffective pressure.");
    adjustments.push("Shift toward stabilization.");
    reasoning.push("Negative adaptive learning patterns detected.");
  }

  if (adjustments.length === 0) {
    adjustments.push("No major automatic adjustment needed.");
  }

  if (reasoning.length === 0) {
    reasoning.push("No dominant tuning signal detected.");
  }

  return {
    adjustedPlanningIntensity,
    adjustedInterventionStyle,
    systemMode,
    summary,
    adjustments,
    reasoning,
  };
}