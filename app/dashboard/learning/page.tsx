"use client";

import { useEffect, useState } from "react";

type LearnedPattern = {
  actionType: string;
  helpfulCount: number;
  neutralCount: number;
  unhelpfulCount: number;
  score: number;
  recommendation: string;
};

type AdaptiveLearningResult = {
  summary: string;
  patterns: LearnedPattern[];
  nextSystemBehavior: string[];
};

export default function LearningPage() {
  const [data, setData] = useState<AdaptiveLearningResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLearning = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/learning");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Adaptive learning load failed.");
        }

        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška.");
      } finally {
        setLoading(false);
      }
    };

    loadLearning();
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adaptive Learning</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot počinje da uči koje akcije zaista pomažu ovom korisniku.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje adaptive learning sloja...
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

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Learned patterns</p>
              <div className="mt-4 space-y-4">
                {data.patterns.length > 0 ? (
                  data.patterns.map((pattern) => (
                    <div key={pattern.actionType} className="rounded-2xl border p-4">
                      <div className="font-semibold">{pattern.actionType}</div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Helpful: {pattern.helpfulCount} • Neutral: {pattern.neutralCount} • Unhelpful: {pattern.unhelpfulCount}
                      </div>
                      <div className="mt-2">Score: {pattern.score}</div>
                      <div className="mt-2">{pattern.recommendation}</div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border p-4">
                    Još nema dovoljno feedback podataka.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Next system behavior</p>
              <div className="mt-4 space-y-3">
                {data.nextSystemBehavior.map((item) => (
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