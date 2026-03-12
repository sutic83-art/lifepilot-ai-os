"use client";

import { useEffect, useState } from "react";

type Insight = {
  message: string;
  level: "info" | "warning" | "risk";
};

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/analyze");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load insights.");
        }

        setInsights(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška.");
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot prikazuje obrasce i signale iz tvog sistema rada.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje insights sloja...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-3xl border border-red-300 p-6 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div
                  key={`${insight.message}-${index}`}
                  className="rounded-2xl border p-4"
                >
                  <div className="text-sm text-muted-foreground">
                    {insight.level}
                  </div>
                  <div className="mt-2">{insight.message}</div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border p-4">
                Nema dovoljno podataka za insights.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
