"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

type SuggestedPrompt = {
  label: string;
  prompt: string;
};

export default function CoachPage() {
  const { locale, t } = useI18n();

  const suggestedPrompts: SuggestedPrompt[] =
    locale === "sr"
      ? [
          {
            label: "Preopterećenje",
            prompt:
              "Osećam preopterećenje i lista zadataka mi je preduga. Šta da uradim danas?",
          },
          {
            label: "Fokus",
            prompt:
              "Stalno menjam kontekst i gubim fokus. Pomozi mi da organizujem ostatak dana.",
          },
          {
            label: "Prioriteti",
            prompt:
              "Imam previše prioriteta. Pomozi mi da izaberem šta je najvažnije ove nedelje.",
          },
          {
            label: "Burnout rizik",
            prompt:
              "Mentalno sam umoran i bez motivacije. Kako da smanjim burnout rizik a da ne izgubim momentum?",
          },
        ]
      : [
          {
            label: "Overload",
            prompt:
              "I feel overloaded and my task list is too long. What should I do today?",
          },
          {
            label: "Focus",
            prompt:
              "I keep switching context and losing focus. Help me structure the rest of today.",
          },
          {
            label: "Priorities",
            prompt:
              "I have too many priorities. Help me choose what matters most this week.",
          },
          {
            label: "Burnout risk",
            prompt:
              "I feel mentally tired and unmotivated. How should I reduce burnout risk without losing momentum?",
          },
        ];

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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Coach request failed.");
      }

      setReply(data.reply || "No reply.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">{t.nav.coach}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {t.coachPage.title}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {t.coachPage.subtitle}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {suggestedPrompts.map((item) => (
          <button
            key={item.label}
            onClick={() => setPrompt(item.prompt)}
            className="rounded-3xl border bg-card p-5 text-left shadow-sm hover:bg-muted/40"
          >
            <div className="text-sm text-muted-foreground">{item.label}</div>
            <div className="mt-2 font-medium">{item.prompt}</div>
          </button>
        ))}
      </section>

      {error && (
        <section className="rounded-3xl border border-red-300 bg-card p-4 text-red-600">
          {error}
        </section>
      )}

      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">{t.coachPage.askCoach}</p>
        <h2 className="mt-2 text-2xl font-semibold">{t.coachPage.describe}</h2>

        <div className="mt-6 space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.coachPage.placeholder}
            className="min-h-40 w-full rounded-2xl border px-4 py-3"
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={askCoach}
              disabled={loading || !prompt.trim()}
              className="rounded-2xl bg-black px-6 py-3 text-white disabled:opacity-50"
            >
              {loading ? t.coachPage.thinking : t.coachPage.askCoach}
            </button>

            <button
              onClick={() => {
                setPrompt("");
                setReply("");
                setError("");
              }}
              disabled={loading}
              className="rounded-2xl border px-6 py-3 disabled:opacity-50"
            >
              {t.coachPage.clear}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">{t.coachPage.response}</p>
        <h2 className="mt-2 text-2xl font-semibold">{t.coachPage.guidance}</h2>

        <div className="mt-6 min-h-32 whitespace-pre-wrap rounded-2xl border p-5">
          {reply || t.coachPage.emptyReply}
        </div>
      </section>
    </div>
  );
}