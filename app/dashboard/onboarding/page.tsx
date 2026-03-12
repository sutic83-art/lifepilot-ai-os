"use client";

import { useEffect, useState } from "react";

type OnboardingState = {
  primaryGoal: string;
  workPace: "gentle" | "balanced" | "ambitious";
  supportStyle: "direct" | "supportive";
  overloadTendency: "low" | "medium" | "high";
  focusArea: "business" | "health" | "finance" | "personal" | "learning";
};

export default function OnboardingPage() {
  const [form, setForm] = useState<OnboardingState>({
    primaryGoal: "",
    workPace: "balanced",
    supportStyle: "direct",
    overloadTendency: "medium",
    focusArea: "business",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/ai/onboarding");
        const data = await res.json();

        if (data?.primaryGoal) {
          setForm({
            primaryGoal: data.primaryGoal,
            workPace: data.workPace,
            supportStyle: data.supportStyle,
            overloadTendency: data.overloadTendency,
            focusArea: data.focusArea,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const save = async () => {
    try {
      setSaving(true);
      setMessage("");

      const res = await fetch("/api/ai/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Saving failed.");
      }

      setMessage("Onboarding saved successfully.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Greška.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-6 md:p-10">
        <div className="mx-auto max-w-3xl rounded-3xl border p-6">
          Učitavanje onboarding-a...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Onboarding OS Layer</h1>
          <p className="mt-2 text-muted-foreground">
            Reci LifePilot-u kako želiš da te vodi.
          </p>
        </div>

        <section className="rounded-3xl border p-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Primary goal</label>
            <input
              value={form.primaryGoal}
              onChange={(e) => setForm({ ...form, primaryGoal: e.target.value })}
              placeholder="Npr. launch AI startup, improve health, restore focus..."
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Work pace</label>
            <select
              value={form.workPace}
              onChange={(e) =>
                setForm({ ...form, workPace: e.target.value as OnboardingState["workPace"] })
              }
              className="w-full rounded-2xl border px-4 py-3"
            >
              <option value="gentle">Gentle</option>
              <option value="balanced">Balanced</option>
              <option value="ambitious">Ambitious</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Support style</label>
            <select
              value={form.supportStyle}
              onChange={(e) =>
                setForm({ ...form, supportStyle: e.target.value as OnboardingState["supportStyle"] })
              }
              className="w-full rounded-2xl border px-4 py-3"
            >
              <option value="direct">Direct</option>
              <option value="supportive">Supportive</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Overload tendency</label>
            <select
              value={form.overloadTendency}
              onChange={(e) =>
                setForm({
                  ...form,
                  overloadTendency: e.target.value as OnboardingState["overloadTendency"],
                })
              }
              className="w-full rounded-2xl border px-4 py-3"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Main focus area</label>
            <select
              value={form.focusArea}
              onChange={(e) =>
                setForm({ ...form, focusArea: e.target.value as OnboardingState["focusArea"] })
              }
              className="w-full rounded-2xl border px-4 py-3"
            >
              <option value="business">Business</option>
              <option value="health">Health</option>
              <option value="finance">Finance</option>
              <option value="personal">Personal</option>
              <option value="learning">Learning</option>
            </select>
          </div>

          <button
            onClick={save}
            disabled={saving || !form.primaryGoal.trim()}
            className="rounded-2xl bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save onboarding"}
          </button>

          {message && (
            <div className="rounded-2xl border p-4 text-sm">
              {message}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}