'use client';

import { useTransition } from 'react';

export function ToggleTaskButton({ endpoint, done }: { endpoint: string; done: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      className="btn-secondary"
      onClick={() => {
        startTransition(async () => {
          await fetch(endpoint, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ done: !done })
          });
          window.location.reload();
        });
      }}
      type="button"
    >
      {pending ? 'Čuvam...' : done ? 'Vrati u aktivno' : 'Označi završeno'}
    </button>
  );
}
