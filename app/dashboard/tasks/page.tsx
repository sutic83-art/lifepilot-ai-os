"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

type Task = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string | null;
  done: boolean;
};

type TaskFormState = {
  title: string;
  description: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string;
};

const initialForm: TaskFormState = {
  title: "",
  description: "",
  category: "General",
  priority: "MEDIUM",
  dueDate: "",
};

export default function TasksPage() {
  const { t, locale } = useI18n();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<TaskFormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/tasks");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load tasks.");
      }

      setTasks(Array.isArray(json) ? json : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        category: form.category,
        priority: form.priority,
        dueDate: form.dueDate || undefined,
      };

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Task creation failed.");
      }

      setForm(initialForm);
      setMessage(t.tasksPage.taskAdded);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Task creation failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      setBusyId(task.id);
      setError("");
      setMessage("");

      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          done: !task.done,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Task update failed.");
      }

      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Task update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setBusyId(taskId);
      setError("");
      setMessage("");

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Task delete failed.");
      }

      setMessage(t.tasksPage.taskDeleted);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Task delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  const openTasks = tasks.filter((task) => !task.done);
  const completedTasks = tasks.filter((task) => task.done);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">{t.nav.tasks}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {t.tasksPage.title}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {t.tasksPage.subtitle}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">{t.tasksPage.total}</p>
          <h2 className="mt-2 text-2xl font-semibold">{tasks.length}</h2>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">{t.tasksPage.open}</p>
          <h2 className="mt-2 text-2xl font-semibold">{openTasks.length}</h2>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {t.tasksPage.completed}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {completedTasks.length}
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
        <p className="text-sm text-muted-foreground">{t.tasksPage.addTask}</p>
        <h2 className="mt-2 text-2xl font-semibold">
          {t.tasksPage.createTask}
        </h2>

        <form onSubmit={createTask} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              {t.tasksPage.titleLabel}
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-2xl border px-4 py-3"
              placeholder={t.tasksPage.titleLabel}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              {t.tasksPage.descriptionLabel}
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="min-h-28 w-full rounded-2xl border px-4 py-3"
              placeholder={t.tasksPage.descriptionLabel}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.tasksPage.categoryLabel}
            </label>
            <input
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full rounded-2xl border px-4 py-3"
              placeholder={t.tasksPage.categoryLabel}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.tasksPage.priorityLabel}
            </label>
            <select
              value={form.priority}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  priority: e.target.value as "LOW" | "MEDIUM" | "HIGH",
                }))
              }
              className="w-full rounded-2xl border px-4 py-3"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.tasksPage.dueDateLabel}
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dueDate: e.target.value }))
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
              {saving ? t.tasksPage.saving : t.tasksPage.addButton}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">{t.tasksPage.open}</p>
        <h2 className="mt-2 text-2xl font-semibold">{t.tasksPage.taskList}</h2>

        {loading ? (
          <div className="mt-6 rounded-2xl border p-4">
            {t.tasksPage.loading}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="rounded-2xl border p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-lg font-semibold ${
                            task.done ? "line-through opacity-60" : ""
                          }`}
                        >
                          {task.title}
                        </h3>
                        <span className="rounded-full border px-2 py-1 text-xs">
                          {task.priority}
                        </span>
                        <span className="rounded-full border px-2 py-1 text-xs">
                          {task.category}
                        </span>
                        {task.done && (
                          <span className="rounded-full border px-2 py-1 text-xs">
                            {locale === "sr" ? "Završeno" : "Done"}
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-muted-foreground">{task.description}</p>
                      )}

                      {task.dueDate && (
                        <p className="text-sm text-muted-foreground">
                          {t.tasksPage.due}:{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => toggleTask(task)}
                        disabled={busyId !== null}
                        className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                      >
                        {busyId === task.id
                          ? t.tasksPage.saving
                          : task.done
                          ? t.tasksPage.markOpen
                          : t.tasksPage.markDone}
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        disabled={busyId !== null}
                        className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                      >
                        {busyId === task.id
                          ? locale === "sr"
                            ? "Radim..."
                            : "Working..."
                          : t.tasksPage.delete}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border p-4">{t.tasksPage.noTasks}</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}