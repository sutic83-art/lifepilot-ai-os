"use client";

import { useEffect, useState } from "react";

type OrchestratorResult = {
  summary: string;
  todayFocus: string[];
  majorRisk: string;
  executiveMode: string;
  energyLevel: string;
  burnoutRisk: string;
  decision: {
    strategy: string;
    primaryAction: string;
    secondaryAction: string;
  };
  policy: {
    profile: string;
    planningIntensity: string;
    interventionStyle: string;
  };
  learning: {
    summary: string;
    topPattern: string;
  };
  actions: Array<{
    type: string;
    title: string;
    description: string;
    reason: string;
  }>;
  reasoning: string[];
};

export default function OrchestratorPage() {
  const [data, setData] = useState<OrchestratorResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/orchestrator");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Orchestrator load failed.");
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
          <h1 className="text-3xl font-bold tracking-tight">Unified Orchestrator</h1>
          <p className="mt-2 text-muted-foreground">
            Centralni LifePilot mozak koji objedinjuje sve AI slojeve.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje orchestrator sloja...
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
              <p className="mt-4 text-sm text-muted-foreground">
                Major risk: {data.majorRisk}
              </p>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Executive mode</p>
                <h3 className="mt-2 text-xl font-semibold">{data.executiveMode}</h3>
              </div>

              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Energy level</p>
                <h3 className="mt-2 text-xl font-semibold">{data.energyLevel}</h3>
              </div>

              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Burnout risk</p>
                <h3 className="mt-2 text-xl font-semibold">{data.burnoutRisk}</h3>
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Today focus</p>
              <div className="mt-4 space-y-3">
                {data.todayFocus.map((item) => (
                  <div key={item} className="rounded-2xl border p-4">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Decision</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border p-4">
                  Strategy: {data.decision.strategy}
                </div>
                <div className="rounded-2xl border p-4">
                  Primary action: {data.decision.primaryAction}
                </div>
                <div className="rounded-2xl border p-4">
                  Secondary action: {data.decision.secondaryAction}
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Policy</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border p-4">
                    Profile: {data.policy.profile}
                  </div>
                  <div className="rounded-2xl border p-4">
                    Planning intensity: {data.policy.planningIntensity}
                  </div>
                  <div className="rounded-2xl border p-4">
                    Intervention style: {data.policy.interventionStyle}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Learning</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border p-4">
                    {data.learning.summary}
                  </div>
                  <div className="rounded-2xl border p-4">
                    Top pattern: {data.learning.topPattern}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Action proposals</p>
              <div className="mt-4 space-y-3">
                {data.actions.map((action) => (
                  <div key={action.title} className="rounded-2xl border p-4">
                    <div className="font-semibold">{action.title}</div>
                    <div className="mt-2 text-sm text-muted-foreground">{action.type}</div>
                    <div className="mt-2">{action.description}</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Reason: {action.reason}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">System reasoning</p>
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