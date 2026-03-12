import { db } from "@/lib/db";

export type Nudge = {
  message: string;
  type: "focus" | "health" | "risk" | "strategy";
};

export async function generateNudges(userId: string): Promise<Nudge[]> {
  const tasks = await db.task.findMany({
    where: { userId, done: false }
  });

  const habits = await db.habit.findMany({
    where: { userId }
  });

  const nudges: Nudge[] = [];

  const openTasks = tasks.length;
  const highPriority = tasks.filter(t => t.priority === "HIGH").length;

  if (openTasks > 8) {
    nudges.push({
      message: "Danas smanji listu i fokusiraj se na najviše 3 taska.",
      type: "focus"
    });
  }

  if (highPriority >= 3) {
    nudges.push({
      message: "Počni od najvažnijeg taska dok ti je pažnja sveža.",
      type: "strategy"
    });
  }

  if (habits.length === 0) {
    nudges.push({
      message: "Dodaj jednu malu dnevnu naviku da stabilizuješ ritam.",
      type: "health"
    });
  }

  if (nudges.length === 0) {
    nudges.push({
      message: "Nema većih upozorenja — održi stabilan tempo danas.",
      type: "strategy"
    });
  }

  return nudges;
}