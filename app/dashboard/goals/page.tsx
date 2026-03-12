"use client";

import { useEffect, useState } from "react";

type Goal = {
  id: string;
  title: string;
  description?: string | null;
  area: string;
  progress: number;
  targetDate?: string | null;
};

const AREA_OPTIONS = [
  "BUSINESS",
  "HEALTH",
  "FINANCE",
  "PERSONAL",
  "LEARNING",
];

export default function GoalsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("BUSINESS");
  const [progress, setProgress] = useState(0);
  const [targetDate, setTargetDate] = useState("");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      const data = await res.json();

      if (Array.isArray(data)) {
        setGoals(data);
      } else {
        setMessage(data.error || "Greška pri učitavanju ciljeva.");
      }
    } catch {
      setMessage("Greška pri učitavanju ciljeva.");
    }
  };

  const createGoal = async () => {
    setMessage("");

    const cleanTitle = title.trim();
    const cleanArea = area.trim();

    if (!cleanTitle) {
      setMessage("Naslov cilja je obavezan.");
      return;
    }

    if (!cleanArea) {
      setMessage("Oblast cilja je obavezna.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: cleanTitle,
          description: description.trim(),
          area: cleanArea,
          progress,
          targetDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Cilj nije sačuvan.");
        return;
      }

      setTitle("");
      setDescription("");
      setArea("BUSINESS");
      setProgress(0);
      setTargetDate("");
      setMessage("Cilj je uspešno sačuvan.");
      await loadGoals();
    } catch {
      setMessage("Greška pri čuvanju cilja.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="mt-2 text-muted-foreground">
            Dodaj cilj sa validnim podacima.
          </p>
        </div>

        <div className="rounded-3xl border p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Naslov cilja</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Unesi cilj"
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Opis</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opcioni opis"
              className="min-h-24 w-full rounded-2xl border px-4 py-3"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Oblast</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3"
              >
                {AREA_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Napredak (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ciljni datum</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
          </div>

          <button
            onClick={createGoal}
            disabled={loading || !title.trim() || !area.trim()}
            className="rounded-2xl bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Čuvanje..." : "Sačuvaj cilj"}
          </button>

          {message && (
            <div className="rounded-2xl border px-4 py-3 text-sm">
              {message}
            </div>
          )}
        </div>

        <div className="rounded-3xl border p-6">
          <h2 className="mb-4 text-xl font-semibold">Lista ciljeva</h2>

          <div className="space-y-3">
            {goals.length === 0 ? (
              <div className="rounded-2xl border p-4 text-muted-foreground">
                Još nema ciljeva.
              </div>
            ) : (
              goals.map((goal) => (
                <div
                  key={goal.id}
                  className="rounded-2xl border p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-medium">{goal.title}</p>
                    {goal.description ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {goal.description}
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {goal.area} • {goal.progress}%
                    </p>
                    {goal.targetDate ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
