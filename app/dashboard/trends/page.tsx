"use client";

import { useEffect, useState } from "react";

type TrendResult = {
  summary: string;
  direction: "improving" | "stable" | "declining";
  energyTrend: string;
  burnoutTrend: string;
  executiveTrend: string;
  signals: string[];
};

export default function TrendsPage() {
  const [data, setData] = useState<TrendResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/trends");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Trend load failed.");
        }

        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trend Intelligence Layer</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot poredi više OS snapshot-a i traži sistemske trendove.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje trend intelligence sloja...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-3xl border border-red-300 p-6 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <>
            <section className="rounded-3xl border p-6">
              <h2 className="text-2xl font-semibold">{data.summary}</h2>
            </section>

            <section className="grid gap-4 md:grid-cols-4">
              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Direction</p>
                <h3 className="mt-2 text-xl font-semibold">{data.direction}</h3>
              </div>

              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Energy trend</p>
                <h3 className="mt-2 text-xl font-semibold">{data.energyTrend}</h3>
              </div>

              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Burnout trend</p>
                <h3 className="mt-2 text-xl font-semibold">{data.burnoutTrend}</h3>
              </div>

              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Executive trend</p>
                <h3 className="mt-2 text-xl font-semibold">{data.executiveTrend}</h3>
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Signals</p>
              <div className="mt-4 space-y-3">
                {data.signals.map((item) => (
                  <div key={item} className="rounded-2xl border p-4">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}