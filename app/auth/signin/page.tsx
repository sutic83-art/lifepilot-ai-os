'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/dashboard';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="container-shell flex min-h-screen items-center justify-center py-10">
      <form
        className="card w-full max-w-md space-y-4 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError('');
          const form = new FormData(e.currentTarget);
          const res = await signIn('credentials', {
            email: form.get('email'),
            password: form.get('password'),
            redirect: false,
            callbackUrl
          });
          setLoading(false);
          if (res?.error) {
            setError('Pogrešan email ili lozinka.');
            return;
          }
          router.push(callbackUrl);
        }}
      >
        <h1 className="text-2xl font-bold">Prijava</h1>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" name="email" required />
        </div>
        <div>
          <label className="label">Lozinka</label>
          <input className="input" type="password" name="password" required />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="btn-primary w-full" disabled={loading} type="submit">{loading ? 'Prijava...' : 'Uloguj se'}</button>
        <p className="text-sm text-slate-600">Nemaš nalog? <Link href="/auth/signup" className="font-medium text-blue-700">Registruj se</Link></p>
      </form>
    </div>
  );
}
