import { db } from "@/lib/db";

export type MemoryFact = {
  type: string;
  value: string;
};

export async function getUserMemoryFacts(userId: string): Promise<MemoryFact[]> {
  const tasks = await db.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const facts: MemoryFact[] = [];

  const completed = tasks.filter((t) => t.done).length;
  const open = tasks.filter((t) => !t.done).length;

  if (open > 8) {
    facts.push({
      type: "risk",
      value: "User tends to accumulate too many open tasks.",
    });
  }

  if (completed >= 5) {
    facts.push({
      type: "strength",
      value: "User can maintain momentum when task list is small.",
    });
  }

  return facts;
}