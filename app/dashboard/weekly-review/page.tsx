"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LoadingCard } from "@/components/ui/loading-card";
import { ErrorCard } from "@/components/ui/error-card";
import { SectionCard } from "@/components/ui/section-card";
import { fetchJson } from "@/lib/api/fetch-json";

type WeeklyOperatingReviewResult = {
  summary: string;
  weeklyMode: "protect" | "stabilize" | "execute" | "scale" | "reset";
  keyMessage: string;
  wins: string[];
  risks: string[];
  adjustments: string[];
  operatingDirectives: string[];
  reasoning: string[];
};

export default function WeeklyReviewPage() {
  const [data, setData] = useState<WeeklyOperatingReviewResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const json = await fetchJson<WeeklyOperatingReviewResult>(
          "/api/ai/weekly-operating-review"
        );

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
    <DashboardShell
      title="Weekly Operating Review"
      description="LifePilot sastavlja nedeljni operativni memo sistema."
    >
      {loading && <LoadingCard message="Učitavanje weekly operating review-a..." />}
      {error && !loading && <ErrorCard message={error} />}

      {!loading && !error && data && (
        <>
          <SectionCard subtitle="Weekly mode" title={data.weeklyMode}>
            <p>{data.summary}</p>
            <div className="mt-4 rounded-2xl border p-4">
              <span className="font-medium">Key message:</span> {data.keyMessage}
            </div>
          </SectionCard>

          <section className="grid gap-6 lg:grid-cols-2">
            <SectionCard subtitle="Wins">
              <div className="space-y-3">
                {data.wins.map((item, index) => (
                  <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                    {item}
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard subtitle="Risks">
              <div className="space-y-3">
                {data.risks.map((item, index) => (
                  <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                    {item}
                  </div>
                ))}
              </div>
            </SectionCard>
          </section>

          <SectionCard subtitle="Adjustments">
            <div className="space-y-3">
              {data.adjustments.map((item, index) => (
                <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                  {item}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard subtitle="Operating directives">
            <div className="space-y-3">
              {data.operatingDirectives.map((item, index) => (
                <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                  {item}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard subtitle="Reasoning">
            <div className="space-y-3">
              {data.reasoning.map((item, index) => (
                <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                  {item}
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}
    </DashboardShell>
  );
}