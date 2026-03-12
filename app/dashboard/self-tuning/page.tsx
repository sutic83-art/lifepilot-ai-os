"use client";

import { useEffect, useState } from "react";

type SelfTuningResult = {
  adjustedPlanningIntensity: "low" | "medium" | "high";
  adjustedInterventionStyle: "soft" | "balanced" | "strong";
  systemMode: "protect" | "stabilize" | "execute" | "push";
  summary: string;
  adjustments: string[];
  reasoning: string[];
};

export default function SelfTuningPage() {
  const [data, setData] = useState<SelfTuningResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/self-tuning");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Self-tuning load failed.");
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
          <h1 className="text-3xl font-bold tracking-tight">Self-Tuning Layer</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot automatski podešava intenzitet i stil vođenja.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje self-tuning sloja...
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

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">System mode</p>
                <h3 className="mt-2 text-xl font-semibold">{data.systemMode}</h3>
              </div>

              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Planning intensity</p>
                <h3 className="mt-2 text-xl font-semibold">{data.adjustedPlanningIntensity}</h3>
              </div>

              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Intervention style</p>
                <h3 className="mt-2 text-xl font-semibold">{data.adjustedInterventionStyle}</h3>
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Adjustments</p>
              <div className="mt-4 space-y-3">
                {data.adjustments.map((item) => (
                  <div key={item} className="rounded-2xl border p-4">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Reasoning</p>
              <div className="mt-4 space-y-3">
                {data.reasoning.map((item) => (
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