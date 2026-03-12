"use client";

import { useEffect, useState } from "react";

type ReviewSummary = {
  completedTasks: number;
  openTasks: number;
  healthyHabits: number;
  weakHabits: number;
  summary: string;
  recommendation: string;
};

export default function ReviewPage() {
  const [review, setReview] = useState<ReviewSummary | null>(null);
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);

  const loadReview = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/ai/review-loop");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load review.");
      }

      setReview(data);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Greška.");
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async (outcome: "helpful" | "neutral" | "unhelpful") => {
    try {
      setSending(outcome);
      setMessage("");

      const res = await fetch("/api/ai/review-loop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          actionType: "executive_action_cycle",
          outcome,
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save feedback.");
      }

      setMessage(`Feedback saved as: ${outcome}`);
      setNote("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Greška pri slanju feedback-a.");
    } finally {
      setSending(null);
    }
  };

  useEffect(() => {
    loadReview();
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Loop</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot meri rezultate i skuplja feedback o svojim akcijama.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje review loop-a...
          </div>
        )}

        {message && (
          <div className="rounded-3xl border p-6 text-sm">
            {message}
          </div>
        )}

        {!loading && review && (
          <>
            <section className="rounded-3xl border p-6">
              <h2 className="text-2xl font-semibold">{review.summary}</h2>
              <p className="mt-4">{review.recommendation}</p>
            </section>

            <section className="rounded-3xl border p-6">
              <h3 className="text-xl font-semibold">System state</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border p-4">
                  Completed tasks: {review.completedTasks}
                </div>
                <div className="rounded-2xl border p-4">
                  Open tasks: {review.openTasks}
                </div>
                <div className="rounded-2xl border p-4">
                  Healthy habits: {review.healthyHabits}
                </div>
                <div className="rounded-2xl border p-4">
                  Weak habits: {review.weakHabits}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border p-6">
              <h3 className="text-xl font-semibold">Action feedback</h3>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note about what worked or did not work..."
                className="mt-4 min-h-28 w-full rounded-2xl border px-4 py-3"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => sendFeedback("helpful")}
                  disabled={sending !== null}
                  className="rounded-2xl bg-black px-5 py-3 text-white disabled:opacity-50"
                >
                  {sending === "helpful" ? "Saving..." : "Helpful"}
                </button>

                <button
                  onClick={() => sendFeedback("neutral")}
                  disabled={sending !== null}
                  className="rounded-2xl border px-5 py-3 disabled:opacity-50"
                >
                  {sending === "neutral" ? "Saving..." : "Neutral"}
                </button>

                <button
                  onClick={() => sendFeedback("unhelpful")}
                  disabled={sending !== null}
                  className="rounded-2xl border px-5 py-3 disabled:opacity-50"
                >
                  {sending === "unhelpful" ? "Saving..." : "Unhelpful"}
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}