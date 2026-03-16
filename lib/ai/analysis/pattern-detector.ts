import { db } from "@/lib/db";

export type BehaviorInsight = {
  message: string;
  level: "info" | "warning" | "risk";
};

export type SupportedLocale = "en" | "sr";

function normalizeLocale(locale?: string): SupportedLocale {
  return locale === "sr" ? "sr" : "en";
}

function t(locale: SupportedLocale, en: string, sr: string) {
  return locale === "sr" ? sr : en;
}

export async function analyzeUserBehavior(
  userId: string,
  localeInput?: string
) {
  const locale = normalizeLocale(localeInput);

  const tasks = await db.task.findMany({
    where: { userId },
  });

  const habits = await db.habit.findMany({
    where: { userId },
  });

  const goals = await db.goal.findMany({
    where: { userId },
  });

  const insights: BehaviorInsight[] = [];

  const openTasks = tasks.filter((t) => !t.done).length;
  const completedTasks = tasks.filter((t) => t.done).length;
  const weakHabits = habits.filter(
    (h) => h.status === "WARNING" || h.streak <= 1
  ).length;
  const lowProgressGoals = goals.filter((g) => g.progress < 30).length;

  if (openTasks > 10) {
    insights.push({
      message: t(
        locale,
        "A high number of open tasks may reduce focus and create a sense of overload.",
        "Veliki broj otvorenih taskova može smanjiti fokus i stvoriti osećaj preopterećenja."
      ),
      level: "warning",
    });
  }

  if (completedTasks >= 5) {
    insights.push({
      message: t(
        locale,
        "A solid execution pace suggests the system can support steady progress.",
        "Dobar tempo izvršenja pokazuje da sistem može da podrži stabilan napredak."
      ),
      level: "info",
    });
  }

  if (weakHabits >= 2) {
    insights.push({
      message: t(
        locale,
        "Several habits appear unstable, which may affect rhythm and discipline.",
        "Više navika deluje nestabilno, što može da utiče na ritam i disciplinu."
      ),
      level: "warning",
    });
  }

  if (lowProgressGoals >= 2) {
    insights.push({
      message: t(
        locale,
        "Multiple goals show low progress, which may indicate drift or diluted focus.",
        "Više ciljeva ima nizak progress, što može značiti drift ili razvodnjen fokus."
      ),
      level: "risk",
    });
  }

  if (insights.length === 0) {
    insights.push({
      message: t(
        locale,
        "There are no strong negative signals right now. The system appears relatively stable.",
        "Nema jakih negativnih signala. Sistem trenutno deluje relativno stabilno."
      ),
      level: "info",
    });
  }

  return insights;
}