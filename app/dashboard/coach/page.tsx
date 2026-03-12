"use client";

import { useState } from "react";

export default function CoachPage() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const askCoach = async () => {
    try {
      setLoading(true);
      setError("");
      setReply("");

      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Coach request failed.");
      }

      setReply(data.reply || "No reply.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Coach</h1>
          <p className="mt-2 text-muted-foreground">
            Postavi pitanje i dobii praktičan LifePilot coaching odgovor.
          </p>
        </div>

        <div className="rounded-3xl border p-6 space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Npr. I feel overloaded and my task list is too long. What should I do today?"
            className="min-h-32 w-full rounded-2xl border px-4 py-3"
          />

          <button
            onClick={askCoach}
            disabled={loading || !prompt.trim()}
            className="rounded-2xl bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask coach"}
          </button>

          {error && (
            <div className="rounded-2xl border border-red-300 p-4 text-red-600">
              {error}
            </div>
          )}

          {reply && (
            <div className="rounded-2xl border p-4 whitespace-pre-wrap">
              {reply}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
