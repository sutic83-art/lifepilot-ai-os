import { generateDailyPlanForUser } from "@/lib/ai/brain";
import { generateDecision } from "@/lib/ai/decision/decision-engine";
import { generateExecutiveDirection } from "@/lib/ai/executive/executive-layer";
import { calculateEnergy } from "@/lib/ai/state/energy-engine";
import { calculateBurnoutRisk } from "@/lib/ai/state/burnout-engine";
import { generateAdaptiveLearning } from "@/lib/ai/learning/adaptive-learning";
import { generatePersonalPolicy } from "@/lib/ai/policy/personal-policy";
import { generateActionProposals } from "@/lib/ai/actions/action-layer";

export type UnifiedOrchestratorResult = {
  summary: string;
  todayFocus: string[];
  majorRisk: string;
  executiveMode: string;
  energyLevel: string;
  burnoutRisk: string;
  decision: {
    strategy: string;
    primaryAction: string;
    secondaryAction: string;
  };
  policy: {
    profile: string;
    planningIntensity: string;
    interventionStyle: string;
  };
  learning: {
    summary: string;
    topPattern: string;
  };
  actions: Array<{
    type: string;
    title: string;
    description: string;
    reason: string;
  }>;
  reasoning: string[];
};

export async function generateUnifiedOrchestrator(
  userId: string
): Promise<UnifiedOrchestratorResult> {
  const [
    dailyPlan,
    decision,
    executive,
    energy,
    burnout,
    learning,
    policy,
    actions,
  ] = await Promise.all([
    generateDailyPlanForUser(userId),
    generateDecision(userId),
    generateExecutiveDirection(userId),
    calculateEnergy(userId),
    calculateBurnoutRisk(userId),
    generateAdaptiveLearning(userId),
    generatePersonalPolicy(userId),
    generateActionProposals(userId),
  ]);

  const todayFocus = dailyPlan.priorities.slice(0, 3);

  const riskCandidates = [
    ...dailyPlan.risks,
    ...executive.risks,
    ...burnout.reasons,
    ...energy.signals,
  ].filter(Boolean);

  const majorRisk = riskCandidates.length > 0
    ? riskCandidates[0]
    : "No major system risk detected.";

  const topPattern =
    learning.patterns.length > 0
      ? `${learning.patterns[0].actionType} (score: ${learning.patterns[0].score})`
      : "No strong learning pattern yet.";

  const summary =
    executive.mode === "recover"
      ? "System recommends recovery and load reduction before stronger execution."
      : executive.mode === "stabilize"
      ? "System recommends stabilization before expansion."
      : executive.mode === "scale"
      ? "System recommends scaling output carefully from a stable base."
      : executive.mode === "reset"
      ? "System recommends resetting direction before pushing harder."
      : "System recommends focused execution with controlled pressure.";

  const reasoning: string[] = [
    `Executive mode selected: ${executive.mode}.`,
    `Decision engine strategy: ${decision.strategy}.`,
    `Energy level detected: ${energy.energyLevel}.`,
    `Burnout risk detected: ${burnout.burnoutRisk}.`,
    `Policy profile selected: ${policy.profile}.`,
  ];

  return {
    summary,
    todayFocus,
    majorRisk,
    executiveMode: executive.mode,
    energyLevel: energy.energyLevel,
    burnoutRisk: burnout.burnoutRisk,
    decision: {
      strategy: decision.strategy,
      primaryAction: decision.primaryAction,
      secondaryAction: decision.secondaryAction,
    },
    policy: {
      profile: policy.profile,
      planningIntensity: policy.planningIntensity,
      interventionStyle: policy.interventionStyle,
    },
    learning: {
      summary: learning.summary,
      topPattern,
    },
    actions: actions.slice(0, 3),
    reasoning,
  };
}