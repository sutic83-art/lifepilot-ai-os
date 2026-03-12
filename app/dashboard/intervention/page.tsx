"use client";

import { useEffect, useState } from "react";

type InterventionResult = {
  interventionNeeded: boolean;
  interventionLevel: "none" | "soft" | "moderate" | "strong";
  interventionType: "none" | "nudge" | "correction" | "protective" | "reset";
  headline: string;
  message: string;
  actions: string[];
  reasoning: string[];
};

export default function InterventionPage() {
  const [data, setData] = useState<InterventionResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/intervention");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Intervention load failed.");
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
          <h1 className="text-3xl font-bold tracking-tight">Intervention Layer</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot određuje kada treba reagovati i koliko snažno.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje intervention sloja...
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
              <p className="text-sm text-muted-foreground">Intervention status</p>
              <h2 className="mt-2 text-2xl font-semibold">{data.headline}</h2>
              <p className="mt-4">{data.message}</p>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Needed</p>
                <h3 className="mt-2 text-xl font-semibold">
                  {data.interventionNeeded ? "Yes" : "No"}
                </h3>
              </div>

              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Level</p>
                <h3 className="mt-2 text-xl font-semibold">{data.interventionLevel}</h3>
              </div>

              <div className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Type</p>
                <h3 className="mt-2 text-xl font-semibold">{data.interventionType}</h3>
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Actions</p>
              <div className="mt-4 space-y-3">
                {data.actions.map((item, index) => (
                  <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                    {item}
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