import { db } from "@/lib/db";

export type TrendResult = {
  summary: string;
  direction: "improving" | "stable" | "declining";
  energyTrend: string;
  burnoutTrend: string;
  executiveTrend: string;
  signals: string[];
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

function executiveScore(value: string | null | undefined) {
  if (value === "scale") return 5;
  if (value === "execute") return 4;
  if (value === "stabilize") return 3;
  if (value === "reset") return 2;
  if (value === "recover") return 1;
  return 0;
}

export async function generateTrendIntelligence(userId: string): Promise<TrendResult> {
  const snapshots = await db.aIStateSnapshot.findMany({
    where: {
      userId,
      snapshotType: "orchestrator",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  if (snapshots.length < 2) {
    return {
      summary: "Not enough snapshots yet to detect meaningful trends.",
      direction: "stable",
      energyTrend: "unknown",
      burnoutTrend: "unknown",
      executiveTrend: "unknown",
      signals: ["Create more OS snapshots to unlock trend intelligence."],
    };
  }

  const latest = snapshots[0];
  const oldest = snapshots[snapshots.length - 1];

  const latestEnergy = scoreEnergy(latest.energyLevel);
  const oldestEnergy = scoreEnergy(oldest.energyLevel);

  const latestBurnout = scoreBurnout(latest.burnoutRisk);
  const oldestBurnout = scoreBurnout(oldest.burnoutRisk);

  const latestExecutive = executiveScore(latest.executiveMode);
  const oldestExecutive = executiveScore(oldest.executiveMode);

  const signals: string[] = [];

  let energyTrend = "stable";
  if (latestEnergy > oldestEnergy) {
    energyTrend = "improving";
    signals.push("Energy trend is improving.");
  } else if (latestEnergy < oldestEnergy) {
    energyTrend = "declining";
    signals.push("Energy trend is declining.");
  } else {
    signals.push("Energy trend is stable.");
  }

  let burnoutTrend = "stable";
  if (latestBurnout > oldestBurnout) {
    burnoutTrend = "improving";
    signals.push("Burnout risk trend is improving.");
  } else if (latestBurnout < oldestBurnout) {
    burnoutTrend = "declining";
    signals.push("Burnout risk trend is worsening.");
  } else {
    signals.push("Burnout trend is stable.");
  }

  let executiveTrend = "stable";
  if (latestExecutive > oldestExecutive) {
    executiveTrend = "improving";
    signals.push("Executive mode is moving toward stronger output.");
  } else if (latestExecutive < oldestExecutive) {
    executiveTrend = "declining";
    signals.push("Executive mode is moving toward recovery or reset.");
  } else {
    signals.push("Executive mode is stable.");
  }

  const positiveSignals = [energyTrend, burnoutTrend, executiveTrend].filter(
    (v) => v === "improving"
  ).length;
  const negativeSignals = [energyTrend, burnoutTrend, executiveTrend].filter(
    (v) => v === "declining"
  ).length;

  let direction: "improving" | "stable" | "declining" = "stable";
  let summary = "System trends are mostly stable.";

  if (positiveSignals > negativeSignals) {
    direction = "improving";
    summary = "System trend suggests improving stability and operating capacity.";
  } else if (negativeSignals > positiveSignals) {
    direction = "declining";
    summary = "System trend suggests deteriorating stability and rising strain.";
  }

  return {
    summary,
    direction,
    energyTrend,
    burnoutTrend,
    executiveTrend,
    signals,
  };
}