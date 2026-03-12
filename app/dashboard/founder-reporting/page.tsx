"use client";

import { useEffect, useState } from "react";
import { LoadingCard } from "@/components/ui/loading-card";
import { ErrorCard } from "@/components/ui/error-card";
import { SectionCard } from "@/components/ui/section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { fetchJson } from "@/lib/api/fetch-json";
import type { FounderReportingResult } from "@/lib/types/founder-reporting";

export default function FounderReportingPage() {
  const [data, setData] = useState<FounderReportingResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const json = await fetchJson<FounderReportingResult>("/api/ai/founder-reporting");
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
      title="Founder Reporting Layer"
      description="Pogled na stvarnu upotrebu LifePilot OS sistema."
    >
      {loading && <LoadingCard message="Učitavanje founder reporting sloja..." />}
      {error && !loading && <ErrorCard message={error} />}

      {!loading && !error && data && (
        <>
          <SectionCard>
            <h2 className="text-2xl font-semibold">{data.summary}</h2>
            <div className="mt-4 rounded-2xl border p-4">
              System health: {data.systemHealth}
            </div>
          </SectionCard>

          <section className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <SectionCard>
              <div>Tasks: {data.totalTasks}</div>
            </SectionCard>
            <SectionCard>
              <div>Goals: {data.totalGoals}</div>
            </SectionCard>
            <SectionCard>
              <div>Habits: {data.totalHabits}</div>
            </SectionCard>
            <SectionCard>
              <div>Reviews: {data.totalReviews}</div>
            </SectionCard>
            <SectionCard>
              <div>Snapshots: {data.totalSnapshots}</div>
            </SectionCard>
          </section>

          <section className="grid gap-4 md:grid-cols-4">
            <SectionCard>
              <div>Action feedback: {data.actionFeedbackCount}</div>
            </SectionCard>
            <SectionCard>
              <div>Helpful: {data.helpfulFeedbackCount}</div>
            </SectionCard>
            <SectionCard>
              <div>Neutral: {data.neutralFeedbackCount}</div>
            </SectionCard>
            <SectionCard>
              <div>Unhelpful: {data.unhelpfulFeedbackCount}</div>
            </SectionCard>
          </section>

          <SectionCard subtitle="Signals">
            <div className="space-y-3">
              {data.signals.map((item, index) => (
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