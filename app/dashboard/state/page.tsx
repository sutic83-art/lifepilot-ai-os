"use client";

import { useEffect, useState } from "react";

type Snapshot = {
  id: string;
  snapshotType: string;
  summary: string;
  executiveMode: string | null;
  energyLevel: string | null;
  burnoutRisk: string | null;
  payload: string;
  createdAt: string;
};

export default function StatePage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSnapshots = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ai/state");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load state snapshots.");
      }

      setSnapshots(data);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Greška.");
    } finally {
      setLoading(false);
    }
  };

  const saveSnapshot = async () => {
    try {
      setSaving(true);
      setMessage("");

      const res = await fetch("/api/ai/state", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save state snapshot.");
      }

      setMessage("State snapshot saved.");
      await loadSnapshots();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Greška pri čuvanju snapshot-a.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSnapshots();
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">State Persistence Layer</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot čuva istoriju OS stanja kroz vreme.
          </p>
        </div>

        <div className="rounded-3xl border p-6">
          <button
            onClick={saveSnapshot}
            disabled={saving}
            className="rounded-2xl bg-black px-5 py-3 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save current OS snapshot"}
          </button>

          {message && (
            <div className="mt-4 rounded-2xl border p-4 text-sm">
              {message}
            </div>
          )}
        </div>

        {loading ? (
          <div className="rounded-3xl border p-6">Loading snapshots...</div>
        ) : (
          <div className="space-y-4">
            {snapshots.length > 0 ? (
              snapshots.map((snapshot) => (
                <section key={snapshot.id} className="rounded-3xl border p-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="rounded-2xl border px-3 py-2 text-sm">
                      {snapshot.snapshotType}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(snapshot.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <h2 className="mt-4 text-xl font-semibold">{snapshot.summary}</h2>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border p-4">
                      Executive: {snapshot.executiveMode || "n/a"}
                    </div>
                    <div className="rounded-2xl border p-4">
                      Energy: {snapshot.energyLevel || "n/a"}
                    </div>
                    <div className="rounded-2xl border p-4">
                      Burnout: {snapshot.burnoutRisk || "n/a"}
                    </div>
                  </div>

                  <details className="mt-4 rounded-2xl border p-4">
                    <summary className="cursor-pointer font-medium">Raw payload</summary>
                    <pre className="mt-4 whitespace-pre-wrap text-xs">
                      {snapshot.payload}
                    </pre>
                  </details>
                </section>
              ))
            ) : (
              <div className="rounded-3xl border p-6">
                No snapshots yet.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}