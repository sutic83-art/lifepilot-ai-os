"use client";

import { useEffect, useState } from "react";

type RetrospectiveResult = {
  summary: string;
  wins: string[];
  regressions: string[];
  lessons: string[];
  nextWeekAdjustments: string[];
};

export default function RetrospectivePage() {
  const [data, setData] = useState<RetrospectiveResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/retrospective");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Retrospective load failed.");
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
          <h1 className="text-3xl font-bold tracking-tight">Retrospective Intelligence Layer</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot pravi retrospektivu sistema i predlaže sledeće korekcije.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje retrospective intelligence sloja...
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

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Wins</p>
                <div className="mt-4 space-y-3">
                  {data.wins.map((item) => (
                    <div key={item} className="rounded-2xl border p-4">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Regressions</p>
                <div className="mt-4 space-y-3">
                  {data.regressions.map((item) => (
                    <div key={item} className="rounded-2xl border p-4">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Lessons</p>
              <div className="mt-4 space-y-3">
                {data.lessons.map((item) => (
                  <div key={item} className="rounded-2xl border p-4">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Next week adjustments</p>
              <div className="mt-4 space-y-3">
                {data.nextWeekAdjustments.map((item) => (
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