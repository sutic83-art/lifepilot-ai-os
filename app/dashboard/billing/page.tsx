"use client";

import { useState } from "react";

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function go(endpoint: string, key: string) {
    try {
      setLoading(key);
      setError("");
      setMessage("");

      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Billing request failed.");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setMessage("Request completed, but no redirect URL was returned.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri billing akciji.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">Billing</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Subscription & billing</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Upravljaj pretplatom, pokreni checkout i otvori Stripe billing portal.
        </p>
      </section>

      {error && (
        <section className="rounded-3xl border border-red-300 bg-card p-4 text-red-600">
          {error}
        </section>
      )}

      {message && (
        <section className="rounded-3xl border bg-card p-4 text-sm">
          {message}
        </section>
      )}

      <section className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">Plan actions</p>
        <h2 className="mt-2 text-2xl font-semibold">Manage your plan</h2>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-2xl bg-black px-6 py-3 text-white disabled:opacity-50"
            onClick={() => go("/api/billing/checkout", "checkout")}
            disabled={loading !== null}
          >
            {loading === "checkout" ? "Otvaram..." : "Upgrade na Pro"}
          </button>

          <button
            className="rounded-2xl border px-6 py-3 disabled:opacity-50"
            onClick={() => go("/api/billing/portal", "portal")}
            disabled={loading !== null}
          >
            {loading === "portal" ? "Otvaram..." : "Billing portal"}
          </button>
        </div>
      </section>
    </div>
  );
}
