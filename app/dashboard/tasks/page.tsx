"use client";

import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  done: boolean;
};

const CATEGORY_OPTIONS = ["GENERAL", "WORK", "HEALTH", "FINANCE", "PERSONAL"];
const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"] as const;

export default function TasksPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();

      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setMessage(data.error || "Greška pri učitavanju taskova.");
      }
    } catch {
      setMessage("Greška pri učitavanju taskova.");
    }
  };

  const createTask = async () => {
    setMessage("");

    const cleanTitle = title.trim();
    const cleanCategory = category.trim();

    if (!cleanTitle) {
      setMessage("Naslov taska je obavezan.");
      return;
    }

    if (!cleanCategory) {
      setMessage("Kategorija je obavezna.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: cleanTitle,
          description: description.trim(),
          category: cleanCategory,
          priority,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Task nije sačuvan.");
        return;
      }

      setTitle("");
      setDescription("");
      setCategory("GENERAL");
      setPriority("MEDIUM");
      setMessage("Task je uspešno sačuvan.");
      await loadTasks();
    } catch {
      setMessage("Greška pri čuvanju taska.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="mt-2 text-muted-foreground">
            Dodaj task sa validnim vrednostima.
          </p>
        </div>

        <div className="rounded-3xl border p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Naslov taska</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Unesi task"
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategorija</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Prioritet</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
                className="w-full rounded-2xl border px-4 py-3"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={createTask}
            disabled={loading || !title.trim() || !category.trim()}
            className="rounded-2xl bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Čuvanje..." : "Sačuvaj task"}
          </button>

          {message && (
            <div className="rounded-2xl border px-4 py-3 text-sm">
              {message}
            </div>
          )}
        </div>

        <div className="rounded-3xl border p-6">
          <h2 className="mb-4 text-xl font-semibold">Lista taskova</h2>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="rounded-2xl border p-4 text-muted-foreground">
                Još nema taskova.
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    {task.description ? (
                      <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                    ) : null}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {task.category} • {task.priority}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {task.done ? "Done" : "Open"}
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
