import { db } from "@/lib/db";
import type { UserContext } from "./types";

export async function buildUserContext(userId: string): Promise<UserContext> {

  const tasks = await db.task.findMany({
    where: { userId, done: false }
  });

  const openTasks = tasks.length;

  const highPriorityTasks = tasks.filter(
    (t) => t.priority === "HIGH"
  ).length;

  const risks: string[] = [];

  if (openTasks > 8) {
    risks.push("Too many open tasks");
  }

  return {
    userId,
    userName: "User",
    energy: "medium",
    openTasks,
    highPriorityTasks,
    risks
  };
}