import { db } from "@/lib/db";

export type UserPreferences = {
  planningMode: "gentle" | "balanced" | "ambitious";
  tone: "direct" | "supportive";
  workStyle: "focused" | "flexible";
};

export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  const preferences = await db.userPreference.findUnique({
    where: { userId }
  });

  if (!preferences) {
    return {
      planningMode: "balanced",
      tone: "direct",
      workStyle: "focused",
    };
  }

  return {
    planningMode: (preferences.planningMode as "gentle" | "balanced" | "ambitious") || "balanced",
    tone: (preferences.tone as "direct" | "supportive") || "direct",
    workStyle: (preferences.workStyle as "focused" | "flexible") || "focused",
  };
}

export async function saveUserPreferences(
  userId: string,
  input: UserPreferences
) {
  return db.userPreference.upsert({
    where: { userId },
    update: {
      planningMode: input.planningMode,
      tone: input.tone,
      workStyle: input.workStyle,
    },
    create: {
      userId,
      planningMode: input.planningMode,
      tone: input.tone,
      workStyle: input.workStyle,
    },
  });
}