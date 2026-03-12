import { db } from "@/lib/db";

export type WeeklyStrategy = {
  summary: string;
  priorities: string[];
  riskLevel: "low" | "medium" | "high";
};

export async function generateWeeklyStrategy(userId: string): Promise<WeeklyStrategy> {
  const tasks = await db.task.findMany({
    where: { userId }
  });

  const habits = await db.habit.findMany({
    where: { userId }
  });

  const openTasks = tasks.filter(t => !t.done).length;
  const completedTasks = tasks.filter(t => t.done).length;

  let riskLevel: "low" | "medium" | "high" = "low";
  const priorities: string[] = [];

  if (openTasks > 10) {
    riskLevel = "high";
    priorities.push("Zatvori stare taskove pre dodavanja novih.");
  }

  if (completedTasks < 3) {
    riskLevel = riskLevel === "high" ? "high" : "medium";
    priorities.push("Postavi manje, ali jasnije ciljeve za nedelju.");
  }

  if (habits.length === 0) {
    priorities.push("Dodaj bar jednu naviku koja podržava fokus ili zdravlje.");
  }

  if (priorities.length === 0) {
    priorities.push("Nastavi stabilan tempo i fokusiraj se na najvažnije ciljeve.");
  }

  return {
    summary: "Ovo je preporučena strategija za sledećih 7 dana.",
    priorities,
    riskLevel
  };
}