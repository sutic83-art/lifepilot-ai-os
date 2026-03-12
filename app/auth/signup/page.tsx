'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="container-shell flex min-h-screen items-center justify-center py-10">
      <form
        className="card w-full max-w-md space-y-4 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError('');
          const form = new FormData(e.currentTarget);
          const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(form.entries()))
          });
          const data = await res.json();
          setLoading(false);
          if (!res.ok) {
            setError(data.error || 'Registracija nije uspela.');
            return;
          }
          router.push('/auth/signin');
        }}
      >
        <h1 className="text-2xl font-bold">Registracija</h1>
        <div>
          <label className="label">Ime</label>
          <input className="input" type="text" name="name" required />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" name="email" required />
        </div>
        <div>
          <label className="label">Lozinka</label>
          <input className="input" type="password" name="password" minLength={8} required />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="btn-primary w-full" disabled={loading} type="submit">{loading ? 'Kreiranje...' : 'Napravi nalog'}</button>
        <p className="text-sm text-slate-600">Imaš nalog? <Link href="/auth/signin" className="font-medium text-blue-700">Prijavi se</Link></p>
      </form>
    </div>
  );
}
