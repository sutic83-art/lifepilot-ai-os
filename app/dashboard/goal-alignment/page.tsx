"use client";

import { useEffect, useState } from "react";

type GoalAlignmentResult = {
  summary: string;
  alignmentScore: number;
  primaryGoal: string;
  alignedTasks: string[];
  misalignedTasks: string[];
  busyworkSignals: string[];
  nextAdjustments: string[];
};

export default function GoalAlignmentPage() {
  const [data, setData] = useState<GoalAlignmentResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/goal-alignment");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Goal alignment load failed.");
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
          <h1 className="text-3xl font-bold tracking-tight">Goal Alignment Layer</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot proverava da li aktivni rad zaista vodi glavnim ciljevima.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje goal alignment sloja...
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
              <p className="text-sm text-muted-foreground">Primary goal</p>
              <h2 className="mt-2 text-2xl font-semibold">{data.primaryGoal}</h2>
              <p className="mt-4">{data.summary}</p>
              <div className="mt-4 rounded-2xl border p-4">
                Alignment score: {data.alignmentScore}%
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Aligned tasks</p>
                <div className="mt-4 space-y-3">
                  {data.alignedTasks.length > 0 ? (
                 data.alignedTasks.map((item, index) => (
                  <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                    {item}
                  </div>
                ))
                  ) : (
                    <div className="rounded-2xl border p-4">
                      No clearly aligned open tasks detected.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Misaligned tasks</p>
                <div className="mt-4 space-y-3">
                  {data.misalignedTasks.length > 0 ? (
                    data.misalignedTasks.map((item, index) => (
                      <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                        {item}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border p-4">
                      No strong misalignment signal detected.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Busywork signals</p>
              <div className="mt-4 space-y-3">
                {data.busyworkSignals.map((item) => (
                  <div key={item} className="rounded-2xl border p-4">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Next adjustments</p>
              <div className="mt-4 space-y-3">
                {data.nextAdjustments.map((item) => (
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