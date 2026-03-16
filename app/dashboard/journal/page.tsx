"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

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
  const { t, locale } = useI18n();

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
      setError(err instanceof Error ? err.message : "Journal load failed.");
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
      setMessage(t.journalPage.entrySaved);
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Journal save failed.");
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

      setMessage(t.journalPage.entryDeleted);
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Journal delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">{t.nav.journal}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {t.journalPage.title}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {t.journalPage.subtitle}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">{t.journalPage.entries}</p>
          <h2 className="mt-2 text-2xl font-semibold">{entries.length}</h2>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {t.journalPage.latestMood}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {entries[0]?.mood || "—"}
          </h2>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {t.journalPage.writingStatus}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {entries.length > 0 ? t.journalPage.active : t.journalPage.empty}
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
        <p className="text-sm text-muted-foreground">{t.journalPage.newEntry}</p>
        <h2 className="mt-2 text-2xl font-semibold">
          {t.journalPage.writeReflection}
        </h2>

        <form onSubmit={createEntry} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.journalPage.titleLabel}
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-2xl border px-4 py-3"
              placeholder={t.journalPage.titleLabel}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.journalPage.moodLabel}
            </label>
            <input
              value={form.mood}
              onChange={(e) => setForm((prev) => ({ ...prev, mood: e.target.value }))}
              className="w-full rounded-2xl border px-4 py-3"
              placeholder={t.journalPage.moodLabel}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.journalPage.contentLabel}
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              className="min-h-40 w-full rounded-2xl border px-4 py-3"
              placeholder={t.journalPage.contentLabel}
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving || !form.content.trim()}
            className="rounded-2xl bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {saving ? t.journalPage.saving : t.journalPage.saveEntry}
          </button>
        </form>
      </section>

      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">{t.journalPage.history}</p>
        <h2 className="mt-2 text-2xl font-semibold">
          {t.journalPage.recentEntries}
        </h2>

        {loading ? (
          <div className="mt-6 rounded-2xl border p-4">
            {t.journalPage.loading}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <div key={entry.id} className="rounded-2xl border p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {entry.title || t.journalPage.untitled}
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
                        {busyId === entry.id
                          ? locale === "sr"
                            ? "Radim..."
                            : "Working..."
                          : locale === "sr"
                          ? "Obriši"
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border p-4">
                {t.journalPage.noEntries}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}