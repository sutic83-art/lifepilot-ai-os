import { buildUserContext } from "./context-builder";
import { generateDailyPlan } from "./planner";
import { runConstitutionChecks } from "./constitution";

export async function generateDailyPlanForUser(userId: string) {

  const context = await buildUserContext(userId);

  const draft = await generateDailyPlan(context);

  const finalPlan = runConstitutionChecks(draft);

  return finalPlan;
}