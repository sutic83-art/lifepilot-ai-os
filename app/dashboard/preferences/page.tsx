"use client";

import { useEffect, useState } from "react";

type Preferences = {
  planningMode: "gentle" | "balanced" | "ambitious";
  tone: "direct" | "supportive";
  workStyle: "focused" | "flexible";
};

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<Preferences>({
    planningMode: "balanced",
    tone: "direct",
    workStyle: "focused",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/ai/preferences")
      .then((res) => res.json())
      .then((data) => {
        if (data?.planningMode) {
          setPreferences(data);
        }
      });
  }, []);

  const save = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/ai/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(preferences),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Save failed");
      }

      setMessage("Preferences saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Greška.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preferences</h1>
          <p className="mt-2 text-muted-foreground">
            Prilagodi način na koji LifePilot planira za tebe.
          </p>
        </div>

        <div className="rounded-3xl border p-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Planning mode</label>
            <select
              value={preferences.planningMode}
              onChange={(e) =>
                setPreferences({ ...preferences, planningMode: e.target.value as Preferences["planningMode"] })
              }
              className="w-full rounded-2xl border px-4 py-3"
            >
              <option value="gentle">Gentle</option>
              <option value="balanced">Balanced</option>
              <option value="ambitious">Ambitious</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Tone</label>
            <select
              value={preferences.tone}
              onChange={(e) =>
                setPreferences({ ...preferences, tone: e.target.value as Preferences["tone"] })
              }
              className="w-full rounded-2xl border px-4 py-3"
            >
              <option value="direct">Direct</option>
              <option value="supportive">Supportive</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Work style</label>
            <select
              value={preferences.workStyle}
              onChange={(e) =>
                setPreferences({ ...preferences, workStyle: e.target.value as Preferences["workStyle"] })
              }
              className="w-full rounded-2xl border px-4 py-3"
            >
              <option value="focused">Focused</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <button
            onClick={save}
            disabled={loading}
            className="rounded-2xl bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save preferences"}
          </button>

          {message && (
            <div className="rounded-2xl border p-4 text-sm">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}