"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

type Insight = {
  message: string;
  level: "info" | "warning" | "risk";
};

const levelStyles: Record<Insight["level"], string> = {
  info: "border-slate-300",
  warning: "border-amber-300",
  risk: "border-red-300",
};

export default function InsightsPage() {
  const { t, locale } = useI18n();

  const [insights, setInsights] = useState<Insight[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/ai/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ locale }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load insights.");
        }

        setInsights(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error.");
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, [locale]);

  const infoCount = insights.filter((item) => item.level === "info").length;
  const warningCount = insights.filter((item) => item.level === "warning").length;
  const riskCount = insights.filter((item) => item.level === "risk").length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">{t.nav.insights}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {t.insightsPage.title}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {t.insightsPage.subtitle}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">{t.insightsPage.info}</p>
          <h2 className="mt-2 text-2xl font-semibold">{infoCount}</h2>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {t.insightsPage.warnings}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{warningCount}</h2>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">{t.insightsPage.risks}</p>
          <h2 className="mt-2 text-2xl font-semibold">{riskCount}</h2>
        </div>
      </section>

      {loading && (
        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          {t.insightsPage.loading}
        </section>
      )}

      {error && !loading && (
        <section className="rounded-3xl border border-red-300 bg-card p-6 text-red-600">
          {error}
        </section>
      )}

      {!loading && !error && (
        <section className="rounded-3xl border bg-card p-8 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {t.insightsPage.signals}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {t.insightsPage.currentPatterns}
          </h2>

          <div className="mt-6 space-y-4">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div
                  key={`${insight.message}-${index}`}
                  className={`rounded-2xl border p-5 ${levelStyles[insight.level]}`}
                >
                  <div className="text-sm uppercase tracking-wide text-muted-foreground">
                    {insight.level}
                  </div>
                  <div className="mt-2">{insight.message}</div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border p-4">
                {t.insightsPage.noData}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}