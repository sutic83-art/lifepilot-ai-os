"use client";

import { useEffect, useState } from "react";

type EnergyResult = {
  energyLevel: "low" | "medium" | "high";
  signals: string[];
  recommendation: string;
};

type BurnoutResult = {
  burnoutRisk: "low" | "medium" | "high";
  reasons: string[];
  recommendation: string;
};

export default function EnergyPage() {
  const [energy, setEnergy] = useState<EnergyResult | null>(null);
  const [burnout, setBurnout] = useState<BurnoutResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        setLoading(true);
        setError("");

        const [energyRes, burnoutRes] = await Promise.all([
          fetch("/api/ai/energy"),
          fetch("/api/ai/burnout"),
        ]);

        const energyData = await energyRes.json();
        const burnoutData = await burnoutRes.json();

        if (!energyRes.ok) {
          throw new Error(energyData.error || "Energy failed.");
        }

        if (!burnoutRes.ok) {
          throw new Error(burnoutData.error || "Burnout failed.");
        }

        setEnergy(energyData);
        setBurnout(burnoutData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška.");
      } finally {
        setLoading(false);
      }
    };

    loadState();
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Energy & Burnout</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot procenjuje tvoje stanje, ne samo tvoje taskove.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje Energy Engine-a...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-3xl border border-red-300 p-6 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {energy && (
              <section className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Energy level</p>
                <h2 className="mt-2 text-2xl font-semibold">{energy.energyLevel}</h2>

                <div className="mt-4 space-y-3">
                  {energy.signals.map((signal) => (
                    <div key={signal} className="rounded-2xl border p-4">
                      {signal}
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border p-4">
                  {energy.recommendation}
                </div>
              </section>
            )}

            {burnout && (
              <section className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">Burnout risk</p>
                <h2 className="mt-2 text-2xl font-semibold">{burnout.burnoutRisk}</h2>

                <div className="mt-4 space-y-3">
                  {burnout.reasons.map((reason) => (
                    <div key={reason} className="rounded-2xl border p-4">
                      {reason}
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border p-4">
                  {burnout.recommendation}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}