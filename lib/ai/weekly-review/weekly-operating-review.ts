import { generateTrendIntelligence } from "@/lib/ai/trends/trend-intelligence";
import { generateRetrospective } from "@/lib/ai/retrospective/retrospective-intelligence";
import { generateExecutiveDirection } from "@/lib/ai/executive/executive-layer";
import { calculateEnergy } from "@/lib/ai/state/energy-engine";
import { calculateBurnoutRisk } from "@/lib/ai/state/burnout-engine";
import { generatePersonalPolicy } from "@/lib/ai/policy/personal-policy";

export type WeeklyOperatingReviewResult = {
  summary: string;
  weeklyMode: "protect" | "stabilize" | "execute" | "scale" | "reset";
  keyMessage: string;
  wins: string[];
  risks: string[];
  adjustments: string[];
  operatingDirectives: string[];
  reasoning: string[];
};

export async function generateWeeklyOperatingReview(
  userId: string
): Promise<WeeklyOperatingReviewResult> {
  const [trends, retrospective, executive, energy, burnout, policy] =
    await Promise.all([
      generateTrendIntelligence(userId),
      generateRetrospective(userId),
      generateExecutiveDirection(userId),
      calculateEnergy(userId),
      calculateBurnoutRisk(userId),
      generatePersonalPolicy(userId),
    ]);

  let weeklyMode: "protect" | "stabilize" | "execute" | "scale" | "reset" =
    "execute";
  let summary =
    "The coming week should focus on controlled execution and visible progress.";
  let keyMessage = "Push meaningful work, but keep the system clean.";
  const risks: string[] = [];
  const operatingDirectives: string[] = [];
  const reasoning: string[] = [];

  const wins = retrospective.wins.slice(0, 4);

  if (burnout.burnoutRisk === "high" || energy.energyLevel === "low") {
    weeklyMode = "protect";
    summary =
      "The coming week should prioritize protection of energy and reduction of strain.";
    keyMessage = "Lower pressure first, then rebuild momentum.";
    operatingDirectives.push(
      "Do not expand commitments this week.",
      "Protect energy before chasing output.",
      "Use smaller daily plans and lower-friction wins."
    );
    risks.push(
      "Burnout risk is elevated.",
      "Energy capacity is currently reduced."
    );
    reasoning.push("Burnout and energy signals dominate weekly planning.");
  } else if (
    executive.mode === "recover" ||
    executive.mode === "stabilize" ||
    trends.direction === "declining"
  ) {
    weeklyMode = "stabilize";
    summary =
      "The coming week should focus on stabilization before expansion.";
    keyMessage = "Reduce drift, clean up overload, and restore consistency.";
    operatingDirectives.push(
      "Close open loops before adding new work.",
      "Keep the active system smaller than usual.",
      "Reconnect tasks to one important goal."
    );
    risks.push(
      "Recent system direction is weak or unstable.",
      "Stability should come before ambition."
    );
    reasoning.push(
      "Executive mode or trend direction indicates stabilization is needed."
    );
  } else if (executive.mode === "reset") {
    weeklyMode = "reset";
    summary =
      "The coming week should be used to reset direction and reduce misalignment.";
    keyMessage = "Choose one direction and cut the noise.";
    operatingDirectives.push(
      "Select one primary goal for the week.",
      "Archive or defer low-value work.",
      "Rebuild clarity before pushing harder."
    );
    risks.push("System direction appears diffused or misaligned.");
    reasoning.push("Executive layer recommends reset-oriented behavior.");
  } else if (
    executive.mode === "scale" &&
    trends.direction === "improving" &&
    burnout.burnoutRisk === "low"
  ) {
    weeklyMode = "scale";
    summary =
      "The coming week supports stronger execution and selective expansion.";
    keyMessage = "Scale carefully from a stable base.";
    operatingDirectives.push(
      "Push one high-value weekly result to completion.",
      "Expand only where stability already exists.",
      "Preserve what is already working."
    );
    risks.push("Avoid scaling too many things at once.");
    reasoning.push(
      "Executive, trend, and burnout signals all support selective scaling."
    );
  } else {
    weeklyMode = "execute";
    summary =
      "The coming week favors focused execution with controlled pressure.";
    keyMessage = "Convert stable structure into visible progress.";
    operatingDirectives.push(
      "Work from a short list of meaningful priorities.",
      "Protect focus blocks early in the day.",
      "Avoid clutter and unnecessary switching."
    );
    risks.push("Execution quality drops if the system becomes crowded.");
    reasoning.push("No dominant protect/stabilize/reset signal detected.");
  }

  if (policy.profile === "gentle_rebuilder" && weeklyMode !== "protect") {
    operatingDirectives.push(
      "Keep tone supportive and avoid aggressive pressure."
    );
    reasoning.push("Policy profile favors gentler handling.");
  }

  if (policy.profile === "ambitious_executor" && weeklyMode === "execute") {
    operatingDirectives.push(
      "Allow stronger execution on the highest-value result."
    );
    reasoning.push("Policy profile supports stronger execution style.");
  }

  retrospective.nextWeekAdjustments.slice(0, 3).forEach((item) => {
    operatingDirectives.push(item);
  });

  if (risks.length === 0) {
    risks.push("No major weekly operating risk detected.");
  }

  if (reasoning.length === 0) {
    reasoning.push("Weekly review defaults to current stable system state.");
  }

  return {
    summary,
    weeklyMode,
    keyMessage,
    wins,
    risks,
    adjustments: retrospective.nextWeekAdjustments.slice(0, 4),
    operatingDirectives: Array.from(new Set(operatingDirectives)).slice(0, 8),
    reasoning,
  };
}