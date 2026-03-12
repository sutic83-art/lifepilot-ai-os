'use client';

import { useState } from 'react';

export function EntityForm({
  endpoint,
  fields,
  submitLabel,
  onSuccess
}: {
  endpoint: string;
  fields: Array<{ name: string; label: string; type?: string; placeholder?: string }>;
  submitLabel: string;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    const body = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      onSuccess?.();
      const form = document.getElementById(`form-${endpoint}`) as HTMLFormElement | null;
      form?.reset();
      if (!onSuccess) window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      id={`form-${endpoint}`}
      action={async (formData) => {
        await handleSubmit(formData);
      }}
      className="card space-y-4 p-5"
    >
      {fields.map((field) => (
        <div key={field.name}>
          <label className="label">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea name={field.name} placeholder={field.placeholder} className="input min-h-28" />
          ) : (
            <input name={field.name} type={field.type || 'text'} placeholder={field.placeholder} className="input" />
          )}
        </div>
      ))}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="btn-primary" disabled={loading} type="submit">
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
