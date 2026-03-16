import { generateDailyPlanForUser } from "@/lib/ai/brain";
import { generateDecision } from "@/lib/ai/decision/decision-engine";
import { generateExecutiveDirection } from "@/lib/ai/executive/executive-layer";
import { calculateEnergy } from "@/lib/ai/state/energy-engine";
import { calculateBurnoutRisk } from "@/lib/ai/state/burnout-engine";
import { generateAdaptiveLearning } from "@/lib/ai/learning/adaptive-learning";
import { generatePersonalPolicy } from "@/lib/ai/policy/personal-policy";
import { generateActionProposals } from "@/lib/ai/actions/action-layer";

export type SupportedLocale = "en" | "sr";

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

function normalizeLocale(locale?: string): SupportedLocale {
  return locale === "sr" ? "sr" : "en";
}

function t(locale: SupportedLocale, en: string, sr: string) {
  return locale === "sr" ? sr : en;
}

function localizeMode(mode: string, locale: SupportedLocale) {
  const map: Record<string, { en: string; sr: string }> = {
    recover: { en: "recover", sr: "oporavak" },
    stabilize: { en: "stabilize", sr: "stabilizacija" },
    scale: { en: "scale", sr: "širenje" },
    reset: { en: "reset", sr: "reset" },
    execute: { en: "execute", sr: "izvršavanje" },
  };

  const found = map[mode];
  if (found) return locale === "sr" ? found.sr : found.en;
  return mode;
}

function localizeEnergyLevel(level: string, locale: SupportedLocale) {
  const map: Record<string, { en: string; sr: string }> = {
    low: { en: "low", sr: "niska" },
    medium: { en: "medium", sr: "srednja" },
    high: { en: "high", sr: "visoka" },
    unstable: { en: "unstable", sr: "nestabilna" },
    strong: { en: "strong", sr: "jaka" },
  };

  const found = map[level];
  if (found) return locale === "sr" ? found.sr : found.en;
  return level;
}

function localizeBurnoutRisk(level: string, locale: SupportedLocale) {
  const map: Record<string, { en: string; sr: string }> = {
    low: { en: "low", sr: "nizak" },
    medium: { en: "medium", sr: "srednji" },
    high: { en: "high", sr: "visok" },
    critical: { en: "critical", sr: "kritičan" },
  };

  const found = map[level];
  if (found) return locale === "sr" ? found.sr : found.en;
  return level;
}

export async function generateUnifiedOrchestrator(
  userId: string,
  localeInput?: string
): Promise<UnifiedOrchestratorResult> {
  const locale = normalizeLocale(localeInput);

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

  const majorRisk =
    riskCandidates.length > 0
      ? riskCandidates[0]
      : t(
          locale,
          "No major system risk detected.",
          "Nije detektovan glavni sistemski rizik."
        );

  const topPattern =
    learning.patterns.length > 0
      ? locale === "sr"
        ? `${learning.patterns[0].actionType} (skor: ${learning.patterns[0].score})`
        : `${learning.patterns[0].actionType} (score: ${learning.patterns[0].score})`
      : t(
          locale,
          "No strong learning pattern yet.",
          "Još nema izraženog obrasca učenja."
        );

  const summary =
    executive.mode === "recover"
      ? t(
          locale,
          "System recommends recovery and load reduction before stronger execution.",
          "Sistem preporučuje oporavak i smanjenje opterećenja pre jačeg izvršavanja."
        )
      : executive.mode === "stabilize"
      ? t(
          locale,
          "System recommends stabilization before expansion.",
          "Sistem preporučuje stabilizaciju pre širenja."
        )
      : executive.mode === "scale"
      ? t(
          locale,
          "System recommends scaling output carefully from a stable base.",
          "Sistem preporučuje pažljivo povećanje output-a iz stabilne osnove."
        )
      : executive.mode === "reset"
      ? t(
          locale,
          "System recommends resetting direction before pushing harder.",
          "Sistem preporučuje reset pravca pre jačeg pritiska."
        )
      : t(
          locale,
          "System recommends focused execution with controlled pressure.",
          "Sistem preporučuje fokusirano izvršavanje uz kontrolisan pritisak."
        );

  const reasoning: string[] = [
    t(
      locale,
      `Executive mode selected: ${localizeMode(executive.mode, locale)}.`,
      `Izabran izvršni režim: ${localizeMode(executive.mode, locale)}.`
    ),
    t(
      locale,
      `Decision engine strategy: ${decision.strategy}.`,
      `Strategija decision engine-a: ${decision.strategy}.`
    ),
    t(
      locale,
      `Energy level detected: ${localizeEnergyLevel(energy.energyLevel, locale)}.`,
      `Detektovan nivo energije: ${localizeEnergyLevel(energy.energyLevel, locale)}.`
    ),
    t(
      locale,
      `Burnout risk detected: ${localizeBurnoutRisk(burnout.burnoutRisk, locale)}.`,
      `Detektovan burnout rizik: ${localizeBurnoutRisk(burnout.burnoutRisk, locale)}.`
    ),
    t(
      locale,
      `Policy profile selected: ${policy.profile}.`,
      `Izabran policy profil: ${policy.profile}.`
    ),
  ];

  return {
    summary,
    todayFocus,
    majorRisk,
    executiveMode: localizeMode(executive.mode, locale),
    energyLevel: localizeEnergyLevel(energy.energyLevel, locale),
    burnoutRisk: localizeBurnoutRisk(burnout.burnoutRisk, locale),
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