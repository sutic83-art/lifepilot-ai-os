import { getUserOnboarding } from "@/lib/ai/onboarding/onboarding";
import { getUserPreferences } from "@/lib/ai/memory/preferences";
import { generateAdaptiveLearning } from "@/lib/ai/learning/adaptive-learning";
import { generatePersonalPolicy } from "@/lib/ai/policy/personal-policy";
import { generateTrendIntelligence } from "@/lib/ai/trends/trend-intelligence";

export type ConsolidatedMemoryItem = {
  type: string;
  statement: string;
  confidence: "low" | "medium" | "high";
};

export type MemoryConsolidationResult = {
  summary: string;
  identityModel: string[];
  operatingTraits: ConsolidatedMemoryItem[];
  stablePreferences: ConsolidatedMemoryItem[];
  riskMemory: ConsolidatedMemoryItem[];
  actionMemory: ConsolidatedMemoryItem[];
};

export async function generateMemoryConsolidation(
  userId: string
): Promise<MemoryConsolidationResult> {
  const [onboarding, preferences, learning, policy, trends] = await Promise.all([
    getUserOnboarding(userId),
    getUserPreferences(userId),
    generateAdaptiveLearning(userId),
    generatePersonalPolicy(userId),
    generateTrendIntelligence(userId),
  ]);

  const identityModel: string[] = [];
  const operatingTraits: ConsolidatedMemoryItem[] = [];
  const stablePreferences: ConsolidatedMemoryItem[] = [];
  const riskMemory: ConsolidatedMemoryItem[] = [];
  const actionMemory: ConsolidatedMemoryItem[] = [];

  if (onboarding?.primaryGoal) {
    identityModel.push(`Primary goal: ${onboarding.primaryGoal}`);
  }

  if (onboarding?.focusArea) {
    identityModel.push(`Main focus area: ${onboarding.focusArea}`);
  }

  if (preferences.planningMode === "gentle") {
    stablePreferences.push({
      type: "planning_mode",
      statement: "User prefers gentler planning intensity.",
      confidence: "high",
    });
  } else if (preferences.planningMode === "ambitious") {
    stablePreferences.push({
      type: "planning_mode",
      statement: "User tolerates or prefers stronger execution pressure.",
      confidence: "high",
    });
  } else {
    stablePreferences.push({
      type: "planning_mode",
      statement: "User prefers balanced planning by default.",
      confidence: "high",
    });
  }

  stablePreferences.push({
    type: "tone",
    statement:
      preferences.tone === "supportive"
        ? "User responds better to supportive guidance."
        : "User responds better to direct guidance.",
    confidence: "high",
  });

  stablePreferences.push({
    type: "work_style",
    statement:
      preferences.workStyle === "flexible"
        ? "User benefits from flexibility under pressure."
        : "User benefits from focused structure.",
    confidence: "medium",
  });

  operatingTraits.push({
    type: "policy_profile",
    statement: `Current dominant policy profile: ${policy.profile}.`,
    confidence: "medium",
  });

  if (trends.direction === "improving") {
    operatingTraits.push({
      type: "trend",
      statement: "System trend is improving, suggesting stable operating behavior.",
      confidence: "medium",
    });
  } else if (trends.direction === "declining") {
    operatingTraits.push({
      type: "trend",
      statement: "System trend is declining, suggesting accumulated strain or drift.",
      confidence: "medium",
    });
  } else {
    operatingTraits.push({
      type: "trend",
      statement: "System trend is mostly stable without strong directional change.",
      confidence: "low",
    });
  }

  if (policy.profile === "gentle_rebuilder") {
    riskMemory.push({
      type: "strain_pattern",
      statement: "User may need lower pressure and softer interventions during strain periods.",
      confidence: "medium",
    });
  }

  if (policy.profile === "overloaded_stabilizer") {
    riskMemory.push({
      type: "overload_pattern",
      statement: "User may accumulate overload and benefit from stronger stabilization.",
      confidence: "medium",
    });
  }

  if (trends.energyTrend === "declining") {
    riskMemory.push({
      type: "energy_trend",
      statement: "Energy tends to decline across recent snapshots.",
      confidence: "medium",
    });
  }

  if (trends.burnoutTrend === "declining") {
    riskMemory.push({
      type: "burnout_trend",
      statement: "Burnout risk may be worsening across recent snapshots.",
      confidence: "medium",
    });
  }

  learning.patterns.slice(0, 3).forEach((pattern) => {
    actionMemory.push({
      type: "action_feedback",
      statement: `${pattern.actionType} has score ${pattern.score} and should influence future behavior.`,
      confidence:
        pattern.score >= 3 || pattern.score <= -2 ? "high" : "medium",
    });
  });

  if (identityModel.length === 0) {
    identityModel.push("No strong identity anchors yet. Onboarding data should be refined.");
  }

  if (riskMemory.length === 0) {
    riskMemory.push({
      type: "risk_memory",
      statement: "No strong recurring risk pattern has been consolidated yet.",
      confidence: "low",
    });
  }

  if (actionMemory.length === 0) {
    actionMemory.push({
      type: "action_feedback",
      statement: "Not enough repeated action feedback yet for stable action memory.",
      confidence: "low",
    });
  }

  const summary =
    "Memory consolidation converts scattered signals into a more stable user operating model.";

  return {
    summary,
    identityModel,
    operatingTraits,
    stablePreferences,
    riskMemory,
    actionMemory,
  };
}