"use client";

import { useEffect, useState } from "react";

type ConsolidatedMemoryItem = {
  type: string;
  statement: string;
  confidence: "low" | "medium" | "high";
};

type MemoryConsolidationResult = {
  summary: string;
  identityModel: string[];
  operatingTraits: ConsolidatedMemoryItem[];
  stablePreferences: ConsolidatedMemoryItem[];
  riskMemory: ConsolidatedMemoryItem[];
  actionMemory: ConsolidatedMemoryItem[];
};

function MemoryList({
  title,
  items,
}: {
  title: string;
  items: ConsolidatedMemoryItem[];
}) {
  return (
    <section className="rounded-3xl border p-6">
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div key={`${item.type}-${index}`} className="rounded-2xl border p-4">
            <div className="font-medium">{item.statement}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Type: {item.type} • Confidence: {item.confidence}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function MemoryConsolidationPage() {
  const [data, setData] = useState<MemoryConsolidationResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/memory-consolidation");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Memory consolidation load failed.");
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
          <h1 className="text-3xl font-bold tracking-tight">Memory Consolidation Layer</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot pretvara rasute signale u stabilniji operativni model korisnika.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje memory consolidation sloja...
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
              <p className="text-sm text-muted-foreground">Identity model</p>
              <div className="mt-4 space-y-3">
                {data.identityModel.map((item, index) => (
                  <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <MemoryList title="Operating traits" items={data.operatingTraits} />
            <MemoryList title="Stable preferences" items={data.stablePreferences} />
            <MemoryList title="Risk memory" items={data.riskMemory} />
            <MemoryList title="Action memory" items={data.actionMemory} />
          </>
        )}
      </div>
    </main>
  );
}