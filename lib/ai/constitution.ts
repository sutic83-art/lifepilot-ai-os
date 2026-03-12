import type { DraftDailyPlan, FinalDailyPlan } from "./types";

export function runConstitutionChecks(
  plan: DraftDailyPlan
): FinalDailyPlan {

  const notes: string[] = [];
  let safe = true;

  if (plan.priorities.length > 5) {
    safe = false;
    notes.push("Too many priorities suggested");
  }

  return {
    ...plan,
    safe,
    constitutionalNotes: notes
  };
}