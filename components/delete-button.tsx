'use client';

import { useTransition } from 'react';

export function DeleteButton({ endpoint }: { endpoint: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      className="btn-secondary"
      onClick={() => {
        startTransition(async () => {
          await fetch(endpoint, { method: 'DELETE' });
          window.location.reload();
        });
      }}
      type="button"
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
