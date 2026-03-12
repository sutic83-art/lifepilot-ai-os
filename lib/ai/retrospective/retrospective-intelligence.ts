import { db } from "@/lib/db";
import { generateTrendIntelligence } from "@/lib/ai/trends/trend-intelligence";
import { generateAdaptiveLearning } from "@/lib/ai/learning/adaptive-learning";

export type RetrospectiveResult = {
  summary: string;
  wins: string[];
  regressions: string[];
  lessons: string[];
  nextWeekAdjustments: string[];
};

function scoreEnergy(value: string | null | undefined) {
  if (value === "high") return 3;
  if (value === "medium") return 2;
  if (value === "low") return 1;
  return 0;
}

function scoreBurnout(value: string | null | undefined) {
  if (value === "low") return 3;
  if (value === "medium") return 2;
  if (value === "high") return 1;
  return 0;
}

export async function generateRetrospective(userId: string): Promise<RetrospectiveResult> {
  const [snapshots, trends, learning] = await Promise.all([
    db.aIStateSnapshot.findMany({
      where: {
        userId,
        snapshotType: "orchestrator",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 12,
    }),
    generateTrendIntelligence(userId),
    generateAdaptiveLearning(userId),
  ]);

  const wins: string[] = [];
  const regressions: string[] = [];
  const lessons: string[] = [];
  const nextWeekAdjustments: string[] = [];

  if (snapshots.length < 2) {
    return {
      summary: "Not enough retrospective data yet. Save more snapshots first.",
      wins: ["System setup is working, but more history is needed."],
      regressions: [],
      lessons: ["Retrospective intelligence improves after more saved state snapshots."],
      nextWeekAdjustments: ["Create several snapshots over time to unlock stronger retrospectives."],
    };
  }

  const latest = snapshots[0];
  const oldest = snapshots[snapshots.length - 1];

  const latestEnergy = scoreEnergy(latest.energyLevel);
  const oldestEnergy = scoreEnergy(oldest.energyLevel);

  const latestBurnout = scoreBurnout(latest.burnoutRisk);
  const oldestBurnout = scoreBurnout(oldest.burnoutRisk);

  if (latestEnergy > oldestEnergy) {
    wins.push("Energy state improved compared with earlier snapshots.");
  } else if (latestEnergy < oldestEnergy) {
    regressions.push("Energy state is worse than earlier snapshots.");
  }

  if (latestBurnout > oldestBurnout) {
    wins.push("Burnout risk trend improved over time.");
  } else if (latestBurnout < oldestBurnout) {
    regressions.push("Burnout risk trend worsened over time.");
  }

  if (trends.direction === "improving") {
    wins.push("Overall system direction is improving.");
  } else if (trends.direction === "declining") {
    regressions.push("Overall system direction is declining.");
  }

  const strongPositive = learning.patterns.filter((p) => p.score >= 3);
  const strongNegative = learning.patterns.filter((p) => p.score <= -2);

  if (strongPositive.length > 0) {
    lessons.push(
      `Some action types appear effective, especially: ${strongPositive
        .slice(0, 2)
        .map((p) => p.actionType)
        .join(", ")}.`
    );
  }

  if (strongNegative.length > 0) {
    lessons.push(
      `Some action types appear less effective, especially: ${strongNegative
        .slice(0, 2)
        .map((p) => p.actionType)
        .join(", ")}.`
    );
  }

  if (wins.length === 0) {
    wins.push("No strong positive movement detected yet.");
  }

  if (regressions.length === 0) {
    regressions.push("No major regression signals detected.");
  }

  if (lessons.length === 0) {
    lessons.push("More feedback is needed before stronger behavioral lessons emerge.");
  }

  if (trends.direction === "declining") {
    nextWeekAdjustments.push("Reduce pressure and simplify your active system.");
  }

  if (trends.energyTrend === "declining") {
    nextWeekAdjustments.push("Protect energy more aggressively during the next week.");
  }

  if (trends.burnoutTrend === "declining") {
    nextWeekAdjustments.push("Treat burnout prevention as a primary planning constraint.");
  }

  if (strongNegative.length > 0) {
    nextWeekAdjustments.push("Reduce use of action types that have received poor feedback.");
  }

  if (strongPositive.length > 0) {
    nextWeekAdjustments.push("Reuse action types that consistently received helpful feedback.");
  }

  if (nextWeekAdjustments.length === 0) {
    nextWeekAdjustments.push("Maintain the current approach and continue collecting evidence.");
  }

  const summary =
    trends.direction === "improving"
      ? "Retrospective suggests the system is improving and becoming more stable."
      : trends.direction === "declining"
      ? "Retrospective suggests the system is accumulating strain and needs correction."
      : "Retrospective suggests mixed or stable movement without a dominant directional shift.";

  return {
    summary,
    wins,
    regressions,
    lessons,
    nextWeekAdjustments,
  };
}