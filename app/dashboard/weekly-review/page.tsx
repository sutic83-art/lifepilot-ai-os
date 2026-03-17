"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LoadingCard } from "@/components/ui/loading-card";
import { ErrorCard } from "@/components/ui/error-card";
import { SectionCard } from "@/components/ui/section-card";
import { useI18n } from "@/lib/i18n/context";

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
  const { locale } = useI18n();

  const [data, setData] = useState<WeeklyOperatingReviewResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/weekly-operating-review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ locale }),
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to load weekly operating review.");
        }

        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [locale]);

  return (
    <DashboardShell
      title={locale === "sr" ? "Nedeljni operativni pregled" : "Weekly Operating Review"}
      description={
        locale === "sr"
          ? "LifePilot sastavlja nedeljni operativni memo sistema."
          : "LifePilot composes the system’s weekly operating memo."
      }
    >
      {loading && (
        <LoadingCard
          message={
            locale === "sr"
              ? "Učitavanje weekly operating review-a..."
              : "Loading weekly operating review..."
          }
        />
      )}

      {error && !loading && <ErrorCard message={error} />}

      {!loading && !error && data && (
        <>
          <SectionCard
            subtitle={locale === "sr" ? "Nedeljni režim" : "Weekly mode"}
            title={data.weeklyMode}
          >
            <p>{data.summary}</p>
            <div className="mt-4 rounded-2xl border p-4">
              <span className="font-medium">
                {locale === "sr" ? "Ključna poruka" : "Key message"}:
              </span>{" "}
              {data.keyMessage}
            </div>
          </SectionCard>

          <section className="grid gap-6 lg:grid-cols-2">
            <SectionCard subtitle={locale === "sr" ? "Pobede" : "Wins"}>
              <div className="space-y-3">
                {data.wins.map((item, index) => (
                  <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                    {item}
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard subtitle={locale === "sr" ? "Rizici" : "Risks"}>
              <div className="space-y-3">
                {data.risks.map((item, index) => (
                  <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                    {item}
                  </div>
                ))}
              </div>
            </SectionCard>
          </section>

          <SectionCard subtitle={locale === "sr" ? "Prilagođavanja" : "Adjustments"}>
            <div className="space-y-3">
              {data.adjustments.map((item, index) => (
                <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                  {item}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            subtitle={locale === "sr" ? "Operativne direktive" : "Operating directives"}
          >
            <div className="space-y-3">
              {data.operatingDirectives.map((item, index) => (
                <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                  {item}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard subtitle={locale === "sr" ? "Obrazloženje" : "Reasoning"}>
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