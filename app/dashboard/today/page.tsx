"use client";

import { useEffect, useState } from "react";

type DailyPlan = {
  summary: string;
  priorities: string[];
  risks: string[];
  safe: boolean;
  constitutionalNotes: string[];
};

export default function TodayPage() {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/daily-plan");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Greška pri učitavanju plana.");
        }

        setPlan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška.");
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Today</h1>
          <p className="mt-2 text-muted-foreground">
            Tvoj prvi LifePilot AI daily plan.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje plana...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-3xl border border-red-300 p-6 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && plan && (
          <div className="space-y-6">
            <section className="rounded-3xl border p-6">
              <h2 className="text-2xl font-semibold">{plan.summary}</h2>
            </section>

            <section className="rounded-3xl border p-6">
              <h3 className="mb-4 text-xl font-semibold">Prioriteti</h3>
              <div className="space-y-3">
                {plan.priorities.map((item) => (
                  <div key={item} className="rounded-2xl border p-4">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <h3 className="mb-4 text-xl font-semibold">Rizici</h3>
              <div className="space-y-3">
                {plan.risks.length > 0 ? (
                  plan.risks.map((item) => (
                    <div key={item} className="rounded-2xl border p-4">
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border p-4">
                    Nema većih rizika.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <h3 className="mb-4 text-xl font-semibold">Constitution status</h3>
              <div className="rounded-2xl border p-4">
                {plan.safe ? "Plan je prošao safety proveru." : "Plan je korigovan."}
              </div>

              {plan.constitutionalNotes.length > 0 && (
                <div className="mt-4 space-y-2">
                  {plan.constitutionalNotes.map((note) => (
                    <div key={note} className="rounded-2xl border p-4 text-sm">
                      {note}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}