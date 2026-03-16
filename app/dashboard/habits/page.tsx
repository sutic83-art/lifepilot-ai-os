"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

type Habit = {
  id: string;
  title: string;
  frequency: string;
  streak: number;
  status: "GOOD" | "WARNING" | "GREAT";
};

type HabitFormState = {
  title: string;
  frequency: string;
};

const initialForm: HabitFormState = {
  title: "",
  frequency: "daily",
};

export default function HabitsPage() {
  const { t, locale } = useI18n();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [form, setForm] = useState<HabitFormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadHabits = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/habits");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load habits.");
      }

      setHabits(Array.isArray(json) ? json : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading habits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const createHabit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        title: form.title.trim(),
        frequency: form.frequency,
      };

      const res = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Habit creation failed.");
      }

      setForm(initialForm);
      setMessage(t.habitsPage.habitAdded);
      await loadHabits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Habit creation failed.");
    } finally {
      setSaving(false);
    }
  };

  const updateHabit = async (
    habit: Habit,
    changes: Partial<Pick<Habit, "streak" | "status">>
  ) => {
    try {
      setBusyId(habit.id);
      setError("");
      setMessage("");

      const res = await fetch(`/api/habits/${habit.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Habit update failed.");
      }

      await loadHabits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Habit update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      setBusyId(habitId);
      setError("");
      setMessage("");

      const res = await fetch(`/api/habits/${habitId}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Habit delete failed.");
      }

      setMessage(t.habitsPage.habitDeleted);
      await loadHabits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Habit delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  const greatHabits = habits.filter((habit) => habit.status === "GREAT").length;
  const warningHabits = habits.filter((habit) => habit.status === "WARNING").length;
  const bestStreak =
    habits.length > 0 ? Math.max(...habits.map((habit) => habit.streak)) : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">{t.nav.habits}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {t.habitsPage.title}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {t.habitsPage.subtitle}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">{t.habitsPage.total}</p>
          <h2 className="mt-2 text-2xl font-semibold">{habits.length}</h2>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {t.habitsPage.bestStreak}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{bestStreak}</h2>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {t.habitsPage.greatWarning}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {greatHabits} / {warningHabits}
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
        <p className="text-sm text-muted-foreground">{t.habitsPage.addHabit}</p>
        <h2 className="mt-2 text-2xl font-semibold">
          {t.habitsPage.createHabit}
        </h2>

        <form onSubmit={createHabit} className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.habitsPage.titleLabel}
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-2xl border px-4 py-3"
              placeholder={t.habitsPage.titleLabel}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.habitsPage.frequencyLabel}
            </label>
            <select
              value={form.frequency}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, frequency: e.target.value }))
              }
              className="w-full rounded-2xl border px-4 py-3"
            >
              <option value="daily">{locale === "sr" ? "dnevno" : "daily"}</option>
              <option value="weekly">{locale === "sr" ? "nedeljno" : "weekly"}</option>
              <option value="custom">{locale === "sr" ? "prilagođeno" : "custom"}</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving || !form.title.trim()}
              className="rounded-2xl bg-black px-6 py-3 text-white disabled:opacity-50"
            >
              {saving ? t.habitsPage.saving : t.habitsPage.addButton}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">{t.nav.habits}</p>
        <h2 className="mt-2 text-2xl font-semibold">{t.habitsPage.habitList}</h2>

        {loading ? (
          <div className="mt-6 rounded-2xl border p-4">
            {t.habitsPage.loading}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {habits.length > 0 ? (
              habits.map((habit) => (
                <div key={habit.id} className="rounded-2xl border p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{habit.title}</h3>
                        <span className="rounded-full border px-2 py-1 text-xs">
                          {habit.frequency}
                        </span>
                        <span className="rounded-full border px-2 py-1 text-xs">
                          {locale === "sr" ? "niz" : "streak"}: {habit.streak}
                        </span>
                        <span className="rounded-full border px-2 py-1 text-xs">
                          {habit.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          updateHabit(habit, {
                            streak: Math.max(0, habit.streak - 1),
                          })
                        }
                        disabled={busyId !== null}
                        className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                      >
                        {busyId === habit.id ? t.habitsPage.saving : "-1"}
                      </button>

                      <button
                        onClick={() =>
                          updateHabit(habit, {
                            streak: habit.streak + 1,
                          })
                        }
                        disabled={busyId !== null}
                        className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                      >
                        {busyId === habit.id ? t.habitsPage.saving : "+1"}
                      </button>

                      <button
                        onClick={() => updateHabit(habit, { status: "GOOD" })}
                        disabled={busyId !== null}
                        className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                      >
                        {busyId === habit.id ? t.habitsPage.saving : "GOOD"}
                      </button>

                      <button
                        onClick={() => updateHabit(habit, { status: "GREAT" })}
                        disabled={busyId !== null}
                        className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                      >
                        {busyId === habit.id ? t.habitsPage.saving : "GREAT"}
                      </button>

                      <button
                        onClick={() => updateHabit(habit, { status: "WARNING" })}
                        disabled={busyId !== null}
                        className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                      >
                        {busyId === habit.id ? t.habitsPage.saving : "WARNING"}
                      </button>

                      <button
                        onClick={() => deleteHabit(habit.id)}
                        disabled={busyId !== null}
                        className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                      >
                        {busyId === habit.id
                          ? locale === "sr"
                            ? "Radim..."
                            : "Working..."
                          : t.habitsPage.delete}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border p-4">
                {t.habitsPage.noHabits}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}