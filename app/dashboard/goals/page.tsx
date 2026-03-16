"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

type Goal = {
  id: string;
  title: string;
  description?: string | null;
  area: string;
  progress: number;
  targetDate?: string | null;
};

type GoalFormState = {
  title: string;
  description: string;
  area: string;
  progress: number;
  targetDate: string;
};

const initialForm: GoalFormState = {
  title: "",
  description: "",
  area: "General",
  progress: 0,
  targetDate: "",
};

export default function GoalsPage() {
  const { t, locale } = useI18n();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [form, setForm] = useState<GoalFormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/goals");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load goals.");
      }

      setGoals(Array.isArray(json) ? json : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading goals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const createGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        area: form.area,
        progress: form.progress,
        targetDate: form.targetDate || undefined,
      };

      const res = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Goal creation failed.");
      }

      setForm(initialForm);
      setMessage(t.goalsPage.goalAdded);
      await loadGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Goal creation failed.");
    } finally {
      setSaving(false);
    }
  };

  const updateProgress = async (goal: Goal, nextProgress: number) => {
    try {
      setBusyId(goal.id);
      setError("");
      setMessage("");

      const res = await fetch(`/api/goals/${goal.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          progress: nextProgress,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Goal update failed.");
      }

      await loadGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Goal update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      setBusyId(goalId);
      setError("");
      setMessage("");

      const res = await fetch(`/api/goals/${goalId}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Goal delete failed.");
      }

      setMessage(t.goalsPage.goalDeleted);
      await loadGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Goal delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  const averageProgress =
    goals.length > 0
      ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
      : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">{t.nav.goals}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {t.goalsPage.title}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {t.goalsPage.subtitle}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">{t.goalsPage.total}</p>
          <h2 className="mt-2 text-2xl font-semibold">{goals.length}</h2>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {t.goalsPage.averageProgress}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{averageProgress}%</h2>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {t.goalsPage.highTraction}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {goals.filter((goal) => goal.progress >= 70).length}
          </h2>
        </div>
      </section>

      {error && (
        <section className="rounded-3xl border border-red-300 bg-card p-4 text-red-600">
          {error}
        </section>
      )}

      {message && (
        <section className="rounded-3xl border bg-card p-4 text-sm">
          {message}
        </section>
      )}

      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">{t.goalsPage.addGoal}</p>
        <h2 className="mt-2 text-2xl font-semibold">
          {t.goalsPage.createGoal}
        </h2>

        <form onSubmit={createGoal} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              {t.goalsPage.titleLabel}
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-2xl border px-4 py-3"
              placeholder={t.goalsPage.titleLabel}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              {t.goalsPage.descriptionLabel}
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="min-h-28 w-full rounded-2xl border px-4 py-3"
              placeholder={t.goalsPage.descriptionLabel}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.goalsPage.areaLabel}
            </label>
            <input
              value={form.area}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, area: e.target.value }))
              }
              className="w-full rounded-2xl border px-4 py-3"
              placeholder={t.goalsPage.areaLabel}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.goalsPage.progressLabel}
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={form.progress}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  progress: Number(e.target.value) || 0,
                }))
              }
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.goalsPage.targetDateLabel}
            </label>
            <input
              type="date"
              value={form.targetDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, targetDate: e.target.value }))
              }
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving || !form.title.trim()}
              className="w-full rounded-2xl bg-black px-6 py-3 text-white disabled:opacity-50"
            >
              {saving ? t.goalsPage.saving : t.goalsPage.addButton}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">{t.nav.goals}</p>
        <h2 className="mt-2 text-2xl font-semibold">{t.goalsPage.goalList}</h2>

        {loading ? (
          <div className="mt-6 rounded-2xl border p-4">
            {t.goalsPage.loading}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <div key={goal.id} className="rounded-2xl border p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{goal.title}</h3>
                        <span className="rounded-full border px-2 py-1 text-xs">
                          {goal.area}
                        </span>
                        <span className="rounded-full border px-2 py-1 text-xs">
                          {goal.progress}%
                        </span>
                      </div>

                      {goal.description && (
                        <p className="text-muted-foreground">{goal.description}</p>
                      )}

                      {goal.targetDate && (
                        <p className="text-sm text-muted-foreground">
                          {t.goalsPage.target}:{" "}
                          {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      )}

                      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-black"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          updateProgress(goal, Math.max(0, goal.progress - 10))
                        }
                        disabled={busyId !== null}
                        className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                      >
                        {busyId === goal.id ? t.goalsPage.saving : "-10%"}
                      </button>

                      <button
                        onClick={() =>
                          updateProgress(goal, Math.min(100, goal.progress + 10))
                        }
                        disabled={busyId !== null}
                        className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                      >
                        {busyId === goal.id ? t.goalsPage.saving : "+10%"}
                      </button>

                      <button
                        onClick={() => deleteGoal(goal.id)}
                        disabled={busyId !== null}
                        className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                      >
                        {busyId === goal.id
                          ? locale === "sr"
                            ? "Radim..."
                            : "Working..."
                          : t.goalsPage.delete}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border p-4">{t.goalsPage.noGoals}</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}