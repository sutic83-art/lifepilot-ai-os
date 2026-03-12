"use client";

import { useEffect, useState } from "react";

type ExecutiveResult = {
  mode: "stabilize" | "recover" | "execute" | "scale" | "reset";
  summary: string;
  directives: string[];
  risks: string[];
  reasoning: string[];
};

export default function ExecutivePage() {
  const [data, setData] = useState<ExecutiveResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExecutive = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/executive");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Executive load failed.");
        }

        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška.");
      } finally {
        setLoading(false);
      }
    };

    loadExecutive();
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Layer</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot određuje strateški režim narednih 7 dana.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje Executive Layer-a...
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
              <p className="text-sm text-muted-foreground">Mode</p>
              <h2 className="mt-2 text-2xl font-semibold">{data.mode}</h2>
              <p className="mt-4">{data.summary}</p>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Directives</p>
              <div className="mt-4 space-y-3">
                {data.directives.map((item) => (
                  <div key={item} className="rounded-2xl border p-4">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Risks</p>
              <div className="mt-4 space-y-3">
                {data.risks.map((item) => (
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