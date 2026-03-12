"use client";

import { useEffect, useState } from "react";

type ActionProposal = {
  type: "create_focus_task" | "create_recovery_habit" | "create_reset_task";
  title: string;
  description: string;
  reason: string;
};

type ExecutionResult = {
  success: boolean;
  created: string | null;
};

export default function ActionsPage() {
  const [actions, setActions] = useState<ActionProposal[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState<string | null>(null);

  const loadActions = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/ai/actions");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load actions.");
      }

      setActions(data);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Greška.");
    } finally {
      setLoading(false);
    }
  };

  const execute = async (action: ActionProposal) => {
    try {
      setExecuting(action.title);
      setMessage("");

      const res = await fetch("/api/ai/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action),
      });

      const data: ExecutionResult & { error?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Execution failed.");
      }

      setMessage(`Action executed: created ${data.created}.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Greška pri izvršavanju.");
    } finally {
      setExecuting(null);
    }
  };

  useEffect(() => {
    loadActions();
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Action Layer</h1>
          <p className="mt-2 text-muted-foreground">
            LifePilot pretvara odluke u konkretne sistemske akcije.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border p-6">
            Učitavanje AI akcija...
          </div>
        )}

        {message && (
          <div className="rounded-3xl border p-6 text-sm">
            {message}
          </div>
        )}

        {!loading && (
          <div className="space-y-4">
            {actions.map((action) => (
              <section key={action.title} className="rounded-3xl border p-6">
                <p className="text-sm text-muted-foreground">{action.type}</p>
                <h2 className="mt-2 text-2xl font-semibold">{action.title}</h2>
                <p className="mt-3">{action.description}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Reason: {action.reason}
                </p>

                <button
                  onClick={() => execute(action)}
                  disabled={executing === action.title}
                  className="mt-6 rounded-2xl bg-black px-5 py-3 text-white disabled:opacity-50"
                >
                  {executing === action.title ? "Executing..." : "Execute action"}
                </button>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}