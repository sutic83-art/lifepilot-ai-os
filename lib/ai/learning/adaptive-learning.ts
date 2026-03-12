import { db } from "@/lib/db";

export type LearnedPattern = {
  actionType: string;
  helpfulCount: number;
  neutralCount: number;
  unhelpfulCount: number;
  score: number;
  recommendation: string;
};

export type AdaptiveLearningResult = {
  summary: string;
  patterns: LearnedPattern[];
  nextSystemBehavior: string[];
};

function extractOutcome(summary: string): "helpful" | "neutral" | "unhelpful" | "unknown" {
  const normalized = summary.toLowerCase();

  if (normalized.includes("helpful")) return "helpful";
  if (normalized.includes("neutral")) return "neutral";
  if (normalized.includes("unhelpful")) return "unhelpful";

  return "unknown";
}

function extractActionType(type: string): string {
  if (type.startsWith("action_feedback:")) {
    return type.replace("action_feedback:", "");
  }

  return type;
}

export async function generateAdaptiveLearning(userId: string): Promise<AdaptiveLearningResult> {
  const reviews = await db.aIReview.findMany({
    where: {
      userId,
      type: {
        startsWith: "action_feedback:",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  const grouped = new Map<
    string,
    {
      helpfulCount: number;
      neutralCount: number;
      unhelpfulCount: number;
    }
  >();

  for (const review of reviews) {
    const actionType = extractActionType(review.type);
    const outcome = extractOutcome(review.summary);

    if (!grouped.has(actionType)) {
      grouped.set(actionType, {
        helpfulCount: 0,
        neutralCount: 0,
        unhelpfulCount: 0,
      });
    }

    const entry = grouped.get(actionType)!;

    if (outcome === "helpful") entry.helpfulCount += 1;
    if (outcome === "neutral") entry.neutralCount += 1;
    if (outcome === "unhelpful") entry.unhelpfulCount += 1;
  }

  const patterns: LearnedPattern[] = Array.from(grouped.entries()).map(
    ([actionType, counts]) => {
      const score =
        counts.helpfulCount * 2 +
        counts.neutralCount * 1 -
        counts.unhelpfulCount * 2;

      let recommendation = "Not enough evidence yet.";

      if (score >= 3) {
        recommendation = "This action type appears useful and can be favored more often.";
      } else if (score <= -2) {
        recommendation = "This action type should be used more carefully or less often.";
      } else {
        recommendation = "This action type needs more evidence before system adaptation.";
      }

      return {
        actionType,
        helpfulCount: counts.helpfulCount,
        neutralCount: counts.neutralCount,
        unhelpfulCount: counts.unhelpfulCount,
        score,
        recommendation,
      };
    }
  );

  patterns.sort((a, b) => b.score - a.score);

  const nextSystemBehavior: string[] = [];

  const strongPositive = patterns.filter((p) => p.score >= 3);
  const strongNegative = patterns.filter((p) => p.score <= -2);

  if (strongPositive.length > 0) {
    nextSystemBehavior.push(
      "Favor action types with repeated helpful feedback."
    );
  }

  if (strongNegative.length > 0) {
    nextSystemBehavior.push(
      "Reduce or soften action types with repeated unhelpful feedback."
    );
  }

  if (nextSystemBehavior.length === 0) {
    nextSystemBehavior.push(
      "Keep collecting feedback before changing the system’s behavior."
    );
  }

  const summary =
    patterns.length === 0
      ? "No adaptive learning data yet."
      : "Adaptive learning has identified early action preferences from feedback.";

  return {
    summary,
    patterns,
    nextSystemBehavior,
  };
}