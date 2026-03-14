"use client";

import { useEffect, useState } from "react";

type JournalEntry = {
  id: string;
  title?: string | null;
  content: string;
  mood?: string | null;
  createdAt: string;
};

type JournalFormState = {
  title: string;
  content: string;
  mood: string;
};

const initialForm: JournalFormState = {
  title: "",
  content: "",
  mood: "",
};

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [form, setForm] = useState<JournalFormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/journal");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load journal.");
      }

      setEntries(Array.isArray(json) ? json : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Greška pri učitavanju journal-a."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const createEntry = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        title: form.title.trim() || undefined,
        content: form.content.trim(),
        mood: form.mood.trim() || undefined,
      };

      const res = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Journal save failed.");
      }

      setForm(initialForm);
      setMessage("Journal entry saved.");
      await loadEntries();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Greška pri čuvanju journal entry."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async (entryId: string) => {
    try {
      setBusyId(entryId);
      setError("");
      setMessage("");

      const res = await fetch(`/api/journal/${entryId}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Journal delete failed.");
      }

      setMessage("Journal entry deleted.");
      await loadEntries();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Greška pri brisanju journal entry."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">Journal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Reflection Journal</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Zabeleži misli, stanje, uvide i dnevne refleksije da bi LifePilot bolje
          razumeo tvoj ritam i pomagao ti preciznije.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Entries</p>
          <h2 className="mt-2 text-2xl font-semibold">{entries.length}</h2>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Latest mood</p>
          <h2 className="mt-2 text-2xl font-semibold">
            {entries[0]?.mood || "—"}
          </h2>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Writing status</p>
          <h2 className="mt-2 text-2xl font-semibold">
            {entries.length > 0 ? "Active" : "Empty"}
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
        <p className="text-sm text-muted-foreground">New entry</p>
        <h2 className="mt-2 text-2xl font-semibold">Write today’s reflection</h2>

        <form onSubmit={createEntry} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-2xl border px-4 py-3"
              placeholder="Optional entry title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Mood</label>
            <input
              value={form.mood}
              onChange={(e) => setForm((prev) => ({ ...prev, mood: e.target.value }))}
              className="w-full rounded-2xl border px-4 py-3"
              placeholder="Calm, focused, tired, motivated..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              className="min-h-40 w-full rounded-2xl border px-4 py-3"
              placeholder="What happened today? What felt heavy? What worked? What should change tomorrow?"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving || !form.content.trim()}
            className="rounded-2xl bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save entry"}
          </button>
        </form>
      </section>

      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">History</p>
        <h2 className="mt-2 text-2xl font-semibold">Recent entries</h2>

        {loading ? (
          <div className="mt-6 rounded-2xl border p-4">Učitavanje journal unosa...</div>
        ) : (
          <div className="mt-6 space-y-4">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <div key={entry.id} className="rounded-2xl border p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {entry.title || "Untitled entry"}
                        </h3>
                        {entry.mood && (
                          <span className="rounded-full border px-2 py-1 text-xs">
                            {entry.mood}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>

                      <p className="whitespace-pre-wrap text-muted-foreground">
                        {entry.content}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        disabled={busyId !== null}
                        className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                      >
                        {busyId === entry.id ? "Working..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border p-4">
                Nema journal unosa. Dodaj prvi zapis iz forme iznad.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
