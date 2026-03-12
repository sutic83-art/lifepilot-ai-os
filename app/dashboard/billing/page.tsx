'use client';

import { useState } from 'react';

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function go(endpoint: string, key: string) {
    setLoading(key);
    const res = await fetch(endpoint, { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(null);
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="mt-2 text-slate-600">Pokreni Stripe Checkout ili otvori billing portal.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn-primary" onClick={() => go('/api/billing/checkout', 'checkout')}>
            {loading === 'checkout' ? 'Otvaram...' : 'Upgrade na Pro'}
          </button>
          <button className="btn-secondary" onClick={() => go('/api/billing/portal', 'portal')}>
            {loading === 'portal' ? 'Otvaram...' : 'Billing portal'}
          </button>
        </div>
      </div>
    </div>
  );
}
