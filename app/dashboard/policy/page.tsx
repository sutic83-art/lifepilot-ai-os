"use client";

import { useEffect, useState } from "react";

type PersonalPolicyResult = {
  profile:
    | "steady_operator"
    | "gentle_rebuilder"
    | "ambitious_executor"
    | "overloaded_stabilizer";
  summary: string;
  guidanceStyle: string;
  planningIntensity: "low" | "medium" | "high";
  interventionStyle: "soft" | "balanced" | "strong";
  rules: string[];
  reasoning: string[];
};

export default function PolicyPage() {
  const [data, setData] = useState<PersonalPolicyResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/policy");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Policy load failed.");
        }

        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška.");
      } finally {
        setLoading(false);
      }
    };

    loadPolicy();
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal Policy Layer</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot određuje kojim stilom treba da vodi baš ovog korisnika.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje policy sloja...
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
              <p className="text-sm text-muted-foreground">Policy profile</p>
              <h2 className="mt-2 text-2xl font-semibold">{data.profile}</h2>
              <p className="mt-4">{data.summary}</p>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Guidance style</p>
              <div className="mt-3 rounded-2xl border p-4">{data.guidanceStyle}</div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border p-4">
                  Planning intensity: {data.planningIntensity}
                </div>
                <div className="rounded-2xl border p-4">
                  Intervention style: {data.interventionStyle}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <p className="text-sm text-muted-foreground">Policy rules</p>
              <div className="mt-4 space-y-3">
                {data.rules.map((item) => (
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