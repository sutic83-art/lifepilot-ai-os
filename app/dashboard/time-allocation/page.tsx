"use client";

import { useEffect, useState } from "react";

type TimeBlock = {
  label: string;
  durationMinutes: number;
  purpose: string;
  intensity: "low" | "medium" | "high";
};

type TimeAllocationResult = {
  summary: string;
  recommendedDayType: "light" | "balanced" | "deep-work";
  totalPlannedMinutes: number;
  blocks: TimeBlock[];
  reasoning: string[];
};

export default function TimeAllocationPage() {
  const [data, setData] = useState<TimeAllocationResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/time-allocation");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Time allocation load failed.");
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
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar / Time Allocation Layer</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot predlaže raspodelu vremena i fokus blokova za dan.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje time allocation sloja...
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
              <p className="text-sm text-muted-foreground">Recommended day type</p>
              <h2 className="mt-2 text-2xl font-semibold">{data.recommendedDayType}</h2>
              <p className="mt-4">{data.summary}</p>
              <div className="mt-4 rounded-2xl border p-4">
                Total planned minutes: {data.totalPlannedMinutes}
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Time blocks</p>
              <div className="mt-4 space-y-4">
                {data.blocks.map((block, index) => (
                  <div key={`${block.label}-${index}`} className="rounded-2xl border p-4">
                    <div className="font-semibold">{block.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {block.durationMinutes} min • intensity: {block.intensity}
                    </div>
                    <div className="mt-2">{block.purpose}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Reasoning</p>
              <div className="mt-4 space-y-3">
                {data.reasoning.map((item, index) => (
                  <div key={`${item}-${index}`} className="rounded-2xl border p-4">
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