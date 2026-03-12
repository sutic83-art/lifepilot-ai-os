"use client";

import { useEffect, useState } from "react";

type DecisionResult = {
  strategy: string;
  primaryAction: string;
  secondaryAction: string;
  riskLevel: "low" | "medium" | "high";
  reasoning: string[];
};

export default function DecisionPage() {
  const [decision, setDecision] = useState<DecisionResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDecision = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/decision");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Decision load failed.");
        }

        setDecision(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška.");
      } finally {
        setLoading(false);
      }
    };

    loadDecision();
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Decision Engine</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot bira najbolji sledeći pravac delovanja.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje AI odluke...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-3xl border border-red-300 p-6 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && decision && (
          <>
            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Strategy</p>
              <h2 className="mt-2 text-2xl font-semibold">{decision.strategy}</h2>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Primary action</p>
              <div className="mt-3 rounded-2xl border p-4">
                {decision.primaryAction}
              </div>

              <p className="mt-6 text-sm text-muted-foreground">Secondary action</p>
              <div className="mt-3 rounded-2xl border p-4">
                {decision.secondaryAction}
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Risk level</p>
              <div className="mt-3 rounded-2xl border p-4">
                {decision.riskLevel}
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Reasoning</p>
              <div className="mt-3 space-y-3">
                {decision.reasoning.map((item) => (
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