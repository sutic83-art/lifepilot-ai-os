"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

const PRIMARY_NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/tasks", label: "Tasks" },
  { href: "/dashboard/goals", label: "Goals" },
  { href: "/dashboard/habits", label: "Habits" },
  { href: "/dashboard/coach", label: "Coach" },
  { href: "/dashboard/weekly-review", label: "Weekly Review" },
];

export default function DashboardPage() {
  const [data, setData] = useState<OrchestratorResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/ai/orchestrator");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load Today OS screen.");
      }

      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const executeAction = async (action: OrchestratorAction) => {
    try {
      setBusyAction(action.title);
      setMessage("");

      const res = await fetch("/api/ai/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Action execution failed.");
      }

      setMessage(`Executed: ${action.title}`);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Greška pri izvršavanju akcije."
      );
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
          note: `Feedback from Today OS Screen for action: ${action.title}`,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Feedback save failed.");
      }

      setMessage(`Feedback saved: ${outcome} for "${action.title}"`);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Greška pri čuvanju feedback-a."
      );
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border bg-card p-8 shadow-sm">
          <p className="text-sm text-muted-foreground">LifePilot OS</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Today</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Tvoj centralni AI operativni ekran za odluke, fokus, rizik i sledeće akcije.
          </p>

          <nav className="mt-6 flex flex-wrap gap-2">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border px-4 py-2 text-sm hover:bg-muted/40"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </section>

        {loading && (
          <section className="rounded-3xl border p-6">
            Učitavanje Today OS Screen-a...
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
              <p className="text-sm text-muted-foreground">System summary</p>
              <h2 className="mt-2 text-2xl font-semibold">{data.summary}</h2>
              <div className="mt-4 rounded-2xl border p-4">
                <span className="font-medium">Major risk:</span> {data.majorRisk}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border bg-card p-6 shadow-sm">
                <p className="text-sm text-muted-foreground">Executive mode</p>
                <h3 className="mt-2 text-xl font-semibold">{data.executiveMode}</h3>
              </div>

              <div className="rounded-3xl border bg-card p-6 shadow-sm">
                <p className="text-sm text-muted-foreground">Energy</p>
                <h3 className="mt-2 text-xl font-semibold">{data.energyLevel}</h3>
              </div>

              <div className="rounded-3xl border bg-card p-6 shadow-sm">
                <p className="text-sm text-muted-foreground">Burnout risk</p>
                <h3 className="mt-2 text-xl font-semibold">{data.burnoutRisk}</h3>
              </div>
            </section>

            <section className="rounded-3xl border bg-card p-8 shadow-sm">
              <p className="text-sm text-muted-foreground">Today focus</p>
              <div className="mt-4 space-y-3">
                {data.todayFocus.length > 0 ? (
                  data.todayFocus.map((item, index) => (
                    <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border p-4">
                    Nema definisanog fokusa za danas.
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border bg-card p-8 shadow-sm">
                <p className="text-sm text-muted-foreground">Decision</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">Strategy:</span> {data.decision.strategy}
                  </div>
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">Primary action:</span> {data.decision.primaryAction}
                  </div>
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">Secondary action:</span> {data.decision.secondaryAction}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border bg-card p-8 shadow-sm">
                <p className="text-sm text-muted-foreground">Policy & learning</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">Profile:</span> {data.policy.profile}
                  </div>
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">Planning intensity:</span> {data.policy.planningIntensity}
                  </div>
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">Intervention style:</span> {data.policy.interventionStyle}
                  </div>
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">Learning:</span> {data.learning.summary}
                  </div>
                  <div className="rounded-2xl border p-4">
                    <span className="font-medium">Top pattern:</span> {data.learning.topPattern}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border bg-card p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Action proposals</p>
                  <h3 className="mt-2 text-2xl font-semibold">Recommended system actions</h3>
                </div>

                <Link
                  href="/dashboard/actions"
                  className="rounded-2xl border px-4 py-2 text-sm font-medium hover:bg-muted/40"
                >
                  Open full Actions
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {data.actions.length > 0 ? (
                  data.actions.map((action, index) => (
                    <div key={`${action.title}-${index}`} className="rounded-2xl border p-5">
                      <div className="font-semibold">{action.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{action.type}</div>
                      <div className="mt-2">{action.description}</div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Reason: {action.reason}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={() => executeAction(action)}
                          disabled={busyAction !== null}
                          className="rounded-2xl bg-black px-4 py-2 text-white disabled:opacity-50"
                        >
                          {busyAction === action.title ? "Executing..." : "Execute"}
                        </button>

                        <button
                          onClick={() => sendFeedback(action, "helpful")}
                          disabled={busyAction !== null}
                          className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                        >
                          {busyAction === `${action.title}-helpful`
                            ? "Saving..."
                            : "Helpful"}
                        </button>

                        <button
                          onClick={() => sendFeedback(action, "neutral")}
                          disabled={busyAction !== null}
                          className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                        >
                          {busyAction === `${action.title}-neutral`
                            ? "Saving..."
                            : "Not now"}
                        </button>

                        <button
                          onClick={() => sendFeedback(action, "unhelpful")}
                          disabled={busyAction !== null}
                          className="rounded-2xl border px-4 py-2 disabled:opacity-50"
                        >
                          {busyAction === `${action.title}-unhelpful`
                            ? "Saving..."
                            : "Not useful"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border p-4">
                    Nema novih preporučenih akcija.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border bg-card p-8 shadow-sm">
              <p className="text-sm text-muted-foreground">System reasoning</p>
              <div className="mt-4 space-y-3">
                {data.reasoning.map((item, index) => (
                  <div key={`${item}-${index}`} className="rounded-2xl border p-4">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border bg-card p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Advanced</p>
                  <h3 className="mt-2 text-2xl font-semibold">System tools</h3>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Link
                  href="/dashboard/energy"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  Energy
                </Link>
                <Link
                  href="/dashboard/decision"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  Decision
                </Link>
                <Link
                  href="/dashboard/executive"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  Executive
                </Link>
                <Link
                  href="/dashboard/review"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  Review
                </Link>
                <Link
                  href="/dashboard/policy"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  Policy
                </Link>
                <Link
                  href="/dashboard/trends"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  Trends
                </Link>
                <Link
                  href="/dashboard/retrospective"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  Retrospective
                </Link>
                <Link
                  href="/dashboard/state"
                  className="rounded-2xl border p-4 hover:bg-muted/40"
                >
                  State
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
