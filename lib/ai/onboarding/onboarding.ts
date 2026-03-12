import { db } from "@/lib/db";

export type UserOnboardingInput = {
  primaryGoal: string;
  workPace: "gentle" | "balanced" | "ambitious";
  supportStyle: "direct" | "supportive";
  overloadTendency: "low" | "medium" | "high";
  focusArea: "business" | "health" | "finance" | "personal" | "learning";
};

export async function getUserOnboarding(userId: string) {
  return db.userOnboarding.findUnique({
    where: { userId },
  });
}

export async function saveUserOnboarding(userId: string, input: UserOnboardingInput) {
  return db.userOnboarding.upsert({
    where: { userId },
    update: {
      primaryGoal: input.primaryGoal,
      workPace: input.workPace,
      supportStyle: input.supportStyle,
      overloadTendency: input.overloadTendency,
      focusArea: input.focusArea,
    },
    create: {
      userId,
      primaryGoal: input.primaryGoal,
      workPace: input.workPace,
      supportStyle: input.supportStyle,
      overloadTendency: input.overloadTendency,
      focusArea: input.focusArea,
    },
  });
}