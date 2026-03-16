"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

type OrchestratorAction = {
  type: string;
  title: string;
  description: string;
  reason: string;
};

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
  actions: OrchestratorAction[];
  reasoning: string[];
};

export default function DashboardPage() {
  const { t, locale } = useI18n();

  const [data, setData] = useState<OrchestratorResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/ai/orchestrator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load Today OS screen.");
      }

      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [locale]);

  const executeAction = async (action: OrchestratorAction) => {
    try {
      setBusyAction(action.title);
      setMessage("");

      const res = await fetch("/api/ai/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...action, locale }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Action execution failed.");
      }

      setMessage(`${t.dashboard.executed}: ${action.title}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error.");
    } finally {
      setBusyAction(null);
    }
  };

  const sendFeedback = async (
    action: OrchestratorAction,
    outcome: "helpful" | "neutral" | "unhelpful"
  ) => {
    try {
      setBusyAction(`${action.title}-${outcome}`);
      setMessage("");

      const res = await fetch("/api/ai/review-loop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actionType: action.type,
          outcome,
          locale,
          note:
            locale === "sr"
              ? `Feedback sa Today OS ekrana za akciju: ${action.title}`
              : `Feedback from Today OS Screen for action: ${action.title}`,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Feedback save failed.");
      }

      setMessage(`${t.dashboard.feedbackSaved}: "${action.title}"`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error.");
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border bg-card p-8 shadow-sm">
          <p className="text-sm text-muted-foreground">LifePilot OS</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            {t.dashboard.title}
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            {t.dashboard.subtitle}
          </p>
        </section>

        {loading && (
          <section className="rounded-3xl border p-6">
            {t.dashboard.loading}
          </section>
        )}

        {error && !loading && (
          <section className="rounded-3xl border border-red-300 p-6 text-red-600">
            {error}
          </section>
        )}

        {message && (
          <section className="rounded-3xl border p-4 text-sm">
            {message}
          </section>
        )}

        {!loading && !error && data && (
          <>
            <section className="rounded-3xl border bg-card p-8 shadow-sm">
              <p className="text-sm text-muted-foreground">
                {t.dashboard.systemSummary}
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{data.summary}</h2>
              <div className="mt-4 rounded-2xl border p-4">
                <span className="font-medium">{t.dashboard.majorRisk}:</span>{" "}
                {data.majorRisk}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border bg-card p-6 shadow-sm">
                <p className="text-sm text-muted-foreground">
                  {t.dashboard.executiveMode}
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  {data.executiveMode}
                </h3>
              </div>

              <div className="rounded-3xl border bg-card p-6 shadow-sm">
                <p className="text-sm text-muted-foreground">
                  {t.dashboard.energy}
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  {data.energyLevel}
                </h3>
              </div>

              <div className="rounded-3xl border bg-card p-6 shadow-sm">
                <p className="text-sm text-muted-foreground">
                  {t.dashboard.burnoutRisk}
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  {data.burnoutRisk}
                </h3>
              </div>
            </section>

            <section className="rounded-3xl border bg-card p-8 shadow-sm">
              <p className="text-sm text-muted-foreground">
                {t.dashboard.todayFocus}
              </p>
              <div className="mt-4 space-y-3">
                {data.todayFocus.length > 0 ? (
                  data.todayFocus.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="rounded-2xl border p-4"
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border p-4">
                    {t.dashboard.noFocus}
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border bg-card p-8 shadow-sm">
                <p className="text-sm text-muted-foreground">
                  {t.dashboard.decision}
                </p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">
                      {locale === "sr" ? "Strategija" : "Strategy"}:
                    </span>{" "}
                    {data.decision.strategy}
                  </div>
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">
                      {locale === "sr" ? "Primarna akcija" : "Primary action"}:
                    </span>{" "}
                    {data.decision.primaryAction}
                  </div>
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">
                      {locale === "sr"
                        ? "Sekundarna akcija"
                        : "Secondary action"}
                      :
                    </span>{" "}
                    {data.decision.secondaryAction}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border bg-card p-8 shadow-sm">
                <p className="text-sm text-muted-foreground">
                  {t.dashboard.policyLearning}
                </p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">
                      {locale === "sr" ? "Profil" : "Profile"}:
                    </span>{" "}
                    {data.policy.profile}
                  </div>
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">
                      {locale === "sr"
                        ? "Intenzitet planiranja"
                        : "Planning intensity"}
                      :
                    </span>{" "}
                    {data.policy.planningIntensity}
                  </div>
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">
                      {locale === "sr"
                        ? "Stil intervencije"
                        : "Intervention style"}
                      :
                    </span>{" "}
                    {data.policy.interventionStyle}
                  </div>
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">
                      {locale === "sr" ? "Učenje" : "Learning"}:
                    </span>{" "}
                    {data.learning.summary}
                  </div>
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">
                      {locale === "sr" ? "Glavni obrazac" : "Top pattern"}:
                    </span>{" "}
                    {data.learning.topPattern}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border bg-card p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.dashboard.actionProposals}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    {locale === "sr"
                      ? "Preporučene sistemske akcije"
                      : "Recommended system actions"}
                  </h3>
                </div>

                <Link
                  href="/dashboard/actions"
                  className="rounded-2xl border px-4 py-2 text-sm font-medium hover:bg-muted/40"
                >
                  {t.dashboard.openFullActions}
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {data.actions.length > 0 ? (
                  data.actions.map((action, index) => (
                    <div
                      key={`${action.title}-${index}`}
                      className="rounded-2xl border p-5"
                    >
                      <div className="font-semibold">{action.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {action.type}
                      </div>
                      <div className="mt-2">{action.description}</div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {locale === "sr" ? "Razlog" : "Reason"}: {action.reason}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={() => executeAction(action)}
                          disabled={busyAction !== null}
                          className="rounded-2xl bg-black px-4 py-2 text-white disabled:opacity-50"
                        >
                          {busyAction === action.title
                            ? t.dashboard.executing
                            : t.dashboard.execute}
                        </button>

                        <button
                          onClick={() => sendFeedback(action, "helpful")}
                          disabled={busyAction !== null}
                          className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                        >
                          {busyAction === `${action.title}-helpful`
                            ? t.dashboard.saving
                            : t.dashboard.helpful}
                        </button>

                        <button
                          onClick={() => sendFeedback(action, "neutral")}
                          disabled={busyAction !== null}
                          className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                        >
                          {busyAction === `${action.title}-neutral`
                            ? t.dashboard.saving
                            : t.dashboard.notNow}
                        </button>

                        <button
                          onClick={() => sendFeedback(action, "unhelpful")}
                          disabled={busyAction !== null}
                          className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                        >
                          {busyAction === `${action.title}-unhelpful`
                            ? t.dashboard.saving
                            : t.dashboard.notUseful}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border p-4">
                    {t.dashboard.noActions}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border bg-card p-8 shadow-sm">
              <p className="text-sm text-muted-foreground">
                {t.dashboard.reasoning}
              </p>
              <div className="mt-4 space-y-3">
                {data.reasoning.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-2xl border p-4"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border bg-card p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.dashboard.advanced}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    {t.dashboard.systemTools}
                  </h3>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Link
                  href="/dashboard/energy"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  {locale === "sr" ? "Energija" : "Energy"}
                </Link>
                <Link
                  href="/dashboard/decision"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  {locale === "sr" ? "Odluka" : "Decision"}
                </Link>
                <Link
                  href="/dashboard/executive"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  {locale === "sr" ? "Izvršno" : "Executive"}
                </Link>
                <Link
                  href="/dashboard/review"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  {locale === "sr" ? "Pregled" : "Review"}
                </Link>
                <Link
                  href="/dashboard/policy"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  {locale === "sr" ? "Politika" : "Policy"}
                </Link>
                <Link
                  href="/dashboard/trends"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  {locale === "sr" ? "Trendovi" : "Trends"}
                </Link>
                <Link
                  href="/dashboard/retrospective"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  {locale === "sr" ? "Retrospektiva" : "Retrospective"}
                </Link>
                <Link
                  href="/dashboard/state"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  {locale === "sr" ? "Stanje" : "State"}
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
