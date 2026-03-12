import { getUserPreferences } from "@/lib/ai/memory/preferences";
import { generateAdaptiveLearning } from "@/lib/ai/learning/adaptive-learning";
import { calculateBurnoutRisk } from "@/lib/ai/state/burnout-engine";
import { calculateEnergy } from "@/lib/ai/state/energy-engine";

export type PolicyProfile =
  | "steady_operator"
  | "gentle_rebuilder"
  | "ambitious_executor"
  | "overloaded_stabilizer";

export type PersonalPolicyResult = {
  profile: PolicyProfile;
  summary: string;
  guidanceStyle: string;
  planningIntensity: "low" | "medium" | "high";
  interventionStyle: "soft" | "balanced" | "strong";
  rules: string[];
  reasoning: string[];
};

export async function generatePersonalPolicy(userId: string): Promise<PersonalPolicyResult> {
  const [preferences, learning, burnout, energy] = await Promise.all([
    getUserPreferences(userId),
    generateAdaptiveLearning(userId),
    calculateBurnoutRisk(userId),
    calculateEnergy(userId),
  ]);

  const reasoning: string[] = [];
  let profile: PolicyProfile = "steady_operator";
  let summary = "This user benefits from steady execution with moderate guidance.";
  let guidanceStyle = "Direct, calm, and practical.";
  let planningIntensity: "low" | "medium" | "high" = "medium";
  let interventionStyle: "soft" | "balanced" | "strong" = "balanced";
  let rules: string[] = [
    "Keep plans realistic and focused.",
    "Prefer consistent progress over dramatic changes.",
  ];

  if (burnout.burnoutRisk === "high" || energy.energyLevel === "low") {
    profile = "gentle_rebuilder";
    summary = "This user currently needs lower pressure and more stabilization.";
    guidanceStyle = "Supportive, calm, and protective of energy.";
    planningIntensity = "low";
    interventionStyle = "soft";
    rules = [
      "Reduce workload before increasing ambition.",
      "Favor recovery-supporting actions over stretch actions.",
      "Use smaller daily plans and softer nudges.",
      "Avoid stacking too many new commitments.",
    ];
    reasoning.push("Burnout or low energy signals are dominant.");
  }

  if (
    preferences.planningMode === "ambitious" &&
    burnout.burnoutRisk === "low" &&
    energy.energyLevel !== "low"
  ) {
    profile = "ambitious_executor";
    summary = "This user can handle stronger execution if overload is monitored.";
    guidanceStyle = "Direct, strategic, and execution-oriented.";
    planningIntensity = "high";
    interventionStyle = "strong";
    rules = [
      "Push important work early.",
      "Use stronger execution prompts when risk is low.",
      "Allow more ambitious plans when stability is present.",
      "Avoid clutter even when ambition is high.",
    ];
    reasoning.push("Ambitious preference is supported by low burnout risk.");
  }

  if (
    burnout.burnoutRisk !== "high" &&
    energy.energyLevel === "medium" &&
    preferences.planningMode === "balanced"
  ) {
    profile = "steady_operator";
    summary = "This user responds best to stable structure and measured execution.";
    guidanceStyle = "Clear, practical, and moderately firm.";
    planningIntensity = "medium";
    interventionStyle = "balanced";
    rules = [
      "Prefer stable execution over aggressive optimization.",
      "Use moderate nudges and focused task plans.",
      "Intervene when overload rises, but do not overcorrect too early.",
    ];
    reasoning.push("Balanced planning mode and medium energy favor a steady policy.");
  }

  const negativePatterns = learning.patterns.filter((p) => p.score <= -2).length;
  if (negativePatterns > 0 && profile !== "gentle_rebuilder") {
    profile = "overloaded_stabilizer";
    summary = "This user needs stronger correction when system drift and overload appear.";
    guidanceStyle = "Clear, corrective, but still respectful.";
    planningIntensity = "low";
    interventionStyle = "strong";
    rules = [
      "Reduce ineffective action types.",
      "Use stronger stabilization when feedback suggests poor fit.",
      "Cut overload before adding optimization.",
      "Favor clarity and system cleanup over expansion.",
    ];
    reasoning.push("Repeated negative feedback suggests the system should stabilize more aggressively.");
  }

  if (reasoning.length === 0) {
    reasoning.push("Policy is based on current preference defaults and stable signals.");
  }

  return {
    profile,
    summary,
    guidanceStyle,
    planningIntensity,
    interventionStyle,
    rules,
    reasoning,
  };
}